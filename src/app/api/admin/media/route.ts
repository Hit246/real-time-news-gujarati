import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { getAdminClient, isSanityConfigured } from '@/lib/sanity/client';
import { checkRateLimit } from '@/lib/utils/rate-limit';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  size: number;
  width?: number;
  height?: number;
  uploadedAt: string;
}

// In-memory registry for uploaded items
export const MEDIA_REGISTRY: MediaItem[] = [];

export async function GET() {
  const session = await auth();
  const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();

  if (!session?.user?.email || (adminEmail && session.user.email.toLowerCase() !== adminEmail)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Read local uploads directory
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const files = await fs.readdir(uploadsDir);
    const diskItems: MediaItem[] = [];

    for (const file of files) {
      if (/\.(jpg|jpeg|png|webp|avif)$/i.test(file)) {
        const stats = await fs.stat(path.join(uploadsDir, file));
        diskItems.push({
          id: file,
          url: `/uploads/${file}`,
          filename: file,
          size: stats.size,
          uploadedAt: stats.mtime.toISOString(),
        });
      }
    }

    // Merge with any in-memory/Sanity assets
    const merged = [...diskItems.reverse()];
    return NextResponse.json({ media: merged });
  } catch (err) {
    console.error('Error reading uploads folder:', err);
    return NextResponse.json({ media: MEDIA_REGISTRY });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();

  if (!session?.user?.email || (adminEmail && session.user.email.toLowerCase() !== adminEmail)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rate = checkRateLimit(`media-upload:${session.user.email}`, 50, 60000);
  if (!rate.success) {
    return NextResponse.json({ error: 'Upload rate limit exceeded.' }, { status: 429 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. Validate MIME format: JPG, PNG, WEBP only
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid file format. Only JPG, PNG, and WEBP images are allowed.' },
        { status: 400 }
      );
    }

    // 2. Validate Size: Max 5 MB
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: 'File size exceeds 5 MB limit.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Resize and Optimize with Sharp (Max width: 1600px for sharp high-res news articles)
    const optimizedBuffer = await sharp(buffer)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    const metadata = await sharp(optimizedBuffer).metadata();

    const cleanBaseName = file.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');
    const filename = `${cleanBaseName}-${Date.now()}.webp`;

    // 4. Save to public/uploads/
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    const targetFilePath = path.join(uploadsDir, filename);
    await fs.writeFile(targetFilePath, optimizedBuffer);

    const publicUrl = `/uploads/${filename}`;

    const mediaItem: MediaItem = {
      id: filename,
      url: publicUrl,
      filename: file.name,
      size: optimizedBuffer.length,
      width: metadata.width,
      height: metadata.height,
      uploadedAt: new Date().toISOString(),
    };

    MEDIA_REGISTRY.unshift(mediaItem);

    // 5. If Sanity is configured with write token, upload asset to Sanity
    if (isSanityConfigured()) {
      try {
        const client = getAdminClient();
        const asset = await client.assets.upload('image', optimizedBuffer, {
          filename,
          contentType: 'image/webp',
        });
        if (asset?.url) {
          mediaItem.url = asset.url;
        }
      } catch (sanityErr) {
        console.warn('Could not upload image to Sanity asset pipeline, using local path:', sanityErr);
      }
    }

    return NextResponse.json({ success: true, media: mediaItem });
  } catch (err: any) {
    console.error('Image upload error:', err);
    return NextResponse.json({ error: err.message || 'Image upload failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();

  if (!session?.user?.email || (adminEmail && session.user.email.toLowerCase() !== adminEmail)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  try {
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(process.cwd(), 'public', 'uploads', sanitizedFilename);
    await fs.unlink(filePath);

    return NextResponse.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    return NextResponse.json({ error: 'File not found or already deleted' }, { status: 404 });
  }
}

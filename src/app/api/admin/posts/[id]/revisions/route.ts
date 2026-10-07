import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { getAdminClient, isSanityConfigured } from '@/lib/sanity/client';
import { SAMPLE_REVISIONS, SAMPLE_POSTS } from '@/lib/sanity/sample-data';
import { Revision } from '@/types/sanity';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: Params) {
  const session = await auth();
  const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();

  if (!session?.user?.email || (adminEmail && session.user.email.toLowerCase() !== adminEmail)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  let revisions: Revision[] = SAMPLE_REVISIONS.filter((r) => r.postId === id);

  if (isSanityConfigured()) {
    try {
      const client = getAdminClient();
      const sanityRevisions = await client.fetch(
        `*[_type == "revision" && postId == $id] | order(savedAt desc) {
          _id,
          _type,
          postId,
          titleSnapshot,
          bodySnapshot,
          summarySnapshot,
          savedAt,
          authorEmail
        }`,
        { id }
      );
      if (sanityRevisions && sanityRevisions.length > 0) {
        revisions = sanityRevisions;
      }
    } catch (err) {
      console.error('Error fetching revisions from Sanity:', err);
    }
  }

  return NextResponse.json({ revisions });
}

export async function POST(req: Request, { params }: Params) {
  const session = await auth();
  const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();

  if (!session?.user?.email || (adminEmail && session.user.email.toLowerCase() !== adminEmail)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { titleSnapshot, bodySnapshot, summarySnapshot } = body;

    if (!titleSnapshot || !bodySnapshot) {
      return NextResponse.json({ error: 'Missing snapshot data' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const newRev: Revision = {
      _id: `rev-${Date.now()}`,
      _type: 'revision',
      postId: id,
      titleSnapshot,
      bodySnapshot,
      summarySnapshot,
      savedAt: now,
      authorEmail: session.user.email,
    };

    // Save in memory
    SAMPLE_REVISIONS.unshift(newRev);

    // Save to Sanity if configured
    if (isSanityConfigured()) {
      try {
        const client = getAdminClient();
        const created = await client.create({
          _type: 'revision',
          postId: id,
          titleSnapshot,
          bodySnapshot,
          summarySnapshot,
          savedAt: now,
          authorEmail: session.user.email,
        });
        newRev._id = created._id;
      } catch (err) {
        console.error('Error saving revision to Sanity:', err);
      }
    }

    return NextResponse.json({ success: true, revision: newRev });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create revision snapshot' }, { status: 500 });
  }
}

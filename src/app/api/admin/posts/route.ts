import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { postFormSchema } from '@/lib/validations/post';
import { getAdminClient, isSanityConfigured } from '@/lib/sanity/client';
import { SAMPLE_POSTS, SAMPLE_CATEGORIES, SAMPLE_AUTHORS } from '@/lib/sanity/sample-data';
import { checkRateLimit } from '@/lib/utils/rate-limit';
import { Post } from '@/types/sanity';

export async function GET(req: Request) {
  const session = await auth();
  const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();

  if (!session?.user?.email || (adminEmail && session.user.email.toLowerCase() !== adminEmail)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search')?.toLowerCase();

  let posts: Post[] = [];

  if (isSanityConfigured()) {
    try {
      const client = getAdminClient();
      posts = await client.fetch(`*[_type == "post"] | order(_updatedAt desc) {
        _id,
        _type,
        title,
        slug,
        summary,
        body,
        mainImage,
        category->,
        tags,
        author->,
        status,
        scheduledAt,
        publishedAt,
        updatedAt,
        _createdAt,
        _updatedAt,
        isBreaking,
        isOpinion,
        seoTitle,
        seoDescription
      }`);
    } catch (err) {
      console.error('Error fetching admin posts from Sanity, using fallback:', err);
      posts = SAMPLE_POSTS;
    }
  } else {
    posts = SAMPLE_POSTS;
  }

  if (status && status !== 'all') {
    posts = posts.filter((p) => p.status === status);
  }

  if (search) {
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.summary.toLowerCase().includes(search) ||
        p.tags?.some((t) => t.toLowerCase().includes(search))
    );
  }

  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  const session = await auth();
  const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();

  if (!session?.user?.email || (adminEmail && session.user.email.toLowerCase() !== adminEmail)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limiting
  const rate = checkRateLimit(`admin-create:${session.user.email}`, 30, 60000);
  if (!rate.success) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please slow down.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const validated = postFormSchema.parse(body);

    const now = new Date().toISOString();
    const newId = `post-${Date.now()}`;

    // Resolve category and author objects
    const category = SAMPLE_CATEGORIES.find((c) => c._id === validated.categoryId) || {
      _id: validated.categoryId,
      _type: 'category' as const,
      title: 'સામાન્ય',
      slug: { _type: 'slug' as const, current: 'general' },
    };

    const author = SAMPLE_AUTHORS.find((a) => a._id === validated.authorId) || {
      _id: validated.authorId,
      _type: 'author' as const,
      name: 'મુખ્ય સંપાદક',
    };

    const newPost: Post = {
      _id: newId,
      _type: 'post',
      title: validated.title,
      slug: { _type: 'slug', current: validated.slug },
      summary: validated.summary,
      body: validated.body,
      mainImage: validated.mainImage,
      category,
      tags: validated.tags,
      author,
      status: validated.status,
      scheduledAt: validated.scheduledAt || undefined,
      publishedAt: validated.status === 'published' ? (validated.publishedAt || now) : undefined,
      updatedAt: now,
      _createdAt: now,
      _updatedAt: now,
      isBreaking: validated.isBreaking,
      isOpinion: validated.isOpinion,
      seoTitle: validated.seoTitle,
      seoDescription: validated.seoDescription,
    };

    // Save to Sanity if configured
    if (isSanityConfigured()) {
      try {
        const client = getAdminClient();
        const sanityDoc = {
          _type: 'post',
          title: validated.title,
          slug: { _type: 'slug', current: validated.slug },
          summary: validated.summary,
          body: validated.body,
          mainImage: validated.mainImage,
          category: { _type: 'reference', _ref: validated.categoryId },
          tags: validated.tags,
          author: { _type: 'reference', _ref: validated.authorId },
          status: validated.status,
          scheduledAt: validated.scheduledAt,
          publishedAt: validated.status === 'published' ? (validated.publishedAt || now) : undefined,
          updatedAt: now,
          isBreaking: validated.isBreaking,
          isOpinion: validated.isOpinion,
          seoTitle: validated.seoTitle,
          seoDescription: validated.seoDescription,
        };

        const created = await client.create(sanityDoc);
        newPost._id = created._id;

        // Create initial revision
        await client.create({
          _type: 'revision',
          postId: created._id,
          titleSnapshot: validated.title,
          bodySnapshot: validated.body,
          savedAt: now,
        });

        // Create audit log
        await client.create({
          _type: 'auditLog',
          action: 'create',
          postId: created._id,
          postTitle: validated.title,
          timestamp: now,
          performedBy: session.user.email,
        });
      } catch (sanityErr) {
        console.error('Error creating post in Sanity, added to local memory:', sanityErr);
      }
    }

    // Always prepend to memory store so it appears immediately
    SAMPLE_POSTS.unshift(newPost);

    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (err: any) {
    if (err?.issues && Array.isArray(err.issues)) {
      const messages = err.issues.map((i: any) => i.message).join(' • ');
      return NextResponse.json({ error: messages }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Validation failed' }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { postFormSchema } from '@/lib/validations/post';
import { getAdminClient, isSanityConfigured } from '@/lib/sanity/client';
import { SAMPLE_POSTS, SAMPLE_CATEGORIES, SAMPLE_AUTHORS } from '@/lib/sanity/sample-data';
import { checkRateLimit } from '@/lib/utils/rate-limit';

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
  let post = SAMPLE_POSTS.find((p) => p._id === id);

  if (isSanityConfigured()) {
    try {
      const client = getAdminClient();
      const sanityPost = await client.fetch(`*[_type == "post" && _id == $id][0] {
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
        isBreaking,
        isOpinion,
        seoTitle,
        seoDescription
      }`, { id });
      if (sanityPost) post = sanityPost;
    } catch (err) {
      console.error('Error fetching post by ID from Sanity:', err);
    }
  }

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json({ post });
}

export async function PUT(req: Request, { params }: Params) {
  const session = await auth();
  const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();

  if (!session?.user?.email || (adminEmail && session.user.email.toLowerCase() !== adminEmail)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rate = checkRateLimit(`admin-edit:${session.user.email}`, 60, 60000);
  if (!rate.success) {
    return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const validated = postFormSchema.parse(body);
    const now = new Date().toISOString();

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

    // Update in-memory fallback
    const index = SAMPLE_POSTS.findIndex((p) => p._id === id);
    const updatedPost = {
      _id: id,
      _type: 'post' as const,
      title: validated.title,
      slug: { _type: 'slug' as const, current: validated.slug },
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
      isBreaking: validated.isBreaking,
      isOpinion: validated.isOpinion,
      seoTitle: validated.seoTitle,
      seoDescription: validated.seoDescription,
    };

    if (index !== -1) {
      SAMPLE_POSTS[index] = updatedPost;
    } else {
      SAMPLE_POSTS.unshift(updatedPost);
    }

    // Save to Sanity if configured
    if (isSanityConfigured()) {
      try {
        const client = getAdminClient();
        await client
          .patch(id)
          .set({
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
          })
          .commit();

        // Save Revision and Audit Log on manual save & publish (skip on auto-save to avoid cluttering history)
        const isAutoSave = body.isAutoSave === true;
        if (!isAutoSave) {
          await client.create({
            _type: 'revision',
            postId: id,
            titleSnapshot: validated.title,
            bodySnapshot: validated.body,
            savedAt: now,
            authorEmail: session.user.email,
          });

          await client.create({
            _type: 'auditLog',
            action: validated.status === 'published' ? 'publish' : 'edit',
            postId: id,
            postTitle: validated.title,
            timestamp: now,
            performedBy: session.user.email,
          });
        }
      } catch (sanityErr) {
        console.error('Error updating post in Sanity, updated in memory:', sanityErr);
      }
    }

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (err: any) {
    if (err?.issues && Array.isArray(err.issues)) {
      const messages = err.issues.map((i: any) => i.message).join(' • ');
      return NextResponse.json({ error: messages }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Validation failed' }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await auth();
  const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();

  if (!session?.user?.email || (adminEmail && session.user.email.toLowerCase() !== adminEmail)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const target = SAMPLE_POSTS.find((p) => p._id === id);

  // Remove from in-memory fallback
  const index = SAMPLE_POSTS.findIndex((p) => p._id === id);
  if (index !== -1) {
    SAMPLE_POSTS.splice(index, 1);
  }

  // Delete from Sanity if configured
  if (isSanityConfigured()) {
    try {
      const client = getAdminClient();
      await client.delete(id);
      await client.delete(`drafts.${id}`).catch(() => {});
      await client.delete({ query: '*[_type == "revision" && postId == $id]', params: { id } }).catch(() => {});

      // Write Audit Log
      await client.create({
        _type: 'auditLog',
        action: 'delete',
        postId: id,
        postTitle: target?.title || id,
        timestamp: new Date().toISOString(),
        performedBy: session.user.email,
      });
    } catch (err: any) {
      console.error('Error deleting post in Sanity:', err);
      return NextResponse.json({ error: err.message || 'Failed to delete post in database' }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, message: 'Post deleted successfully' });
}

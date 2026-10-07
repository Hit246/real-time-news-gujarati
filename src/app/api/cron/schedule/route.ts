import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminClient, isSanityConfigured } from '@/lib/sanity/client';
import { SAMPLE_POSTS } from '@/lib/sanity/sample-data';
import { Post } from '@/types/sanity';

export async function GET(req: Request) {
  return handleCronPublish(req);
}

export async function POST(req: Request) {
  return handleCronPublish(req);
}

async function handleCronPublish(req: Request) {
  // Verify Cron authorization secret
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET?.trim();
  const vercelCronHeader = req.headers.get('x-vercel-cron');

  // If CRON_SECRET is configured, require valid authorization header
  if (cronSecret) {
    const isAuthorized =
      authHeader === `Bearer ${cronSecret}` ||
      vercelCronHeader === 'true' ||
      req.headers.get('x-cron-secret') === cronSecret;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or missing CRON_SECRET' },
        { status: 401 }
      );
    }
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const publishedList: { id: string; title: string; slug: string }[] = [];

  // 1. Process in-memory fallback posts
  for (const post of SAMPLE_POSTS) {
    if (
      post.status === 'scheduled' &&
      post.scheduledAt &&
      new Date(post.scheduledAt) <= now
    ) {
      post.status = 'published';
      post.publishedAt = post.scheduledAt || nowIso;
      post.updatedAt = nowIso;
      publishedList.push({
        id: post._id,
        title: post.title,
        slug: post.slug.current,
      });
    }
  }

  // 2. Process in Sanity if configured
  if (isSanityConfigured()) {
    try {
      const client = getAdminClient();
      const duePosts: Post[] = await client.fetch(
        `*[_type == "post" && status == "scheduled" && scheduledAt <= $nowIso] {
          _id,
          title,
          slug,
          scheduledAt
        }`,
        { nowIso }
      );

      for (const due of duePosts) {
        // Transition post to published
        await client
          .patch(due._id)
          .set({
            status: 'published',
            publishedAt: due.scheduledAt || nowIso,
            updatedAt: nowIso,
          })
          .commit();

        // Write Audit Log entry
        await client.create({
          _type: 'auditLog',
          action: 'publish',
          postId: due._id,
          postTitle: due.title,
          timestamp: nowIso,
          performedBy: 'Automated Scheduler (Cron)',
        });

        if (!publishedList.some((p) => p.id === due._id)) {
          publishedList.push({
            id: due._id,
            title: due.title,
            slug: due.slug?.current || due._id,
          });
        }
      }
    } catch (err: any) {
      console.error('Error in cron scheduled publishing from Sanity:', err);
      return NextResponse.json(
        {
          error: 'Failed to process scheduled posts in Sanity',
          details: err.message,
        },
        { status: 500 }
      );
    }
  }

  // Revalidate public routes if any post was published
  if (publishedList.length > 0) {
    try {
      revalidatePath('/');
      revalidatePath('/[category]', 'page');
      for (const p of publishedList) {
        revalidatePath(`/post/${p.slug}`);
      }
    } catch (revalErr) {
      console.error('Revalidation error:', revalErr);
    }
  }

  return NextResponse.json({
    success: true,
    timestamp: nowIso,
    publishedCount: publishedList.length,
    publishedPosts: publishedList,
  });
}

import { NextResponse } from 'next/server';
import { getAdminClient, isSanityConfigured } from '@/lib/sanity/client';
import { SAMPLE_POSTS } from '@/lib/sanity/sample-data';

// In-memory view deduplication map: key = `${ip}_${slug}`, value = timestamp
const recentViewsMap = new Map<string, number>();
const DEDUPLICATION_WINDOW_MS = 15 * 60 * 1000; // 15 minutes per unique visitor/post

interface Params {
  params: Promise<{ slug: string }>;
}

export async function POST(req: Request, { params }: Params) {
  const { slug } = await params;

  // Extract client IP / user-agent for deduplication
  const forwardedFor = req.headers.get('x-forwarded-for');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
  const dedupKey = `${clientIp}_${slug}`;

  const now = Date.now();
  const lastViewTime = recentViewsMap.get(dedupKey);

  // If viewed within last 15 minutes, skip incrementing to prevent fake view spam
  if (lastViewTime && now - lastViewTime < DEDUPLICATION_WINDOW_MS) {
    const existingPost = SAMPLE_POSTS.find((p) => p.slug.current === slug);
    return NextResponse.json({
      success: true,
      incremented: false,
      views: existingPost?.viewsCount || 1,
    });
  }

  // Record view timestamp
  recentViewsMap.set(dedupKey, now);

  // Periodically clean up old entries in dedup map
  if (recentViewsMap.size > 10000) {
    for (const [key, time] of recentViewsMap.entries()) {
      if (now - time > DEDUPLICATION_WINDOW_MS) {
        recentViewsMap.delete(key);
      }
    }
  }

  let totalViews = 1;

  // Update in-memory fallback
  const post = SAMPLE_POSTS.find((p) => p.slug.current === slug);
  if (post) {
    post.viewsCount = (post.viewsCount || 0) + 1;
    totalViews = post.viewsCount;
  }

  // Update in Sanity if configured
  if (isSanityConfigured()) {
    try {
      const client = getAdminClient();
      const sanityPost = await client.fetch(
        `*[_type == "post" && slug.current == $slug][0]._id`,
        { slug }
      );

      if (sanityPost) {
        const updated = await client
          .patch(sanityPost)
          .setIfMissing({ viewsCount: 0 })
          .inc({ viewsCount: 1 })
          .commit();

        totalViews = updated.viewsCount || totalViews;
      }
    } catch (err) {
      console.error('Error recording view in Sanity:', err);
    }
  }

  return NextResponse.json({
    success: true,
    incremented: true,
    views: totalViews,
  });
}

export async function GET(req: Request, { params }: Params) {
  const { slug } = await params;
  let views = 0;

  const post = SAMPLE_POSTS.find((p) => p.slug.current === slug);
  if (post) {
    views = post.viewsCount || 0;
  }

  if (isSanityConfigured()) {
    try {
      const client = getAdminClient();
      const sanityPost = await client.fetch(
        `*[_type == "post" && slug.current == $slug][0].viewsCount`,
        { slug }
      );
      if (typeof sanityPost === 'number') {
        views = sanityPost;
      }
    } catch (err) {
      console.error('Error fetching views from Sanity:', err);
    }
  }

  return NextResponse.json({ slug, views });
}

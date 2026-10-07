import Link from 'next/link';
import { getHomePosts } from '@/lib/sanity/fetch';
import { PostsTable } from '@/components/admin/PostsTable';
import { PlusCircle } from 'lucide-react';
import { SAMPLE_POSTS } from '@/lib/sanity/sample-data';
import { isSanityConfigured } from '@/lib/sanity/client';
import { getAdminClient } from '@/lib/sanity/client';
import { Post } from '@/types/sanity';

export default async function AdminPostsPage() {
  let allPosts: Post[] = SAMPLE_POSTS;

  if (isSanityConfigured()) {
    try {
      const client = getAdminClient();
      const sanityPosts = await client.fetch(`*[_type == "post"] | order(_updatedAt desc) {
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
      if (sanityPosts?.length) allPosts = sanityPosts;
    } catch (err) {
      console.error('Error fetching admin posts, using fallback:', err);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50">
            તમામ સમાચારો (All Posts)
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-1 uppercase">
            Manage, edit, schedule and publish newsroom stories
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-bold px-4 py-2.5 rounded-sm transition-colors cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          નવો અહેવાલ (New Story)
        </Link>
      </div>

      {/* Interactive Posts Table */}
      <PostsTable initialPosts={allPosts} />
    </div>
  );
}

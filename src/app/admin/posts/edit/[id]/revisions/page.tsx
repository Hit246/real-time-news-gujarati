import { notFound } from 'next/navigation';
import { SAMPLE_POSTS } from '@/lib/sanity/sample-data';
import { isSanityConfigured, getAdminClient } from '@/lib/sanity/client';
import { Post } from '@/types/sanity';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface RevisionsPageProps {
  params: Promise<{ id: string }>;
}

export default async function RevisionsPage({ params }: RevisionsPageProps) {
  const { id } = await params;
  let post: Post | null = SAMPLE_POSTS.find((p) => p._id === id) || null;

  if (isSanityConfigured()) {
    try {
      const client = getAdminClient();
      const sanityPost = await client.fetch(`*[_type == "post" && _id == $id][0]`, { id });
      if (sanityPost) post = sanityPost;
    } catch (err) {
      console.error('Error fetching post for revisions from Sanity:', err);
    }
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <Link
          href={`/admin/posts/edit/${id}`}
          className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-sm text-zinc-600 dark:text-zinc-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50">
            રિવિઝન હિસ્ટ્રી: {post.title}
          </h1>
          <p className="text-xs font-mono text-zinc-500 uppercase mt-0.5">
            Post ID: {id} • Full revision snapshot timeline
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm p-6">
        <p className="text-sm font-sans text-zinc-700 dark:text-zinc-300 mb-4">
          તમે એડિટર પેજ પરથી સીધું &quot;રિવિઝન હિસ્ટ્રી&quot; બટન દબાવીને સ્નેપશોટ જોઈ અને રિસ્ટોર કરી શકો છો.
        </p>
        <Link
          href={`/admin/posts/edit/${id}`}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-sm transition-colors"
        >
          એડિટરમાં પાછા જાઓ અને રિવિઝન મેનેજ કરો
        </Link>
      </div>
    </div>
  );
}

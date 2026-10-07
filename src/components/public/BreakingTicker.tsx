import Link from 'next/link';
import { getBreakingNews } from '@/lib/sanity/fetch';

export async function BreakingTicker() {
  const breakingPosts = await getBreakingNews();

  if (!breakingPosts || breakingPosts.length === 0) {
    return null;
  }

  return (
    <div className="bg-zinc-950 text-white dark:bg-zinc-900 border-b border-zinc-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-3">
        <span className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold tracking-wider px-2 py-0.5 rounded-xs shrink-0">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          બ્રેકિંગ ન્યૂઝ
        </span>
        <div className="overflow-hidden whitespace-nowrap text-xs sm:text-sm font-medium flex-1">
          <div className="inline-flex items-center gap-6">
            {breakingPosts.map((post) => (
              <Link
                key={post._id}
                href={`/post/${post.slug.current}`}
                className="hover:underline hover:text-red-400 transition-colors"
              >
                {post.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

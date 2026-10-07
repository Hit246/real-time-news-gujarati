import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types/sanity';
import { formatDate } from '@/lib/utils/format-date';

interface LatestFeedProps {
  posts: Post[];
}

export function LatestFeed({ posts }: LatestFeedProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="border-b-2 border-zinc-900 dark:border-zinc-100 pb-2">
        <h3 className="font-serif text-2xl font-bold tracking-tight">
          તાજા અહેવાલો
        </h3>
      </div>

      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {posts.map((post) => (
          <article key={post._id} className="py-6 first:pt-0 group flex flex-col sm:flex-row gap-6">
            <Link
              href={`/post/${post.slug.current}`}
              className="relative aspect-[16/9] sm:w-56 shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-800 rounded-sm"
            >
              <Image
                src={post.mainImage?.url || '/placeholder.jpg'}
                alt={post.mainImage?.alt || post.title}
                fill
                sizes="(max-width: 640px) 100vw, 224px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1.5">
                  {post.isOpinion && (
                    <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-xs font-bold">
                      મંતવ્ય
                    </span>
                  )}
                  {post.isBreaking && (
                    <span className="bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 text-[10px] px-1.5 py-0.2 rounded-xs font-bold">
                      બ્રેકિંગ
                    </span>
                  )}
                  <Link href={`/${post.category?.slug?.current}`} className="text-red-600 hover:underline font-bold">
                    {post.category?.title}
                  </Link>
                  <span>•</span>
                  <time dateTime={post.publishedAt || ''}>
                    {formatDate(post.publishedAt)}
                  </time>
                </div>

                <h4 className="font-serif text-lg sm:text-xl font-bold leading-snug group-hover:text-red-600 transition-colors mb-2">
                  <Link href={`/post/${post.slug.current}`}>
                    {post.title}
                  </Link>
                </h4>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <div className="mt-3 text-xs text-zinc-400 font-medium">
                અહેવાલ: {post.author?.name}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

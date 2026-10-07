import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types/sanity';
import { formatDate } from '@/lib/utils/format-date';

interface HeroGridProps {
  posts: Post[];
}

export function HeroGrid({ posts }: HeroGridProps) {
  if (!posts || posts.length === 0) return null;

  const leadStory = posts[0];
  const sideStories = posts.slice(1, 5);

  return (
    <section className="mb-14 pb-12 border-b-2 border-zinc-900 dark:border-zinc-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 1 Large Lead Story (Takes 7 columns on desktop) */}
        {leadStory && (
          <article className="lg:col-span-7 flex flex-col justify-between group">
            <div>
              <Link
                href={`/post/${leadStory.slug.current}`}
                className="relative aspect-[16/9] w-full block overflow-hidden bg-zinc-100 dark:bg-zinc-800 rounded-sm mb-4"
              >
                <Image
                  src={leadStory.mainImage?.url || '/placeholder.jpg'}
                  alt={leadStory.mainImage?.alt || leadStory.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-2">
                {leadStory.isOpinion && (
                  <span className="bg-red-600 text-white text-[11px] px-2 py-0.5 rounded-xs font-bold">
                    મંતવ્ય
                  </span>
                )}
                {leadStory.isBreaking && (
                  <span className="bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 text-[11px] px-2 py-0.5 rounded-xs font-bold">
                    બ્રેકિંગ
                  </span>
                )}
                <Link
                  href={`/${leadStory.category?.slug?.current}`}
                  className="text-red-600 hover:underline font-bold"
                >
                  {leadStory.category?.title}
                </Link>
                <span>•</span>
                <time dateTime={leadStory.publishedAt || ''}>
                  {formatDate(leadStory.publishedAt)}
                </time>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-snug group-hover:text-red-600 transition-colors mb-3">
                <Link href={`/post/${leadStory.slug.current}`}>
                  {leadStory.title}
                </Link>
              </h2>

              <p className="text-base text-zinc-600 dark:text-zinc-300 font-normal leading-relaxed line-clamp-3">
                {leadStory.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-900 text-xs text-zinc-500 font-medium">
              અહેવાલ: {leadStory.author?.name}
            </div>
          </article>
        )}

        {/* 4 Compact Supporting Stories */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          {sideStories.map((story) => (
            <article
              key={story._id}
              className="group flex flex-col sm:flex-row lg:flex-row gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800 last:border-0 last:pb-0"
            >
              <Link
                href={`/post/${story.slug.current}`}
                className="relative aspect-[16/9] sm:w-36 lg:w-40 shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-800 rounded-sm"
              >
                <Image
                  src={story.mainImage?.url || '/placeholder.jpg'}
                  alt={story.mainImage?.alt || story.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 160px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                    <span className="text-red-600 font-semibold">{story.category?.title}</span>
                    <span>•</span>
                    <time dateTime={story.publishedAt || ''}>
                      {formatDate(story.publishedAt)}
                    </time>
                  </div>
                  <h3 className="font-serif text-sm sm:text-base font-bold leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                    <Link href={`/post/${story.slug.current}`}>
                      {story.title}
                    </Link>
                  </h3>
                </div>

                <div className="text-xs text-zinc-400 mt-1">
                  {story.author?.name}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

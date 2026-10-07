import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types/sanity';
import { formatDate } from '@/lib/utils/format-date';

interface RelatedStoriesProps {
  posts: Post[];
}

export function RelatedStories({ posts }: RelatedStoriesProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t-2 border-zinc-900 dark:border-zinc-100">
      <h2 className="font-serif text-2xl font-bold tracking-tight mb-8">
        સંબંધિત સમાચારો
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post) => {
          const imageUrl = post.mainImage?.url || '/placeholder.jpg';
          return (
            <article key={post._id} className="group flex flex-col">
              <Link href={`/post/${post.slug.current}`} className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-3 rounded-sm">
                <Image
                  src={imageUrl}
                  alt={post.mainImage?.alt || post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                <span className="font-semibold text-red-600">{post.category?.title}</span>
                <span>•</span>
                <time dateTime={post.publishedAt || ''}>
                  {formatDate(post.publishedAt)}
                </time>
              </div>
              <h3 className="font-serif text-base font-bold leading-snug group-hover:text-red-600 transition-colors">
                <Link href={`/post/${post.slug.current}`}>
                  {post.title}
                </Link>
              </h3>
            </article>
          );
        })}
      </div>
    </section>
  );
}

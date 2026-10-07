import Link from 'next/link';
import Image from 'next/image';
import { Post, Category } from '@/types/sanity';
import { formatDate } from '@/lib/utils/format-date';

interface CategoryBlocksProps {
  categories: Category[];
  posts: Post[];
}

export function CategoryBlocks({ categories, posts }: CategoryBlocksProps) {
  const categoriesWithPosts = categories
    .map((cat) => ({
      category: cat,
      posts: posts.filter((p) => p.category?._id === cat._id || p.category?.slug?.current === cat.slug?.current),
    }))
    .filter((item) => item.posts.length > 0);

  if (categoriesWithPosts.length === 0) return null;

  return (
    <div className="space-y-14">
      {categoriesWithPosts.map(({ category, posts: catPosts }) => {
        const primaryPost = catPosts[0];
        const otherPosts = catPosts.slice(1, 4);

        return (
          <section key={category._id} className="border-t-2 border-zinc-900 dark:border-zinc-100 pt-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {category.title}
              </h3>
              <Link
                href={`/${category.slug.current}`}
                className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline font-sans"
              >
                બધા સમાચારો &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Primary Category Story */}
              {primaryPost && (
                <article className="md:col-span-6 flex flex-col justify-between group">
                  <div>
                    <Link
                      href={`/post/${primaryPost.slug.current}`}
                      className="relative aspect-[16/9] w-full block overflow-hidden bg-zinc-100 dark:bg-zinc-800 rounded-sm mb-3"
                    >
                      <Image
                        src={primaryPost.mainImage?.url || '/placeholder.jpg'}
                        alt={primaryPost.mainImage?.alt || primaryPost.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                      {primaryPost.isOpinion && (
                        <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-xs font-bold">
                          મંતવ્ય
                        </span>
                      )}
                      <time dateTime={primaryPost.publishedAt || ''}>
                        {formatDate(primaryPost.publishedAt)}
                      </time>
                    </div>

                    <h4 className="font-serif text-xl font-bold leading-snug group-hover:text-red-600 transition-colors mb-2">
                      <Link href={`/post/${primaryPost.slug.current}`}>
                        {primaryPost.title}
                      </Link>
                    </h4>

                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {primaryPost.summary}
                    </p>
                  </div>

                  <div className="text-xs text-zinc-400 mt-2 font-medium">
                    અહેવાલ: {primaryPost.author?.name}
                  </div>
                </article>
              )}

              {/* Supporting Category Stories */}
              <div className="md:col-span-6 space-y-4">
                {otherPosts.map((post) => (
                  <article
                    key={post._id}
                    className="group flex gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800 last:border-0 last:pb-0"
                  >
                    <Link
                      href={`/post/${post.slug.current}`}
                      className="relative aspect-[16/9] w-32 shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-800 rounded-sm"
                    >
                      <Image
                        src={post.mainImage?.url || '/placeholder.jpg'}
                        alt={post.mainImage?.alt || post.title}
                        fill
                        sizes="128px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-zinc-400 mb-0.5">
                        <time dateTime={post.publishedAt || ''}>
                          {formatDate(post.publishedAt)}
                        </time>
                      </div>
                      <h5 className="font-serif text-sm font-bold leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                        <Link href={`/post/${post.slug.current}`}>
                          {post.title}
                        </Link>
                      </h5>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

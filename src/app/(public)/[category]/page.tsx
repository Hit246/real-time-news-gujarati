import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getCategoryPosts, getCategories, getSiteSettings, getHomePosts } from '@/lib/sanity/fetch';
import { formatDate } from '@/lib/utils/format-date';
import { Pagination } from '@/components/public/Pagination';
import { Sidebar } from '@/components/public/Sidebar';
import { Post } from '@/types/sanity';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug.current === categorySlug);

  if (!category) {
    return { title: 'વિભાગ મળ્યો નથી | રીયલ ટાઇમ ન્યૂઝ ગુજરાતી' };
  }

  return {
    title: `${category.title} સમાચાર અને વિશ્લેષણ | રીયલ ટાઇમ ન્યૂઝ ગુજરાતી`,
    description: `${category.title} વિભાગના તાજા અહેવાલો, સમાચાર અને વિશેષ લેખો.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const search = await searchParams;
  const currentPage = parseInt(search.page || '1', 10);

  const categories = await getCategories();
  const category = categories.find((c) => c.slug.current === categorySlug);

  if (!category) {
    notFound();
  }

  const [{ posts, total, totalPages }, allPosts, settings] = await Promise.all([
    getCategoryPosts(categorySlug, currentPage, 8),
    getHomePosts(),
    getSiteSettings(),
  ]);

  return (
    <div className="space-y-10">
      {/* Category Header */}
      <div className="border-b-2 border-zinc-900 dark:border-zinc-100 pb-4">
        <span className="text-xs uppercase font-bold text-red-600">
          વિભાગ
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mt-1 text-zinc-950 dark:text-zinc-50">
          {category.title}
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          આ વિભાગમાં કુલ {total} અહેવાલો ઉપલબ્ધ છે
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Category Posts List */}
        <div className="lg:col-span-8">
          {posts.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-sm text-zinc-500">
              આ વિભાગમાં હાલ કોઈ અહેવાલ ઉપલબ્ધ નથી.
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {posts.map((post: Post) => (
                <article
                  key={post._id}
                  className="py-8 first:pt-0 group flex flex-col sm:flex-row gap-6"
                >
                  <Link
                    href={`/post/${post.slug.current}`}
                    className="relative aspect-[16/9] sm:w-60 shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-800 rounded-sm"
                  >
                    <Image
                      src={post.mainImage?.url || '/placeholder.jpg'}
                      alt={post.mainImage?.alt || post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 240px"
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
                        <time dateTime={post.publishedAt || ''}>
                          {formatDate(post.publishedAt)}
                        </time>
                      </div>

                      <h2 className="font-serif text-xl font-bold leading-snug group-hover:text-red-600 transition-colors mb-2">
                        <Link href={`/post/${post.slug.current}`}>
                          {post.title}
                        </Link>
                      </h2>

                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>

                    <div className="mt-4 text-xs text-zinc-400 font-medium">
                      અહેવાલ: {post.author?.name}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`/${categorySlug}`}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <Sidebar trendingPosts={allPosts} settings={settings} />
        </div>
      </div>
    </div>
  );
}

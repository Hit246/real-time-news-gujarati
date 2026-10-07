import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { searchPosts } from '@/lib/sanity/fetch';
import { formatDate } from '@/lib/utils/format-date';
import { Search, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'સમાચાર આર્કાઇવ અને શોધ | રીયલ ટાઇમ ન્યૂઝ ગુજરાતી',
  description: 'રીયલ ટાઇમ ન્યૂઝ ગુજરાતીના પ્રકાશિત અહેવાલો, સમાચાર અને લેખો શોધો.',
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string; tag?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, tag } = await searchParams;
  const searchQuery = (q || tag || '').trim();
  const results = searchQuery ? await searchPosts(searchQuery) : [];

  const popularTags = [
    'ગુજરાત',
    'સૌરઊર્જા',
    'ધોલેરા',
    'સેમિકન્ડક્ટર',
    'ખેતી',
    'નર્મદા',
    'વેપાર',
    'વિશ્લેષણ',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="border-b-2 border-zinc-900 dark:border-zinc-100 pb-4">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          સમાચાર શોધો
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          હેડલાઇન, વિષય અથવા કીવર્ડ દ્વારા અમારા સમગ્ર પત્રકારત્વ આર્કાઇવમાં શોધો.
        </p>
      </div>

      {/* Search Bar */}
      <form method="GET" action="/search" className="relative flex items-center">
        <div className="absolute left-4 text-zinc-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          name="q"
          defaultValue={searchQuery}
          placeholder="સમાચાર, વિષય અથવા લેખકનું નામ દાખલ કરો..."
          className="w-full pl-12 pr-28 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-sm text-base focus:outline-none focus:border-red-600 focus:bg-white dark:focus:bg-black transition-colors"
        />
        <button
          type="submit"
          className="absolute right-2 bg-zinc-950 hover:bg-red-600 dark:bg-zinc-100 dark:hover:bg-red-600 dark:text-zinc-950 text-white font-bold py-2 px-5 text-xs tracking-wider transition-colors rounded-sm cursor-pointer"
        >
          શોધો
        </button>
      </form>

      {/* Popular Topic Tags */}
      <div className="flex items-center flex-wrap gap-2 pt-2">
        <span className="text-xs font-bold text-zinc-500 flex items-center gap-1 mr-1">
          <Tag className="w-3.5 h-3.5 text-red-600" />
          મુખ્ય વિષયો:
        </span>
        {popularTags.map((topic) => (
          <Link
            key={topic}
            href={`/search?q=${encodeURIComponent(topic)}`}
            className={`text-xs px-2.5 py-1 rounded-sm border transition-colors ${searchQuery.toLowerCase() === topic.toLowerCase()
                ? 'bg-red-600 text-white border-red-600 font-bold'
                : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-red-600'
              }`}
          >
            #{topic}
          </Link>
        ))}
      </div>

      {/* Results Section */}
      {searchQuery ? (
        <div className="space-y-6 pt-4">
          <div className="flex justify-between items-center text-sm text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <span>
              &ldquo;<span className="text-zinc-900 dark:text-zinc-100 font-bold">{searchQuery}</span>&rdquo; માટે શોધ પરિણામો
            </span>
            <span>
              {results.length} અહેવાલો મળ્યા
            </span>
          </div>

          {results.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-sm">
              <p className="text-base text-zinc-600 dark:text-zinc-400 mb-2 font-medium">
                આ શોધ માટે કોઈ અહેવાલ મળ્યો નથી.
              </p>
              <p className="text-xs text-zinc-400">
                કૃપા કરીને અન્ય કીવર્ડ અથવા વિષય પસંદ કરીને ફરી પ્રયાસ કરો.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {results.map((post) => (
                <article
                  key={post._id}
                  className="py-6 first:pt-0 group flex flex-col sm:flex-row gap-6"
                >
                  <Link
                    href={`/post/${post.slug.current}`}
                    className="relative aspect-[16/9] sm:w-52 shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-800 rounded-sm"
                  >
                    <Image
                      src={post.mainImage?.url || '/placeholder.jpg'}
                      alt={post.mainImage?.alt || post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 208px"
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
                        <span className="text-red-600 font-semibold">{post.category?.title}</span>
                        <span>•</span>
                        <time dateTime={post.publishedAt || ''}>
                          {formatDate(post.publishedAt)}
                        </time>
                      </div>

                      <h2 className="font-serif text-lg sm:text-xl font-bold leading-snug group-hover:text-red-600 transition-colors mb-2">
                        <Link href={`/post/${post.slug.current}`}>
                          {post.title}
                        </Link>
                      </h2>

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
          )}
        </div>
      ) : (
        <div className="py-12 text-center text-zinc-500 text-sm">
          અમારા પત્રકારત્વ આર્કાઇવમાંથી અહેવાલો શોધવા માટે ઉપર સર્ચ કરો.
        </div>
      )}
    </div>
  );
}

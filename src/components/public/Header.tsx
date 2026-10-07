import Link from 'next/link';
import Image from 'next/image';
import { getCategories, getSiteSettings } from '@/lib/sanity/fetch';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Search } from 'lucide-react';

export async function Header() {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSiteSettings(),
  ]);

  const currentDate = new Intl.DateTimeFormat('gu-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      {/* Top utility bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center text-xs text-zinc-600 dark:text-zinc-400">
        <div className="font-sans font-medium text-xs">{currentDate}</div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>

      {/* Main Logo & Masthead Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col items-center justify-center text-center">
        <Link href="/" className="group inline-flex flex-col items-center">
          {settings.logo?.url ? (
            <div className="relative h-20 sm:h-24 md:h-28 w-80 sm:w-96 max-w-full my-1">
              <Image
                src={settings.logo.url}
                alt={settings.logo.alt || settings.siteName || 'Logo'}
                fill
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 bg-red-600 inline-block rotate-45 shrink-0" />
              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 group-hover:text-red-600 transition-colors">
                {settings.siteName || 'રીયલ ટાઇમ ન્યૂઝ ગુજરાતી'}
              </h1>
              <span className="w-3.5 h-3.5 bg-red-600 inline-block rotate-45 shrink-0" />
            </div>
          )}
        </Link>
        <p className="text-xs tracking-wider text-zinc-500 dark:text-zinc-400 mt-1.5 font-sans font-medium">
          સત્યની સાથે... સત્યની રાહ પર
        </p>
      </div>

      {/* Navigation bar - Sticky slim menu bar */}
      <nav className="sticky top-0 z-40 border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto py-2.5">
          <div className="flex items-center gap-6 sm:gap-8 text-sm font-bold tracking-wide whitespace-nowrap">
            <Link
              href="/"
              className="text-zinc-950 dark:text-zinc-50 hover:text-red-600 dark:hover:text-red-500 transition-colors"
            >
              મુખ્ય પૃષ્ઠ
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/${cat.slug.current}`}
                className="text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-500 transition-colors"
              >
                {cat.title}
              </Link>
            ))}
          </div>

          <Link
            href="/search"
            aria-label="સમાચાર શોધો"
            className="p-1.5 text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition-colors shrink-0 ml-4 flex items-center gap-1.5 text-xs font-semibold"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">શોધો</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}

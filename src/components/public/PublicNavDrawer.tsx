'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Search, Info, Phone, ShieldCheck, ChevronRight } from 'lucide-react';
import { Category } from '@/types/sanity';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface PublicNavDrawerProps {
  categories: Category[];
  siteName?: string;
}

export function PublicNavDrawer({ categories, siteName }: PublicNavDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Toggle Button in Sticky Nav */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'મેનુ બંધ કરો' : 'મેનુ ખોલો'}
        title={isOpen ? 'મેનુ બંધ કરો (Hide)' : 'મેનુ ખોલો (Show)'}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-zinc-800 dark:text-zinc-200 hover:text-red-600 dark:hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0 mr-2 cursor-pointer"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        <span className="text-xs font-bold hidden sm:inline">મેનુ</span>
      </button>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Sidebar Drawer */}
      <aside
        aria-label="મુખ્ય નેવિગેશન સાઇડબાર"
        className={`fixed top-0 left-0 z-50 h-screen w-72 sm:w-80 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-red-600 rotate-45 inline-block shrink-0" />
            <span className="font-serif font-black text-base text-zinc-950 dark:text-zinc-50 tracking-tight">
              {siteName || 'રીયલ ટાઇમ ન્યૂઝ ગુજરાતી'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="સાઇડબાર બંધ કરો"
              className="p-1.5 rounded-sm text-zinc-500 hover:text-red-600 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Primary Links */}
          <div className="space-y-1">
            <Link
              href="/"
              className={`flex items-center justify-between px-3 py-2.5 rounded-sm text-sm font-bold transition-colors ${pathname === '/'
                  ? 'bg-red-600 text-white'
                  : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-red-600'
                }`}
            >
              <span className="flex items-center gap-2.5">
                <Home className="w-4 h-4" />
                <span>મુખ્ય પૃષ્ઠ</span>
              </span>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </Link>

            <Link
              href="/search"
              className={`flex items-center justify-between px-3 py-2.5 rounded-sm text-sm font-bold transition-colors ${pathname.startsWith('/search')
                  ? 'bg-red-600 text-white'
                  : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-red-600'
                }`}
            >
              <span className="flex items-center gap-2.5">
                <Search className="w-4 h-4" />
                <span>સમાચાર શોધો</span>
              </span>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </Link>
          </div>

          {/* Categories Section */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-mono uppercase tracking-wider text-red-600 font-bold">
              સમાચાર વિભાગો (Categories)
            </div>
            <div className="space-y-1">
              {categories.map((cat) => {
                const href = `/${cat.slug.current}`;
                const isActive = pathname === href;
                return (
                  <Link
                    key={cat._id}
                    href={href}
                    className={`flex items-center justify-between px-3 py-2 rounded-sm text-sm font-bold transition-colors ${isActive
                        ? 'bg-red-600 text-white'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-red-600'
                      }`}
                  >
                    <span>{cat.title}</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Info Links */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
            <Link
              href="/about"
              className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>અમારા વિશે (About Us)</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>સંપર્ક કરો (Contact)</span>
            </Link>
            <Link
              href="/privacy"
              className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>ગોપનીયતા નીતિ (Privacy Policy)</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

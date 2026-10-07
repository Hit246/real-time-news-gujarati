'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Post, SiteSettings } from '@/types/sanity';
import { formatDate } from '@/lib/utils/format-date';
import { TrendingUp, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { NewsletterForm } from './NewsletterForm';

interface SidebarProps {
  trendingPosts: Post[];
  settings?: SiteSettings;
}

export function Sidebar({ trendingPosts, settings }: SidebarProps) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <aside className="space-y-6">
      {/* Sidebar Header with Hide / Show Toggle */}
      <div className="border-t-2 border-zinc-900 dark:border-zinc-100 pt-4">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-red-600 shrink-0" />
            <h3 className="font-serif text-lg font-bold tracking-tight">
              સૌથી વધુ વંચાયેલ / ટ્રેન્ડિંગ
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setIsVisible((prev) => !prev)}
            aria-expanded={isVisible}
            title={isVisible ? 'સાઇડબાર છુપાવો (Hide)' : 'સાઇડબાર બતાવો (Show)'}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors cursor-pointer shrink-0"
          >
            {isVisible ? (
              <>
                <PanelRightClose className="w-3.5 h-3.5" />
                <span>છુપાવો</span>
              </>
            ) : (
              <>
                <PanelRightOpen className="w-3.5 h-3.5" />
                <span>બતાવો</span>
              </>
            )}
          </button>
        </div>

        {isVisible && (
          <div className="space-y-10 animate-in fade-in duration-200">
            {/* Trending Stories List */}
            <div className="space-y-4 pt-2">
              {trendingPosts.slice(0, 5).map((post, idx) => (
                <article key={post._id} className="flex items-start gap-4 group">
                  <span className="font-serif text-2xl font-black text-red-600 dark:text-red-500 shrink-0 w-7">
                    0{idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-zinc-400 font-semibold mb-0.5">
                      {post.category?.title}
                    </div>
                    <h4 className="font-serif text-sm font-bold leading-snug group-hover:text-red-600 transition-colors">
                      <Link href={`/post/${post.slug.current}`}>
                        {post.title}
                      </Link>
                    </h4>
                    <div className="text-xs text-zinc-500 mt-1">
                      {formatDate(post.publishedAt)}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Newsletter Signup */}
            <NewsletterForm />

            {/* 1 Ad Slot */}
            <div className="border border-zinc-200 dark:border-zinc-800 p-2 text-center">
              {settings?.adCode ? (
                <div dangerouslySetInnerHTML={{ __html: settings.adCode }} />
              ) : (
                <div className="p-8 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 text-xs font-mono border border-dashed border-zinc-300 dark:border-zinc-800">
                  જાહેરાત જગ્યા (Advertisement Slot)
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}


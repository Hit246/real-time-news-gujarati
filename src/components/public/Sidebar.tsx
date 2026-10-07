import Link from 'next/link';
import { Post, SiteSettings } from '@/types/sanity';
import { formatDate } from '@/lib/utils/format-date';
import { TrendingUp } from 'lucide-react';
import { NewsletterForm } from './NewsletterForm';

interface SidebarProps {
  trendingPosts: Post[];
  settings?: SiteSettings;
}

export function Sidebar({ trendingPosts, settings }: SidebarProps) {
  return (
    <aside className="space-y-10">
      {/* Trending Stories */}
      <div className="border-t-2 border-zinc-900 dark:border-zinc-100 pt-4">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-4 h-4 text-red-600" />
          <h3 className="font-serif text-lg font-bold tracking-tight">
            સૌથી વધુ વંચાયેલ / ટ્રેન્ડિંગ
          </h3>
        </div>

        <div className="space-y-4">
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
    </aside>
  );
}

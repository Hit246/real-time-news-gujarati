import type { Metadata } from 'next';
import { auth } from '@/lib/auth/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
  title: 'Editorial Administration | Real Time News Gujarati',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If on login screen or not logged in, render child content (login page)
  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Editorial Sidebar */}
      <AdminSidebar userEmail={session.user.email} />

      {/* Main Admin Scrollable Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 flex items-center justify-between shrink-0">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-500">
            Real Time Newsroom Control Room
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-zinc-600 dark:text-zinc-400">Database Active</span>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

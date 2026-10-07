'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Image as ImageIcon,
  FolderTree,
  Settings,
  ExternalLink,
  LogOut,
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface AdminSidebarProps {
  userEmail?: string | null;
  isOpen?: boolean;
  onToggle?: () => void;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  userEmail,
  isOpen = true,
  onToggle,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'All Posts', href: '/admin/posts', icon: FileText, exact: true },
    { label: 'New Post', href: '/admin/posts/new', icon: PlusCircle, exact: false },
    { label: 'Media Library', href: '/admin/media', icon: ImageIcon, exact: false },
    { label: 'Categories & Tags', href: '/admin/categories', icon: FolderTree, exact: false },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings, exact: false },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Admin Sidebar"
        className={`fixed md:static inset-y-0 left-0 z-50 bg-zinc-900 text-zinc-300 flex flex-col border-r border-zinc-800 shrink-0 select-none transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen
            ? 'w-64 translate-x-0'
            : 'w-64 -translate-x-full md:w-0 md:translate-x-0 md:border-r-0'
        }`}
      >
        <div className="w-64 flex flex-col h-full">
          {/* Brand & Hide Button */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <div>
              <Link
                href="/admin"
                className="font-serif font-black text-lg text-white tracking-tight hover:text-red-500 transition-colors uppercase"
              >
                REAL TIME CMS
              </Link>
              <div className="flex items-center gap-1 text-[11px] font-mono text-red-500 font-bold uppercase mt-0.5">
                <Shield className="w-3 h-3" />
                <span>Editorial Desk</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <ThemeToggle />
              {onToggle && (
                <button
                  type="button"
                  onClick={onToggle}
                  title="Hide Sidebar (Ctrl+B)"
                  aria-label="Hide Sidebar"
                  className="p-1.5 rounded-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <PanelLeftClose className="w-4 h-4 hidden md:block" />
                  <X className="w-4 h-4 md:hidden" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-mono uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Footer Actions */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-950/60 space-y-3">
            <div className="text-xs">
              <div className="text-zinc-500 font-mono text-[10px] uppercase">
                Authenticated As:
              </div>
              <div className="font-mono text-zinc-300 truncate font-semibold">
                {userEmail}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors font-mono text-[11px]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Public Site</span>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors font-mono text-[11px] cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export function AdminShell({
  userEmail,
  children,
}: {
  userEmail?: string | null;
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Hydrate saved preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rtng_admin_sidebar_open');
      if (saved !== null) {
        setIsSidebarOpen(saved === 'true');
      } else if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('rtng_admin_sidebar_open', String(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const closeMobileSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Keyboard shortcut: Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        // Avoid triggering inside rich text editor bold command if editor is focused
        const activeEl = document.activeElement;
        const isEditable =
          activeEl instanceof HTMLElement &&
          (activeEl.isContentEditable ||
            activeEl.tagName === 'INPUT' ||
            activeEl.tagName === 'TEXTAREA');
        if (!isEditable) {
          e.preventDefault();
          toggleSidebar();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Toggleable Editorial Sidebar */}
      <AdminSidebar
        userEmail={userEmail}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        onCloseMobile={closeMobileSidebar}
      />

      {/* Main Admin Scrollable Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSidebar}
              title={isSidebarOpen ? 'Hide (Ctrl+B)' : 'Show (Ctrl+B)'}
              aria-label={isSidebarOpen ? 'Hide' : 'Show'}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-200 hover:bg-red-600 hover:text-white hover:border-red-600 dark:hover:bg-red-600 transition-colors text-xs font-mono cursor-pointer"
            >
              {isSidebarOpen ? (
                <>
                  <PanelLeftClose className="w-4 h-4" />
                  <span className="hidden sm:inline">Hide</span>
                </>
              ) : (
                <>
                  <PanelLeftOpen className="w-4 h-4 hidden sm:block" />
                  <Menu className="w-4 h-4 sm:hidden" />
                  <span className="hidden sm:inline">Show</span>
                </>
              )}
            </button>
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 truncate">
              Real Time Newsroom Control Room
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono shrink-0">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-zinc-600 dark:text-zinc-400 hidden sm:inline">
              Database Active
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}


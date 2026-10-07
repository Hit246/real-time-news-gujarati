'use client';

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
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface AdminSidebarProps {
  userEmail?: string | null;
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
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
    <aside className="w-64 bg-zinc-900 text-zinc-300 flex flex-col border-r border-zinc-800 shrink-0 select-none">
      {/* Brand */}
      <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <Link href="/admin" className="font-serif font-black text-lg text-white tracking-tight hover:text-red-500 transition-colors uppercase">
            REAL TIME CMS
          </Link>
          <div className="flex items-center gap-1 text-[11px] font-mono text-red-500 font-bold uppercase mt-0.5">
            <Shield className="w-3 h-3" />
            <span>Editorial Desk</span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-mono uppercase tracking-wider transition-colors ${isActive
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
          <div className="text-zinc-500 font-mono text-[10px] uppercase">Authenticated As:</div>
          <div className="font-mono text-zinc-300 truncate font-semibold">{userEmail}</div>
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
    </aside>
  );
}

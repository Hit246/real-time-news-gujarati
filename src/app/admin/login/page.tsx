import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { LoginForm } from '@/components/admin/LoginForm';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Editorial Staff Login | Real Time News Gujarati',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-zinc-100 dark:bg-zinc-950">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm rounded-sm">
        {/* Newsroom header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group mb-3">
            <h1 className="font-serif text-2xl font-black uppercase tracking-tight group-hover:text-red-600 transition-colors">
              REAL TIME NEWS GUJARATI
            </h1>
          </Link>
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono uppercase text-red-600 font-bold tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Staff Administration Console</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            Restricted access. Only authorized editorial emails are permitted.
          </p>
        </div>

        {/* Login form with Suspense boundary */}
        <Suspense fallback={<div className="text-center py-6 text-xs text-zinc-400">Loading console...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-center">
          <Link href="/" className="text-xs text-zinc-500 hover:text-red-600 transition-colors font-mono">
            &larr; Return to Public Site
          </Link>
        </div>
      </div>
    </div>
  );
}

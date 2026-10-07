import type { Metadata } from 'next';
import { auth } from '@/lib/auth/auth';
import { AdminShell } from '@/components/admin/AdminSidebar';

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

  return <AdminShell userEmail={session.user.email}>{children}</AdminShell>;
}


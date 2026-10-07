import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { BreakingTicker } from '@/components/public/BreakingTicker';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <BreakingTicker />
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}

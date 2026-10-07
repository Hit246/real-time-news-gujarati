import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    return page === 1 ? basePath : `${basePath}?page=${page}`;
  };

  return (
    <nav aria-label="Pagination Navigation" className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-6 mt-12">
      <div className="flex w-0 flex-1">
        {currentPage > 1 ? (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            પાછળ
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-zinc-300 dark:text-zinc-700 cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
            પાછળ
          </span>
        )}
      </div>

      <div className="hidden md:flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
          const isActive = pageNum === currentPage;
          return (
            <Link
              key={pageNum}
              href={getPageUrl(pageNum)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-9 h-9 flex items-center justify-center text-sm font-sans rounded-sm transition-colors ${
                isActive
                  ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      <div className="flex w-0 flex-1 justify-end">
        {currentPage < totalPages ? (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition-colors"
          >
            આગળ
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-zinc-300 dark:text-zinc-700 cursor-not-allowed">
            આગળ
            <ChevronRight className="w-4 h-4" />
          </span>
        )}
      </div>
    </nav>
  );
}

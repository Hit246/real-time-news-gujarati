'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    if (isCurrentlyDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('real-time_theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('real-time_theme', 'dark');
      setTheme('dark');
    }
  };

  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={theme === 'light' ? 'ડાર્ક મોડ ચાલુ કરો' : 'લાઈટ મોડ ચાલુ કરો'}
      aria-label="Toggle Theme"
      className="p-1.5 rounded-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer inline-flex items-center justify-center border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900"
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 text-zinc-800" />
      ) : (
        <Sun className="w-4 h-4 text-amber-400" />
      )}
    </button>
  );
}

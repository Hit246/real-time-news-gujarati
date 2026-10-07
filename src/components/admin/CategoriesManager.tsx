'use client';

import { useState } from 'react';
import { Category } from '@/types/sanity';
import { slugify } from '@/lib/utils/slugify';
import { Plus, FolderTree, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface CategoriesManagerProps {
  initialCategories: Category[];
}

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [order, setOrder] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(slugify(val));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, order }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to create category');
      }

      setCategories([...categories, json.category]);
      setTitle('');
      setSlug('');
      setOrder(0);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-20">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="font-serif text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50">
          સમાચાર વિભાગો (Categories & Sections)
        </h1>
        <p className="text-xs font-mono text-zinc-500 mt-1 uppercase">
          Manage news sections, ordering, and category URL slugs
        </p>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 bg-green-600/10 border border-green-600/30 text-green-700 dark:text-green-400 text-sm rounded-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>નવો વિભાગ સફળતાપૂર્વક ઉમેરાયો છે! (Category created)</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-600/10 border border-red-600/30 text-red-600 dark:text-red-400 text-sm rounded-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Add New Category Form */}
        <div className="md:col-span-5 bg-white dark:bg-zinc-900 p-6 rounded-sm border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <h3 className="font-serif text-base font-bold flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <Plus className="w-4 h-4 text-red-600" />
            નવો વિભાગ ઉમેરો (Add Category)
          </h3>

          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div>
              <label className="block font-mono font-bold mb-1 text-zinc-700 dark:text-zinc-300">
                વિભાગનું નામ (Category Title) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="દા.ત. રમતગમત અથવા મનોરંજન"
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600 font-sans text-sm"
              />
            </div>

            <div>
              <label className="block font-mono font-bold mb-1 text-zinc-700 dark:text-zinc-300">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="sports"
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600 font-mono"
              />
            </div>

            <div>
              <label className="block font-mono font-bold mb-1 text-zinc-700 dark:text-zinc-300">
                ક્રમ (Display Order)
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-400 text-white font-bold py-2.5 px-4 text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'વિભાગ સેવ કરો (Save Category)'}
            </button>
          </form>
        </div>

        {/* Right: Existing Categories List */}
        <div className="md:col-span-7 bg-white dark:bg-zinc-900 rounded-sm border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-red-600" />
            <h3 className="font-serif text-base font-bold">
              હાલના વિભાગો ({categories.length})
            </h3>
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {categories.map((cat, idx) => (
              <div key={cat._id || idx} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div>
                  <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-sans">
                    {cat.title}
                  </div>
                  <div className="text-xs font-mono text-zinc-400 mt-0.5">
                    /{cat.slug.current} • ક્રમ: {cat.order || 0}
                  </div>
                </div>

                <a
                  href={`/${cat.slug.current}`}
                  target="_blank"
                  className="text-xs font-mono text-red-600 hover:underline"
                >
                  View Page &rarr;
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

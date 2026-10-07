'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Post } from '@/types/sanity';
import { formatDate } from '@/lib/utils/format-date';
import { Search, Edit3, Copy, Trash2, Eye, PlusCircle, AlertCircle, Loader2 } from 'lucide-react';

interface PostsTableProps {
  initialPosts: Post[];
}

export function PostsTable({ initialPosts }: PostsTableProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      post.title.toLowerCase().includes(lowerSearch) ||
      post.summary.toLowerCase().includes(lowerSearch) ||
      post.category?.title?.toLowerCase().includes(lowerSearch);

    return matchesStatus && matchesSearch;
  });

  // Duplicate Post
  const handleDuplicate = async (postToDuplicate: Post) => {
    setDuplicatingId(postToDuplicate._id);
    try {
      const duplicatedData = {
        title: `${postToDuplicate.title} (Copy)`,
        slug: `${postToDuplicate.slug.current}-copy-${Date.now()}`,
        summary: postToDuplicate.summary,
        body: postToDuplicate.body,
        mainImage: postToDuplicate.mainImage,
        categoryId: postToDuplicate.category?._id || 'cat-gujarat',
        authorId: postToDuplicate.author?._id || 'author-1',
        tags: postToDuplicate.tags || [],
        status: 'draft',
        isBreaking: false,
        isOpinion: postToDuplicate.isOpinion || false,
        seoTitle: postToDuplicate.seoTitle,
        seoDescription: postToDuplicate.seoDescription,
      };

      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicatedData),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.post) {
          setPosts([json.post, ...posts]);
          router.push(`/admin/posts/edit/${json.post._id}`);
        }
      } else {
        alert('અહેવાલ ડુપ્લિકેટ કરવામાં સમસ્યા આવી.');
      }
    } catch {
      alert('Error duplicating post');
    } finally {
      setDuplicatingId(null);
    }
  };

  // Delete Post
  const handleDelete = async (postId: string) => {
    setDeletingId(postId);
    try {
      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPosts(posts.filter((p) => p._id !== postId));
        setConfirmDeleteId(null);
      } else {
        alert('અહેવાલ ડિલીટ કરવામાં સમસ્યા આવી.');
      }
    } catch {
      alert('Error deleting post');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status filter tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-200 dark:bg-zinc-800/80 rounded-sm text-xs font-mono">
          {(['all', 'published', 'draft', 'scheduled'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xs font-bold uppercase transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              {st === 'all'
                ? `બધા (${posts.length})`
                : st === 'published'
                ? `Published (${posts.filter((p) => p.status === 'published').length})`
                : st === 'draft'
                ? `Drafts (${posts.filter((p) => p.status === 'draft').length})`
                : `Scheduled (${posts.filter((p) => p.status === 'scheduled').length})`}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="અહેવાલ શીર્ષક અથવા વિષય શોધો..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-sm border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 text-[11px] font-mono uppercase border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">Headline</th>
                <th className="py-3.5 px-4 font-bold">Category</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-center">Traffic / Views</th>
                <th className="py-3.5 px-4 font-bold">Author</th>
                <th className="py-3.5 px-4 font-bold">Updated</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400 text-xs font-mono">
                    કોઈ અહેવાલ મળ્યો નથી. (No posts found matching filter)
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => {
                  const genuineViews = post.viewsCount || 0;
                  return (
                  <tr
                    key={post._id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    {/* Headline */}
                    <td className="py-3.5 px-4 font-serif font-bold text-zinc-900 dark:text-zinc-100 max-w-sm">
                      <Link
                        href={`/admin/posts/edit/${post._id}`}
                        className="hover:text-red-600 transition-colors line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 mt-0.5">
                        {post.isOpinion && (
                          <span className="text-red-600 font-bold uppercase">Opinion</span>
                        )}
                        {post.isBreaking && (
                          <span className="bg-red-600 text-white px-1 rounded-xs font-bold text-[9px]">
                            Breaking
                          </span>
                        )}
                        <span>/post/{post.slug.current}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                      {post.category?.title}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase font-bold ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                            : post.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>

                    {/* Traffic / Views */}
                    <td className="py-3.5 px-4 text-center font-mono text-xs font-bold">
                      {post.status === 'published' ? (
                        <span className="text-zinc-800 dark:text-zinc-200">
                          {genuineViews.toLocaleString('gu-IN')} <span className="text-[10px] font-normal text-zinc-400">વ્યુઝ</span>
                        </span>
                      ) : (
                        <span className="text-zinc-400 text-[11px]">-</span>
                      )}
                    </td>

                    {/* Author */}
                    <td className="py-3.5 px-4 text-xs text-zinc-600 dark:text-zinc-400">
                      {post.author?.name}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-xs text-zinc-500 font-mono">
                      {formatDate(post.updatedAt || post.publishedAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Public Preview / View */}
                        {post.status === 'published' ? (
                          <Link
                            href={`/post/${post.slug.current}`}
                            target="_blank"
                            title="View Public Post"
                            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <Link
                            href={`/admin/preview/${post._id}`}
                            target="_blank"
                            title="Preview Draft"
                            className="p-1.5 text-amber-500 hover:text-amber-600 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        )}

                        {/* Edit */}
                        <Link
                          href={`/admin/posts/edit/${post._id}`}
                          title="Edit Post"
                          className="p-1.5 text-zinc-700 dark:text-zinc-300 hover:text-red-600 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => handleDuplicate(post)}
                          disabled={duplicatingId === post._id}
                          title="Duplicate Post"
                          className="p-1.5 text-zinc-700 dark:text-zinc-300 hover:text-blue-600 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                          {duplicatingId === post._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Delete with Confirmation */}
                        {confirmDeleteId === post._id ? (
                          <div className="inline-flex items-center gap-1 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                            <span>ખરેખર ડિલીટ કરવું છે?</span>
                            <button
                              type="button"
                              onClick={() => handleDelete(post._id)}
                              disabled={deletingId === post._id}
                              className="underline font-bold hover:text-zinc-200 cursor-pointer"
                            >
                              {deletingId === post._id ? '...' : 'હા (Yes)'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-zinc-300 hover:text-white cursor-pointer ml-1"
                            >
                              ના (No)
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(post._id)}
                            title="Delete Post"
                            className="p-1.5 text-zinc-400 hover:text-red-600 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

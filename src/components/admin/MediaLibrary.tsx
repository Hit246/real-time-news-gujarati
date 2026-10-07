'use client';

import { useState, useEffect, useRef } from 'react';
import { MediaItem } from '@/app/api/admin/media/route';
import { Upload, Copy, Check, Trash2, Loader2, Image as ImageIcon, Search } from 'lucide-react';

export function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const json = await res.json();
        setMedia(json.media || []);
      }
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/admin/media', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          const json = await res.json();
          if (json.media) {
            setMedia((prev) => [json.media, ...prev]);
          }
        }
      } catch (err) {
        console.error('Upload error:', err);
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (filename: string) => {
    setDeletingId(filename);
    try {
      const res = await fetch(`/api/admin/media?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.id !== filename));
        setConfirmDeleteId(null);
      }
    } catch (err) {
      alert('Failed to delete image');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMedia = media.filter((m) =>
    m.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50">
            મીડિયા લાઇબ્રેરી (Media Library)
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-1 uppercase">
            Upload, optimize, and manage article images and graphics
          </p>
        </div>

        {/* Upload Button */}
        <label className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-bold px-5 py-2.5 rounded-sm transition-colors cursor-pointer shrink-0">
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              અપલોડિંગ...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              ઇમેજ અપલોડ કરો (Upload Images)
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={(e) => handleUpload(e.target.files)}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Drag & Drop Upload Banner */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleUpload(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-sm p-8 text-center bg-zinc-50 dark:bg-zinc-900/50 space-y-3"
      >
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 text-red-600 mx-auto flex items-center justify-center">
          <ImageIcon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 font-sans">
            ઇમેજ ફાઇલ્સ અહીં ડ્રેગ-એન્ડ-ડ્રોપ કરો અથવા બટન પર ક્લિક કરો
          </p>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            JPG, PNG, WEBP • Max 5 MB પ્રતિ ફાઇલ • Sharp દ્વારા આપોઆપ ઓપ્ટિમાઇઝ થશે
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ફાઇલના નામ દ્વારા શોધો..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600 font-sans"
          />
        </div>
        <div className="text-xs font-mono text-zinc-400">
          કુલ {filteredMedia.length} ઇમેજ
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-zinc-400 font-mono">
          મીડિયા લાઇબ્રેરી લોડ થઈ રહી છે...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-sm text-xs font-mono text-zinc-400">
          કોઈ ઇમેજ મળી નથી. ઉપર આપેલા બટન પરથી તમારી પ્રથમ ઇમેજ અપલોડ કરો!
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-950 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-2.5 space-y-2">
                <div className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300 truncate font-semibold">
                  {item.filename}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>{(item.size / 1024).toFixed(0)} KB</span>
                  {item.width && <span>{item.width}x{item.height}</span>}
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-1">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-red-600 hover:text-white text-zinc-700 dark:text-zinc-300 py-1 px-2 rounded-xs text-[10px] font-mono font-bold transition-colors cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy URL
                      </>
                    )}
                  </button>

                  {confirmDeleteId === item.id ? (
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="bg-red-600 text-white px-2 py-1 rounded-xs text-[10px] font-mono font-bold cursor-pointer"
                    >
                      {deletingId === item.id ? '...' : 'Yes'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(item.id)}
                      className="text-zinc-400 hover:text-red-500 p-1 cursor-pointer"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

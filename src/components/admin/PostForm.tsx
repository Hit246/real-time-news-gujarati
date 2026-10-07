'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Post, Category, Author } from '@/types/sanity';
import { PostFormData } from '@/lib/validations/post';
import { slugify } from '@/lib/utils/slugify';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { PrePublishModal } from './PrePublishModal';
import { RevisionsModal } from './RevisionsModal';
import {
  Save,
  Send,
  Clock,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  X,
  Upload,
  Loader2,
  Image as ImageIcon,
  History,
} from 'lucide-react';
import Link from 'next/link';

interface PostFormProps {
  initialPost?: Post | null;
  categories: Category[];
  authors: Author[];
}

function formatDisplayError(rawError: string): string {
  if (!rawError) return '';
  try {
    if (rawError.trim().startsWith('[') || rawError.trim().startsWith('{')) {
      const parsed = JSON.parse(rawError);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => item.message || JSON.stringify(item)).join(' • ');
      }
      if (parsed.message) return parsed.message;
    }
  } catch {}
  return rawError;
}

export function PostForm({ initialPost, categories, authors }: PostFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialPost?._id);
  const featuredFileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug?.current || '');
  const [isSlugCustomized, setIsSlugCustomized] = useState(Boolean(initialPost?.slug?.current));
  const [summary, setSummary] = useState(initialPost?.summary || '');
  const [body, setBody] = useState(initialPost?.body || '{"type":"doc","content":[{"type":"paragraph"}]}');
  const [imageUrl, setImageUrl] = useState(initialPost?.mainImage?.url || '');
  const [imageAlt, setImageAlt] = useState(initialPost?.mainImage?.alt || '');
  const [imageCaption, setImageCaption] = useState(initialPost?.mainImage?.caption || '');
  const [categoryId, setCategoryId] = useState(initialPost?.category?._id || categories[0]?._id || '');
  const [authorId, setAuthorId] = useState(initialPost?.author?._id || authors[0]?._id || '');
  const [tags, setTags] = useState<string[]>(initialPost?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<'draft' | 'scheduled' | 'published'>(initialPost?.status || 'draft');
  const [scheduledAt, setScheduledAt] = useState(initialPost?.scheduledAt || '');
  const [isBreaking, setIsBreaking] = useState(Boolean(initialPost?.isBreaking));
  const [isOpinion, setIsOpinion] = useState(Boolean(initialPost?.isOpinion));
  const [seoTitle, setSeoTitle] = useState(initialPost?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialPost?.seoDescription || '');

  // UI status
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPrePublish, setShowPrePublish] = useState(false);
  const [showRevisions, setShowRevisions] = useState(false);

  // Auto-Save States
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastAutoSavedTime, setLastAutoSavedTime] = useState<string | null>(null);

  // Two-tab Collision Warning States
  const [hasCollision, setHasCollision] = useState(false);
  const [dismissCollision, setDismissCollision] = useState(false);

  // Auto-slug generator
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setIsDirty(true);
    if (!isSlugCustomized) {
      setSlug(slugify(newTitle) || `story-${Date.now()}`);
    }
  };

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // 30-Second Debounced Auto-Save without spamming revision history
  useEffect(() => {
    if (!isEditing || !isDirty || isSubmitting || !initialPost?._id || !title.trim()) {
      return;
    }

    const timer = setTimeout(async () => {
      setAutoSaveStatus('saving');
      const data = constructFormData(status);

      try {
        const res = await fetch(`/api/admin/posts/${initialPost._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            isAutoSave: true,
          }),
        });

        if (res.ok) {
          setIsDirty(false);
          setAutoSaveStatus('saved');
          const timeStr = new Date().toLocaleTimeString('gu-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          });
          setLastAutoSavedTime(timeStr);
        } else {
          setAutoSaveStatus('error');
        }
      } catch {
        setAutoSaveStatus('error');
      }
    }, 30000); // 30 seconds debounce

    return () => clearTimeout(timer);
  }, [
    isEditing,
    isDirty,
    isSubmitting,
    title,
    slug,
    summary,
    body,
    imageUrl,
    imageAlt,
    imageCaption,
    categoryId,
    authorId,
    tags,
    status,
    scheduledAt,
    isBreaking,
    isOpinion,
    seoTitle,
    seoDescription,
    initialPost?._id,
  ]);

  // Two-Tab Presence Detection with BroadcastChannel
  useEffect(() => {
    if (!isEditing || !initialPost?._id || typeof window === 'undefined') return;

    const currentTabId = `tab_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const channelName = `post_lock_${initialPost._id}`;

    let channel: BroadcastChannel | null = null;
    let heartbeatTimer: NodeJS.Timeout | null = null;

    try {
      if ('BroadcastChannel' in window) {
        channel = new BroadcastChannel(channelName);

        channel.onmessage = (event) => {
          const msg = event.data;
          if (msg && msg.tabId !== currentTabId) {
            if (msg.type === 'PING' || msg.type === 'HEARTBEAT') {
              setHasCollision(true);
              channel?.postMessage({ type: 'PONG', tabId: currentTabId });
            } else if (msg.type === 'PONG') {
              setHasCollision(true);
            } else if (msg.type === 'CLOSE') {
              setHasCollision(false);
            }
          }
        };

        // Broadcast opening ping
        channel.postMessage({ type: 'PING', tabId: currentTabId });

        // Heartbeat interval
        heartbeatTimer = setInterval(() => {
          channel?.postMessage({ type: 'HEARTBEAT', tabId: currentTabId });
        }, 8000);
      }
    } catch {
      // Ignored
    }

    const handleUnload = () => {
      try {
        channel?.postMessage({ type: 'CLOSE', tabId: currentTabId });
        channel?.close();
      } catch {}
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      handleUnload();
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [isEditing, initialPost?._id]);

  // Featured Image File Upload
  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFeatured(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Upload failed');
      }

      if (json.media?.url) {
        setImageUrl(json.media.url);
        if (!imageAlt) setImageAlt(title || file.name.replace(/\.[^/.]+$/, ''));
        setIsDirty(true);
      }
    } catch (err: any) {
      alert(err.message || 'ઇમેજ અપલોડ કરવામાં સમસ્યા આવી.');
    } finally {
      setUploadingFeatured(false);
      if (featuredFileInputRef.current) featuredFileInputRef.current.value = '';
    }
  };

  // Tag management
  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
      setIsDirty(true);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
    setIsDirty(true);
  };

  const constructFormData = (targetStatus?: 'draft' | 'scheduled' | 'published'): PostFormData => {
    return {
      title,
      slug: slug || slugify(title) || `story-${Date.now()}`,
      summary,
      body,
      mainImage: {
        url: imageUrl,
        alt: imageAlt,
        caption: imageCaption,
      },
      categoryId,
      authorId,
      tags,
      status: targetStatus || status,
      scheduledAt: targetStatus === 'scheduled' ? scheduledAt : null,
      publishedAt: (targetStatus || status) === 'published' ? (initialPost?.publishedAt || new Date().toISOString()) : null,
      isBreaking,
      isOpinion,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || summary,
    };
  };

  const handleSave = async (targetStatus: 'draft' | 'scheduled' | 'published') => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const data = constructFormData(targetStatus);

    try {
      const url = isEditing ? `/api/admin/posts/${initialPost?._id}` : '/api/admin/posts';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to save post');
      }

      setIsDirty(false);
      setStatus(targetStatus);
      setSuccessMessage(
        targetStatus === 'published'
          ? 'અહેવાલ સફળતાપૂર્વક પ્રકાશિત (Published) થયો છે!'
          : 'અહેવાલ ડ્રાફ્ટ તરીકે સેવ (Saved Draft) થયો છે.'
      );

      if (!isEditing && json.post?._id) {
        setTimeout(() => {
          router.push(`/admin/posts/edit/${json.post._id}`);
        }, 1000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
      setShowPrePublish(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Pre-Publish Checklist Modal */}
      <PrePublishModal
        isOpen={showPrePublish}
        onClose={() => setShowPrePublish(false)}
        onConfirmPublish={() => handleSave('published')}
        formData={constructFormData('published')}
        isSubmitting={isSubmitting}
      />

      {/* Revisions History & Restore Modal */}
      {isEditing && initialPost?._id && (
        <RevisionsModal
          isOpen={showRevisions}
          onClose={() => setShowRevisions(false)}
          postId={initialPost._id}
          onRestore={(restored) => {
            setTitle(restored.title);
            setBody(restored.body);
            if (restored.summary) setSummary(restored.summary);
            setIsDirty(true);
          }}
        />
      )}

      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4 sticky top-14 bg-zinc-100 dark:bg-zinc-950 z-20 py-2">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-sm text-zinc-600 dark:text-zinc-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-black uppercase tracking-tight">
              {isEditing ? 'અહેવાલ સંપાદિત કરો (Edit Post)' : 'નવો અહેવાલ તૈયાર કરો (New Post)'}
            </h1>
            <div className="flex items-center gap-2 text-[11px] font-mono mt-0.5">
              <span
                className={`px-1.5 py-0.2 rounded-xs font-bold uppercase ${
                  status === 'published'
                    ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                    : status === 'scheduled'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                Status: {status}
              </span>
              {isDirty && <span className="text-amber-500 font-semibold">• અસંગ્રહિત ફેરફારો (Unsaved changes)</span>}

              {/* Auto-Save Indicator */}
              {isEditing && (
                <div className="flex items-center gap-1.5 text-[11px] font-mono">
                  {autoSaveStatus === 'saving' ? (
                    <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      સ્વચાલિત સેવ થઈ રહ્યું છે...
                    </span>
                  ) : autoSaveStatus === 'saved' && lastAutoSavedTime ? (
                    <span className="inline-flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      ઓટો-સેવ થયેલ ({lastAutoSavedTime})
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Revision History button (Edit Mode Only) */}
          {isEditing && (
            <button
              type="button"
              onClick={() => setShowRevisions(true)}
              className="px-3 py-2 text-xs font-mono uppercase font-bold border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-zinc-500 rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
              title="અગાઉના રિવિઝન સ્નેપશોટ જુઓ અને રિસ્ટોર કરો"
            >
              <History className="w-3.5 h-3.5 text-red-600" />
              <span>રિવિઝન હિસ્ટ્રી</span>
            </button>
          )}

          {/* Save Draft */}
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={isSubmitting}
            className="px-3.5 py-2 text-xs font-mono uppercase font-bold border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-zinc-500 rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            ડ્રાફ્ટ સેવ (Save Draft)
          </button>

          {/* Schedule Option */}
          {status === 'scheduled' || scheduledAt ? (
            <button
              type="button"
              onClick={() => handleSave('scheduled')}
              disabled={isSubmitting}
              className="px-3.5 py-2 text-xs font-mono uppercase font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              સમયપત્રક મુજબ સેવ (Schedule)
            </button>
          ) : null}

          {/* Publish Trigger (Opens checklist popup) */}
          <button
            type="button"
            onClick={() => setShowPrePublish(true)}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-mono uppercase font-bold bg-red-600 hover:bg-red-700 text-white rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            પ્રકાશિત કરો (Publish)
          </button>
        </div>
      </div>

      {/* Two-Tab Collision Warning Banner */}
      {hasCollision && !dismissCollision && (
        <div className="p-4 bg-amber-500/15 border-2 border-amber-500 text-amber-900 dark:text-amber-200 rounded-sm flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-amber-900 dark:text-amber-200">
                મલ્ટી-ટેબ ચેતવણી (Multi-Tab Editing Collision Warning)
              </h4>
              <p className="text-xs font-sans mt-0.5 leading-relaxed text-amber-800 dark:text-amber-300">
                આ અહેવાલ તમારા બ્રાઉઝરના બીજા ટેબ અથવા વિન્ડોમાં પણ ખુલ્લો છે. ડેટા ઓવરરાઇટ થવાનું જોખમ ટાળવા માટે કૃપા કરીને માત્ર એક જ ટેબમાં ફેરફાર કરો.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDismissCollision(true)}
            className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300 hover:text-amber-900 p-1 cursor-pointer shrink-0"
            title="Dismiss warning"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Notifications */}
      {errorMessage && (
        <div className="p-4 bg-red-600/10 border border-red-600/30 text-red-600 dark:text-red-400 text-sm rounded-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{formatDisplayError(errorMessage)}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-600/10 border border-green-600/30 text-green-700 dark:text-green-400 text-sm rounded-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Title, Body, Summary, SEO */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-sm border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
            <label className="block text-xs uppercase font-mono font-bold text-zinc-700 dark:text-zinc-300">
              મુખ્ય હેડલાઇન / શીર્ષક (Headline) *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="અહીં અહેવાલનું મુખ્ય શીર્ષક દાખલ કરો..."
              className="w-full px-3.5 py-2.5 font-serif text-lg font-bold bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600"
            />

            {/* Slug */}
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-zinc-500">
              <span className="shrink-0">URL Slug: /post/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  setIsSlugCustomized(true);
                  setIsDirty(true);
                }}
                className="flex-1 px-2 py-1 bg-transparent border-b border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          {/* Standfirst / Summary (Max 200 chars) */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-sm border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs uppercase font-mono font-bold text-zinc-700 dark:text-zinc-300">
                સંક્ષિપ્ત સારાંશ (Standfirst / Summary max 200 chars) *
              </label>
              <span
                className={`text-xs font-mono ${
                  summary.length > 200 ? 'text-red-600 font-bold' : 'text-zinc-400'
                }`}
              >
                {summary.length}/૨૦૦
              </span>
            </div>
            <textarea
              required
              rows={3}
              value={summary}
              maxLength={200}
              onChange={(e) => {
                setSummary(e.target.value);
                setIsDirty(true);
              }}
              placeholder="વાચકો માટે મુખ્ય અહેવાલનો ૧-૨ વાક્યનો સારાંશ..."
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600 leading-relaxed"
            />
          </div>

          {/* Tiptap Rich Body Editor */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-sm border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
            <label className="block text-xs uppercase font-mono font-bold text-zinc-700 dark:text-zinc-300">
              અહેવાલ વિગત (Article Body Content) *
            </label>
            <TiptapEditor
              value={body}
              onChange={(newJson) => {
                setBody(newJson);
                setIsDirty(true);
              }}
            />
          </div>

          {/* SEO Metadata Fields */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-sm border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2">
              સર્ચ એન્જિન ઓપ્ટિમાઇઝેશન (SEO Settings)
            </h3>

            <div>
              <label className="block text-xs uppercase font-mono font-bold mb-1 text-zinc-600 dark:text-zinc-400">
                SEO શીર્ષક (SEO Title - Max 70 chars)
              </label>
              <input
                type="text"
                value={seoTitle}
                maxLength={70}
                onChange={(e) => {
                  setSeoTitle(e.target.value);
                  setIsDirty(true);
                }}
                placeholder={title || 'Google સર્ચ માટે શીર્ષક'}
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-mono font-bold mb-1 text-zinc-600 dark:text-zinc-400">
                SEO વિવરણ (SEO Meta Description - Max 160 chars)
              </label>
              <textarea
                rows={2}
                value={seoDescription}
                maxLength={160}
                onChange={(e) => {
                  setSeoDescription(e.target.value);
                  setIsDirty(true);
                }}
                placeholder={summary || 'Google સ્નિપેટ માટે વિવરણ'}
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600"
              />
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Featured Image with Device Upload, Category, Author, Tags */}
        <div className="lg:col-span-4 space-y-6">
          {/* Main Featured Image with Local Device Upload & URL */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-sm border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-red-600" />
                મુખ્ય ઇમેજ (Featured Image) *
              </h3>
            </div>

            {/* Direct Device Upload Box */}
            <div className="p-4 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-sm bg-zinc-50 dark:bg-zinc-950/60 text-center space-y-2">
              <div className="flex justify-center text-red-600">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-sans">
                કમ્પ્યુટર / મોબાઇલમાંથી ઇમેજ અપલોડ કરો
              </div>
              <div className="text-[10px] text-zinc-400">
                JPG, PNG, WEBP (Max 5 MB)
              </div>

              <label className="inline-flex items-center gap-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold px-3 py-1.5 rounded-sm cursor-pointer transition-colors mt-1">
                {uploadingFeatured ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    અપલોડ થઈ રહ્યું છે...
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    ઇમેજ ફાઇલ પસંદ કરો (Choose Image)
                  </>
                )}
                <input
                  ref={featuredFileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFeaturedImageUpload}
                  disabled={uploadingFeatured}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image Preview */}
            {imageUrl && (
              <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 group">
                <img src={imageUrl} alt="Featured Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('');
                    setIsDirty(true);
                  }}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white p-1 rounded-sm text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove Image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono mb-1 text-zinc-500">
                ઇમેજ URL અથવા પાથ:
              </label>
              <input
                type="text"
                required
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="/uploads/... અથવા https://..."
                className="w-full px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono mb-1 text-zinc-500">
                Alt ટેક્સ્ટ (Accessibility & SEO) *
              </label>
              <input
                type="text"
                required
                value={imageAlt}
                onChange={(e) => {
                  setImageAlt(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="ઇમેજ શું દર્શાવે છે તેનું સંક્ષિપ્ત વર્ણન"
                className="w-full px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono mb-1 text-zinc-500">
                કેપ્શન (Photo Caption)
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => {
                  setImageCaption(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="ફોટો સ્ત્રોત અથવા કેપ્શન"
                className="w-full px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          {/* Section & Author */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-sm border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2">
              વર્ગીકરણ (Section & Byline)
            </h3>

            <div>
              <label className="block text-xs font-mono mb-1 text-zinc-500">
                સમાચાર વિભાગ (Category) *
              </label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono mb-1 text-zinc-500">
                પત્રકાર / લેખક (Author) *
              </label>
              <select
                value={authorId}
                onChange={(e) => {
                  setAuthorId(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600"
              >
                {authors.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-sm border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2">
              સમાચાર ટેગ્સ (Tags)
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="ટેગ લખીને Add પર ક્લિક કરો"
                className="flex-1 px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold rounded-sm cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs px-2 py-0.5 rounded-sm font-mono"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-red-500 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Badges & Flags */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-sm border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2">
              વિશેષ ફ્લેગ્સ (Special Flags)
            </h3>

            <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={isBreaking}
                onChange={(e) => {
                  setIsBreaking(e.target.checked);
                  setIsDirty(true);
                }}
                className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
              />
              <span>બ્રેકિંગ ન્યૂઝ ટિકર પર દર્શાવો (Breaking News Alert)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={isOpinion}
                onChange={(e) => {
                  setIsOpinion(e.target.checked);
                  setIsDirty(true);
                }}
                className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
              />
              <span>મંતવ્ય / સંપાદકીય લેખ (Opinion Piece)</span>
            </label>

            {/* Scheduled Publish Date */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <label className="block text-xs font-mono mb-1 text-zinc-500">
                સમયપત્રક મુજબ પ્રકાશન (Schedule At)
              </label>
              <input
                type="datetime-local"
                value={scheduledAt ? scheduledAt.slice(0, 16) : ''}
                onChange={(e) => {
                  setScheduledAt(e.target.value ? new Date(e.target.value).toISOString() : '');
                  if (e.target.value) setStatus('scheduled');
                  setIsDirty(true);
                }}
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600 font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

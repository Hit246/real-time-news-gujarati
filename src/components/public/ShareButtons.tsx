'use client';

import { useState } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return url || window.location.href;
    }
    return url || '';
  };

  const shareOnTwitter = () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(getShareUrl())}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const shareOnFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const shareOnLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex items-center gap-2 py-4 border-y border-zinc-200 dark:border-zinc-800 my-6">
      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mr-2 flex items-center gap-1">
        <Share2 className="w-3.5 h-3.5 text-red-600" />
        શેર કરો:
      </span>

      {/* Twitter / X */}
      <button
        onClick={shareOnTwitter}
        aria-label="X / Twitter પર શેર કરો"
        className="p-2 rounded-sm border border-zinc-200 dark:border-zinc-800 hover:border-red-600 hover:text-red-600 dark:hover:border-red-500 transition-colors text-zinc-700 dark:text-zinc-300 cursor-pointer"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      {/* Facebook */}
      <button
        onClick={shareOnFacebook}
        aria-label="Facebook પર શેર કરો"
        className="p-2 rounded-sm border border-zinc-200 dark:border-zinc-800 hover:border-red-600 hover:text-red-600 dark:hover:border-red-500 transition-colors text-zinc-700 dark:text-zinc-300 cursor-pointer"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-1.874 0-2.327.906-2.327 2.476v1.504h4.819l-.678 3.667h-4.141v7.98H9.101z" />
        </svg>
      </button>

      {/* LinkedIn */}
      <button
        onClick={shareOnLinkedIn}
        aria-label="LinkedIn પર શેર કરો"
        className="p-2 rounded-sm border border-zinc-200 dark:border-zinc-800 hover:border-red-600 hover:text-red-600 dark:hover:border-red-500 transition-colors text-zinc-700 dark:text-zinc-300 cursor-pointer"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      </button>

      {/* Copy Link */}
      <button
        onClick={copyToClipboard}
        aria-label="લિંક કોપી કરો"
        className="p-2 rounded-sm border border-zinc-200 dark:border-zinc-800 hover:border-red-600 hover:text-red-600 dark:hover:border-red-500 transition-colors text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 text-xs font-medium cursor-pointer"
      >
        {copied ? <Check className="w-4 h-4 text-green-600" /> : <LinkIcon className="w-4 h-4" />}
        {copied ? 'કોપી થયું!' : 'લિંક કોપી'}
      </button>
    </div>
  );
}

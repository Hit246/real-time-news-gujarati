'use client';

import { useState, useEffect } from 'react';
import { Revision } from '@/types/sanity';
import { formatDateTime } from '@/lib/utils/format-date';
import {
  History,
  X,
  RotateCcw,
  Clock,
  User,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface RevisionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  onRestore: (data: { title: string; body: string; summary?: string }) => void;
}

export function RevisionsModal({
  isOpen,
  onClose,
  postId,
  onRestore,
}: RevisionsModalProps) {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRev, setSelectedRev] = useState<Revision | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [confirmingRestore, setConfirmingRestore] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isOpen || !postId) return;

    setLoading(true);
    setError('');
    setSuccess('');
    setSelectedRev(null);
    setConfirmingRestore(false);

    fetch(`/api/admin/posts/${postId}/revisions`)
      .then((res) => res.json())
      .then((data) => {
        const revs: Revision[] = data.revisions || [];
        setRevisions(revs);
        if (revs.length > 0) {
          setSelectedRev(revs[0]);
        }
      })
      .catch((err) => {
        setError('રિવિઝન લોડ કરવામાં નિષ્ફળ.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen, postId]);

  if (!isOpen) return null;

  const handleRestoreConfirm = async () => {
    if (!selectedRev) return;

    setRestoring(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/admin/posts/${postId}/revisions/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revisionId: selectedRev._id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Restore failed');
      }

      setSuccess('રિવિઝન સફળતાપૂર્વક પુનઃસ્થાપિત (Restored) થઈ ગયું છે!');
      onRestore({
        title: selectedRev.titleSnapshot,
        body: selectedRev.bodySnapshot,
        summary: selectedRev.summarySnapshot,
      });

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'રિવિઝન રિસ્ટોર કરવામાં ભૂલ આવી.');
    } finally {
      setRestoring(false);
      setConfirmingRestore(false);
    }
  };

  // Helper to extract text from Tiptap JSON for preview
  const getBodyPreviewText = (bodyStr: string) => {
    try {
      const json = JSON.parse(bodyStr);
      if (json.content && Array.isArray(json.content)) {
        return json.content
          .map((node: any) => {
            if (node.content && Array.isArray(node.content)) {
              return node.content.map((c: any) => c.text || '').join('');
            }
            return '';
          })
          .filter(Boolean)
          .join('\n\n');
      }
      return bodyStr;
    } catch {
      return bodyStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm shadow-2xl max-w-5xl w-full max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-100 dark:bg-red-950 text-red-600 rounded-sm">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100 uppercase">
                રિવિઝન હિસ્ટ્રી અને રિસ્ટોર (Revision Snapshots)
              </h2>
              <p className="text-[11px] font-mono text-zinc-500 uppercase">
                Browse historical versions and restore previous content in 1-click
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-sm cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-600/10 border border-red-600/30 text-red-600 dark:text-red-400 text-xs rounded-sm flex items-center gap-2 font-sans">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mx-6 mt-4 p-3 bg-green-600/10 border border-green-600/30 text-green-700 dark:text-green-400 text-xs rounded-sm flex items-center gap-2 font-sans">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Content Body */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-24 text-zinc-400 font-mono text-xs gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            રિવિઝન સ્નેપશોટ લોડ થઈ રહ્યા છે...
          </div>
        ) : revisions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
            <History className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-2" />
            <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              આ અહેવાલ માટે કોઈ અગાઉના રિવિઝન મળ્યા નથી.
            </p>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              જ્યારે તમે અહેવાલમાં ફેરફાર કરીને સેવ કરશો, ત્યારે ઓટોમેટિક સ્નેપશોટ બનશે.
            </p>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
            {/* Left Column: Revision Timestamps list (4 cols) */}
            <div className="md:col-span-4 border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto max-h-[58vh] divide-y divide-zinc-100 dark:divide-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-950/40">
              {revisions.map((rev, index) => {
                const isSelected = selectedRev?._id === rev._id;
                const isLatest = index === 0;

                return (
                  <button
                    key={rev._id}
                    onClick={() => {
                      setSelectedRev(rev);
                      setConfirmingRestore(false);
                    }}
                    className={`w-full text-left p-3.5 transition-colors cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-white dark:bg-zinc-900 border-l-4 border-l-red-600 shadow-xs'
                        : 'hover:bg-zinc-100/70 dark:hover:bg-zinc-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        <Clock className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>{formatDateTime(rev.savedAt)}</span>
                      </div>
                      {isLatest && (
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 rounded-xs font-bold">
                          નવીનતમ
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-serif font-bold text-zinc-700 dark:text-zinc-300 line-clamp-1">
                      {rev.titleSnapshot}
                    </div>

                    {rev.authorEmail && (
                      <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400">
                        <User className="w-3 h-3" />
                        <span className="truncate">{rev.authorEmail}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Column: Selected Revision Preview & Restore Button (8 cols) */}
            <div className="md:col-span-8 flex flex-col overflow-hidden max-h-[58vh] bg-white dark:bg-zinc-900">
              {selectedRev ? (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Header info bar */}
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                          Snapshot Saved On
                        </span>
                        <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200">
                          {formatDateTime(selectedRev.savedAt)}
                        </span>
                      </div>

                      {selectedRev.authorEmail && (
                        <div className="text-right">
                          <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                            Saved By
                          </span>
                          <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                            {selectedRev.authorEmail}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Title Snapshot */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                        શીર્ષક (Title Snapshot)
                      </span>
                      <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        {selectedRev.titleSnapshot}
                      </h3>
                    </div>

                    {/* Summary Snapshot */}
                    {selectedRev.summarySnapshot && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                          સારાંશ (Summary)
                        </span>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 italic bg-zinc-50 dark:bg-zinc-950 p-3 rounded-sm border border-zinc-200 dark:border-zinc-800">
                          {selectedRev.summarySnapshot}
                        </p>
                      </div>
                    )}

                    {/* Body Content Snippet Preview */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        અહેવાલ લખાણ (Body Text Snapshot)
                      </span>
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-sm border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 font-sans whitespace-pre-line max-h-60 overflow-y-auto leading-relaxed">
                        {getBodyPreviewText(selectedRev.bodySnapshot) || '(લખાણ ખાલી છે)'}
                      </div>
                    </div>
                  </div>

                  {/* Restore Action Footer */}
                  <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between gap-4">
                    {confirmingRestore ? (
                      <div className="flex items-center justify-between w-full gap-3">
                        <div className="text-xs font-sans text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>શું તમે ખરેખર આ રિવિઝન પુનઃસ્થાપિત કરવા માંગો છો? હાલના અસંગ્રહિત ફેરફારો બદલાઈ જશે.</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setConfirmingRestore(false)}
                            className="px-3 py-1.5 text-xs font-mono uppercase font-bold border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded-sm cursor-pointer"
                          >
                            રદ કરો (Cancel)
                          </button>
                          <button
                            type="button"
                            onClick={handleRestoreConfirm}
                            disabled={restoring}
                            className="px-4 py-1.5 text-xs font-mono uppercase font-bold bg-red-600 hover:bg-red-700 text-white rounded-sm cursor-pointer flex items-center gap-1.5"
                          >
                            {restoring ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <RotateCcw className="w-3.5 h-3.5" />
                            )}
                            હા, રિસ્ટોર કરો (Confirm)
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-[11px] font-mono text-zinc-500">
                          આ રિવિઝન રિસ્ટોર કરવાથી એડિટરમાં અગાઉનું લખાણ આવી જશે.
                        </div>
                        <button
                          type="button"
                          onClick={() => setConfirmingRestore(true)}
                          className="px-4 py-2 text-xs font-mono uppercase font-bold bg-zinc-900 hover:bg-red-600 text-white dark:bg-zinc-100 dark:hover:bg-red-600 dark:text-zinc-950 dark:hover:text-white rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          આ રિવિઝન રિસ્ટોર કરો (Restore Version)
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

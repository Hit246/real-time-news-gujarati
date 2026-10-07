'use client';

import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { PostFormData } from '@/lib/validations/post';

interface PrePublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPublish: () => void;
  formData: PostFormData;
  isSubmitting: boolean;
}

export function PrePublishModal({
  isOpen,
  onClose,
  onConfirmPublish,
  formData,
  isSubmitting,
}: PrePublishModalProps) {
  if (!isOpen) return null;

  const checks = [
    {
      label: 'મુખ્ય હેડલાઇન (Headline)',
      valid: Boolean(formData.title && formData.title.trim().length >= 3),
      detail: formData.title ? `"${formData.title.slice(0, 40)}..."` : 'હેડલાઇન દાખલ કરેલ નથી',
    },
    {
      label: 'મુખ્ય ઇમેજ (Featured Image)',
      valid: Boolean(formData.mainImage?.url && formData.mainImage.url.startsWith('http')),
      detail: formData.mainImage?.url ? 'ઇમેજ લિંક જોડાયેલ છે' : 'મુખ્ય ઇમેજ URL ખૂટે છે',
    },
    {
      label: 'ઇમેજ Alt ટેક્સ્ટ (Accessibility & SEO)',
      valid: Boolean(formData.mainImage?.alt && formData.mainImage.alt.trim().length > 0),
      detail: formData.mainImage?.alt || 'Alt ટેક્સ્ટ ખાલી છે (જરૂરી)',
    },
    {
      label: 'સંક્ષિપ્ત સારાંશ (Summary max 200 chars)',
      valid: Boolean(
        formData.summary &&
          formData.summary.trim().length >= 10 &&
          formData.summary.trim().length <= 200
      ),
      detail: `${formData.summary?.length || 0}/૨૦૦ અક્ષરો`,
    },
    {
      label: 'સમાચાર વિભાગ (Category)',
      valid: Boolean(formData.categoryId && formData.categoryId.trim().length > 0),
      detail: formData.categoryId ? 'વિભાગ પસંદ કરેલ છે' : 'વિભાગ પસંદ કરો',
    },
    {
      label: 'SEO શીર્ષક અને વિવરણ (SEO Meta)',
      valid: Boolean(formData.seoTitle || formData.seoDescription),
      detail: formData.seoTitle ? 'કસ્ટમ SEO શીર્ષક દાખલ કરેલ છે' : 'ડિફૉલ્ટ હેડલાઇન ઉપયોગ થશે',
    },
  ];

  const allPassed = checks.slice(0, 5).every((c) => c.valid);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm max-w-lg w-full p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-serif text-lg font-bold">
              પ્રકાશન પૂર્વ ચકાસણી (Pre-Publish Checklist)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-zinc-500 font-sans leading-relaxed">
          અહેવાલ લાઈવ કરતા પહેલા ગુણવત્તા, સર્ચ એન્જિન (SEO) અને વાચકોની સરળતા માટે નીચેની વિગતો ચકાસો:
        </p>

        <div className="space-y-3">
          {checks.map((check, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between p-3 rounded-sm border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 text-xs"
            >
              <div>
                <div className="font-bold text-zinc-900 dark:text-zinc-100">
                  {check.label}
                </div>
                <div className="text-zinc-500 mt-0.5">{check.detail}</div>
              </div>
              <div>
                {check.valid ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-sm cursor-pointer"
          >
            સંપાદન ચાલુ રાખો
          </button>

          <button
            type="button"
            onClick={onConfirmPublish}
            disabled={!allPassed || isSubmitting}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 disabled:bg-zinc-400 text-white rounded-sm transition-colors cursor-pointer"
          >
            {isSubmitting ? 'પ્રકાશિત થઈ રહ્યું છે...' : 'અત્યારે જ પ્રકાશિત કરો (Confirm Publish)'}
          </button>
        </div>
      </div>
    </div>
  );
}

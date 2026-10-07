import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import { sanitizeArticleHtml } from './sanitizer';

const extensions = [
  StarterKit.configure({
    heading: {
      levels: [2, 3, 4],
    },
    codeBlock: {
      HTMLAttributes: {
        class: 'bg-zinc-100 dark:bg-zinc-800 p-4 rounded font-mono text-sm overflow-x-auto my-4',
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: 'border-l-4 border-red-600 pl-4 italic my-6 text-lg text-zinc-800 dark:text-zinc-200',
      },
    },
  }),
  Image.configure({
    allowBase64: false,
    HTMLAttributes: {
      class: 'w-full rounded-md my-6 shadow-sm',
      loading: 'lazy',
    },
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-red-600 dark:text-red-400 hover:underline font-medium',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  }),
  Youtube.configure({
    inline: false,
    HTMLAttributes: {
      class: 'w-full aspect-video rounded-md my-6 shadow-sm',
    },
  }),
];

/**
 * Server-side function to convert stored Tiptap JSON string into clean, sanitized HTML for SEO and rendering.
 */
export function renderTiptapToHtml(bodyJsonString: string | object): string {
  if (!bodyJsonString) return '';

  try {
    let jsonDoc: any;
    if (typeof bodyJsonString === 'string') {
      jsonDoc = JSON.parse(bodyJsonString);
    } else {
      jsonDoc = bodyJsonString;
    }

    if (!jsonDoc || !jsonDoc.type) {
      return '';
    }

    const rawHtml = generateHTML(jsonDoc, extensions);
    return sanitizeArticleHtml(rawHtml);
  } catch (err) {
    console.error('Error parsing Tiptap JSON document:', err);
    // If it is plain HTML or text fallback
    if (typeof bodyJsonString === 'string') {
      return sanitizeArticleHtml(`<p>${bodyJsonString}</p>`);
    }
    return '';
  }
}

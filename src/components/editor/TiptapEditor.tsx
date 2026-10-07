'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Undo,
  Redo,
  Upload,
  Loader2,
  X,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface TiptapEditorProps {
  value: string;
  onChange: (jsonString: string) => void;
}

export function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  let initialContent: any = '';
  try {
    if (value) {
      initialContent = typeof value === 'string' ? JSON.parse(value) : value;
    }
  } catch {
    initialContent = value || '';
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-md max-w-full my-4 shadow-xs',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-red-600 underline font-medium',
        },
      }),
      Youtube.configure({
        inline: false,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-md my-4 shadow-xs',
        },
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          'prose-custom min-h-[350px] p-4 focus:outline-none bg-white dark:bg-zinc-950 rounded-b-sm border-x border-b border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100',
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(JSON.stringify(json));
    },
  });

  useEffect(() => {
    if (editor && value) {
      try {
        const parsed = JSON.parse(value);
        const currentJSON = JSON.stringify(editor.getJSON());
        if (JSON.stringify(parsed) !== currentJSON) {
          editor.commands.setContent(parsed);
        }
      } catch {
        // Ignored
      }
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="h-[350px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-sm flex items-center justify-center text-xs text-zinc-400 font-mono">
        Loading rich text editor...
      </div>
    );
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
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
        editor.chain().focus().setImage({ src: json.media.url, alt: imageAlt || file.name }).run();
        setShowImageModal(false);
        setImageUrl('');
        setImageAlt('');
      }
    } catch (err: any) {
      alert(err.message || 'ઇમેજ અપલોડ કરવામાં સમસ્યા આવી.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleInsertUrlImage = () => {
    if (!imageUrl) return;
    editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt || 'Article image' }).run();
    setShowImageModal(false);
    setImageUrl('');
    setImageAlt('');
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('લિંક URL દાખલ કરો (Enter Link URL):', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addYoutube = () => {
    const url = window.prompt('YouTube વિડિયો લિંક દાખલ કરો (Enter YouTube Video URL):');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-sm overflow-hidden relative">
      {/* Inline Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <h4 className="font-serif font-bold text-sm">ઇમેજ ઉમેરો (Insert Inline Image)</h4>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Option 1: Direct File Upload from Device */}
            <div className="p-4 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-sm bg-zinc-50 dark:bg-zinc-950/60 text-center space-y-2">
              <div className="flex justify-center text-red-600">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-sans">
                તમારા કમ્પ્યુટર પરથી ઇમેજ પસંદ કરો
              </div>
              <div className="text-[11px] text-zinc-400">
                JPG, PNG, WEBP (Max 5 MB)
              </div>
              <label className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-sm cursor-pointer transition-colors mt-2">
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    અપલોડ થઈ રહ્યું છે...
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    ફાઇલ પસંદ કરો (Choose File)
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-zinc-200 dark:border-zinc-800 w-full" />
              <span className="bg-white dark:bg-zinc-900 px-2 text-[10px] font-mono text-zinc-400 uppercase">
                અથવા વેબ લિંક (Or Image Link)
              </span>
              <div className="border-t border-zinc-200 dark:border-zinc-800 w-full" />
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block font-mono text-zinc-500 mb-1">ઇમેજ URL:</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block font-mono text-zinc-500 mb-1">Alt ટેક્સ્ટ (વર્ણન):</label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="ઇમેજ શું દર્શાવે છે..."
                  className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <button
                type="button"
                onClick={handleInsertUrlImage}
                disabled={!imageUrl}
                className="w-full mt-2 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 text-white py-1.5 font-bold rounded-sm disabled:opacity-50 cursor-pointer"
              >
                લિંક ઉમેરો (Insert Link)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Toolbar */}
      <div className="bg-zinc-100 dark:bg-zinc-900 p-2 border-b border-zinc-200 dark:border-zinc-700 flex flex-wrap items-center gap-1">
        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-red-600 text-white'
              : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-red-600 text-white'
              : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={`p-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
            editor.isActive('heading', { level: 4 })
              ? 'bg-red-600 text-white'
              : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
          }`}
          title="Heading 4"
        >
          <Heading4 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-1" />

        {/* Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive('bold')
              ? 'bg-red-600 text-white'
              : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive('italic')
              ? 'bg-red-600 text-white'
              : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive('strike')
              ? 'bg-red-600 text-white'
              : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive('bulletList')
              ? 'bg-red-600 text-white'
              : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive('orderedList')
              ? 'bg-red-600 text-white'
              : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
          }`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive('blockquote')
              ? 'bg-red-600 text-white'
              : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
          }`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-1" />

        {/* Embeds: Link, Image, Video */}
        <button
          type="button"
          onClick={addLink}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive('link')
              ? 'bg-red-600 text-white'
              : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
          }`}
          title="Add / Edit Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          className="p-1.5 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer flex items-center gap-1"
          title="Insert Image (Local Upload or URL)"
        >
          <ImageIcon className="w-4 h-4 text-red-600" />
        </button>

        <button
          type="button"
          onClick={addYoutube}
          className="p-1.5 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Embed YouTube Video"
        >
          <Video className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-1" />

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded text-zinc-500 disabled:opacity-40 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded text-zinc-500 disabled:opacity-40 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}

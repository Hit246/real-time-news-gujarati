import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { getPreviewPostById, getRelatedPosts } from '@/lib/sanity/fetch';
import { renderTiptapToHtml } from '@/lib/tiptap/renderer';
import { formatDate } from '@/lib/utils/format-date';
import { ShareButtons } from '@/components/public/ShareButtons';
import { RelatedStories } from '@/components/public/RelatedStories';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, ArrowLeft, Edit3 } from 'lucide-react';

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminPreviewPage({ params }: PreviewPageProps) {
  const session = await auth();
  const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();

  // Double check authorization
  if (!session?.user?.email || (adminEmail && session.user.email.toLowerCase() !== adminEmail)) {
    notFound();
  }

  const { id } = await params;
  const post = await getPreviewPostById(id);

  if (!post) {
    notFound();
  }

  const articleHtml = renderTiptapToHtml(post.body);
  const relatedPosts = await getRelatedPosts(post.category?._id, post._id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const postUrl = `${siteUrl}/post/${post.slug.current}`;

  return (
    <div>
      {/* Draft Preview Warning Header */}
      <div className="bg-amber-500 text-zinc-950 px-4 py-2.5 mb-8 rounded-sm flex items-center justify-between flex-wrap gap-3 font-mono text-xs font-bold shadow-sm">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 shrink-0" />
          <span>[DRAFT PREVIEW MODE] આ ડ્રાફ્ટ પ્રિવ્યૂ છે - આ અહેવાલ હજી પબ્લિક માટે લાઈવ નથી.</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/posts/edit/${post._id}`}
            className="inline-flex items-center gap-1 bg-zinc-950 text-white px-3 py-1 rounded hover:bg-zinc-800 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            સંપાદન કરો (Edit Post)
          </Link>
          <Link
            href="/admin/posts"
            className="inline-flex items-center gap-1 text-zinc-900 underline hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            પાછા જાઓ
          </Link>
        </div>
      </div>

      {/* Render in the authentic public post layout */}
      <article className="max-w-4xl mx-auto">
        {/* Category & Badges */}
        <div className="flex items-center gap-3 mb-4">
          {post.isOpinion ? (
            <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-xs">
              મંતવ્ય / વિશ્લેષણ
            </span>
          ) : null}
          {post.isBreaking ? (
            <span className="bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold px-2.5 py-1 rounded-xs">
              બ્રેકિંગ ન્યૂઝ
            </span>
          ) : null}
          <span className="text-xs font-bold tracking-wider text-red-600 dark:text-red-400 uppercase">
            {post.category?.title}
          </span>
          <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
            Status: {post.status}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.2] mb-6">
          {post.title}
        </h1>

        {/* Standfirst / Summary */}
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 font-sans leading-relaxed mb-6 font-normal">
          {post.summary}
        </p>

        {/* Author & Publish Date Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            {post.author?.image?.url ? (
              <div className="relative w-11 h-11 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0">
                <Image
                  src={post.author.image.url}
                  alt={post.author.image.alt || post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : null}
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                અહેવાલ: {post.author?.name}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <time dateTime={post.publishedAt || post._createdAt || ''}>
                  {formatDate(post.publishedAt || post._createdAt)}
                </time>
                <span className="text-amber-500 font-mono">(Draft Preview)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Image with 16:9 ratio and required alt text */}
        {post.mainImage?.url && (
          <figure className="my-8">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-zinc-100 dark:bg-zinc-800">
              <Image
                src={post.mainImage.url}
                alt={post.mainImage.alt}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
            </div>
            {post.mainImage.caption && (
              <figcaption className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 italic">
                {post.mainImage.caption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Share Buttons */}
        <ShareButtons title={post.title} url={postUrl} />

        {/* Narrow readable text column for the article body */}
        <div className="max-w-2xl mx-auto">
          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: articleHtml }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-zinc-500 mr-2">
                ટેગ્સ:
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-1 rounded-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Author Bio Box */}
          {post.author?.bio && (
            <div className="mt-10 p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm flex items-start gap-4">
              {post.author.image?.url && (
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0">
                  <Image
                    src={post.author.image.url}
                    alt={post.author.image.alt || post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  લેખક પરિચય: {post.author.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {post.author.bio}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Related Stories */}
        <RelatedStories posts={relatedPosts} />
      </article>
    </div>
  );
}

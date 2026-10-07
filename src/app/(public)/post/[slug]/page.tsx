import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug, getRelatedPosts } from '@/lib/sanity/fetch';
import { renderTiptapToHtml } from '@/lib/tiptap/renderer';
import { formatDate } from '@/lib/utils/format-date';
import { ShareButtons } from '@/components/public/ShareButtons';
import { RelatedStories } from '@/components/public/RelatedStories';
import { ViewCounter } from '@/components/public/ViewCounter';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'અહેવાલ મળ્યો નથી | રીયલ ટાઇમ ન્યૂઝ ગુજરાતી',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const postUrl = `${siteUrl}/post/${post.slug.current}`;
  const ogImage = post.mainImage?.url || '/og-image.jpg';

  return {
    title: `${post.seoTitle || post.title} | રીયલ ટાઇમ ન્યૂઝ ગુજરાતી`,
    description: post.seoDescription || post.summary,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      url: postUrl,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author?.name || 'રીયલ ટાઇમ ન્યૂઝ ગુજરાતી'],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 675,
          alt: post.mainImage?.alt || post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: [ogImage],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Render Tiptap JSON to clean HTML on the server
  const articleHtml = renderTiptapToHtml(post.body);
  const relatedPosts = await getRelatedPosts(post.category?._id, post._id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const postUrl = `${siteUrl}/post/${post.slug.current}`;

  // NewsArticle JSON-LD for Google & SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': post.isOpinion ? 'OpinionNewsArticle' : 'NewsArticle',
    headline: post.title,
    description: post.summary,
    image: [post.mainImage?.url],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    inLanguage: 'gu',
    author: [
      {
        '@type': 'Person',
        name: post.author?.name,
        description: post.author?.bio,
      },
    ],
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'રીયલ ટાઇમ ન્યૂઝ ગુજરાતી',
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Real-time Genuine View Counter Tracker */}
      <ViewCounter slug={post.slug.current} />

      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
        <Link
          href={`/${post.category?.slug?.current}`}
          className="text-xs font-bold tracking-wider text-red-600 dark:text-red-400 hover:underline uppercase"
        >
          {post.category?.title}
        </Link>
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
              <time dateTime={post.publishedAt || ''}>
                {formatDate(post.publishedAt)}
              </time>
              {post.updatedAt && post.updatedAt !== post.publishedAt && (
                <span>• સુધારેલ: {formatDate(post.updatedAt)}</span>
              )}
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
  );
}

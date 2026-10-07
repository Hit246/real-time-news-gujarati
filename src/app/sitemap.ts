import { MetadataRoute } from 'next';
import { getHomePosts, getCategories } from '@/lib/sanity/fetch';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const [posts, categories] = await Promise.all([
    getHomePosts(),
    getCategories(),
  ]);

  const now = new Date();

  // Static public pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${siteUrl}/search`,
      lastModified: now,
      changeFrequency: 'always',
      priority: 0.6,
    },
  ];

  // Category archive pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteUrl}/${category.slug.current}`,
    lastModified: now,
    changeFrequency: 'hourly',
    priority: 0.8,
  }));

  // Published Post pages (Strictly filtering status == "published")
  const publishedPosts = posts.filter((p) => p.status === 'published' && p.slug?.current);
  const postPages: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
    url: `${siteUrl}/post/${post.slug.current}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : (post.publishedAt ? new Date(post.publishedAt) : now),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  return [...staticPages, ...categoryPages, ...postPages];
}

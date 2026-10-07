import { sanityClient, isSanityConfigured } from './client';
import {
  HOME_POSTS_QUERY,
  POST_BY_SLUG_QUERY,
  RELATED_POSTS_QUERY,
  CATEGORY_POSTS_QUERY,
  SEARCH_POSTS_QUERY,
  ALL_CATEGORIES_QUERY,
  SITE_SETTINGS_QUERY,
  PREVIEW_POST_BY_ID_QUERY,
  BREAKING_POSTS_QUERY,
} from './queries';
import { SAMPLE_POSTS, SAMPLE_CATEGORIES, SAMPLE_SETTINGS } from './sample-data';
import { Post, Category, SiteSettings } from '@/types/sanity';

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSanityConfigured()) {
    return SAMPLE_SETTINGS;
  }
  try {
    const settings = await sanityClient.fetch(SITE_SETTINGS_QUERY);
    return settings || SAMPLE_SETTINGS;
  } catch (error) {
    console.error('Error fetching site settings from Sanity, using fallback:', error);
    return SAMPLE_SETTINGS;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!isSanityConfigured()) {
    return SAMPLE_CATEGORIES;
  }
  try {
    const categories = await sanityClient.fetch(ALL_CATEGORIES_QUERY);
    return categories?.length ? categories : SAMPLE_CATEGORIES;
  } catch (error) {
    console.error('Error fetching categories from Sanity, using fallback:', error);
    return SAMPLE_CATEGORIES;
  }
}

export async function getBreakingNews(): Promise<Pick<Post, '_id' | 'title' | 'slug' | 'publishedAt'>[]> {
  const fallbackBreaking = SAMPLE_POSTS.filter((p) => p.status === 'published' && p.isBreaking).map((p) => ({
    _id: p._id,
    title: p.title,
    slug: p.slug,
    publishedAt: p.publishedAt,
  }));

  if (!isSanityConfigured()) {
    return fallbackBreaking;
  }
  try {
    const posts = await sanityClient.fetch(BREAKING_POSTS_QUERY);
    return posts?.length ? posts : fallbackBreaking;
  } catch (error) {
    console.error('Error fetching breaking news:', error);
    return fallbackBreaking;
  }
}

export async function getHomePosts(): Promise<Post[]> {
  const fallback = SAMPLE_POSTS.filter((p) => p.status === 'published');
  if (!isSanityConfigured()) {
    return fallback;
  }
  try {
    const posts = await sanityClient.fetch(HOME_POSTS_QUERY);
    return posts?.length ? posts : fallback;
  } catch (error) {
    console.error('Error fetching home posts, using fallback:', error);
    return fallback;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fallbackPost = SAMPLE_POSTS.find((p) => p.slug.current === slug && p.status === 'published') || null;

  if (!isSanityConfigured()) {
    return fallbackPost;
  }
  try {
    const post = await sanityClient.fetch(POST_BY_SLUG_QUERY, { slug });
    return post || fallbackPost;
  } catch (error) {
    console.error(`Error fetching post by slug "${slug}":`, error);
    return fallbackPost;
  }
}

export async function getRelatedPosts(categoryId?: string, currentId?: string): Promise<Post[]> {
  const fallbackRelated = SAMPLE_POSTS.filter(
    (p) => p.status === 'published' && p._id !== currentId
  ).slice(0, 4);

  if (!isSanityConfigured()) {
    return fallbackRelated;
  }
  try {
    const posts = await sanityClient.fetch(RELATED_POSTS_QUERY, {
      categoryId: categoryId || '',
      currentId: currentId || '',
    });
    return posts?.length ? posts : fallbackRelated;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return fallbackRelated;
  }
}

export async function getCategoryPosts(categorySlug: string, page: number = 1, pageSize: number = 10) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const fallbackFiltered = SAMPLE_POSTS.filter(
    (p) => p.status === 'published' && p.category?.slug?.current === categorySlug
  );

  if (!isSanityConfigured()) {
    return {
      posts: fallbackFiltered.slice(start, end),
      total: fallbackFiltered.length,
      page,
      totalPages: Math.ceil(fallbackFiltered.length / pageSize) || 1,
    };
  }

  try {
    const [posts, total] = await Promise.all([
      sanityClient.fetch(CATEGORY_POSTS_QUERY, { categorySlug, start, end }),
      sanityClient.fetch(`count(*[_type == "post" && status == "published" && category->slug.current == $categorySlug])`, { categorySlug }),
    ]);

    if (!posts || posts.length === 0) {
      return {
        posts: fallbackFiltered.slice(start, end),
        total: fallbackFiltered.length,
        page,
        totalPages: Math.ceil(fallbackFiltered.length / pageSize) || 1,
      };
    }

    return {
      posts: posts || [],
      total: total || 0,
      page,
      totalPages: Math.ceil((total || 0) / pageSize) || 1,
    };
  } catch (error) {
    console.error(`Error fetching category posts for "${categorySlug}":`, error);
    return {
      posts: fallbackFiltered.slice(start, end),
      total: fallbackFiltered.length,
      page,
      totalPages: Math.ceil(fallbackFiltered.length / pageSize) || 1,
    };
  }
}

export async function searchPosts(query: string): Promise<Post[]> {
  if (!query || query.trim().length === 0) return [];

  const lower = query.toLowerCase();
  const fallbackSearch = SAMPLE_POSTS.filter(
    (p) =>
      p.status === 'published' &&
      (p.title.toLowerCase().includes(lower) ||
        p.summary.toLowerCase().includes(lower) ||
        p.tags?.some((t) => t.toLowerCase().includes(lower)))
  );

  if (!isSanityConfigured()) {
    return fallbackSearch;
  }

  try {
    const term = `*${query}*`;
    const posts = await sanityClient.fetch(SEARCH_POSTS_QUERY, { term });
    return posts?.length ? posts : fallbackSearch;
  } catch (error) {
    console.error(`Error searching posts for "${query}":`, error);
    return fallbackSearch;
  }
}

// Admin / Preview query
export async function getPreviewPostById(id: string): Promise<Post | null> {
  const fallback = SAMPLE_POSTS.find((p) => p._id === id) || null;
  if (!isSanityConfigured()) {
    return fallback;
  }
  try {
    const post = await sanityClient.fetch(PREVIEW_POST_BY_ID_QUERY, { id });
    return post || fallback;
  } catch (error) {
    console.error(`Error fetching preview post by id "${id}":`, error);
    return fallback;
  }
}

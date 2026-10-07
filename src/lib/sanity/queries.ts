import groq from 'groq';

// Base projection for posts
export const postProjection = `
  _id,
  _type,
  title,
  slug,
  summary,
  body,
  mainImage {
    asset->,
    alt,
    caption,
    url
  },
  category->{
    _id,
    title,
    slug,
    order
  },
  tags,
  author->{
    _id,
    name,
    bio,
    image {
      asset->,
      alt,
      url
    }
  },
  status,
  scheduledAt,
  publishedAt,
  updatedAt,
  _createdAt,
  _updatedAt,
  isBreaking,
  isOpinion,
  seoTitle,
  seoDescription
`;

// PUBLIC QUERIES - Strictly status == 'published'

// 1. Breaking ticker news
export const BREAKING_POSTS_QUERY = groq`
  *[_type == "post" && status == "published" && isBreaking == true] | order(publishedAt desc)[0...5] {
    _id,
    title,
    slug,
    publishedAt
  }
`;

// 2. Home Hero & Latest
export const HOME_POSTS_QUERY = groq`
  *[_type == "post" && status == "published"] | order(publishedAt desc)[0...20] {
    ${postProjection}
  }
`;

// 3. Single post by slug (Strictly published for public)
export const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && slug.current == $slug && status == "published"][0] {
    ${postProjection}
  }
`;

// 4. Related posts by category (excluding current post, strictly published)
export const RELATED_POSTS_QUERY = groq`
  *[_type == "post" && status == "published" && category._ref == $categoryId && _id != $currentId] | order(publishedAt desc)[0...4] {
    ${postProjection}
  }
`;

// 5. Category paginated posts
export const CATEGORY_POSTS_QUERY = groq`
  *[_type == "post" && status == "published" && category->slug.current == $categorySlug] | order(publishedAt desc)[$start...$end] {
    ${postProjection}
  }
`;

export const CATEGORY_POSTS_COUNT_QUERY = groq`
  count(*[_type == "post" && status == "published" && category->slug.current == $categorySlug])
`;

// 6. Search query
export const SEARCH_POSTS_QUERY = groq`
  *[_type == "post" && status == "published" && (title match $term || summary match $term || tags[] match $term)] | order(publishedAt desc)[0...30] {
    ${postProjection}
  }
`;

// 7. Categories list
export const ALL_CATEGORIES_QUERY = groq`
  *[_type == "category"] | order(order asc, title asc) {
    _id,
    title,
    slug,
    order
  }
`;

// 8. Site settings
export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    _id,
    siteName,
    logo {
      asset->,
      alt,
      url
    },
    socialLinks,
    adCode,
    breakingTickerEnabled
  }
`;

// 9. All slugs for sitemap & static paths (Strictly published)
export const SITEMAP_POSTS_QUERY = groq`
  *[_type == "post" && status == "published"] | order(publishedAt desc) {
    "slug": slug.current,
    publishedAt,
    updatedAt,
    _updatedAt
  }
`;

// ADMIN & PREVIEW QUERIES

// Preview post by ID (Includes draft & scheduled)
export const PREVIEW_POST_BY_ID_QUERY = groq`
  *[_type == "post" && _id == $id][0] {
    ${postProjection}
  }
`;

// Admin post by ID
export const ADMIN_POST_BY_ID_QUERY = groq`
  *[_type == "post" && _id == $id][0] {
    ${postProjection}
  }
`;

// Admin all posts with filter
export const ADMIN_ALL_POSTS_QUERY = groq`
  *[_type == "post"] | order(_updatedAt desc) {
    ${postProjection}
  }
`;

// Admin Revisions for a post
export const REVISIONS_BY_POST_ID_QUERY = groq`
  *[_type == "revision" && postId == $postId] | order(savedAt desc) {
    _id,
    postId,
    titleSnapshot,
    bodySnapshot,
    savedAt
  }
`;

// Admin Audit Logs
export const AUDIT_LOGS_QUERY = groq`
  *[_type == "auditLog"] | order(timestamp desc)[0...50] {
    _id,
    action,
    postId,
    postTitle,
    timestamp,
    performedBy
  }
`;

// Cron query for scheduled posts ready to publish
export const DUE_SCHEDULED_POSTS_QUERY = groq`
  *[_type == "post" && status == "scheduled" && scheduledAt <= $now] {
    _id,
    slug,
    title,
    scheduledAt
  }
`;

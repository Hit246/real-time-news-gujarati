export type PostStatus = 'draft' | 'scheduled' | 'published';

export interface SanityImage {
  _type?: 'image';
  asset?: {
    _ref?: string;
    _type?: 'reference';
    url?: string;
  };
  url?: string;
  alt: string; // Required
  caption?: string;
}

export interface Category {
  _id: string;
  _type: 'category';
  title: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  order?: number;
}

export interface Author {
  _id: string;
  _type: 'author';
  name: string;
  bio?: string;
  image?: SanityImage;
}

export interface Post {
  _id: string;
  _type: 'post';
  title: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  summary: string; // Max 200 chars
  body: string; // Tiptap JSON stored as stringified text
  mainImage: SanityImage; // Required with alt text
  category: Category;
  tags?: string[];
  author: Author;
  status: PostStatus;
  scheduledAt?: string;
  publishedAt?: string;
  updatedAt?: string;
  _createdAt?: string;
  _updatedAt?: string;
  isBreaking?: boolean;
  isOpinion?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  viewsCount?: number;
}

export interface Revision {
  _id: string;
  _type: 'revision';
  postId: string;
  titleSnapshot: string;
  bodySnapshot: string;
  savedAt: string;
  summarySnapshot?: string;
  authorEmail?: string;
}

export interface SiteSettings {
  _id: string;
  _type: 'siteSettings';
  siteName: string;
  logo?: SanityImage;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  adCode?: string;
  breakingTickerEnabled?: boolean;
}

export interface AuditLog {
  _id: string;
  _type: 'auditLog';
  action: 'publish' | 'unpublish' | 'edit' | 'delete' | 'create' | 'restore';
  postId?: string;
  postTitle?: string;
  timestamp: string;
  performedBy?: string;
}

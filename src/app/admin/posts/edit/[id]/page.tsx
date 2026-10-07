import { notFound } from 'next/navigation';
import { getCategories } from '@/lib/sanity/fetch';
import { SAMPLE_POSTS, SAMPLE_AUTHORS } from '@/lib/sanity/sample-data';
import { PostForm } from '@/components/admin/PostForm';
import { isSanityConfigured, getAdminClient } from '@/lib/sanity/client';
import { Post } from '@/types/sanity';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  let post: Post | null = SAMPLE_POSTS.find((p) => p._id === id) || null;

  if (isSanityConfigured()) {
    try {
      const client = getAdminClient();
      const sanityPost = await client.fetch(`*[_type == "post" && _id == $id][0] {
        _id,
        _type,
        title,
        slug,
        summary,
        body,
        mainImage,
        category->,
        tags,
        author->,
        status,
        scheduledAt,
        publishedAt,
        updatedAt,
        isBreaking,
        isOpinion,
        seoTitle,
        seoDescription
      }`, { id });
      if (sanityPost) post = sanityPost;
    } catch (err) {
      console.error('Error fetching post for editing from Sanity:', err);
    }
  }

  if (!post) {
    notFound();
  }

  const categories = await getCategories();
  const authors = SAMPLE_AUTHORS;

  return <PostForm initialPost={post} categories={categories} authors={authors} />;
}

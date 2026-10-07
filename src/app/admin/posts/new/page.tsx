import { getCategories } from '@/lib/sanity/fetch';
import { SAMPLE_AUTHORS } from '@/lib/sanity/sample-data';
import { PostForm } from '@/components/admin/PostForm';

export default async function NewPostPage() {
  const categories = await getCategories();
  const authors = SAMPLE_AUTHORS;

  return <PostForm categories={categories} authors={authors} />;
}

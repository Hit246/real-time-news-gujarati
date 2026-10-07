import { getCategories } from '@/lib/sanity/fetch';
import { CategoriesManager } from '@/components/admin/CategoriesManager';

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return <CategoriesManager initialCategories={categories} />;
}

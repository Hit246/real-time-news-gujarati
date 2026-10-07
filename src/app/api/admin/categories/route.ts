import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { categoryFormSchema } from '@/lib/validations/category';
import { getAdminClient, isSanityConfigured } from '@/lib/sanity/client';
import { SAMPLE_CATEGORIES } from '@/lib/sanity/sample-data';
import { Category } from '@/types/sanity';

export async function GET() {
  const session = await auth();
  const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();

  if (!session?.user?.email || (adminEmail && session.user.email.toLowerCase() !== adminEmail)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let categories: Category[] = SAMPLE_CATEGORIES;

  if (isSanityConfigured()) {
    try {
      const client = getAdminClient();
      const fetched = await client.fetch(`*[_type == "category"] | order(order asc, title asc)`);
      if (fetched?.length) categories = fetched;
    } catch (err) {
      console.error('Error fetching categories from Sanity:', err);
    }
  }

  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  const session = await auth();
  const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();

  if (!session?.user?.email || (adminEmail && session.user.email.toLowerCase() !== adminEmail)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const json = await req.json();
    const validated = categoryFormSchema.parse(json);

    const newCategory: Category = {
      _id: `cat-${Date.now()}`,
      _type: 'category',
      title: validated.title,
      slug: { _type: 'slug', current: validated.slug },
      order: validated.order || 0,
    };

    SAMPLE_CATEGORIES.push(newCategory);

    if (isSanityConfigured()) {
      try {
        const client = getAdminClient();
        const created = await client.create({
          _type: 'category',
          title: validated.title,
          slug: { _type: 'slug', current: validated.slug },
          order: validated.order || 0,
        });
        newCategory._id = created._id;
      } catch (err) {
        console.error('Error creating category in Sanity:', err);
      }
    }

    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Validation failed' }, { status: 400 });
  }
}

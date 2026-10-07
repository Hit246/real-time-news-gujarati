import { z } from 'zod';

export const categoryFormSchema = z.object({
  title: z.string().min(2, 'Category title must be at least 2 characters').max(50),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  order: z.number().int().default(0),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

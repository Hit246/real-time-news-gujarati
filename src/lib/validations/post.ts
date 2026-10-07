import { z } from 'zod';

const imagePathOrUrl = z
  .string()
  .refine((val) => !val || val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://'), {
    message: 'Must be a valid URL (http/https) or local path starting with /',
  });

export const postFormSchema = z.object({
  title: z
    .string()
    .min(3, 'શીર્ષક ઓછામાં ઓછું ૩ અક્ષરનું હોવું જરૂરી છે (Title must be at least 3 characters)')
    .max(160, 'શીર્ષક ૧૬૦ અક્ષરોથી વધુ ન હોવું જોઈએ (Title cannot exceed 160 characters)'),
  slug: z
    .string()
    .min(2, 'સ્લગ ઓછામાં ઓછો ૨ અક્ષરનો હોવો જોઈએ (Slug must be at least 2 characters)')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  summary: z
    .string()
    .min(10, 'સારાંશ ઓછામાં ઓછો ૧૦ અક્ષરનો હોવો જરૂરી છે (Summary must be at least 10 characters)')
    .max(200, 'સારાંશ ૨૦૦ અક્ષરોથી વધુ ન હોવો જોઈએ (Summary cannot exceed 200 characters)'),
  body: z.string().min(1, 'અહેવાલની વિગત (Body content) દાખલ કરવી જરૂરી છે'),
  mainImage: z.object({
    url: imagePathOrUrl,
    alt: z.string().min(1, 'મુખ્ય ઇમેજ માટે Alt ટેક્સ્ટ લખવું ફરજિયાત છે (Alt text is required)'),
    caption: z.string().optional(),
    asset: z.any().optional(),
  }),
  categoryId: z.string().min(1, 'સમાચાર વિભાગ પસંદ કરવો જરૂરી છે (Category is required)'),
  tags: z.array(z.string()).default([]),
  authorId: z.string().min(1, 'લેખક / પત્રકાર પસંદ કરવા જરૂરી છે (Author is required)'),
  status: z.enum(['draft', 'scheduled', 'published']),
  scheduledAt: z.string().optional().nullable(),
  publishedAt: z.string().optional().nullable(),
  isBreaking: z.boolean().default(false),
  isOpinion: z.boolean().default(false),
  seoTitle: z.string().max(70, 'SEO title should be under 70 characters').optional(),
  seoDescription: z.string().max(160, 'SEO description should be under 160 characters').optional(),
});

export type PostFormData = z.infer<typeof postFormSchema>;

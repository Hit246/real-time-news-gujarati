import { z } from 'zod';

// Allows full URLs (http/https) OR local relative paths starting with /
const imagePathOrUrl = z
  .string()
  .refine((val) => !val || val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://'), {
    message: 'Must be a valid URL (http/https) or relative path starting with /',
  });

export const siteSettingsFormSchema = z.object({
  siteName: z.string().min(2, 'Site name is required').max(100),
  logo: z
    .object({
      url: imagePathOrUrl.optional(),
      alt: z.string().optional(),
      asset: z.any().optional(),
    })
    .optional(),
  socialLinks: z
    .object({
      twitter: z.string().url().or(z.literal('')).optional(),
      facebook: z.string().url().or(z.literal('')).optional(),
      instagram: z.string().url().or(z.literal('')).optional(),
      youtube: z.string().url().or(z.literal('')).optional(),
    })
    .optional(),
  adCode: z.string().optional(),
  breakingTickerEnabled: z.boolean().default(true),
});

export type SiteSettingsFormData = z.infer<typeof siteSettingsFormSchema>;

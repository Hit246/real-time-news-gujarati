import { createClient } from '@sanity/client';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

// Read-only client for public site (SSR / SSG / ISR)
export const sanityClient = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_READ_TOKEN, // Read-only token
});

// Server-side only client with write privileges for admin API
export const getAdminClient = () => {
  const writeToken = process.env.SANITY_WRITE_TOKEN;
  if (!writeToken && process.env.NODE_ENV === 'production') {
    console.warn('SANITY_WRITE_TOKEN is missing in production environment');
  }

  return createClient({
    projectId: projectId || 'placeholder',
    dataset,
    apiVersion,
    useCdn: false,
    token: writeToken,
  });
};

export const isSanityConfigured = () => {
  return Boolean(projectId && projectId !== 'placeholder');
};

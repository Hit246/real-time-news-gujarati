import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './client';
import { SanityImage } from '@/types/sanity';

const builder = imageUrlBuilder(sanityClient);

export function urlForImage(source: any) {
  if (!source) return null;
  // If it's already a direct URL string
  if (typeof source === 'string') return source;
  // If it's a Sanity image object with direct url property (e.g. mock/uploaded)
  if (source.url) return source.url;
  // If it has asset._ref
  if (source.asset?._ref || source.asset?._id || source._ref) {
    try {
      return builder.image(source).auto('format').fit('max').url();
    } catch {
      return null;
    }
  }
  return null;
}

export function getImageDimensions(source: SanityImage | any) {
  return {
    width: 1200,
    height: 675, // 16:9 ratio
  };
}

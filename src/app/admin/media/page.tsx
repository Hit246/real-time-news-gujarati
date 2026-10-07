import { Metadata } from 'next';
import { MediaLibrary } from '@/components/admin/MediaLibrary';

export const metadata: Metadata = {
  title: 'મીડિયા લાઇબ્રેરી (Media Library) | Admin',
};

export default function MediaPage() {
  return <MediaLibrary />;
}

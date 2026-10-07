import { getSiteSettings } from '@/lib/sanity/fetch';
import { SettingsForm } from '@/components/admin/SettingsForm';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return <SettingsForm initialSettings={settings} />;
}

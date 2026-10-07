import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { siteSettingsFormSchema } from '@/lib/validations/settings';
import { getAdminClient, isSanityConfigured } from '@/lib/sanity/client';
import { SAMPLE_SETTINGS } from '@/lib/sanity/sample-data';
import { SITE_SETTINGS_QUERY } from '@/lib/sanity/queries';

export async function GET() {
  const session = await auth();
  const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();

  if (!session?.user?.email || (adminEmail && session.user.email.toLowerCase() !== adminEmail)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let settings = SAMPLE_SETTINGS;

  if (isSanityConfigured()) {
    try {
      const client = getAdminClient();
      const sanitySettings = await client.fetch(SITE_SETTINGS_QUERY);
      if (sanitySettings) settings = sanitySettings;
    } catch (err) {
      console.error('Error fetching settings from Sanity, using fallback:', err);
    }
  }

  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const session = await auth();
  const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();

  if (!session?.user?.email || (adminEmail && session.user.email.toLowerCase() !== adminEmail)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const json = await req.json();
    const validated = siteSettingsFormSchema.parse(json);

    // Update in-memory fallback
    SAMPLE_SETTINGS.siteName = validated.siteName;
    if (validated.logo?.url) {
      SAMPLE_SETTINGS.logo = { url: validated.logo.url, alt: validated.logo.alt || validated.siteName };
    }
    SAMPLE_SETTINGS.socialLinks = validated.socialLinks;
    SAMPLE_SETTINGS.adCode = validated.adCode;
    SAMPLE_SETTINGS.breakingTickerEnabled = validated.breakingTickerEnabled;

    if (isSanityConfigured()) {
      try {
        const client = getAdminClient();
        await client.createOrReplace({
          _id: 'siteSettings',
          _type: 'siteSettings',
          siteName: validated.siteName,
          logo: validated.logo,
          socialLinks: validated.socialLinks,
          adCode: validated.adCode,
          breakingTickerEnabled: validated.breakingTickerEnabled,
        });

        // Audit log
        await client.create({
          _type: 'auditLog',
          action: 'edit',
          postId: 'siteSettings',
          postTitle: 'Site Settings Updated',
          timestamp: new Date().toISOString(),
          performedBy: session.user.email,
        });
      } catch (err) {
        console.error('Error updating site settings in Sanity, updated in memory:', err);
      }
    }

    return NextResponse.json({ success: true, settings: SAMPLE_SETTINGS });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Validation failed' }, { status: 400 });
  }
}

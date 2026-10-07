export const siteSettingsSchema = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'REAL TIME NEWS GUJARATI',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'logo',
      title: 'Site Logo',
      type: 'image',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        },
      ],
    },
    {
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        { name: 'twitter', title: 'Twitter / X URL', type: 'url' },
        { name: 'facebook', title: 'Facebook URL', type: 'url' },
        { name: 'instagram', title: 'Instagram URL', type: 'url' },
        { name: 'youtube', title: 'YouTube URL', type: 'url' },
      ],
    },
    {
      name: 'adCode',
      title: 'Ad Slot Code / Banner HTML',
      type: 'text',
      rows: 4,
    },
    {
      name: 'breakingTickerEnabled',
      title: 'Enable Breaking News Ticker',
      type: 'boolean',
      initialValue: true,
    },
  ],
};

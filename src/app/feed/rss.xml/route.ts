import { NextResponse } from 'next/server';
import { getHomePosts, getSiteSettings } from '@/lib/sanity/fetch';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const [posts, settings] = await Promise.all([
    getHomePosts(),
    getSiteSettings(),
  ]);

  const siteName = settings.siteName || 'રીયલ ટાઇમ ન્યૂઝ ગુજરાતી';
  const siteDescription = 'ગુજરાત, દેશ અને દુનિયાના તાજા સમાચાર, બિઝનેસ અને વિશેષ વિશ્લેષણ';
  const publishedPosts = posts.filter(
    (p) => p.status === 'published' && p.slug?.current
  );

  const rssItems = publishedPosts
    .map((post) => {
      const postUrl = `${siteUrl}/post/${post.slug.current}`;
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : new Date().toUTCString();

      const imageUrl = post.mainImage?.url;
      const enclosureTag = imageUrl
        ? `<enclosure url="${escapeXml(imageUrl)}" length="0" type="image/jpeg" />`
        : '';

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.summary || post.title}]]></description>
      <category><![CDATA[${post.category?.title || 'સમાચાર'}]]></category>
      <author>${escapeXml(post.author?.name || siteName)}</author>
      ${enclosureTag}
    </item>`;
    })
    .join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteName}]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[${siteDescription}]]></description>
    <language>gu-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed/rss.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rssXml.trim(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

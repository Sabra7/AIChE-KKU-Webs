import type { MetadataRoute } from 'next';

import { siteUrl } from '@/data/site';

const LAST_MODIFIED = new Date('2026-09-05');

const languages = {
  ar: siteUrl,
  en: `${siteUrl}/en`,
  'x-default': siteUrl,
};

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${siteUrl}/en`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages },
    },
    ...[`${siteUrl}/challenge`, `${siteUrl}/en/challenge`].map((url) => ({
      url,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
      alternates: {
        languages: { ar: `${siteUrl}/challenge`, en: `${siteUrl}/en/challenge` },
      },
    })),
  ];
}

import type { Metadata, Viewport } from 'next';

import Shell from '@/components/Shell';
import { site, siteUrl } from '@/data/site';
import { organizationJsonLd } from '@/lib/jsonld';

import '../globals.css';

const title = 'AIChE KKU | Chemical Engineering Student Chapter, King Khalid University, Abha';

const description =
  'AIChE KKU is the AIChE student chapter at King Khalid University, Abha. Run by students of the Chemical Engineering Department at KKU: technical workshops, engineering courses and industry visits connecting them to a network across 110+ countries.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: '/en',
    languages: { ar: '/', en: '/en' },
  },
  openGraph: {
    title,
    description: site.tagline,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  verification: {
    google: 'wIE6QzaD2FwUCRpzzJuGLDeLX_jgqAm9pWwIbXHex9A',
  },
};

export const viewport: Viewport = {
  themeColor: '#FAFAFA',
  viewportFit: 'cover',
};

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Shell lang="en" jsonLd={organizationJsonLd('en')}>
      {children}
    </Shell>
  );
}

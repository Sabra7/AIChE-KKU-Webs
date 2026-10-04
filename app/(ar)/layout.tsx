import type { Metadata, Viewport } from 'next';

import Shell from '@/components/Shell';
import { site, siteUrl } from '@/data/site';
import { organizationJsonLd } from '@/lib/jsonld';

import '../globals.css';

const title = 'AIChE KKU | الفرع الطلابي للهندسة الكيميائية بجامعة الملك خالد';

const description =
  'الفرع الطلابي للمعهد الأمريكي للمهندسين الكيميائيين AIChE بجامعة الملك خالد في أبها. ورش تقنية ودورات هندسية وزيارات صناعية تربط طلاب قسم الهندسة الكيميائية بشبكة عالمية في أكثر من 110 دول.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: '/',
    languages: { ar: '/', en: '/en' },
  },
  openGraph: {
    title,
    description: site.tagline,
    locale: 'ar_SA',
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

export default function ArabicRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Shell lang="ar" jsonLd={organizationJsonLd('ar')}>
      {children}
    </Shell>
  );
}

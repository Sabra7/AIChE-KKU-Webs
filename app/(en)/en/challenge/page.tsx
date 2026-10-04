import type { Metadata, Viewport } from 'next';

import Challenge from '@/components/challenge/Challenge';

export const metadata: Metadata = {
  title: 'Challenge yourself | AIChE KKU',
  description:
    'An interactive periodic table: pick an element to see its atom and answer a question about it.',
  alternates: {
    canonical: '/en/challenge',
    languages: { ar: '/challenge', en: '/en/challenge' },
  },
};

export const viewport: Viewport = {
  themeColor: '#111813',
  viewportFit: 'cover',
};

export default function EnglishChallenge() {
  return <Challenge lang="en" />;
}

import type { Metadata, Viewport } from 'next';

import Challenge from '@/components/challenge/Challenge';
import { parseScore, QUIZ_LENGTH, scoreParams } from '@/lib/scoreImage';

type Params = { params: Promise<{ score: string }> };

export const generateStaticParams = scoreParams;
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const score = parseScore((await params).score);
  const title = `I scored ${score} out of ${QUIZ_LENGTH} on the periodic table challenge`;
  return {
    title: `${title} | AIChE KKU`,
    description: 'Try the AIChE KKU periodic table quiz and see if you can beat this score.',
    alternates: { canonical: '/en/challenge' },
    openGraph: { title, locale: 'en_US', type: 'website' },
    twitter: { card: 'summary_large_image', title },
    robots: { index: false },
  };
}

export const viewport: Viewport = {
  themeColor: '#111813',
  viewportFit: 'cover',
};

export default async function EnglishScore({ params }: Params) {
  return <Challenge lang="en" challengerScore={parseScore((await params).score)} />;
}

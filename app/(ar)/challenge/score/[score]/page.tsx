import type { Metadata, Viewport } from 'next';

import Challenge from '@/components/challenge/Challenge';
import { parseScore, QUIZ_LENGTH, scoreParams } from '@/lib/scoreImage';

type Params = { params: Promise<{ score: string }> };

export const generateStaticParams = scoreParams;
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const score = parseScore((await params).score);
  const title = `حصلت على ${score} من ${QUIZ_LENGTH} في تحدي الجدول الدوري`;
  return {
    title: `${title} | AIChE KKU`,
    description:
      'جرّب اختبار الجدول الدوري من فرع AIChE بجامعة الملك خالد وحاول تتفوق على النتيجة.',
    alternates: { canonical: '/challenge' },
    openGraph: { title, locale: 'ar_SA', type: 'website' },
    twitter: { card: 'summary_large_image', title },
    robots: { index: false },
  };
}

export const viewport: Viewport = {
  themeColor: '#111813',
  viewportFit: 'cover',
};

export default async function ArabicScore({ params }: Params) {
  return <Challenge lang="ar" challengerScore={parseScore((await params).score)} />;
}

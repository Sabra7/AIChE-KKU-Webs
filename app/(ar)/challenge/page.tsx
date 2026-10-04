import type { Metadata, Viewport } from 'next';

import Challenge from '@/components/challenge/Challenge';

export const metadata: Metadata = {
  title: 'تحدَّ نفسك | AIChE KKU',
  description: 'الجدول الدوري التفاعلي: اختر عنصرًا لتشاهد ذرته وتجيب عن سؤال تحدٍّ عنه.',
  alternates: {
    canonical: '/challenge',
    languages: { ar: '/challenge', en: '/en/challenge' },
  },
};

export const viewport: Viewport = {
  themeColor: '#111813',
  viewportFit: 'cover',
};

export default function ArabicChallenge() {
  return <Challenge lang="ar" />;
}

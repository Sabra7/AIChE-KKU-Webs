import type { Lang } from './i18n';

export interface DualDate {
  greg: string;

  hijri: string;
}

export const dualText = (lang: Lang, d: DualDate) =>
  lang === 'ar' ? `${d.greg}م (${d.hijri}هـ)` : `${d.greg} (${d.hijri} AH)`;

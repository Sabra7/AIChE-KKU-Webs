export type Lang = 'ar' | 'en';
type Dir = 'rtl' | 'ltr';

export const dirOf = (lang: Lang): Dir => (lang === 'ar' ? 'rtl' : 'ltr');

export const otherLang = (lang: Lang): Lang => (lang === 'ar' ? 'en' : 'ar');

export const homeHref = (lang: Lang) => (lang === 'ar' ? '/' : '/en');

export const pick = (lang: Lang, ar: string, en: string) => (lang === 'ar' ? ar : en);

export const challengeHref = (lang: Lang) => (lang === 'ar' ? '/challenge' : '/en/challenge');

export const scoreHref = (lang: Lang, score: number) => `${challengeHref(lang)}/score/${score}`;

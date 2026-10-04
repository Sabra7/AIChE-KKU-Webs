import { IBM_Plex_Sans_Arabic } from 'next/font/google';

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-arabic',
  display: 'swap',
});

export const fontVars = plexArabic.variable;

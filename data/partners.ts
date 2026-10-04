import type { SocialKey } from '@/lib/socials';

interface Partner {
  id: string;
  nameAr: string;
  nameEn: string;
  logo: string;

  links?: Partial<Record<SocialKey, string>>;
}

export const partners: Partner[] = [
  {
    id: 'madar-alfalak',

    nameAr: 'مركز مدار الفلك للتدريب',
    nameEn: 'Madar Al-Falak Training Center',
    logo: '/partners/madar-alfalak.png',
    links: {
      tiktok: 'https://www.tiktok.com/@mafacadmy',
      x: 'https://x.com/mafacadmy',
      instagram: 'https://www.instagram.com/mafacadmy',
    },
  },
  {
    id: 'bred-bakehouse',
    nameAr: 'برد بيك هاوس',
    nameEn: 'Bred Bakehouse',
    logo: '/partners/bred-bakehouse.png',
    links: {
      tiktok: 'https://www.tiktok.com/@bred_ksa',
      maps: 'https://share.google/MklVbji5OaboVxBE4',
    },
  },
];

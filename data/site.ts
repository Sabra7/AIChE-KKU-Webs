export const siteUrl = 'https://aiche-kku.vercel.app';

export const site = {
  nameEn: 'AIChE-KKU',
  nameAr: 'AIChE، الفرع الطلابي بجامعة الملك خالد',

  universityAr: 'جامعة الملك خالد، أبها',
  universityEn: 'King Khalid University, Abha',

  departmentAr: 'قسم الهندسة الكيميائية',
  departmentEn: 'Chemical Engineering Department',

  founded: 2021,

  tagline: 'Advancing Chemical Engineering, Empowering Students',
} as const;

export const socials: Partial<
  Record<'linkedin' | 'tiktok' | 'x' | 'instagram' | 'whatsapp', string>
> = {
  whatsapp: 'https://chat.whatsapp.com/I7GYjjkNv6Q6T1hMX5txtD',
  x: 'https://x.com/aiche_aseer',
  linkedin: 'https://www.linkedin.com/company/kku-aiche/',
  tiktok: 'https://www.tiktok.com/@aiche_aseer',
};

export const joinUrl = 'https://forms.gle/xEQaFY3UANYquYJV8';

export const registrationOpen: boolean = false;

export const contact = {
  email: 'kku.aiche@gmail.com',

  mapsUrl: 'https://maps.app.goo.gl/bp8x7BTN5XiEPy6W6',

  placeAr: 'جامعة الملك خالد',
  placeEn: 'King Khalid University',

  replyTimeAr: '',
  replyTimeEn: '',
};

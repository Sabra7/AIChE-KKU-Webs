export const ui = {
  joinCtaAr: 'انضم إلينا',
  joinCtaEn: 'Join us',

  followCtaAr: 'تابعنا',
  followCtaEn: 'Follow us',

  contactCtaAr: 'تواصل معنا',
  contactCtaEn: 'Contact us',

  challengeCtaAr: 'تحدَّ نفسك',
  challengeCtaEn: 'Challenge yourself',

  channelsAr: {
    whatsapp: 'واتساب',
    x: 'X',
    tiktok: 'تيك توك',
    linkedin: 'لينكدإن',
    instagram: 'إنستقرام',
    maps: 'المكان',
    email: 'الإيميل',
  },
  channelsEn: {
    whatsapp: 'WhatsApp',
    x: 'X',
    tiktok: 'TikTok',
    linkedin: 'LinkedIn',
    instagram: 'Instagram',
    maps: 'Location',
    email: 'Email',
  },

  waGroupAr: 'قروب الفرع',
  waGroupEn: 'Chapter group',

  navAr: {
    about: 'عن الفرع',
    gallery: 'الصور',
    gains: 'العضوية',
    journey: 'المحطات',
    team: 'الفريق',
    join: 'التسجيل',
  },
  navEn: {
    about: 'About',
    gallery: 'Photos',
    gains: 'Membership',
    journey: 'Milestones',
    team: 'Team',
    join: 'Join',
  },

  soonAr: 'قريبًا',
  soonEn: 'Coming soon',

  readBioAr: 'النبذة',
  readBioEn: 'Read bio',

  skipAr: 'تخطَّ إلى المحتوى',
  skipEn: 'Skip to content',

  menuAr: 'القائمة',
  menuEn: 'Menu',

  creditPrefix: 'Designed & developed by',
  creditName: 'Mohammed Sabrah',
  creditUrl: 'https://github.com/Sabra7',
} as const;

type NavKey = keyof typeof ui.navAr;

export const NAV_ORDER: NavKey[] = ['about', 'gallery', 'gains', 'journey', 'team', 'join'];

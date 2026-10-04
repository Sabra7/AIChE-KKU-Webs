import type { DualDate } from '@/lib/dates';

interface Photo {
  src: string;
  captionAr: string;
  captionEn: string;

  term?: { ar: string; en: string; date: DualDate };

  wide?: boolean;
}

const TERM_1: Photo['term'] = {
  ar: 'الفصل الأول',
  en: 'Term 1',
  date: { greg: '2025', hijri: '1447' },
};
const TERM_2: Photo['term'] = {
  ar: 'الفصل الثاني',
  en: 'Term 2',
  date: { greg: '2026', hijri: '1447' },
};

export const aboutPhoto: Photo = {
  src: '/gallery/g1.jpg',
  captionAr: 'المعرض التعريفي للطلاب المستجدين، مركز المعارض والمؤتمرات',
  captionEn: 'Freshman orientation expo, Exhibitions & Conferences Centre',
};

export const targetsPhoto: Photo = {
  src: '/gallery/g9.jpg',
  captionAr: 'تنظيم اللقاء التعريفي للهيئة السعودية للمهندسين، قاعة الندوات',
  captionEn: 'Saudi Council of Engineers orientation session, Seminar hall',
};

export const gallery: Photo[] = [
  {
    src: '/gallery/g5.jpg',
    captionAr: 'معرض الكيانات الطلابية، شطر الطلاب',
    captionEn: 'Student-body expo, Male section',
    term: TERM_2,
    wide: true,
  },
  {
    src: '/gallery/g2.jpg',
    captionAr: 'معرض الكيانات الهندسية الطلابية، كلية الهندسة',
    captionEn: 'Engineering student-body expo, College of Engineering',
    term: TERM_1,
  },
  {
    src: '/gallery/g7.jpg',
    captionAr: 'تغطية إعلامية لمشاريع تخرج طلاب كلية الهندسة',
    captionEn: 'Media coverage of engineering graduation projects',
    term: TERM_1,
  },
  {
    src: '/gallery/g4.jpg',
    captionAr: 'معرض الكيانات الطلابية، شطر الطلاب',
    captionEn: 'Student-body expo, Male section',
    term: TERM_2,
  },
  {
    src: '/gallery/g3.jpg',
    captionAr: 'معرض الكيانات الطلابية، شطر الطالبات، كلية الهندسة',
    captionEn: 'Student-body expo, Female section, College of Engineering',
  },
  {
    src: '/gallery/g8.jpg',
    captionAr: 'المشاركة في مؤتمر حلول الاستدامة، مركز المعارض والمؤتمرات',
    captionEn: 'Sustainable solutions conference, Exhibitions & Conferences Centre',
  },
  {
    src: '/gallery/g6.jpg',
    captionAr: 'معرض الكيانات الطلابية، شطر الطلاب',
    captionEn: 'Student-body expo, Male section',
    term: TERM_2,
  },
];

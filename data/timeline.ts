import type { DualDate } from '@/lib/dates';

interface Milestone {
  id: string;

  date?: DualDate;
  labelAr: string;
  labelEn: string;
  titleAr: string;
  titleEn: string;

  titleDate?: DualDate;
  bodyAr: string;
  bodyEn: string;

  next?: boolean;
}

export const timeline: Milestone[] = [
  {
    id: 'chartered',

    date: { greg: '2021', hijri: '1442' },
    labelAr: '2021',
    labelEn: '2021',
    titleAr: 'الاعتماد الرسمي',
    titleEn: 'Officially chartered',
    bodyAr: 'اعتماد الجامعة فرعًا طلابيًا لـ AIChE في يوليو 2021م الموافق 1442هـ.',
    bodyEn: 'The university achieved AIChE Student Chapter status in July 2021 (1442 AH).',
  },
  {
    id: 'seesc',

    date: { greg: '2025', hijri: '1446/1447' },
    labelAr: '2025',
    labelEn: '2025',
    titleAr: 'مؤتمر الحلول المستدامة',
    titleEn: 'Sustainable solutions conference',
    bodyAr: 'المشاركة في مؤتمر الحلول المستدامة في الطاقة والبيئة SEESC 2025.',
    bodyEn:
      'Participation in the Sustainable Energy and Environmental Solutions Conference, SEESC 2025.',
  },
  {
    id: 'recognition',

    date: { greg: '2025/2026', hijri: '1447' },
    labelAr: '1447',
    labelEn: '1447 AH',
    titleAr: 'شكر من عمادة الكلية',
    titleEn: 'Recognised by the College',
    bodyAr: 'شهادات شكر وتقدير من عميد كلية الهندسة عن الجهود في تنظيم الفعاليات.',
    bodyEn:
      'Certificates of appreciation from the Dean of the College of Engineering for event organisation.',
  },
  {
    id: 'next',
    labelAr: 'العام القادم',
    labelEn: 'Next year',
    titleAr: 'خطة',
    titleEn: 'Plan for',

    titleDate: { greg: '2026/2027', hijri: '1448' },
    bodyAr: 'من أهداف الخطة: تطوير هيكلة الفرع، وزيادة مشاركة الطلاب، وشراكات مع القطاع الصناعي.',
    bodyEn:
      "The plan's aims include restructuring the chapter, more student involvement, and partnerships with industry.",
    next: true,
  },
];

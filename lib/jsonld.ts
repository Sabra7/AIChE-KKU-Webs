import { homeHref, pick, type Lang } from '@/lib/i18n';
import { site, siteUrl, socials } from '@/data/site';

export function organizationJsonLd(lang: Lang) {
  const [university, city] = pick(lang, site.universityAr, site.universityEn).split(/[،,]\s*/);

  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: pick(lang, site.nameAr, site.nameEn),
    alternateName: pick(lang, site.nameEn, site.nameAr),

    url: `${siteUrl}${homeHref(lang)}`.replace(/\/$/, ''),
    logo: `${siteUrl}/logo/logo-full.png`,
    slogan: site.tagline,
    foundingDate: String(site.founded),
    department: {
      '@type': 'EducationalOrganization',
      name: pick(lang, site.departmentAr, site.departmentEn),
    },
    parentOrganization: { '@type': 'CollegeOrUniversity', name: university },
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressCountry: pick(lang, 'المملكة العربية السعودية', 'Saudi Arabia'),
    },
    sameAs: Object.values(socials),
  };
}

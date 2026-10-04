import type { CSSProperties } from 'react';

import { pick, type Lang } from '@/lib/i18n';
import { ui } from '@/lib/ui';
import { SocialMark, type SocialKey } from '@/lib/socials';
import { contact, registrationOpen, socials } from '@/data/site';
import JoinButton from './JoinButton';
import StaggerList from './StaggerList';

type Row = { key: SocialKey; name: string; detail: string; href: string; external: boolean };

function handleOf(key: SocialKey, url: string, lang: Lang): string {
  if (key === 'whatsapp') return pick(lang, ui.waGroupAr, ui.waGroupEn);
  const last = new URL(url).pathname.split('/').filter(Boolean).pop() ?? '';
  return key === 'x' ? `@${last}` : last;
}

export default function Join({ lang }: { lang: Lang }) {
  const names = lang === 'ar' ? ui.channelsAr : ui.channelsEn;
  const place = pick(lang, contact.placeAr, contact.placeEn);
  const replyTime = pick(lang, contact.replyTimeAr, contact.replyTimeEn);

  const socialRows: Row[] = (Object.entries(socials) as Array<[SocialKey, string]>)
    .filter(([, url]) => url)
    .map(([key, url]) => ({
      key,
      name: names[key as keyof typeof names],
      detail: handleOf(key, url, lang),
      href: url,
      external: true,
    }));
  const emailRow: Row[] = contact.email
    ? [
        {
          key: 'email',
          name: names.email,
          detail: contact.email,
          href: `mailto:${contact.email}`,
          external: false,
        },
      ]
    : [];
  const mapsRow: Row[] =
    contact.mapsUrl && place
      ? [{ key: 'maps', name: names.maps, detail: place, href: contact.mapsUrl, external: true }]
      : [];

  const rows: Row[] = [
    ...socialRows.filter((row) => row.key === 'whatsapp'),
    ...emailRow,
    ...socialRows.filter((row) => row.key !== 'whatsapp'),
    ...mapsRow,
  ];

  return (
    <section className="sect join" id="join">
      <div className="shell join__in">
        <div className="join__lead">
          <h2>{pick(lang, 'التسجيل والتواصل', 'Join and contact')}</h2>
          <p className="join__status">
            {registrationOpen
              ? pick(
                  lang,
                  'العضوية مفتوحة لطلاب جامعة الملك خالد من كل التخصصات، ولا تُشترط خبرة سابقة. التسجيل عبر نموذج Google.',
                  'Membership is open to King Khalid University students from any major, and no experience is needed. You sign up through a Google Form.',
                )
              : pick(
                  lang,
                  'التسجيل مغلق حاليًا، ونعلن موعد فتحه في حساباتنا.',
                  'Registration is closed for now. We announce when it opens on our accounts.',
                )}
          </p>
          {registrationOpen && <JoinButton lang={lang} size="lg" />}
          <p className="join__more">
            <strong>{pick(lang, 'للتواصل والشراكات', 'Contact and partnerships')}</strong>
            {pick(
              lang,
              'الحسابات والإيميل ليست للتسجيل فقط. راسلنا عليها لأي سؤال أو تعاون أو رعاية.',
              'Our accounts and email are not only for joining. Message us there with any question, collaboration or sponsorship.',
            )}
          </p>
          {replyTime && <p className="join__note">{replyTime}</p>}
        </div>

        <StaggerList className="clist">
          {rows.map((row, i) => (
            <li key={row.key} style={{ '--i': i } as CSSProperties}>
              <a
                href={row.href}
                {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span className="clist__ico" aria-hidden="true">
                  <SocialMark name={row.key} size={20} />
                </span>
                <span className="clist__txt">
                  <span className="clist__name">{row.name}</span>
                  <span
                    className="clist__detail"
                    dir={row.key === 'maps' || row.key === 'whatsapp' ? undefined : 'ltr'}
                  >
                    {row.detail}
                  </span>
                </span>
                <span className="clist__go" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}

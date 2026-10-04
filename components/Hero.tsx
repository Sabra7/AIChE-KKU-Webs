import Link from 'next/link';

import { challengeHref, pick, type Lang } from '@/lib/i18n';
import ChemField from './ChemField';
import JoinButton from './JoinButton';
import { registrationOpen } from '@/data/site';
import { ui } from '@/lib/ui';

export default function Hero({ lang }: { lang: Lang }) {
  return (
    <section className="hero" id="top">
      <ChemField variant="hero" />

      <div className="shell hero__in">
        <h1>
          {pick(
            lang,
            'فرع AIChE في جامعة الملك خالد',
            'The AIChE student chapter at King Khalid University',
          )}
        </h1>

        <p className="hero__lead">
          {pick(
            lang,
            'الفرع الطلابي للمعهد الأمريكي للمهندسين الكيميائيين في قسم الهندسة الكيميائية بأبها.',
            "The American Institute of Chemical Engineers' student chapter in the Chemical Engineering Department, Abha.",
          )}
        </p>

        <div className="hero__cta">
          <div className="hero__btns">
            <JoinButton lang={lang} />
            {registrationOpen && (
              <a className="btn btn--ghost soft-blur" href="#join">
                {pick(lang, ui.contactCtaAr, ui.contactCtaEn)}
              </a>
            )}
            <Link className="btn btn--ghost soft-blur" href={challengeHref(lang)}>
              {pick(lang, ui.challengeCtaAr, ui.challengeCtaEn)}
            </Link>
          </div>
          <span className="hero__meta">
            {registrationOpen
              ? pick(
                  lang,
                  'التسجيل مفتوح لجميع طلاب جامعة الملك خالد',
                  'Open to all King Khalid University students',
                )
              : pick(lang, 'التسجيل مغلق حاليًا', 'Registration is closed for now')}
          </span>
        </div>
      </div>
    </section>
  );
}

import Image from 'next/image';

import { pick, type Lang } from '@/lib/i18n';
import { targetsPhoto } from '@/data/gallery';
import { achievements, targets } from '@/data/targets';
import DualDate from './DualDate';

const PLAN_YEAR = { greg: '2026/2027', hijri: '1448' };

const CHARTER_YEAR = { greg: '2021', hijri: '1442' };

export default function Targets({ lang }: { lang: Lang }) {
  const caption = pick(lang, targetsPhoto.captionAr, targetsPhoto.captionEn);

  return (
    <section className="targets" id="targets">
      <div className="targets__bg">
        <Image
          src={targetsPhoto.src}
          alt={caption}
          fill
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className="shell targets__in">
        <div className="targets__panel soft-blur">
          <h2>
            {pick(lang, 'أهداف العام ', 'Targets for ')}
            <DualDate lang={lang} date={PLAN_YEAR} inline />
          </h2>
          <p className="targets__intro">
            {pick(
              lang,
              'من الخطة الرئاسية للفرع. هذه أرقام نعمل للوصول إليها خلال العام، وليست نتائج.',
              "From the chapter president's plan. These are figures we are working towards this year, not results.",
            )}
          </p>

          <ol className="targets__list">
            {targets.map((figure) => (
              <li key={figure.labelEn + figure.value}>
                <span className="targets__v num">{figure.value}</span>
                <span className="targets__l">{pick(lang, figure.labelAr, figure.labelEn)}</span>
              </li>
            ))}
          </ol>

          <p className="targets__foot">
            {pick(lang, 'المنجز منذ ', 'Done since ')}
            <DualDate lang={lang} date={CHARTER_YEAR} inline />
            {': '}
            {achievements.map((item, i) => (
              <span key={item.labelEn}>
                {i > 0 && ' · '}
                <span className="num">{item.value}</span> {pick(lang, item.labelAr, item.labelEn)}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

import Image from 'next/image';

import { pick, type Lang } from '@/lib/i18n';
import { SocialMark, SOCIAL_LABELS, type SocialKey } from '@/lib/socials';
import { partners } from '@/data/partners';
import Reveal from './Reveal';

export default function Partners({ lang }: { lang: Lang }) {
  return (
    <section className="sect" id="partners">
      <div className="shell">
        <Reveal className="sect__head">
          <h2>{pick(lang, 'الشركاء', 'Partners')}</h2>
        </Reveal>

        <div className="prt">
          {partners.map((partner) => {
            const name = pick(lang, partner.nameAr, partner.nameEn);
            const links = Object.entries(partner.links ?? {}) as Array<[SocialKey, string]>;
            return (
              <article className="prt__item" key={partner.id}>
                <div className="prt__logo">
                  <Image src={partner.logo} alt={name} fill sizes="280px" />
                </div>
                <p className="prt__name">{name}</p>

                {links.length > 0 && (
                  <div className="prt__links">
                    {links.map(([key, url]) => (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${SOCIAL_LABELS[key]}, ${name}`}
                      >
                        <SocialMark name={key} />
                      </a>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

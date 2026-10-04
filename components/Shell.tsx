import type { ReactNode } from 'react';

import { dirOf, pick, type Lang } from '@/lib/i18n';
import { fontVars } from '@/lib/fonts';
import { ui } from '@/lib/ui';
import { ChemDefs } from './ChemField';
import ChemPause from './ChemPause';
import Footer from './Footer';
import Header from './Header';
import MobileCta from './MobileCta';
import HeroParallax from './HeroParallax';
import { IconSprite } from './Icon';

function serialiseJsonLd(data: object) {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}

export default function Shell({
  lang,
  jsonLd,
  children,
}: {
  lang: Lang;

  jsonLd?: object;
  children: ReactNode;
}) {
  return (
    <html lang={lang} dir={dirOf(lang)} className={fontVars}>
      <body>
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serialiseJsonLd(jsonLd) }}
          />
        )}

        <a className="skip" href="#main">
          {pick(lang, ui.skipAr, ui.skipEn)}
        </a>

        <IconSprite />
        <ChemDefs />
        <Header lang={lang} />

        <main id="main" tabIndex={-1}>
          {children}
        </main>

        <Footer lang={lang} />
        <MobileCta lang={lang} />

        <ChemPause />
        <HeroParallax />
      </body>
    </html>
  );
}

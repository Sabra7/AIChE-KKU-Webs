import type { Lang } from '@/lib/i18n';
import About from './About';
import Gains from './Gains';
import Gallery from './Gallery';
import Hero from './Hero';
import Join from './Join';
import Journey from './Journey';
import Partners from './Partners';
import Targets from './Targets';
import Team from './Team';

export default function HomeSections({ lang }: { lang: Lang }) {
  return (
    <>
      <Hero lang={lang} />
      <About lang={lang} />
      <Gallery lang={lang} />
      <Gains lang={lang} />
      <Targets lang={lang} />

      <Journey lang={lang} />
      <Team lang={lang} />
      <Partners lang={lang} />
      <Join lang={lang} />
    </>
  );
}

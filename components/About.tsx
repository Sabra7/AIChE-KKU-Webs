import Image from 'next/image';

import { pick, type Lang } from '@/lib/i18n';
import { aboutPhoto } from '@/data/gallery';
import DualDate from './DualDate';
import Reveal from './Reveal';

const CHARTER = { greg: '2021', hijri: '1442' };

export default function About({ lang }: { lang: Lang }) {
  const caption = pick(lang, aboutPhoto.captionAr, aboutPhoto.captionEn);

  return (
    <section className="sect about" id="about">
      <div className="shell about__grid">
        <figure className="about__ph">
          <div className="about__frame">
            <Image
              src={aboutPhoto.src}
              alt={caption}
              fill
              sizes="(max-width: 860px) 100vw, 640px"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <figcaption>{caption}</figcaption>
        </figure>

        <Reveal className="about__txt">
          <h2>{pick(lang, 'عن الفرع', 'About the chapter')}</h2>
          {lang === 'ar' ? (
            <>
              <p>
                فرع طلابي تابع للمعهد الأمريكي للمهندسين الكيميائيين (AIChE)، في قسم الهندسة
                الكيميائية بجامعة الملك خالد في أبها. اعتمده المعهد فرعًا رسميًا في يوليو{' '}
                <DualDate lang={lang} date={CHARTER} inline /> ضمن منطقته الدولية.
              </p>
              <p>
                يديره طلاب من القسم. ننظّم ورشًا ودورات تقنية وزيارات صناعية، ونشارك في معارض كلية
                الهندسة ومؤتمراتها في شطري الطلاب والطالبات.
              </p>
            </>
          ) : (
            <>
              <p>
                A student chapter of the American Institute of Chemical Engineers (AIChE), based in
                the Chemical Engineering Department at King Khalid University in Abha. AIChE
                chartered it in July <DualDate lang={lang} date={CHARTER} inline />, within its
                International Region.
              </p>
              <p>
                Students from the department run it. We organise technical workshops, courses and
                industry visits, and take part in the College of Engineering&apos;s expos and
                conferences in both the male and female sections.
              </p>
            </>
          )}

          <dl className="about__facts">
            <div>
              <dt>{pick(lang, 'الجهة', 'Organisation')}</dt>
              <dd>
                {pick(
                  lang,
                  'المعهد الأمريكي للمهندسين الكيميائيين، المنطقة الدولية',
                  'American Institute of Chemical Engineers, International Region',
                )}
              </dd>
            </div>
            <div>
              <dt>{pick(lang, 'القسم', 'Department')}</dt>
              <dd>
                {pick(
                  lang,
                  'الهندسة الكيميائية، كلية الهندسة، جامعة الملك خالد',
                  'Chemical Engineering, College of Engineering, King Khalid University',
                )}
              </dd>
            </div>
            <div>
              <dt>{pick(lang, 'الاعتماد', 'Chartered')}</dt>
              <dd>
                {pick(lang, 'يوليو ', 'July ')}
                <DualDate lang={lang} date={CHARTER} inline />
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

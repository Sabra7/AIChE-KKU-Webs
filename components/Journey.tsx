import { pick, type Lang } from '@/lib/i18n';
import { timeline } from '@/data/timeline';
import DualDate from './DualDate';
import Reveal from './Reveal';

export default function Journey({ lang }: { lang: Lang }) {
  return (
    <section className="sect" id="journey">
      <div className="shell">
        <Reveal className="sect__head">
          <h2>{pick(lang, 'محطات الفرع', 'Milestones')}</h2>
        </Reveal>

        <ol className="tl">
          {timeline.map((milestone) => (
            <li key={milestone.id} className={`tl__i${milestone.next ? ' tl__i--next' : ''}`}>
              <span className="tl__y">
                {milestone.date ? (
                  <DualDate lang={lang} date={milestone.date} />
                ) : (
                  pick(lang, milestone.labelAr, milestone.labelEn)
                )}
              </span>
              <h3>
                {pick(lang, milestone.titleAr, milestone.titleEn)}
                {milestone.titleDate && (
                  <>
                    {' '}
                    <DualDate lang={lang} date={milestone.titleDate} inline />
                  </>
                )}
              </h3>
              <p>{pick(lang, milestone.bodyAr, milestone.bodyEn)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

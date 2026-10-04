'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

import { pick, type Lang } from '@/lib/i18n';
import ChemField from './ChemField';
import { Icon, type IconName } from './Icon';
import Num from './Num';
import Reveal from './Reveal';

interface Gain {
  icon: IconName;
  titleAr: string;
  titleEn: string;
  descAr: ReactNode;
  descEn: ReactNode;
}

const GAINS: Gain[] = [
  {
    icon: 'helmet',
    titleAr: 'القيادة',
    titleEn: 'Leadership',
    descAr: 'تتولى مسؤولية في إحدى لجان الفرع وتديرها مع فريقك.',
    descEn: "You take on a role in one of the chapter's committees and run it with your team.",
  },
  {
    icon: 'flask',
    titleAr: 'البحث',
    titleEn: 'Research',
    descAr: 'تعمل على ملصق بحثي وتعرضه في معارض الكلية.',
    descEn: "You work on a research poster and present it at the College's expos.",
  },
  {
    icon: 'bond',
    titleAr: 'العضوية الدولية',
    titleEn: 'AIChE membership',
    descAr: (
      <>
        تنضم إلى AIChE، ولها أعضاء في أكثر من <Num>110</Num> دولة.
      </>
    ),
    descEn: (
      <>
        You join AIChE, which has members in more than <Num>110</Num> countries.
      </>
    ),
  },
  {
    icon: 'gear',
    titleAr: 'التنظيم',
    titleEn: 'Events',
    descAr: 'تشارك في تنظيم المعارض واللقاءات المهنية التي يقيمها الفرع.',
    descEn: 'You help organise the expos and professional sessions the chapter holds.',
  },
  {
    icon: 'signal',
    titleAr: 'العرض',
    titleEn: 'Presenting',
    descAr: 'تشرح مواضيع هندسية لزوّار المعارض وحضور الورش.',
    descEn: 'You explain engineering topics to visitors at expos and workshops.',
  },
  {
    icon: 'sprout',
    titleAr: 'التعلّم',
    titleEn: 'Learning',
    descAr: 'شهادات في سلامة العمليات، ومكتبة AIChE التقنية المتاحة للأعضاء.',
    descEn: "Process-safety certificates and AIChE's technical library for members.",
  },
];

function Chevron({ points }: { points: 'start' | 'end' }) {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
      <path
        d={points === 'start' ? 'M10 2.5 4.5 8 10 13.5' : 'M6 2.5 11.5 8 6 13.5'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const twoDigits = (n: number) => String(n).padStart(2, '0');

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function nearestToCentre(list: HTMLElement) {
  const listBox = list.getBoundingClientRect();
  const listCentre = listBox.left + listBox.width / 2;
  let nearestIndex = 0;
  let nearestDistance = Infinity;
  Array.from(list.children).forEach((card, i) => {
    const cardBox = card.getBoundingClientRect();
    const distance = Math.abs(cardBox.left + cardBox.width / 2 - listCentre);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = i;
    }
  });
  return nearestIndex;
}

export default function Gains({ lang }: { lang: Lang }) {
  const listRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const [swiped, setSwiped] = useState(false);
  const [active, setActive] = useState(0);

  const isRtl = lang === 'ar';
  const lastIndex = GAINS.length - 1;

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    let frameId = 0;
    const measure = () => {
      frameId = 0;
      setActive(nearestToCentre(list));

      const maxScroll = list.scrollWidth - list.clientWidth;
      const travelled = Math.abs(list.scrollLeft);
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${maxScroll > 0 ? Math.min(1, travelled / maxScroll) : 0})`;
      }

      if (travelled > 8) setSwiped(true);
    };
    const schedule = () => {
      if (!frameId) frameId = requestAnimationFrame(measure);
    };

    measure();
    list.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frameId);
      list.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const scrollToCard = (index: number) => {
    const list = listRef.current;
    const card = list?.children[index];
    if (!list || !card) return;
    const listBox = list.getBoundingClientRect();
    const cardBox = card.getBoundingClientRect();
    list.scrollBy({
      left: cardBox.left + cardBox.width / 2 - (listBox.left + listBox.width / 2),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  return (
    <section className="gains" id="gains">
      <div className="gains__body">
        <ChemField variant="gains" />

        <div className="shell gains__stage">
          <Reveal className="sect__head">
            <h2>{pick(lang, 'ماذا يقدّم الفرع لأعضائه', 'What the chapter offers members')}</h2>
          </Reveal>

          <p className={`gains__swipe${swiped ? ' is-done' : ''}`} aria-hidden="true">
            <i className="gains__swipe-arrow">
              <Chevron points={isRtl ? 'start' : 'end'} />
            </i>
            <span>{pick(lang, 'اسحب لعرض البقية', 'Swipe to see the rest')}</span>
          </p>

          <ul className="gainlist" ref={listRef}>
            {GAINS.map((gain, i) => (
              <li
                className={`gain soft-blur soft-blur--card${i === active ? ' on' : ''}`}
                key={gain.icon}
              >
                <div className="gain__in">
                  <span className="gain__n" aria-hidden="true">
                    {twoDigits(i + 1)}
                  </span>
                  <Icon name={gain.icon} className="gain__i" />
                  <h3 className="gain__w">{pick(lang, gain.titleAr, gain.titleEn)}</h3>
                  <p className="gain__d">{lang === 'ar' ? gain.descAr : gain.descEn}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="gains__foot">
            <div className="gains__rule">
              <i ref={barRef} />
            </div>
            <span className="gains__count" aria-hidden="true">
              <Num>{twoDigits(active + 1)}</Num>
              <i>/</i>
              <Num>{twoDigits(GAINS.length)}</Num>
            </span>

            <div className="gains__nav">
              <button
                type="button"
                onClick={() => scrollToCard(active - 1)}
                disabled={active === 0}
                aria-label={pick(lang, 'البطاقة السابقة', 'Previous card')}
              >
                <Chevron points={isRtl ? 'end' : 'start'} />
              </button>
              <button
                type="button"
                onClick={() => scrollToCard(active + 1)}
                disabled={active === lastIndex}
                aria-label={pick(lang, 'البطاقة التالية', 'Next card')}
              >
                <Chevron points={isRtl ? 'start' : 'end'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

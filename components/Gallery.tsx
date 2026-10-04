'use client';

import Image from 'next/image';
import { useEffect, useRef, type CSSProperties } from 'react';

import { pick, type Lang } from '@/lib/i18n';
import { gallery } from '@/data/gallery';
import DualDate from './DualDate';
import Reveal from './Reveal';

const ORBIT_TILTS = [0, 60, -60];
const ATOM_BOX = 76;

function Atom() {
  return (
    <span className="chain__atom" aria-hidden="true">
      {ORBIT_TILTS.map((tilt, index) => (
        <span
          key={tilt}
          className={index === 1 ? 'chem__shell chem__shell--rev' : 'chem__shell'}
          style={{ '--i': index } as CSSProperties}
        >
          <svg viewBox={`${-ATOM_BOX / 2} ${-ATOM_BOX / 2} ${ATOM_BOX} ${ATOM_BOX}`}>
            <g transform={`rotate(${tilt})`}>
              <ellipse className="chain__orbit" rx="34" ry="14.5" />
              <circle className="chem__e" cx="34" cy="0" r="2.9" />
              <circle className="chem__e" cx="-34" cy="0" r="2.9" />
            </g>
          </svg>
        </span>
      ))}
      <span className="chain__nucleus" />
    </span>
  );
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export default function Gallery({ lang }: { lang: Lang }) {
  const chainRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const chain = chainRef.current;
    if (!chain) return;
    const items = Array.from(chain.querySelectorAll<HTMLElement>('.chain__item'));
    const atoms = items.map(
      (item) => [item, item.querySelector<HTMLElement>('.chain__atom') ?? item] as const,
    );

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      chain.style.setProperty('--spine-progress', '1');
      items.forEach((item) => item.style.setProperty('--item-progress', '1'));
      return;
    }

    let frameId = 0;
    const update = () => {
      frameId = 0;
      const viewportHeight = window.innerHeight;
      const marker = viewportHeight * 0.62;
      const chainBox = chain.getBoundingClientRect();
      chain.style.setProperty(
        '--spine-progress',
        clamp01((marker - chainBox.top) / chainBox.height).toFixed(4),
      );
      const range = viewportHeight * 0.24;
      for (const [item, atom] of atoms) {
        const atomBox = atom.getBoundingClientRect();
        const atomCentre = atomBox.top + atomBox.height / 2;
        const progress = clamp01((marker + range / 2 - atomCentre) / range);
        item.style.setProperty('--item-progress', progress.toFixed(3));
      }
    };
    const schedule = () => {
      if (!frameId) frameId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <section className="sect sect--tint" id="gallery">
      <div className="shell">
        <Reveal className="sect__head">
          <h2>{pick(lang, 'صور من نشاطات الفرع', 'Photos from our events')}</h2>
        </Reveal>

        <ol className="chain" ref={chainRef}>
          <li className="chain__spine" aria-hidden="true">
            <i />
          </li>
          {gallery.map((photo, index) => {
            const caption = pick(lang, photo.captionAr, photo.captionEn);
            return (
              <li
                key={photo.src}
                className={`chain__item ${index % 2 ? 'chain__item--end' : 'chain__item--start'}`}
              >
                <Atom />
                <span className="chain__bond" aria-hidden="true" />
                <figure className="chain__photo">
                  <div className="chain__frame">
                    <Image
                      src={photo.src}
                      alt={caption}
                      fill
                      sizes="(max-width: 767px) 85vw, 480px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <figcaption>
                    {caption}
                    {photo.term && (
                      <span className="chain__term">
                        {pick(lang, photo.term.ar, photo.term.en)}{' '}
                        <DualDate lang={lang} date={photo.term.date} inline />
                      </span>
                    )}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

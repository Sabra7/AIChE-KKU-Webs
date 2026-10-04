'use client';

import { useEffect, useState } from 'react';

import type { Lang } from '@/lib/i18n';
import JoinButton from './JoinButton';

export default function MobileCta({ lang }: { lang: Lang }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('top');
    const join = document.getElementById('join');
    if (!hero || !join) return;

    let frameId = 0;
    const check = () => {
      frameId = 0;
      const pastHero = hero.getBoundingClientRect().bottom < 0;
      const beforeJoin = join.getBoundingClientRect().top > window.innerHeight;
      setShown(pastHero && beforeJoin);
    };
    const schedule = () => {
      if (!frameId) frameId = requestAnimationFrame(check);
    };

    check();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <div className={`mcta soft-blur${shown ? ' on' : ''}`} inert={!shown}>
      <JoinButton lang={lang} />
    </div>
  );
}

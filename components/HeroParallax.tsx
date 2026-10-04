'use client';

import { useEffect } from 'react';

const PARALLAX_RATE = 0.25;

export default function HeroParallax() {
  useEffect(() => {
    const heroField = document.querySelector<HTMLElement>('.chem--hero');
    if (!heroField) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const desktopQuery = window.matchMedia('(min-width: 861px) and (pointer: fine)');

    let frameId = 0;
    const update = () => {
      frameId = 0;
      const shift = desktopQuery.matches
        ? Math.min(window.scrollY, window.innerHeight) * PARALLAX_RATE
        : 0;
      heroField.style.translate = `0 ${shift.toFixed(1)}px`;
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

  return null;
}

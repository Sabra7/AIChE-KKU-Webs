'use client';

import { useEffect } from 'react';

export default function ChemPause() {
  useEffect(() => {
    const fields = document.querySelectorAll<HTMLElement>('.chem');
    if (!fields.length || !('IntersectionObserver' in window)) return;

    const visibilityObserver = new IntersectionObserver((entries) => {
      for (const entry of entries)
        entry.target.classList.toggle('is-paused', !entry.isIntersecting);
    });
    fields.forEach((field) => visibilityObserver.observe(field));
    return () => visibilityObserver.disconnect();
  }, []);

  return null;
}

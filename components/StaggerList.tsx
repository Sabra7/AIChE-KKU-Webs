'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export default function StaggerList({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (list.getBoundingClientRect().top < window.innerHeight) return;

    list.classList.add('is-armed');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        list.classList.add('is-in');
        observer.disconnect();
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <ul className={className} ref={ref}>
      {children}
    </ul>
  );
}

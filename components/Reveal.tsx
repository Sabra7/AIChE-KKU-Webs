'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

let sharedObserver: IntersectionObserver | null = null;

function getObserver() {
  if (typeof window === 'undefined') return null;
  if (sharedObserver) return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
  );
  return sharedObserver;
}

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

export default function Reveal({ children, as: Tag = 'div', className = '' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.classList.add('in');
      return;
    }

    const observer = getObserver();
    observer?.observe(element);
    return () => observer?.unobserve(element);
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { challengeHref, homeHref, otherLang, pick, type Lang } from '@/lib/i18n';
import { NAV_ORDER, ui } from '@/lib/ui';

export default function Header({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const nav = lang === 'ar' ? ui.navAr : ui.navEn;
  const progressRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    let frameId = 0;
    const paint = () => {
      frameId = 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0})`;
      }
    };
    const onScroll = () => {
      setStuck(window.scrollY > 12);
      if (!frameId) frameId = requestAnimationFrame(paint);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    const sections = NAV_ORDER.map((key) => document.getElementById(key)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!sections.length) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((section) => sectionObserver.observe(section));
    return () => sectionObserver.disconnect();
  }, []);

  const swapTo = otherLang(lang);
  const challengeRoot = challengeHref(lang);
  const onChallenge = pathname === challengeRoot || pathname.startsWith(`${challengeRoot}/`);
  const swapHref = onChallenge
    ? challengeHref(swapTo) + pathname.slice(challengeRoot.length)
    : homeHref(swapTo);
  const sectionHref = (key: string) => (onChallenge ? `${homeHref(lang)}#${key}` : `#${key}`);

  return (
    <header className={`hdr${stuck ? ' stuck' : ''}`}>
      <div className="hdr__bg soft-blur" aria-hidden="true" />
      <div className="hdr__progress" aria-hidden="true">
        <i ref={progressRef} />
      </div>
      <div className="shell hdr__in">
        <Link className="brand" href={homeHref(lang)}>
          <Image
            className="brand__mark"
            src="/logo/logo-mark.png"
            alt=""
            width={31}
            height={34}
            priority
          />
          <span className="brand__txt">
            AIChE<span className="brand__dot">·</span>KKU
          </span>
        </Link>

        <nav
          id="site-nav"
          className={`nav soft-blur${open ? ' open' : ''}`}
          aria-label={pick(lang, 'التنقل الرئيسي', 'Main navigation')}
        >
          {NAV_ORDER.map((key) => (
            <a
              key={key}
              href={sectionHref(key)}
              onClick={() => setOpen(false)}
              aria-current={active === key ? 'true' : undefined}
            >
              {nav[key]}
            </a>
          ))}
        </nav>

        <Link
          className="langbtn"
          href={swapHref}
          hrefLang={swapTo}
          lang={swapTo}
          aria-label={pick(lang, 'Switch to English', 'التبديل إلى العربية')}
        >
          {lang === 'ar' ? 'EN' : 'ع'}
        </Link>

        <button
          className="burger"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={pick(lang, ui.menuAr, ui.menuEn)}
          onClick={() => setOpen((isOpen) => !isOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

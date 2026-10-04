import { pick, type Lang } from '@/lib/i18n';
import { ui } from '@/lib/ui';
import { joinUrl, registrationOpen } from '@/data/site';

export default function JoinButton({ lang, size = 'md' }: { lang: Lang; size?: 'md' | 'lg' }) {
  const external = registrationOpen
    ? { href: joinUrl, target: '_blank', rel: 'noopener noreferrer' }
    : { href: '#join' };

  return (
    <a className={`btn${size === 'lg' ? ' btn--lg' : ''}`} {...external}>
      <span>
        {registrationOpen
          ? pick(lang, ui.joinCtaAr, ui.joinCtaEn)
          : pick(lang, ui.followCtaAr, ui.followCtaEn)}
      </span>
      <span className="btn__ico" aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <path
            d="M2 8h11M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  );
}

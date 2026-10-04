'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { pick, type Lang } from '@/lib/i18n';
import { SocialMark, SOCIAL_LABELS, type SocialKey } from '@/lib/socials';
import { ui } from '@/lib/ui';
import { committees, leadership, supervisor, type Member } from '@/data/team';
import Reveal from './Reveal';

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('');

function MemberCard({
  member,
  lang,
  open,
  onToggle,
  pointer,
}: {
  member: Member;
  lang: Lang;
  open: boolean;

  onToggle: (id: string | null) => void;

  pointer: boolean;
}) {
  if (member.soon) {
    return (
      <article className="card">
        <div className="card__ph card__ph--soon">{pick(lang, ui.soonAr, ui.soonEn)}</div>
        <h3>{pick(lang, member.nameAr, member.nameEn)}</h3>
        <p className="card__role">{pick(lang, ui.soonAr, ui.soonEn)}</p>
      </article>
    );
  }

  const name = pick(lang, member.nameAr, member.nameEn);
  const bio = pick(lang, member.bioAr ?? '', member.bioEn ?? '');
  const links = Object.entries(member.links) as Array<[SocialKey, string]>;

  return (
    <article className={`card${open ? ' open' : ''}`}>
      <div className="card__fig">
        <div
          className="card__ph"
          tabIndex={bio && pointer ? 0 : undefined}
          role={bio && pointer ? 'group' : undefined}
          aria-label={bio && pointer ? name : undefined}
          aria-describedby={bio && pointer ? `bio-${member.id}` : undefined}
        >
          {member.photo ? (
            <Image
              src={member.photo}
              alt={`${name}, ${pick(lang, member.roleAr, member.roleEn)}`}
              fill
              sizes="(max-width: 700px) 50vw, (max-width: 1000px) 33vw, 25vw"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <span className="card__initials">{initialsOf(member.nameEn)}</span>
          )}
        </div>

        <div className="card__plate soft-blur">
          <h3>{name}</h3>
          <p className="card__role">{pick(lang, member.roleAr, member.roleEn)}</p>
        </div>

        {bio && (
          <p className="card__phBio soft-blur" id={`bio-${member.id}`}>
            {bio}
          </p>
        )}
      </div>

      {member.majorAr && (
        <p className="card__major">{pick(lang, member.majorAr, member.majorEn)}</p>
      )}
      {member.flagAr && (
        <p className="card__flag">{pick(lang, member.flagAr, member.flagEn ?? member.flagAr)}</p>
      )}

      {bio && (
        <div className="card__bio">
          <button
            className="card__bioBtn"
            type="button"
            aria-expanded={open}
            onClick={() => onToggle(open ? null : member.id)}
          >
            <span>{pick(lang, ui.readBioAr, ui.readBioEn)}</span>
            <i className="card__bioChev" aria-hidden="true" />
          </button>
          <div className="card__bioWrap">
            <div className="card__bioClip">
              <p className="card__bioTxt">{bio}</p>
            </div>
          </div>
        </div>
      )}

      {(links.length > 0 || member.code) && (
        <div className="card__links">
          {links.map(([key, url]) => {
            const external = url.startsWith('http');
            return (
              <a
                key={key}
                href={url}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                aria-label={`${SOCIAL_LABELS[key]}, ${name}`}
              >
                <SocialMark name={key} />
              </a>
            );
          })}

          {member.code && (
            <span className="card__code" aria-hidden="true">
              &lt;/&gt;
            </span>
          )}
        </div>
      )}
    </article>
  );
}

export default function Team({ lang }: { lang: Lang }) {
  const [openBio, setOpenBio] = useState<string | null>(null);

  const [pointer, setPointer] = useState(false);

  useEffect(() => {
    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setPointer(finePointerQuery.matches);
    sync();
    finePointerQuery.addEventListener('change', sync);
    return () => finePointerQuery.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!openBio) return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.target instanceof Element && e.target.closest('.card.open')) return;
      setOpenBio(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenBio(null);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openBio]);

  return (
    <section className="sect sect--tint" id="team">
      <div className="shell">
        <Reveal className="sect__head">
          <h2>{pick(lang, 'الفريق', 'Team')}</h2>
        </Reveal>

        <div className="sup">
          <div className="sup__ph">
            <Image
              src={supervisor.photo}
              alt={`${pick(lang, supervisor.nameAr, supervisor.nameEn)}, ${pick(
                lang,
                supervisor.roleAr,
                supervisor.roleEn,
              )}${pick(lang, '، ', ', ')}${pick(lang, supervisor.affiliationAr, supervisor.affiliationEn)}`}
              width={264}
              height={352}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <p className="sup__role">{pick(lang, supervisor.roleAr, supervisor.roleEn)}</p>
            <h3>{pick(lang, supervisor.nameAr, supervisor.nameEn)}</h3>
            <p className="sup__sub">
              {pick(lang, supervisor.affiliationAr, supervisor.affiliationEn)}
            </p>
          </div>
        </div>

        <div className="grp">
          <p className="grp__t">{pick(lang, 'القيادة التنفيذية', 'Executive leadership')}</p>
          <div className="team">
            {leadership.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                lang={lang}
                open={openBio === member.id}
                onToggle={setOpenBio}
                pointer={pointer}
              />
            ))}
          </div>
        </div>

        <div className="grp">
          <p className="grp__t">{pick(lang, 'رؤساء اللجان', 'Committee heads')}</p>
          <div className="team">
            {committees.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                lang={lang}
                open={openBio === member.id}
                onToggle={setOpenBio}
                pointer={pointer}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

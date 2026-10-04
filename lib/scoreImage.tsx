import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

import { QUIZ_LENGTH } from './quiz';

export { QUIZ_LENGTH };
export const SCORE_IMAGE_SIZE = { width: 1200, height: 630 };
export const scoreParams = () =>
  Array.from({ length: QUIZ_LENGTH + 1 }, (_, score) => ({ score: String(score) }));

const BACKGROUND = '#111813';
const SURFACE = '#172019';
const INK = '#EEF2EA';
const INK_2 = '#A8B3A4';
const ACCENT = '#8BCB32';

interface Tier {
  label: string;
  metal: string;
  shade: string;
  trophy: boolean;
}

function tierFor(score: number): Tier {
  if (score >= QUIZ_LENGTH)
    return { label: 'Perfect score', metal: '#F2C94C', shade: '#B8860B', trophy: true };
  if (score >= 8) return { label: 'Gold', metal: '#F2C94C', shade: '#B8860B', trophy: false };
  if (score >= 5) return { label: 'Silver', metal: '#D9DEE3', shade: '#8E979F', trophy: false };
  return { label: 'Bronze', metal: '#D99A6C', shade: '#9A5B34', trophy: false };
}

export const parseScore = (value: string) => {
  const score = Number(value);
  return Number.isInteger(score) && score >= 0 && score <= QUIZ_LENGTH ? score : 0;
};

function Medal({ tier, score }: { tier: Tier; score: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 14, marginBottom: -26 }}>
        <div
          style={{
            display: 'flex',
            width: 70,
            height: 150,
            background: ACCENT,
            transform: 'skewX(18deg)',
            borderRadius: 6,
          }}
        />
        <div
          style={{
            display: 'flex',
            width: 70,
            height: 150,
            background: '#5E8F1F',
            transform: 'skewX(-18deg)',
            borderRadius: 6,
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 280,
          height: 280,
          borderRadius: 140,
          background: tier.metal,
          border: `14px solid ${tier.shade}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 190,
            height: 190,
            borderRadius: 95,
            border: `4px solid ${tier.shade}`,
            color: tier.shade,
            fontSize: 110,
            fontWeight: 700,
          }}
        >
          {score}
        </div>
      </div>
    </div>
  );
}

function Trophy({ tier }: { tier: Tier }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div
          style={{
            display: 'flex',
            width: 70,
            height: 110,
            marginTop: 30,
            marginRight: -18,
            border: `16px solid ${tier.shade}`,
            borderRight: 'none',
            borderRadius: '60px 0 0 60px',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 250,
            height: 230,
            background: tier.metal,
            borderRadius: '0 0 125px 125px',
            border: `10px solid ${tier.shade}`,
            color: tier.shade,
            fontSize: 96,
            fontWeight: 700,
          }}
        >
          10
        </div>
        <div
          style={{
            display: 'flex',
            width: 70,
            height: 110,
            marginTop: 30,
            marginLeft: -18,
            border: `16px solid ${tier.shade}`,
            borderLeft: 'none',
            borderRadius: '0 60px 60px 0',
          }}
        />
      </div>
      <div style={{ display: 'flex', width: 46, height: 60, background: tier.shade }} />
      <div
        style={{
          display: 'flex',
          width: 200,
          height: 46,
          background: tier.metal,
          borderRadius: 8,
          border: `8px solid ${tier.shade}`,
        }}
      />
    </div>
  );
}

export async function renderScoreImage(score: number) {
  const tier = tierFor(score);
  const logo = await readFile(join(process.cwd(), 'public/logo/logo-mark.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: BACKGROUND,
        color: INK,
        padding: 64,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img src={logoSrc} width={84} height={84} alt="" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 40, fontWeight: 700 }}>AIChE KKU</div>
            <div style={{ display: 'flex', fontSize: 26, color: INK_2 }}>
              King Khalid University
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 34, color: ACCENT, fontWeight: 700 }}>
            Periodic table challenge
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 6 }}>
            <div
              style={{ display: 'flex', fontSize: 190, fontWeight: 700, color: INK, lineHeight: 1 }}
            >
              {score}
            </div>
            <div
              style={{ display: 'flex', fontSize: 90, color: INK_2, marginLeft: 16 }}
            >{`/ ${QUIZ_LENGTH}`}</div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignSelf: 'flex-start',
            padding: '12px 24px',
            borderRadius: 10,
            background: SURFACE,
            border: `2px solid ${tier.shade}`,
            color: tier.metal,
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          {tier.label}
        </div>
      </div>

      <div style={{ display: 'flex', marginRight: 40 }}>
        {tier.trophy ? <Trophy tier={tier} /> : <Medal tier={tier} score={score} />}
      </div>
    </div>,
    SCORE_IMAGE_SIZE,
  );
}

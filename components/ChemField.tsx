import type { CSSProperties } from 'react';

type Variant = 'hero' | 'gains';

type Spot = [number, number];

type AtomSpot = [number, number, number];

interface Composition {
  w: number;
  h: number;
  bonds: string[];
  cogs: Spot[];
  rings: Spot[];
  atoms: AtomSpot[];
}

const WIDE: Composition = {
  w: 1400,
  h: 800,
  bonds: [
    'M150,130 L430,250 L700,90',
    'M1090,360 L1210,190',
    'M120,480 L330,700 L770,720 L980,640',
    'M1090,360 L1310,480',
    'M700,90 L1090,360',
    'M430,250 L330,700',
  ],
  cogs: [
    [430, 250],
    [1090, 360],
    [120, 480],
    [770, 720],
  ],
  rings: [
    [150, 130],
    [1210, 190],
    [980, 640],
    [330, 700],
    [700, 90],
    [1310, 480],
  ],
  atoms: [
    [880, 470, 1],
    [250, 300, 0.8],
  ],
};

const TALL: Composition = {
  w: 420,
  h: 860,
  bonds: [
    'M62,118 L192,232 L338,150',
    'M338,150 L378,436',
    'M60,470 L128,600 L330,612',
    'M192,232 L60,470',
    'M128,600 L250,830',
  ],
  cogs: [
    [192, 232],
    [128, 600],
  ],
  rings: [
    [62, 118],
    [338, 150],
    [60, 470],
    [378, 436],
    [330, 612],
    [250, 830],
  ],
  atoms: [
    [320, 755, 0.9],
    [60, 300, 0.75],
  ],
};

const RING_BOX = 54;
const COG_BOX = 54;
const SHELL_BOX = 76;

const TILTS = [0, 60, -60];

const percent = (n: number) => `${+(n * 100).toFixed(4)}%`;

function place(c: Composition, x: number, y: number, size: number, i?: number): CSSProperties {
  return {
    left: percent((x - size / 2) / c.w),
    top: percent((y - size / 2) / c.h),
    width: percent(size / c.w),
    ...(i === undefined ? {} : { ['--i' as string]: i }),
  };
}

const step = (i: number) => ({ ['--i' as string]: i }) as CSSProperties;

const SHAPE_CLASS = { wide: 'chem__scene--wide', tall: 'chem__scene--tall' } as const;

function Scene({ shape, c }: { shape: keyof typeof SHAPE_CLASS; c: Composition }) {
  return (
    <div
      className={`chem__scene ${SHAPE_CLASS[shape]}`}
      style={{ ['--ar' as string]: `${c.w} / ${c.h}` }}
    >
      <svg className="chem__bonds" viewBox={`0 0 ${c.w} ${c.h}`}>
        {c.bonds.map((shape, i) => (
          <path className="chem__bond" key={shape} d={shape} pathLength={1} style={step(i)} />
        ))}
        {c.atoms.map(([x, y, s]) => (
          <circle className="chem__nucleus" key={`${x}-${y}`} cx={x} cy={y} r={5 * s} />
        ))}
      </svg>

      {c.cogs.map(([x, y], i) => (
        <span
          className={i % 2 ? 'chem__cog chem__cog--b' : 'chem__cog'}
          key={`${x}-${y}`}
          style={place(c, x, y, COG_BOX)}
        >
          <svg viewBox={`${-COG_BOX / 2} ${-COG_BOX / 2} ${COG_BOX} ${COG_BOX}`}>
            <use href="#chem-cog" />
          </svg>
        </span>
      ))}

      {c.atoms.flatMap(([x, y, s]) =>
        TILTS.map((tilt, i) => (
          <span
            className={i === 1 ? 'chem__shell chem__shell--rev' : 'chem__shell'}
            key={`${x}-${y}-${tilt}`}
            style={place(c, x, y, SHELL_BOX * s, i)}
          >
            <svg viewBox={`${-SHELL_BOX / 2} ${-SHELL_BOX / 2} ${SHELL_BOX} ${SHELL_BOX}`}>
              <g transform={`rotate(${tilt})`}>
                <ellipse className="chem__orbit" rx="34" ry="14.5" />
                <circle className="chem__e" cx="34" cy="0" r="2.9" />
                <circle className="chem__e" cx="-34" cy="0" r="2.9" />
              </g>
            </svg>
          </span>
        )),
      )}

      {c.rings.map(([x, y], i) => (
        <span
          className={i % 2 ? 'chem__ring chem__ring--b' : 'chem__ring'}
          key={`${x}-${y}`}
          style={place(c, x, y, RING_BOX, i)}
        >
          <svg viewBox={`${-RING_BOX / 2} ${-RING_BOX / 2} ${RING_BOX} ${RING_BOX}`}>
            <use href="#chem-benz" />
          </svg>
        </span>
      ))}
    </div>
  );
}

const VARIANT_CLASS: Record<Variant, string> = {
  hero: 'chem chem--hero',
  gains: 'chem chem--gains',
};

export default function ChemField({ variant }: { variant: Variant }) {
  return (
    <div className={VARIANT_CLASS[variant]} aria-hidden="true">
      <Scene shape="wide" c={WIDE} />
      <Scene shape="tall" c={TALL} />
    </div>
  );
}

export function ChemDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <g id="chem-benz" fill="none" stroke="currentColor">
          <polygon
            points="0,-26 22.5,-13 22.5,13 0,26 -22.5,13 -22.5,-13"
            strokeWidth="1.35"
            strokeOpacity=".62"
          />
          <polygon
            points="0,-17 14.7,-8.5 14.7,8.5 0,17 -14.7,8.5 -14.7,-8.5"
            strokeWidth="1.1"
            strokeOpacity=".4"
          />
        </g>

        <g id="chem-cog" fill="none" stroke="currentColor" strokeLinecap="round">
          <circle r="19" strokeWidth="1.35" strokeOpacity=".55" />
          <circle r="9" strokeWidth="1.1" strokeOpacity=".38" />
          <g strokeWidth="1.35" strokeOpacity=".55">
            <path d="M0,-19V-25M0,19V25M-19,0H-25M19,0H25" />
            <path d="M13.4,-13.4l4.3,-4.3M-13.4,13.4l-4.3,4.3M13.4,13.4l4.3,4.3M-13.4,-13.4l-4.3,-4.3" />
          </g>
        </g>
      </defs>
    </svg>
  );
}

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const WIDTH = 1200;
const HEIGHT = 630;
const PADDING = 96;

const BACKGROUND = '#F5F1EE';
const INK = '#0D3E6B';
const INK_2 = '#075B91';
const ACCENT = '#8BCB32';
const GREEN_DEEP = '#237A13';

const AR_BOLD = 'IBM Plex Sans Arabic';
const AR_SEMI = 'IBM Plex Sans Arabic SemiBold';
const EN_BOLD = 'Space Grotesk';
const EN_MED = 'Space Grotesk Medium';

async function downloadFonts() {
  const fontDir = mkdtempSync(join(tmpdir(), 'og-fonts-'));
  let fontIndex = 0;
  for (const [family, axis] of [
    ['IBM+Plex+Sans+Arabic', 'wght@600;700'],
    ['Space+Grotesk', 'wght@500;700'],
  ]) {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=${family}:${axis}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    }).then((response) => response.text());
    for (const match of css.matchAll(/src:\s*url\((https:[^)]+\.ttf)\)/g)) {
      writeFileSync(
        join(fontDir, `f${fontIndex++}.ttf`),
        Buffer.from(await fetch(match[1]).then((response) => response.arrayBuffer())),
      );
    }
  }

  mkdirSync(join(fontDir, 'cache'), { recursive: true });
  writeFileSync(
    join(fontDir, 'fonts.conf'),
    `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig>` +
      `<dir>${fontDir}</dir><cachedir>${join(fontDir, 'cache')}</cachedir></fontconfig>`,
  );
  return fontDir;
}

if (!process.env.OG_FONT_DIR) {
  const fontDir = await downloadFonts();
  try {
    const child = spawnSync(process.execPath, [fileURLToPath(import.meta.url)], {
      stdio: 'inherit',
      env: { ...process.env, OG_FONT_DIR: fontDir, FONTCONFIG_FILE: join(fontDir, 'fonts.conf') },
    });
    process.exitCode = child.status ?? 1;
  } finally {
    rmSync(fontDir, { recursive: true, force: true });
  }
} else {
  let sharp;
  try {
    ({ default: sharp } = await import('sharp'));
  } catch {
    console.error(
      'og-image: sharp is not installed. It normally arrives as an optional ' +
        'dependency of Next; install it directly with `npm install sharp`.',
    );
    process.exit(1);
  }
  const { site } = await import('../data/site.ts');

  const escapeXml = (text) =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  async function renderLine(text, { size, fill = INK, font }) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH * 2}" height="${size * 3}">
      <text x="20" y="${size * 1.9}" font-family="${font}" font-size="${size}"
            font-weight="700" fill="${fill}">${escapeXml(text)}</text></svg>`;
    const { data, info } = await sharp(Buffer.from(svg))
      .png()
      .trim({ threshold: 0 })
      .toBuffer({ resolveWithObject: true });
    return { buf: data, w: info.width, h: info.height };
  }

  async function fitLine(text, opts) {
    const maxWidth = WIDTH - PADDING * 2;
    let size = opts.size;
    for (;;) {
      const rendered = await renderLine(text, { ...opts, size });
      if (rendered.w <= maxWidth || size < 20) return rendered;
      size = Math.floor(size * Math.min(0.94, maxWidth / rendered.w));
    }
  }

  async function build({ out, rtl, name, university, tagline, bold, semi }) {
    const mark = await sharp('public/logo/logo-mark.png')
      .resize({ height: 132 })
      .png()
      .toBuffer({ resolveWithObject: true });

    const nameLine = await fitLine(name, { size: 68, font: bold });
    const universityLine = await fitLine(university, { size: 38, fill: INK_2, font: semi });
    const taglineLine = await fitLine(tagline, { size: 27, fill: GREEN_DEEP, font: EN_MED });

    const RULE_W = 132;
    const RULE_H = 6;
    const gaps = [34, 22, 34, 30];
    const blockH =
      mark.info.height +
      gaps[0] +
      nameLine.h +
      gaps[1] +
      universityLine.h +
      gaps[2] +
      RULE_H +
      gaps[3] +
      taglineLine.h;

    let cursorY = Math.round((HEIGHT - blockH) / 2);

    const leftFor = (width) => (rtl ? WIDTH - PADDING - width : PADDING);

    const layers = [];
    const push = (input, width, advance) => {
      layers.push({ input, left: leftFor(width), top: Math.round(cursorY) });
      cursorY += advance;
    };

    push(mark.data, mark.info.width, mark.info.height + gaps[0]);
    push(nameLine.buf, nameLine.w, nameLine.h + gaps[1]);
    push(universityLine.buf, universityLine.w, universityLine.h + gaps[2]);
    push(
      await sharp({ create: { width: RULE_W, height: RULE_H, channels: 4, background: ACCENT } })
        .png()
        .toBuffer(),
      RULE_W,
      RULE_H + gaps[3],
    );
    push(taglineLine.buf, taglineLine.w, taglineLine.h);

    await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 4, background: BACKGROUND } })
      .composite(layers)
      .png({ compressionLevel: 9 })
      .toFile(out);

    console.log(`wrote ${out}`);
  }

  await build({
    out: 'app/(ar)/opengraph-image.png',
    rtl: true,
    bold: AR_BOLD,
    semi: AR_SEMI,
    name: site.nameAr,
    university: site.universityAr,
    tagline: site.tagline,
  });

  await build({
    out: 'app/(en)/opengraph-image.png',
    rtl: false,
    bold: EN_BOLD,
    semi: EN_MED,
    name: site.nameEn,
    university: site.universityEn,
    tagline: site.tagline,
  });
}

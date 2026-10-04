import type { ChemicalElement, ElementCategory, ElementState } from '@/data/elements';
import { elements } from '@/data/elements';
import { pick, type Lang } from '@/lib/i18n';

export const CATEGORIES: Record<ElementCategory, { ar: string; en: string; color: string }> = {
  alkali: { ar: 'فلزات قلوية', en: 'Alkali metals', color: '#E8836B' },
  alkaline: { ar: 'فلزات قلوية ترابية', en: 'Alkaline earth metals', color: '#E9B86A' },
  transition: { ar: 'فلزات انتقالية', en: 'Transition metals', color: '#7DB2CF' },
  postTransition: { ar: 'فلزات بعد انتقالية', en: 'Post-transition metals', color: '#9FC1A8' },
  metalloid: { ar: 'أشباه فلزات', en: 'Metalloids', color: '#C9B47A' },
  nonmetal: { ar: 'لافلزات', en: 'Nonmetals', color: '#8BCB32' },
  halogen: { ar: 'هالوجينات', en: 'Halogens', color: '#4FC6AA' },
  noble: { ar: 'غازات نبيلة', en: 'Noble gases', color: '#B79BE8' },
  lanthanide: { ar: 'لانثانيدات', en: 'Lanthanides', color: '#E59BBD' },
  actinide: { ar: 'أكتينيدات', en: 'Actinides', color: '#E0A07A' },
};

const STATES: Record<ElementState, { ar: string; en: string }> = {
  solid: { ar: 'صلب', en: 'Solid' },
  liquid: { ar: 'سائل', en: 'Liquid' },
  gas: { ar: 'غاز', en: 'Gas' },
  unknown: { ar: 'غير مؤكدة', en: 'Not confirmed' },
};

export const categoryLabel = (lang: Lang, category: ElementCategory) =>
  pick(lang, CATEGORIES[category].ar, CATEGORIES[category].en);

export const stateLabel = (lang: Lang, state: ElementState) =>
  pick(lang, STATES[state].ar, STATES[state].en);

export const elementName = (lang: Lang, element: ChemicalElement) =>
  pick(lang, element.nameAr, element.nameEn);

export const neutronCount = (element: ChemicalElement) =>
  Math.max(0, Math.round(element.mass) - element.number);

export interface Question {
  text: string;
  options: string[];
  answerIndex: number;
}

const randomInt = (max: number) => Math.floor(Math.random() * max);

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) {
    const swapIndex = randomInt(index + 1);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function distractors<T>(correct: T, pool: T[], count = 2) {
  return shuffle(pool.filter((item) => item !== correct)).slice(0, count);
}

function build(text: string, correct: string, wrong: string[]): Question {
  const options = shuffle([correct, ...wrong]);
  return { text, options, answerIndex: options.indexOf(correct) };
}

function nearbyNumbers(value: number, min: number, max: number) {
  const candidates = [];
  for (let offset = -4; offset <= 4; offset++) {
    const candidate = value + offset;
    if (offset !== 0 && candidate >= min && candidate <= max) candidates.push(candidate);
  }
  return candidates;
}

export function makeQuestion(lang: Lang, element: ChemicalElement): Question {
  const name = elementName(lang, element);
  const outerShell = element.shells[element.shells.length - 1];
  const kinds = [
    () =>
      build(
        pick(lang, `ما العدد الذري لعنصر ${name}؟`, `What is the atomic number of ${name}?`),
        String(element.number),
        distractors(element.number, nearbyNumbers(element.number, 1, 118)).map(String),
      ),
    () =>
      build(
        pick(lang, `ما رمز عنصر ${name}؟`, `What is the symbol for ${name}?`),
        element.symbol,
        distractors(
          element.symbol,
          elements.map((other) => other.symbol),
        ),
      ),
    () =>
      build(
        pick(lang, `إلى أي فئة ينتمي ${name}؟`, `Which group of elements does ${name} belong to?`),
        categoryLabel(lang, element.category),
        distractors(element.category, Object.keys(CATEGORIES) as ElementCategory[]).map(
          (category) => categoryLabel(lang, category),
        ),
      ),
    () =>
      build(
        pick(
          lang,
          `كم إلكترونًا في المدار الأخير لذرة ${name}؟`,
          `How many electrons are in the outer shell of ${name}?`,
        ),
        String(outerShell),
        distractors(outerShell, nearbyNumbers(outerShell, 1, 32)).map(String),
      ),
    () =>
      build(
        pick(
          lang,
          `كم مدارًا إلكترونيًا في ذرة ${name}؟`,
          `How many electron shells does ${name} have?`,
        ),
        String(element.shells.length),
        distractors(element.shells.length, [1, 2, 3, 4, 5, 6, 7]).map(String),
      ),
    () =>
      build(
        pick(
          lang,
          `أي عنصر عدده الذري ${element.number}؟`,
          `Which element has atomic number ${element.number}?`,
        ),
        name,
        distractors(
          element,
          elements.filter((other) => Math.abs(other.number - element.number) <= 6),
        ).map((other) => elementName(lang, other)),
      ),
  ];
  return kinds[randomInt(kinds.length)]();
}

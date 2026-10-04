'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, type CSSProperties } from 'react';

import { elements, type ChemicalElement } from '@/data/elements';
import {
  CATEGORIES,
  categoryLabel,
  elementName,
  makeQuestion,
  neutronCount,
  stateLabel,
  type Question,
} from '@/lib/challenge';
import { dirOf, pick, scoreHref, type Lang } from '@/lib/i18n';
import { QUIZ_LENGTH } from '@/lib/quiz';
import { useStats, type Stats } from './useStats';
import type { ElementCategory } from '@/data/elements';

type ChallengeView = number | 'quiz' | null;

const AtomScene = dynamic(() => import('./AtomScene'), { ssr: false });

const categoryStyle = (category: ElementCategory) =>
  ({ '--cat': CATEGORIES[category].color }) as CSSProperties;

function PeriodicTable({
  lang,
  onSelect,
}: {
  lang: Lang;
  onSelect: (element: ChemicalElement) => void;
}) {
  return (
    <>
      <p className="ptable__hint">
        {pick(lang, 'اسحب الجدول لعرض بقية العناصر', 'Swipe the table to see every element')}
      </p>
      <div className="ptable-wrap" dir="ltr">
        <div className="ptable" dir="ltr">
          {elements.map((element) => (
            <button
              key={element.number}
              type="button"
              className="ptable__cell"
              style={{
                ...categoryStyle(element.category),
                gridColumn: element.column,
                gridRow: element.row,
              }}
              onClick={() => onSelect(element)}
              aria-label={`${elementName(lang, element)}, ${element.number}`}
            >
              <span className="ptable__number">{element.number}</span>
              <span className="ptable__symbol">{element.symbol}</span>
              <span className="ptable__name">{elementName(lang, element)}</span>
            </button>
          ))}
        </div>
      </div>
      <ul className="ptable__legend">
        {(Object.keys(CATEGORIES) as ElementCategory[]).map((category) => (
          <li key={category} style={categoryStyle(category)}>
            {categoryLabel(lang, category)}
          </li>
        ))}
      </ul>
    </>
  );
}

function QuestionBlock({
  lang,
  question,
  label,
  onAnswer,
  nextLabel,
  onNext,
}: {
  lang: Lang;
  question: Question;
  label: string;
  onAnswer: (isCorrect: boolean) => void;
  nextLabel: string;
  onNext: () => void;
}) {
  const [chosen, setChosen] = useState<number | null>(null);
  const answered = chosen !== null;
  const correct = chosen === question.answerIndex;

  const choose = (index: number) => {
    setChosen(index);
    onAnswer(index === question.answerIndex);
  };

  return (
    <div className="quiz">
      <p className="quiz__label">{label}</p>
      <p className="quiz__question">{question.text}</p>
      <div className="quiz__options">
        {question.options.map((option, index) => {
          const state = !answered
            ? ''
            : index === question.answerIndex
              ? ' is-correct'
              : index === chosen
                ? ' is-wrong'
                : ' is-muted';
          return (
            <button
              key={option}
              type="button"
              className={`quiz__option${state}`}
              disabled={answered}
              onClick={() => choose(index)}
            >
              {option}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="quiz__result" role="status">
          <p>
            {correct
              ? pick(lang, 'إجابة صحيحة، أحسنت.', 'Correct, well done.')
              : pick(
                  lang,
                  `إجابة خاطئة. الصحيح: ${question.options[question.answerIndex]}`,
                  `Not quite. The answer is ${question.options[question.answerIndex]}.`,
                )}
          </p>
          <button type="button" className="quiz__next" onClick={onNext}>
            {nextLabel}
          </button>
        </div>
      )}
    </div>
  );
}

function ChallengeCard({
  lang,
  element,
  onAnswer,
}: {
  lang: Lang;
  element: ChemicalElement;
  onAnswer: (isCorrect: boolean) => void;
}) {
  const [round, setRound] = useState(0);
  const [question, setQuestion] = useState<Question>(() => makeQuestion(lang, element));

  const next = () => {
    setQuestion(makeQuestion(lang, element));
    setRound((value) => value + 1);
  };

  return (
    <QuestionBlock
      key={round}
      lang={lang}
      question={question}
      label={pick(lang, 'سؤال التحدي', 'Challenge question')}
      onAnswer={onAnswer}
      nextLabel={pick(lang, 'سؤال آخر', 'Another question')}
      onNext={next}
    />
  );
}

const cardFiles = new Map<number, Promise<File | null>>();

function loadCardFile(score: number) {
  if (!cardFiles.has(score)) {
    cardFiles.set(
      score,
      fetch(`/score-card/${score}`)
        .then((response) => response.blob())
        .then((blob) => new File([blob], `aiche-kku-score-${score}.png`, { type: 'image/png' }))
        .catch(() => null),
    );
  }
  return cardFiles.get(score)!;
}

async function shareScore(lang: Lang, score: number) {
  const url = `${window.location.origin}${scoreHref(lang, score)}`;
  const text = pick(
    lang,
    `حصلت على ${score} من ${QUIZ_LENGTH} في اختبار الجدول الدوري من فرع AIChE بجامعة الملك خالد. جرّب تتحداني:`,
    `I scored ${score} out of ${QUIZ_LENGTH} on the AIChE KKU periodic table quiz. Can you beat it?`,
  );
  try {
    if (navigator.share) {
      const file = await loadCardFile(score);
      if (file && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], text: `${text} ${url}` });
          return '';
        } catch (error) {
          if (error instanceof DOMException && error.name === 'AbortError') return '';
        }
      }
      await navigator.share({ text, url });
      return '';
    }
    await navigator.clipboard.writeText(`${text} ${url}`);
    return pick(lang, 'تم نسخ النتيجة', 'Result copied');
  } catch {
    return '';
  }
}

function ScoreCardDialog({
  lang,
  score,
  onClose,
}: {
  lang: Lang;
  score: number;
  onClose: () => void;
}) {
  const [status, setStatus] = useState('');
  const imageUrl = `/score-card/${score}`;

  useEffect(() => {
    loadCardFile(score);
  }, [score]);

  return (
    <div className="card-dialog" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="card-dialog__panel" onClick={(event) => event.stopPropagation()}>
        <p className="quiz__label">{pick(lang, 'بطاقة نتيجتك', 'Your score card')}</p>
        <img
          className="card-dialog__image"
          src={imageUrl}
          width={1200}
          height={630}
          alt={pick(
            lang,
            `بطاقة النتيجة: ${score} من ${QUIZ_LENGTH}`,
            `Score card: ${score} out of ${QUIZ_LENGTH}`,
          )}
        />
        <div className="qq__actions">
          <a
            className="quiz__next card-dialog__download"
            href={imageUrl}
            download={`aiche-kku-score-${score}.png`}
          >
            {pick(lang, 'تحميل الصورة', 'Download image')}
          </a>
          <button
            type="button"
            className="el-view__back"
            onClick={async () => setStatus(await shareScore(lang, score))}
          >
            {pick(lang, 'شارك نتيجتك', 'Share your score')}
          </button>
          <button type="button" className="el-view__back" onClick={onClose}>
            {pick(lang, 'إغلاق', 'Close')}
          </button>
        </div>
        {status && (
          <p className="qq__note" role="status">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}

function StatsBar({ lang, stats }: { lang: Lang; stats: Stats }) {
  const items: [string, number][] = [
    [pick(lang, 'إجابات صحيحة', 'Correct answers'), stats.correct],
    [pick(lang, 'من أصل', 'Out of'), stats.answered],
  ];
  return (
    <div className="stats">
      <dl className="stats__list">
        {items.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function randomQuizElements() {
  const pool = [...elements];
  const chosen: ChemicalElement[] = [];
  while (chosen.length < QUIZ_LENGTH) {
    chosen.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return chosen;
}

function QuickQuiz({
  lang,
  onAnswer,
  onFinish,
  onRestart,
  onExit,
}: {
  lang: Lang;
  onAnswer: (isCorrect: boolean) => void;
  onFinish: (score: number) => void;
  onRestart: () => void;
  onExit: () => void;
}) {
  const [cardOpen, setCardOpen] = useState(false);
  const [quizElements, setQuizElements] = useState(randomQuizElements);
  const [questions, setQuestions] = useState(() =>
    quizElements.map((element) => makeQuestion(lang, element)),
  );
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [bestRun, setBestRun] = useState(0);
  const [run, setRun] = useState(0);
  const [finished, setFinished] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

  const answer = (isCorrect: boolean) => {
    onAnswer(isCorrect);
    if (isCorrect) {
      setScore((value) => value + 1);
      setRun((value) => {
        setBestRun((best) => Math.max(best, value + 1));
        return value + 1;
      });
    } else {
      setRun(0);
    }
  };

  const next = () => {
    if (index + 1 >= QUIZ_LENGTH) {
      setFinished(true);
      onFinish(score);
      loadCardFile(score);
    } else setIndex((value) => value + 1);
  };

  const restart = () => {
    onRestart();
    const fresh = randomQuizElements();
    setQuizElements(fresh);
    setQuestions(fresh.map((element) => makeQuestion(lang, element)));
    setIndex(0);
    setScore(0);
    setRun(0);
    setBestRun(0);
    setFinished(false);
    setShareStatus('');
  };

  const share = async () => setShareStatus(await shareScore(lang, score));

  const element = quizElements[index];

  if (finished) {
    return (
      <div className="qq qq--result">
        <p className="quiz__label">{pick(lang, 'نتيجتك', 'Your result')}</p>
        <p className="qq__score">
          <b>{score}</b> / {QUIZ_LENGTH}
        </p>
        <p className="qq__note">
          {pick(
            lang,
            `أطول سلسلة إجابات صحيحة: ${bestRun}`,
            `Longest run of correct answers: ${bestRun}`,
          )}
        </p>
        <div className="qq__actions">
          <button type="button" className="quiz__next" onClick={restart}>
            {pick(lang, 'اختبار جديد', 'New quiz')}
          </button>
          <button type="button" className="el-view__back" onClick={() => setCardOpen(true)}>
            {pick(lang, 'عرض بطاقة النتائج', 'Show score card')}
          </button>
          <button type="button" className="el-view__back" onClick={share}>
            {pick(lang, 'شارك نتيجتك', 'Share your score')}
          </button>
          <button type="button" className="el-view__back" onClick={onExit}>
            {pick(lang, 'العودة إلى الجدول الدوري', 'Back to the periodic table')}
          </button>
        </div>
        {cardOpen && (
          <ScoreCardDialog lang={lang} score={score} onClose={() => setCardOpen(false)} />
        )}
        {shareStatus && (
          <p className="qq__note" role="status">
            {shareStatus}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="qq" style={categoryStyle(element.category)}>
      <div className="qq__top">
        <button type="button" className="el-view__back" onClick={onExit}>
          {pick(lang, 'إنهاء الاختبار', 'End quiz')}
        </button>
        <p className="qq__progress">
          {pick(lang, 'السؤال', 'Question')} <b>{index + 1}</b> / {QUIZ_LENGTH}
          <span>
            {pick(lang, 'النتيجة', 'Score')} <b>{score}</b>
          </span>
        </p>
      </div>
      <div className="qq__bar" aria-hidden="true">
        <i style={{ transform: `scaleX(${index / QUIZ_LENGTH})` }} />
      </div>
      <div className="qq__element">
        <span className="el-view__symbol">{element.symbol}</span>
        <p>{categoryLabel(lang, element.category)}</p>
      </div>
      <QuestionBlock
        key={index}
        lang={lang}
        question={questions[index]}
        label={pick(lang, 'اختبار سريع', 'Quick quiz')}
        onAnswer={answer}
        nextLabel={
          index + 1 >= QUIZ_LENGTH
            ? pick(lang, 'عرض النتيجة', 'See your result')
            : pick(lang, 'السؤال التالي', 'Next question')
        }
        onNext={next}
      />
    </div>
  );
}

function ElementView({
  lang,
  element,
  onBack,
  onAnswer,
}: {
  lang: Lang;
  element: ChemicalElement;
  onBack: () => void;
  onAnswer: (isCorrect: boolean) => void;
}) {
  const [atomUnavailable, setAtomUnavailable] = useState(false);
  const neutrons = neutronCount(element);
  const discovered =
    element.discovered === 'Ancient'
      ? pick(lang, 'منذ القدم', 'Ancient times')
      : element.discovered;
  const facts: [string, string][] = [
    [pick(lang, 'العدد الذري', 'Atomic number'), String(element.number)],
    [pick(lang, 'الكتلة الذرية', 'Atomic mass'), String(element.mass)],
    [pick(lang, 'الفئة', 'Group'), categoryLabel(lang, element.category)],
    [pick(lang, 'الدورة', 'Period'), String(element.period)],
    [
      pick(lang, 'الحالة عند الظروف القياسية', 'State at standard conditions'),
      stateLabel(lang, element.state),
    ],
    [
      pick(lang, 'توزيع الإلكترونات', 'Electrons per shell'),
      element.shells.join(pick(lang, '، ', ', ')),
    ],
    [pick(lang, 'سنة الاكتشاف', 'Discovered'), discovered],
  ];

  return (
    <div className="el-view" style={categoryStyle(element.category)}>
      <div className="el-view__stage">
        {atomUnavailable ? (
          <p className="atom-scene atom-scene--fallback" dir={dirOf(lang)}>
            {pick(
              lang,
              'لا يدعم متصفحك العرض ثلاثي الأبعاد، لكن معلومات العنصر والسؤال متاحة بجانبه.',
              'Your browser cannot show the 3D atom, but the element facts and the question are right beside it.',
            )}
          </p>
        ) : (
          <AtomScene
            protons={element.number}
            neutrons={neutrons}
            shells={element.shells}
            onUnavailable={() => setAtomUnavailable(true)}
          />
        )}
        <ul className="el-view__key" dir={dirOf(lang)}>
          <li className="el-view__key--proton">
            {pick(lang, 'بروتونات', 'Protons')} <b>{element.number}</b>
          </li>
          <li className="el-view__key--neutron">
            {pick(lang, 'نيوترونات', 'Neutrons')} <b>{neutrons}</b>
          </li>
          <li className="el-view__key--electron">
            {pick(lang, 'إلكترونات', 'Electrons')} <b>{element.number}</b>
          </li>
        </ul>
        {!atomUnavailable && (
          <p className="el-view__hint" dir={dirOf(lang)}>
            {pick(lang, 'اسحب لتدوير الذرة', 'Drag to rotate the atom')}
          </p>
        )}
      </div>

      <div className="el-view__info" dir={dirOf(lang)}>
        <button type="button" className="el-view__back" onClick={onBack}>
          {pick(lang, 'العودة إلى الجدول الدوري', 'Back to the periodic table')}
        </button>
        <div className="el-view__title">
          <span className="el-view__symbol">{element.symbol}</span>
          <div>
            <h2>{elementName(lang, element)}</h2>
            <p>{pick(lang, element.nameEn, element.nameAr)}</p>
          </div>
        </div>
        <dl className="el-view__facts">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <ChallengeCard key={element.number} lang={lang} element={element} onAnswer={onAnswer} />
      </div>
    </div>
  );
}

export default function Challenge({
  lang,
  challengerScore,
}: {
  lang: Lang;
  challengerScore?: number;
}) {
  const [selected, setSelected] = useState<ChemicalElement | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const { stats, record, recordQuiz, startQuiz } = useStats();

  const display = (element: ChemicalElement | null, quiz: boolean) => {
    setSelected(element);
    setQuizOpen(quiz);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const open = (element: ChemicalElement | null, quiz = false) => {
    if (quiz) startQuiz();
    const view: ChallengeView = quiz ? 'quiz' : (element?.number ?? null);
    window.history.pushState({ ...window.history.state, challengeView: view }, '');
    display(element, quiz);
  };

  const backToTable = () => {
    if (window.history.state?.challengeView != null) window.history.back();
    else display(null, false);
  };

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const view: ChallengeView = event.state?.challengeView ?? null;
      if (view === 'quiz') {
        startQuiz();
        display(null, true);
      } else {
        display(
          view === null ? null : (elements.find((element) => element.number === view) ?? null),
          false,
        );
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [startQuiz]);

  return (
    <section className="challenge">
      <div className="shell">
        {quizOpen ? (
          <QuickQuiz
            lang={lang}
            onAnswer={record}
            onFinish={recordQuiz}
            onRestart={startQuiz}
            onExit={backToTable}
          />
        ) : selected ? (
          <>
            <ElementView lang={lang} element={selected} onBack={backToTable} onAnswer={record} />
            <StatsBar lang={lang} stats={stats} />
          </>
        ) : (
          <>
            {challengerScore !== undefined && (
              <p className="challenge__invite">
                {pick(
                  lang,
                  `صديقك حصل على ${challengerScore} من ${QUIZ_LENGTH} في الاختبار السريع. تقدر تتفوق عليه؟`,
                  `Your friend scored ${challengerScore} out of ${QUIZ_LENGTH} on the quick quiz. Can you beat it?`,
                )}
              </p>
            )}
            <header className="challenge__head">
              <h1>{pick(lang, 'تحدَّ نفسك', 'Challenge yourself')}</h1>
              <p>
                {pick(
                  lang,
                  'اختر عنصرًا من الجدول الدوري لتشاهد ذرته وتجيب عن سؤال عنه، أو ابدأ اختبارًا سريعًا من 10 أسئلة.',
                  'Pick an element from the periodic table to see its atom and answer a question about it, or start a quick 10-question quiz.',
                )}
              </p>
              <div className="challenge__actions">
                <button type="button" className="quiz__next" onClick={() => open(null, true)}>
                  {pick(lang, 'ابدأ الاختبار السريع', 'Start the quick quiz')}
                </button>
                <button type="button" className="el-view__back" onClick={() => setCardOpen(true)}>
                  {pick(lang, 'بطاقة النقاط', 'Score card')}
                </button>
              </div>
            </header>
            {cardOpen &&
              (stats.lastQuizScore !== undefined ? (
                <ScoreCardDialog
                  lang={lang}
                  score={stats.lastQuizScore}
                  onClose={() => setCardOpen(false)}
                />
              ) : (
                <div
                  className="card-dialog"
                  role="dialog"
                  aria-modal="true"
                  onClick={() => setCardOpen(false)}
                >
                  <div className="card-dialog__panel" onClick={(event) => event.stopPropagation()}>
                    <p className="quiz__label">{pick(lang, 'بطاقة النقاط', 'Score card')}</p>
                    <p className="qq__note">
                      {pick(
                        lang,
                        'ما عندك بطاقة إلى الآن. خلّص اختبارًا سريعًا وتظهر بطاقتك هنا.',
                        'You have no score card yet. Finish a quick quiz and it will appear here.',
                      )}
                    </p>
                    <div className="qq__actions">
                      <button
                        type="button"
                        className="quiz__next"
                        onClick={() => {
                          setCardOpen(false);
                          open(null, true);
                        }}
                      >
                        {pick(lang, 'ابدأ الاختبار السريع', 'Start the quick quiz')}
                      </button>
                      <button
                        type="button"
                        className="el-view__back"
                        onClick={() => setCardOpen(false)}
                      >
                        {pick(lang, 'إغلاق', 'Close')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            <StatsBar lang={lang} stats={stats} />
            <PeriodicTable lang={lang} onSelect={(element) => open(element)} />
            <p className="challenge__source">
              {pick(lang, 'مصدر بيانات العناصر: PubChem', 'Element data: PubChem')}
            </p>
          </>
        )}
      </div>
    </section>
  );
}

'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'aiche-kku-challenge-stats';

export interface Stats {
  answered: number;
  correct: number;
  lastQuizScore?: number;
}

const EMPTY_STATS: Stats = { answered: 0, correct: 0 };

function readStats(): Stats {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? { ...EMPTY_STATS, ...JSON.parse(saved) } : EMPTY_STATS;
  } catch {
    return EMPTY_STATS;
  }
}

function writeStats(stats: Stats) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {}
}

export function useStats() {
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);

  useEffect(() => {
    setStats(readStats());
  }, []);

  const record = useCallback((isCorrect: boolean) => {
    setStats((previous) => {
      const next = {
        ...previous,
        answered: previous.answered + 1,
        correct: previous.correct + (isCorrect ? 1 : 0),
      };
      writeStats(next);
      return next;
    });
  }, []);

  const recordQuiz = useCallback((score: number) => {
    setStats((previous) => {
      const next = { ...previous, lastQuizScore: score };
      writeStats(next);
      return next;
    });
  }, []);

  const startQuiz = useCallback(() => {
    setStats((previous) => {
      const next = { ...EMPTY_STATS, lastQuizScore: previous.lastQuizScore };
      writeStats(next);
      return next;
    });
  }, []);

  return { stats, record, recordQuiz, startQuiz };
}

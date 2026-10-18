"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CLEAR_SCORE } from "@/level-manager/types";

// What happened during one level, so the score can reward a clean, independent
// solve. Nothing here punishes: a messy solve still earns the base points.
export type LevelResult = {
  mistakes: number;
  bonus: number;
  guideOpened: boolean;
};

type LevelStats = {
  result: LevelResult;
  mistake: () => void;
  bonus: (points: number) => void;
  guideOpened: () => void;
};

const NOOP: LevelStats = {
  result: { mistakes: 0, bonus: 0, guideOpened: false },
  mistake: () => {},
  bonus: () => {},
  guideOpened: () => {},
};

const LevelStatsContext = createContext<LevelStats>(NOOP);

export const CLEAN_BONUS = 40; // a flawless solve
export const CLEAN_STEP = 8; // each slip costs a little of that bonus
export const SOLO_BONUS = 20; // never opened Sparkles' guide
export const STYLE_CAP = 40; // level-specific style points

export type ScoreBreakdown = {
  base: number;
  clean: number;
  solo: number;
  style: number;
  total: number;
};

export function scoreFor(result: LevelResult): ScoreBreakdown {
  const clean = Math.max(0, CLEAN_BONUS - CLEAN_STEP * result.mistakes);
  const solo = result.guideOpened ? 0 : SOLO_BONUS;
  const style = Math.min(STYLE_CAP, result.bonus);
  return {
    base: CLEAR_SCORE,
    clean,
    solo,
    style,
    total: CLEAR_SCORE + clean + solo + style,
  };
}

export function LevelStatsProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<LevelResult>(NOOP.result);

  // Stable callbacks, so mechanics can list them in effect dependencies.
  const mistake = useCallback(
    () => setResult((prev) => ({ ...prev, mistakes: prev.mistakes + 1 })),
    [],
  );
  const bonus = useCallback(
    (points: number) => setResult((prev) => ({ ...prev, bonus: prev.bonus + points })),
    [],
  );
  const guideOpened = useCallback(
    () => setResult((prev) => (prev.guideOpened ? prev : { ...prev, guideOpened: true })),
    [],
  );

  const value = useMemo<LevelStats>(
    () => ({ result, mistake, bonus, guideOpened }),
    [result, mistake, bonus, guideOpened],
  );

  return <LevelStatsContext value={value}>{children}</LevelStatsContext>;
}

export function useLevelStats(): LevelStats {
  return useContext(LevelStatsContext);
}

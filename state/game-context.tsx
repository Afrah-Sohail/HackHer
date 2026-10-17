"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { LEVELS } from "@/level-manager/catalog";
import { clearedCount, totalScore } from "@/level-manager/progress";
import type { LevelDefinition } from "@/level-manager/types";
import {
  createInitialState,
  gameReducer,
  type GameState,
} from "./game-reducer";

type GameContextValue = {
  state: GameState;
  level: LevelDefinition;
  score: number;
  cleared: number;
  start: (index?: number) => void;
  selectLevel: (index: number) => void;
  completeLevel: () => void;
  jumpToLevel: (index: number) => void;
  forceWin: () => void;
  showWelcome: () => void;
  restart: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const level = LEVELS[state.currentLevelIndex];

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      level,
      score: totalScore(state.levels),
      cleared: clearedCount(state.levels),
      start: (index) => dispatch({ type: "start", index }),
      selectLevel: (index) => dispatch({ type: "select-level", index }),
      completeLevel: () => dispatch({ type: "complete-level" }),
      jumpToLevel: (index) => dispatch({ type: "jump-to-level", index }),
      forceWin: () => dispatch({ type: "force-win" }),
      showWelcome: () => dispatch({ type: "show-welcome" }),
      restart: () => dispatch({ type: "restart" }),
    }),
    [level, state],
  );

  return <GameContext value={value}>{children}</GameContext>;
}

export function useGame(): GameContextValue {
  const value = useContext(GameContext);
  if (!value) {
    throw new Error("useGame must be used within GameProvider");
  }
  return value;
}

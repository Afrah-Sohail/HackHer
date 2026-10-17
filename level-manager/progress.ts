import { CLEAR_SCORE, LEVEL_COUNT, isLevelIndex } from "./types";
import type { LevelIndex, LevelProgress } from "./types";

export function createLevelProgress(): LevelProgress[] {
  return Array.from({ length: LEVEL_COUNT }, (_, index) => ({
    unlocked: index === 0,
    completed: false,
    score: 0,
  }));
}

export function totalScore(levels: readonly LevelProgress[]): number {
  return levels.reduce((sum, level) => sum + level.score, 0);
}

export function clearedCount(levels: readonly LevelProgress[]): number {
  return levels.filter((level) => level.completed).length;
}

export function isUnlocked(
  levels: readonly LevelProgress[],
  index: number,
): boolean {
  return isLevelIndex(index) && levels[index]?.unlocked === true;
}

export function firstPlayableIndex(levels: readonly LevelProgress[]): LevelIndex {
  const nextOpen = levels.findIndex(
    (level) => level.unlocked && !level.completed,
  );
  if (isLevelIndex(nextOpen)) {
    return nextOpen;
  }

  for (let index = levels.length - 1; index >= 0; index -= 1) {
    if (levels[index]?.unlocked && isLevelIndex(index)) {
      return index;
    }
  }

  return 0;
}

export function withUnlockThrough(
  levels: readonly LevelProgress[],
  index: LevelIndex,
): LevelProgress[] {
  return levels.map((level, levelIndex) =>
    levelIndex <= index ? { ...level, unlocked: true } : { ...level },
  );
}

export function withLevelCleared(
  levels: readonly LevelProgress[],
  index: LevelIndex,
  awarded = CLEAR_SCORE,
): LevelProgress[] {
  return levels.map((level, levelIndex) => {
    if (levelIndex === index) {
      return {
        unlocked: true,
        completed: true,
        score: level.completed ? level.score : awarded,
      };
    }

    if (levelIndex === index + 1) {
      return { ...level, unlocked: true };
    }

    return { ...level };
  });
}

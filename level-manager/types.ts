export const LEVEL_COUNT = 6;
export const CLEAR_SCORE = 100;

export type LevelIndex = 0 | 1 | 2 | 3 | 4 | 5;

export type MechanicId =
  | "loom"
  | "waveform"
  | "logic-grid"
  | "mission-desk"
  | "alarm-queue"
  | "blueprint";

export type LevelProgress = {
  unlocked: boolean;
  completed: boolean;
  score: number;
};

export type LevelDefinition = {
  index: LevelIndex;
  floor: number;
  slug: string;
  title: string;
  pioneer: string;
  concept: string;
  narrative: string;
  /** Pre-written overview shown in the guide. **bold** marks key terms. */
  blurb: string;
  mechanicId: MechanicId;
  mechanicLabel: string;
};

export type GameScreen = "welcome" | "playing" | "victory";

export function isLevelIndex(index: number): index is LevelIndex {
  return Number.isInteger(index) && index >= 0 && index < LEVEL_COUNT;
}

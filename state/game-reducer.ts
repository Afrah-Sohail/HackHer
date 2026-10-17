import {
  createLevelProgress,
  firstPlayableIndex,
  withLevelCleared,
  withUnlockThrough,
} from "@/level-manager/progress";
import {
  isLevelIndex,
  type GameScreen,
  type LevelIndex,
  type LevelProgress,
} from "@/level-manager/types";

export type GameState = {
  screen: GameScreen;
  currentLevelIndex: LevelIndex;
  levels: LevelProgress[];
};

export type GameAction =
  | { type: "start"; index?: number }
  | { type: "select-level"; index: number }
  | { type: "complete-level"; score?: number }
  | { type: "jump-to-level"; index: number }
  | { type: "force-win" }
  | { type: "arrive" }
  | { type: "show-welcome" }
  | { type: "restart" };

export function createInitialState(): GameState {
  return {
    screen: "welcome",
    currentLevelIndex: 0,
    levels: createLevelProgress(),
  };
}

function enterLevel(state: GameState, index: number): GameState {
  if (!isLevelIndex(index) || !state.levels[index]?.unlocked) {
    return state;
  }

  return {
    ...state,
    screen: "playing",
    currentLevelIndex: index,
  };
}

function finishLevel(
  state: GameState,
  index: LevelIndex,
  score?: number,
): GameState {
  const levels = withLevelCleared(state.levels, index, score);
  const nextIndex = index + 1;

  if (!isLevelIndex(nextIndex)) {
    return {
      ...state,
      levels,
      screen: "victory",
      currentLevelIndex: index,
    };
  }

  // The rocket flies to (and breaks down on) the next planet before its level.
  return {
    ...state,
    levels,
    screen: "travel",
    currentLevelIndex: nextIndex,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "start": {
      const index = action.index ?? firstPlayableIndex(state.levels);
      return enterLevel(state, index);
    }
    case "select-level":
      return enterLevel(state, action.index);
    case "complete-level":
      return finishLevel(state, state.currentLevelIndex, action.score);
    case "jump-to-level": {
      if (!isLevelIndex(action.index)) {
        return state;
      }

      return {
        ...state,
        screen: "playing",
        currentLevelIndex: action.index,
        levels: withUnlockThrough(state.levels, action.index),
      };
    }
    case "force-win": {
      if (state.screen === "victory") {
        return state;
      }

      return finishLevel(state, state.currentLevelIndex);
    }
    case "arrive":
      return state.screen === "travel" ? { ...state, screen: "playing" } : state;
    case "show-welcome":
      return { ...state, screen: "welcome" };
    case "restart":
      return createInitialState();
    default: {
      const unreachable: never = action;
      return unreachable;
    }
  }
}

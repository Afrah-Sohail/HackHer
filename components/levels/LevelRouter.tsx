import type { LevelDefinition } from "@/level-manager/types";
import { LEVELS } from "@/level-manager/catalog";
import { AdeleGoldbergFloor } from "./floors/AdeleGoldbergFloor";
import { AdaLovelaceFloor } from "./floors/AdaLovelaceFloor";
import { HedyLamarrFloor } from "./floors/HedyLamarrFloor";
import { HiddenFiguresFloor } from "./floors/HiddenFiguresFloor";
import { JoanClarkeFloor } from "./floors/JoanClarkeFloor";
import { MargaretHamiltonFloor } from "./floors/MargaretHamiltonFloor";

const FLOOR_VIEWS = [
  AdaLovelaceFloor,
  HedyLamarrFloor,
  JoanClarkeFloor,
  HiddenFiguresFloor,
  MargaretHamiltonFloor,
  AdeleGoldbergFloor,
] as const;

export function LevelRouter({ level }: { level: LevelDefinition }) {
  if (process.env.NODE_ENV !== "production" && FLOOR_VIEWS.length !== LEVELS.length) {
    throw new Error("Level shells and the level catalog are out of sync.");
  }

  const View = FLOOR_VIEWS[level.index];
  if (!View) {
    return null;
  }

  return <View level={level} />;
}

"use client";

import type { LevelDefinition } from "@/level-manager/types";
import { AnalyticalEngineGame } from "@/components/levels/mechanics/AnalyticalEngineGame";

export function AdaLovelaceFloor({ level }: { level: LevelDefinition }) {
  return <AnalyticalEngineGame level={level} />;
}

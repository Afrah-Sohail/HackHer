"use client";

import type { LevelDefinition } from "@/level-manager/types";
import { AnalyticalEngineGame } from "@/components/levels/mechanics/AnalyticalEngineGame";
<<<<<<< HEAD

export function AdaLovelaceFloor({ level }: { level: LevelDefinition }) {
  return <AnalyticalEngineGame level={level} />;
=======
import { GuideAgent } from "@/components/guide/GuideAgent";

export function AdaLovelaceFloor({ level }: { level: LevelDefinition }) {
  return (
    <>
      <AnalyticalEngineGame level={level} />
      <GuideAgent key={level.slug} level={level} />
    </>
  );
>>>>>>> origin/main
}

"use client";

import { useState } from "react";
import type { LevelDefinition } from "@/level-manager/types";
import { LevelShell } from "@/components/levels/LevelShell";
import { MissionDeskMechanic } from "@/components/levels/mechanics/MissionDeskMechanic";

export function HiddenFiguresFloor({ level }: { level: LevelDefinition }) {
  const [cleared, setCleared] = useState(false);

  return (
    <LevelShell level={level} canComplete={cleared}>
      <MissionDeskMechanic onCleared={() => setCleared(true)} />
    </LevelShell>
  );
}

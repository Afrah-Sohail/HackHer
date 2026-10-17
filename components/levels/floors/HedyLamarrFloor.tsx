"use client";

import { useState } from "react";
import type { LevelDefinition } from "@/level-manager/types";
import { LevelShell } from "@/components/levels/LevelShell";
import { WaveformMechanic } from "@/components/levels/mechanics/WaveformMechanic";

export function HedyLamarrFloor({ level }: { level: LevelDefinition }) {
  const [cleared, setCleared] = useState(false);

  return (
    <LevelShell level={level} canComplete={cleared}>
      <WaveformMechanic onCleared={() => setCleared(true)} />
    </LevelShell>
  );
}

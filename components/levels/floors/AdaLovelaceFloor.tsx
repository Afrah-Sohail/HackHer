"use client";

import { useState } from "react";
import type { LevelDefinition } from "@/level-manager/types";
import { LevelShell } from "@/components/levels/LevelShell";
import { WeaveMechanic } from "@/components/levels/mechanics/WeaveMechanic";

export function AdaLovelaceFloor({ level }: { level: LevelDefinition }) {
  const [cleared, setCleared] = useState(false);

  return (
    <LevelShell level={level} canComplete={cleared}>
      <WeaveMechanic onCleared={() => setCleared(true)} />
    </LevelShell>
  );
}

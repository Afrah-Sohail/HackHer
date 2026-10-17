"use client";

import { useState } from "react";
import type { LevelDefinition } from "@/level-manager/types";
import { LevelShell } from "@/components/levels/LevelShell";
import { AlarmQueueMechanic } from "@/components/levels/mechanics/AlarmQueueMechanic";

export function MargaretHamiltonFloor({ level }: { level: LevelDefinition }) {
  const [cleared, setCleared] = useState(false);

  return (
    <LevelShell level={level} canComplete={cleared}>
      <AlarmQueueMechanic onCleared={() => setCleared(true)} />
    </LevelShell>
  );
}

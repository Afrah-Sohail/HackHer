"use client";

import { useState } from "react";
import type { LevelDefinition } from "@/level-manager/types";
import { LevelShell } from "@/components/levels/LevelShell";
import { BlueprintMechanic } from "@/components/levels/mechanics/BlueprintMechanic";

export function AdeleGoldbergFloor({ level }: { level: LevelDefinition }) {
  const [cleared, setCleared] = useState(false);

  return (
    <LevelShell level={level} canComplete={cleared}>
      <BlueprintMechanic onCleared={() => setCleared(true)} />
    </LevelShell>
  );
}

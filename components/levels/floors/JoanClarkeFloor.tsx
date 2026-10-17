"use client";

import { useState } from "react";
import type { LevelDefinition } from "@/level-manager/types";
import { LevelShell } from "@/components/levels/LevelShell";
import { LogicGridMechanic } from "@/components/levels/mechanics/LogicGridMechanic";

export function JoanClarkeFloor({ level }: { level: LevelDefinition }) {
  const [cleared, setCleared] = useState(false);

  return (
    <LevelShell level={level} canComplete={cleared}>
      <LogicGridMechanic onCleared={() => setCleared(true)} />
    </LevelShell>
  );
}

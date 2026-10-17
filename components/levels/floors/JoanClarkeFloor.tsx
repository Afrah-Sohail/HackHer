import type { LevelDefinition } from "@/level-manager/types";
import { LevelShell } from "@/components/levels/LevelShell";
import { LogicGridMechanic } from "@/components/levels/mechanics/LogicGridMechanic";

export function JoanClarkeFloor({ level }: { level: LevelDefinition }) {
  return (
    <LevelShell level={level}>
      <LogicGridMechanic />
    </LevelShell>
  );
}

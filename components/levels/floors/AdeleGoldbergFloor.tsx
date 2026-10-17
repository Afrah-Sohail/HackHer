import type { LevelDefinition } from "@/level-manager/types";
import { LevelShell } from "@/components/levels/LevelShell";
import { BlueprintMechanic } from "@/components/levels/mechanics/BlueprintMechanic";

export function AdeleGoldbergFloor({ level }: { level: LevelDefinition }) {
  return (
    <LevelShell level={level}>
      <BlueprintMechanic />
    </LevelShell>
  );
}

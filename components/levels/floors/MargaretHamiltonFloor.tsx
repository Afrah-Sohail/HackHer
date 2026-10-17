import type { LevelDefinition } from "@/level-manager/types";
import { LevelShell } from "@/components/levels/LevelShell";
import { AlarmQueueMechanic } from "@/components/levels/mechanics/AlarmQueueMechanic";

export function MargaretHamiltonFloor({ level }: { level: LevelDefinition }) {
  return (
    <LevelShell level={level}>
      <AlarmQueueMechanic />
    </LevelShell>
  );
}

import type { LevelDefinition } from "@/level-manager/types";
import { LevelShell } from "@/components/levels/LevelShell";
import { MissionDeskMechanic } from "@/components/levels/mechanics/MissionDeskMechanic";

export function HiddenFiguresFloor({ level }: { level: LevelDefinition }) {
  return (
    <LevelShell level={level}>
      <MissionDeskMechanic />
    </LevelShell>
  );
}

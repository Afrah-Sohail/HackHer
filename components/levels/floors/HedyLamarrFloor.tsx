import type { LevelDefinition } from "@/level-manager/types";
import { LevelShell } from "@/components/levels/LevelShell";
import { WaveformMechanic } from "@/components/levels/mechanics/WaveformMechanic";

export function HedyLamarrFloor({ level }: { level: LevelDefinition }) {
  return (
    <LevelShell level={level}>
      <WaveformMechanic />
    </LevelShell>
  );
}

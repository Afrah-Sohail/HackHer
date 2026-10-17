import type { LevelDefinition } from "@/level-manager/types";
import { LevelShell } from "@/components/levels/LevelShell";
import { LoomMechanic } from "@/components/levels/mechanics/LoomMechanic";

export function AdaLovelaceFloor({ level }: { level: LevelDefinition }) {
  return (
    <LevelShell level={level}>
      <LoomMechanic />
    </LevelShell>
  );
}

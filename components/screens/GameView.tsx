"use client";

import { LevelRouter } from "@/components/levels/LevelRouter";
import { useGame } from "@/state/game-context";

export function GameView() {
  const { level } = useGame();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <LevelRouter level={level} />
    </div>
  );
}

"use client";

import { useGame } from "@/state/game-context";
import { Button } from "@/components/ui/Button";

export function WelcomeScreen() {
  const { start } = useGame();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <h1 className="font-display text-7xl tracking-tight text-ink drop-shadow-[0_0_28px_rgb(176_140_255_/_0.7)] sm:text-8xl">
        HackHer
      </h1>
      <Button
        className="mt-10 px-10 py-3 text-base shadow-[0_0_28px_rgb(240_195_106_/_0.35)]"
        onClick={() => start(0)}
      >
        Start
      </Button>
    </div>
  );
}

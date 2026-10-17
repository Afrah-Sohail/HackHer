"use client";

import { useGame } from "@/state/game-context";
import { firstPlayableIndex } from "@/level-manager/progress";
import { Button } from "@/components/ui/Button";
import { UnicornSays } from "@/components/guide/Unicorn";
import { JourneyMap } from "@/components/story/JourneyMap";
import { GUIDE_NAME } from "@/guide/config";

export function WelcomeScreen() {
  const { state, cleared, start, selectLevel } = useGame();
  const next = firstPlayableIndex(state.levels);
  const started = cleared > 0;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-10 text-center">
      <h1 className="font-display text-7xl tracking-tight text-ink drop-shadow-[0_0_28px_rgb(176_140_255_/_0.7)] sm:text-8xl">
        HackHer
      </h1>
      <p className="mt-3 text-sm font-medium tracking-[0.2em] text-copper uppercase">
        Fly home
      </p>

      <p className="mt-5 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
        You&apos;re an alien stuck in our solar system, and your rocket keeps breaking
        down. On every planet, a real woman who shaped computing teaches you
        her big idea, and you use it to fix the rocket.
      </p>

      <div className="mt-6 w-full max-w-5xl">
        <JourneyMap
          current={next}
          completed={state.levels.map((level) => level.completed)}
          unlocked={state.levels.map((level) => level.unlocked)}
          onSelect={selectLevel}
        />
      </div>

      <div className="mt-6 w-full max-w-xl text-left">
        <UnicornSays size={64}>
          <strong className="text-copper">Hi, I&apos;m {GUIDE_NAME}!</strong> I&apos;m{" "}
          your space unicorn. I can&apos;t fix a rocket with hooves,
          but I can cheer you on and tell you about the women. Ready?
        </UnicornSays>
      </div>

      <Button
        className="mt-8 px-10 py-3 text-base shadow-[0_0_28px_rgb(240_195_106_/_0.35)]"
        onClick={() => start()}
      >
        {started ? "Continue the journey" : "Start the journey"}
      </Button>

      <p className="mt-8 text-sm text-ink-soft">
        Made with 💜 by <strong className="font-semibold text-ink">Afrah</strong>,{" "}
        <strong className="font-semibold text-ink">Emily</strong> &amp;{" "}
        <strong className="font-semibold text-ink">Valentina</strong>
        <br />
        Planet photos from NASA
      </p>
    </div>
  );
}

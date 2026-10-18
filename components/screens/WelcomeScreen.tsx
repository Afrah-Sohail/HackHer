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
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-5 text-center">
      <h1 className="font-star text-4xl leading-tight tracking-tight text-ink drop-shadow-[0_0_28px_rgb(176_140_255_/_0.7)] sm:text-6xl">
        Lost in Computation
      </h1>
      <p className="mt-2 text-sm font-medium tracking-[0.2em] text-copper uppercase">
        Flying home: a (very bumpy) space odyssey
      </p>

      <p className="mt-3 max-w-2xl text-base leading-6 text-ink-soft sm:text-lg sm:leading-7">
        You&apos;re an alien who flew in to study the Sun, but on the way home your
        rocket keeps breaking down. On every planet, a real woman who shaped computing teaches you
        her big idea, and you use it to fix the rocket.
      </p>

      <div className="mt-3 w-full max-w-5xl">
        <JourneyMap
          current={next}
          completed={state.levels.map((level) => level.completed)}
          unlocked={state.levels.map((level) => level.unlocked)}
          onSelect={selectLevel}
          compact
        />
      </div>

      <div className="mt-3 w-full max-w-xl text-left">
        <UnicornSays small size={52}>
          <strong className="text-copper">Hi, I&apos;m {GUIDE_NAME}!</strong> I&apos;m{" "}
          your space unicorn. I can&apos;t fix a rocket with hooves,
          but I can cheer you on and teach you about these amazing women. Ready?
        </UnicornSays>
      </div>

      <Button
        className="mt-4 px-10 py-3 text-base shadow-[0_0_28px_rgb(240_195_106_/_0.35)]"
        onClick={() => start()}
      >
        {started ? "Continue the journey" : "Start the journey"}
      </Button>

      <p className="mt-4 text-sm text-ink-soft">
        Made with 💜 by <strong className="font-semibold text-ink">Afrah</strong>,{" "}
        <strong className="font-semibold text-ink">Emily</strong> &amp;{" "}
        <strong className="font-semibold text-ink">Valentina</strong>
      </p>
    </div>
  );
}

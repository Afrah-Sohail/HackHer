"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { JourneyMap, type Travel } from "@/components/story/JourneyMap";
import { Speech } from "@/components/story/Speech";
import { JOURNEY } from "@/story/journey";
import { useGame } from "@/state/game-context";

// Timeline of the trip, in milliseconds.
const FLY = 1900; // blast off and fly along the path
const BOOM = 1000; // the engine blows up
const DRIFT = 1700; // limp down to the next planet
const TOTAL = FLY + BOOM + DRIFT;

const ease = (x: number) => {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function TravelScreen() {
  const { state, arrive } = useGame();
  const to = state.currentLevelIndex;
  const from = Math.max(0, to - 1);
  const [elapsed, setElapsed] = useState(() => (prefersReducedMotion() ? TOTAL : 0));

  useEffect(() => {
    if (elapsed >= TOTAL) return;
    let frame = 0;
    const start = performance.now() - elapsed;
    const tick = (now: number) => {
      const next = Math.min(now - start, TOTAL);
      setElapsed(next);
      if (next < TOTAL) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // Start the clock once; later updates come from the animation frames.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const landed = elapsed >= TOTAL;
  const flying = elapsed < FLY;
  const exploding = elapsed >= FLY && elapsed < FLY + BOOM;
  const drifting = elapsed >= FLY + BOOM && !landed;

  let t = 0.5 + 0.5 * ease((elapsed - FLY - BOOM) / DRIFT);
  if (flying) t = 0.5 * ease(elapsed / FLY);
  else if (elapsed < FLY + BOOM) t = 0.5;
  else if (landed) t = 1;

  const travel: Travel = {
    from,
    t,
    flame: flying,
    broken: !flying,
    boom: elapsed >= FLY && elapsed < FLY + 1400,
    wobble: landed ? 18 : drifting ? Math.sin(elapsed / 60) * 14 : 0,
  };

  const origin = JOURNEY[from];
  const destination = JOURNEY[to];
  const status = flying
    ? `🚀 Blast off from ${origin.name}!`
    : exploding
      ? `💥 ${origin.breakdown}`
      : drifting
        ? `The rocket spirals down toward ${destination.name}...`
        : `Crash landing on ${destination.name}!`;

  const completed = state.levels.map(
    (level, i) => level.completed && !(i === from && !landed),
  );
  const unlocked = state.levels.map(
    (level, i) => level.unlocked && !(i === to && !landed),
  );

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-6 px-4 py-8 sm:px-6">
      <JourneyMap current={to} completed={completed} unlocked={unlocked} travel={travel} />

      <p
        className="text-center font-display text-2xl text-ink sm:text-3xl"
        aria-live="polite"
      >
        {status}
      </p>

      {landed ? (
        <div className="mx-auto grid w-full max-w-2xl gap-3">
          <Speech speaker="blip">Not again! Ugh. Okay, we&apos;re on {destination.name}.</Speech>
          <Speech speaker="sparkles">
            Don&apos;t worry, Blip. Someone here can help you fix it!
          </Speech>
          <div className="mt-2 flex justify-center">
            <Button className="px-10 py-3.5 text-lg" onClick={arrive}>
              Look around {destination.name} →
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="px-5 py-2.5 text-base"
            onClick={() => setElapsed(TOTAL)}
          >
            Skip
          </Button>
        </div>
      )}
    </div>
  );
}

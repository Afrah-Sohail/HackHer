"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { JourneyMap, type Travel } from "@/components/story/JourneyMap";
import { ArrivalChat } from "@/components/story/ArrivalChat";
import { JOURNEY } from "@/story/journey";
import { useGame } from "@/state/game-context";

// Timeline of the trip, in milliseconds.
const FLY = 2700; // blast off and fly along the path
const BOOM = 2200; // the engine blows up
const DRIFT = 2800; // limp down to the next planet
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
  const [ticked, setElapsed] = useState(() => (prefersReducedMotion() ? TOTAL : 0));
  const [skipped, setSkipped] = useState(false);
  // Skip jumps to the end and stays there, even while the clock still ticks.
  const elapsed = skipped ? TOTAL : ticked;

  useEffect(() => {
    if (ticked >= TOTAL) return;
    let frame = 0;
    const start = performance.now() - ticked;
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
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-3 px-4 py-4 sm:px-6">
      <JourneyMap current={to} completed={completed} unlocked={unlocked} travel={travel} compact />

      <p
        className="text-center font-display text-xl text-ink sm:text-2xl"
        aria-live="polite"
      >
        {status}
      </p>

      {landed ? (
        <ArrivalChat index={to} onDone={arrive} />
      ) : (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="px-5 py-2.5 text-base"
            onClick={() => setSkipped(true)}
          >
            Skip
          </Button>
        </div>
      )}
    </div>
  );
}

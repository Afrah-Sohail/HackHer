"use client";

import { useEffect, useState } from "react";
import { LEVEL_COUNT } from "@/level-manager/types";
import { useGame } from "@/state/game-context";
import { Button } from "@/components/ui/Button";
import { StarConfetti } from "@/components/ui/StarConfetti";
import { JourneyMap, type Travel } from "@/components/story/JourneyMap";
import { Speech } from "@/components/story/Speech";
import { JOURNEY } from "@/story/journey";

const FLIGHT = 3400; // Last planet to Home, in milliseconds

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

// The ending: the rocket is finally fixed and flies off the end of the path.
export function VictoryScreen() {
  const { state, score, cleared, showWelcome, restart } = useGame();
  const allCleared = cleared === LEVEL_COUNT;
  const [elapsed, setElapsed] = useState(() =>
    !allCleared || prefersReducedMotion() ? FLIGHT : 0,
  );

  useEffect(() => {
    if (elapsed >= FLIGHT) return;
    let frame = 0;
    const start = performance.now() - elapsed;
    const tick = (now: number) => {
      const next = Math.min(now - start, FLIGHT);
      setElapsed(next);
      if (next < FLIGHT) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // Start the clock once; later updates come from the animation frames.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const home = elapsed >= FLIGHT;
  const travel: Travel | undefined = home
    ? undefined
    : {
        from: LEVEL_COUNT - 1,
        t: ease(elapsed / FLIGHT),
        flame: true,
        broken: false,
        boom: false,
        wobble: 0,
      };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-6 px-4 py-8 sm:px-6">
      {allCleared && home && <StarConfetti count={90} seed={11} />}

      <h1 className="text-center font-display text-4xl text-ink sm:text-6xl">
        {allCleared ? (home ? "You're home! 🏠" : "Blast off!") : `You reached ${JOURNEY[LEVEL_COUNT - 1].name}!`}
      </h1>

      <JourneyMap
        current={LEVEL_COUNT - 1}
        completed={state.levels.map((level) => level.completed)}
        unlocked={state.levels.map((level) => level.unlocked)}
        travel={allCleared ? travel : undefined}
        atHome={allCleared && home}
      />

      {home && (
        <div className="mx-auto grid w-full max-w-2xl gap-3">
          {allCleared ? (
            <>
              <Speech speaker="you">
                I made it! Every planet taught me something new. Thank you,
                everyone!
              </Speech>
              <Speech speaker="sparkles">
                I&apos;m so proud of you both. I did the cheering, you did the
                fixing! You learned loops, hopping, logic, functions, priority
                queues and classes.
              </Speech>
            </>
          ) : (
            <Speech speaker="sparkles">
              You made it to the last planet! Some planets are still waiting,
              so tap one on the map to fix the rest of the rocket.
            </Speech>
          )}
          <p className="text-center font-display text-3xl text-ink">{score} pts</p>
          <ul className="mx-auto grid w-full max-w-md gap-1 text-sm text-ink-soft sm:grid-cols-2 sm:gap-x-10">
            {JOURNEY.map((planet, i) => (
              <li key={planet.planet} className="flex justify-between gap-3">
                <span className="text-ink">{planet.name}</span>
                <span className={state.levels[i]?.completed ? "text-signal" : "text-ink-soft"}>
                  {state.levels[i]?.completed ? "Fixed" : "Still broken"}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Button className="px-8 py-3 text-lg" onClick={showWelcome}>
              Back to the map
            </Button>
            <Button variant="secondary" className="px-8 py-3 text-lg" onClick={restart}>
              Play again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

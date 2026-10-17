"use client";

import { LEVELS } from "@/level-manager/catalog";
import { LEVEL_COUNT } from "@/level-manager/types";
import { useGame } from "@/state/game-context";
import { Button } from "@/components/ui/Button";
import { UnicornSays } from "@/components/guide/Unicorn";
import { GUIDE_NAME } from "@/guide/config";

export function VictoryScreen() {
  const { state, score, cleared, showWelcome, restart } = useGame();
  const archiveCleared = cleared === LEVEL_COUNT;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-xs font-medium tracking-[0.18em] text-copper uppercase">
        Level 6 complete
      </p>
      <h1 className="mt-3 font-display text-5xl leading-none text-ink sm:text-6xl">
        {archiveCleared ? "The archive is clear." : "Level 6 is clear."}
      </h1>
      <div className="mt-6 max-w-xl">
        <UnicornSays tone="happy" size={72}>
          <strong className="text-copper">{GUIDE_NAME} cheers!</strong>{" "}
          {archiveCleared
            ? "You did it! You learned loops, frequency hopping, logic gates, functions, priority queues and classes, one pioneer at a time. I'm so proud of you!"
            : "You reached the last level! Earlier levels can still be cleared from the list below."}
        </UnicornSays>
      </div>
      <p className="mt-6 font-display text-3xl text-ink">{score} pts</p>
      <ul className="mt-8 divide-y divide-line rounded-2xl border border-line bg-paper-raised">
        {LEVELS.map((level) => {
          const completed = state.levels[level.index]?.completed === true;
          return (
            <li
              key={level.slug}
              className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
            >
              <span className="text-ink">
                Level {level.floor}
                <span className="text-ink-soft"> · {level.pioneer}</span>
              </span>
              <span className={completed ? "text-signal" : "text-ink-soft"}>
                {completed ? "Cleared" : "Open"}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={showWelcome}>Back to levels</Button>
        <Button variant="secondary" onClick={restart}>
          Restart
        </Button>
      </div>
    </div>
  );
}

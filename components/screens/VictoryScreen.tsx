"use client";

import { LEVELS } from "@/level-manager/catalog";
import { LEVEL_COUNT } from "@/level-manager/types";
import { useGame } from "@/state/game-context";
import { Button } from "@/components/ui/Button";

export function VictoryScreen() {
  const { state, score, cleared, showWelcome, restart } = useGame();
  const archiveCleared = cleared === LEVEL_COUNT;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-xs font-medium tracking-[0.18em] text-copper uppercase">
        Floor 6 complete
      </p>
      <h1 className="mt-3 font-display text-5xl leading-none text-ink sm:text-6xl">
        {archiveCleared ? "The archive is clear." : "Floor 6 is clear."}
      </h1>
      <p className="mt-5 max-w-xl text-base leading-7 text-ink-soft">
        {archiveCleared
          ? "All six floors are cleared. The shells are ready for their real mechanics."
          : "This run reached the last floor. Earlier floors can still be cleared from the list."}
      </p>
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
                Floor {level.floor}
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
        <Button onClick={showWelcome}>Back to floors</Button>
        <Button variant="secondary" onClick={restart}>
          Restart
        </Button>
      </div>
    </div>
  );
}

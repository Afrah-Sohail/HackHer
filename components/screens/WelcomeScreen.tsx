"use client";

import { LEVELS } from "@/level-manager/catalog";
import { firstPlayableIndex } from "@/level-manager/progress";
import { useGame } from "@/state/game-context";
import { Button } from "@/components/ui/Button";
import { ConceptBadge } from "@/components/ui/ConceptBadge";

export function WelcomeScreen() {
  const { state, cleared, start, selectLevel } = useGame();
  const continueIndex = firstPlayableIndex(state.levels);
  const continueLevel = LEVELS[continueIndex];
  const archiveCleared = state.levels.every((level) => level.completed);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:py-12">
      <section className="lg:sticky lg:top-36 lg:self-start">
        <p className="text-xs font-medium tracking-[0.18em] text-copper uppercase">
          Six floors
        </p>
        <h1 className="mt-3 font-display text-5xl leading-none text-ink sm:text-6xl">
          HackHer
        </h1>
        <p className="mt-5 max-w-md text-base leading-7 text-ink-soft">
          A floor for each pioneer, and the computer-science idea she helped
          make real. The puzzles are still shells. Clearing a floor unlocks the
          next.
        </p>
        <Button className="mt-6" onClick={() => start(continueIndex)}>
          {archiveCleared
            ? `Replay Floor ${continueLevel.floor}`
            : cleared === 0
              ? `Begin Floor ${continueLevel.floor}`
              : `Continue Floor ${continueLevel.floor}`}
        </Button>
      </section>
      <ol className="grid gap-3">
        {LEVELS.map((level) => {
          const progress = state.levels[level.index];
          const unlocked = progress?.unlocked === true;
          const completed = progress?.completed === true;
          const status = completed ? "Cleared" : unlocked ? "Open" : "Locked";

          return (
            <li
              key={level.slug}
              className="rounded-2xl border border-line bg-paper-raised p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium tracking-[0.16em] text-ink-soft uppercase">
                    Floor {level.floor}
                    <span className="px-2 text-line">/</span>
                    {status}
                  </p>
                  <h2 className="mt-1 font-display text-2xl leading-tight text-ink">
                    {level.title}
                  </h2>
                  <p className="mt-1 text-sm text-ink-soft">{level.pioneer}</p>
                </div>
                <Button
                  variant="secondary"
                  disabled={!unlocked}
                  onClick={() => selectLevel(level.index)}
                >
                  {completed ? "Replay" : unlocked ? "Enter" : "Locked"}
                </Button>
              </div>
              <div className="mt-3">
                <ConceptBadge label={level.concept} />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

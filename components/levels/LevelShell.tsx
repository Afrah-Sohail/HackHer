"use client";

import type { ReactNode } from "react";
import type { LevelDefinition } from "@/level-manager/types";
import { useGame } from "@/state/game-context";
import { Button } from "@/components/ui/Button";
import { GuideAgent } from "@/components/guide/GuideAgent";

export function LevelShell({
  level,
  children,
  canComplete: canCompleteProp,
}: {
  level: LevelDefinition;
  children: ReactNode;
  canComplete?: boolean;
}) {
  const { completeLevel } = useGame();
  // Levels with a real game pass canComplete; stub levels leave it unset.
  const isStub = canCompleteProp === undefined;
  const canComplete = canCompleteProp ?? true;
  const isFinalLevel = level.floor === 6;

  return (
    <article className="overflow-hidden rounded-3xl border border-line bg-paper-raised shadow-sm">
      <header className="border-b border-line px-5 py-5 sm:px-8">
        <p className="text-xs font-medium tracking-[0.18em] text-copper uppercase">
          Level {level.floor}
        </p>
        <h1 className="mt-1 font-display text-2xl leading-tight text-ink sm:text-3xl">
          <strong className="font-bold">{level.pioneer}</strong>
          <span className="font-normal">: {level.heading}</span>
        </h1>
        <div className="mt-3">
          <details className="group text-sm text-ink-soft">
            <summary className="cursor-pointer select-none text-copper hover:text-ink">
              About this level
            </summary>
            <p className="mt-2 max-w-2xl leading-6">{level.narrative}</p>
          </details>
        </div>
      </header>
      <section aria-label={level.mechanicLabel} className="px-5 py-6 sm:px-8">
        <p className="mb-4 text-xs font-medium tracking-[0.16em] text-ink-soft uppercase">
          {level.mechanicLabel}{isStub ? " shell" : ""}
        </p>
        {children}
      </section>
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-paper px-5 py-4 sm:px-8">
        <p className="text-sm text-ink-soft">
          {!canComplete
            ? "Solve it to clear this level."
            : isFinalLevel
              ? "Clear it to finish the game."
              : "Clear it to unlock the next level."}
        </p>
        <Button onClick={() => completeLevel()} disabled={!canComplete}>
          Complete Level
        </Button>
      </footer>
      <GuideAgent key={level.slug} level={level} />
    </article>
  );
}

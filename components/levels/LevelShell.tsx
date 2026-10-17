"use client";

import type { ReactNode } from "react";
import type { LevelDefinition } from "@/level-manager/types";
import { useGame } from "@/state/game-context";
import { Button } from "@/components/ui/Button";
import { ConceptBadge } from "@/components/ui/ConceptBadge";
import { GuideAgent } from "@/components/guide/GuideAgent";

export function LevelShell({
  level,
  children,
}: {
  level: LevelDefinition;
  children: ReactNode;
}) {
  const { completeLevel } = useGame();
  const isFinalFloor = level.floor === 6;

  return (
    <article className="overflow-hidden rounded-3xl border border-line bg-paper-raised shadow-sm">
      <header className="border-b border-line px-5 py-6 sm:px-8">
        <p className="text-xs font-medium tracking-[0.18em] text-copper uppercase">
          Floor {level.floor}
        </p>
        <h1 className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">
          {level.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-ink-soft">
          {level.narrative}
        </p>
        <div className="mt-4">
          <ConceptBadge label={level.concept} />
        </div>
      </header>
      <section aria-label={level.mechanicLabel} className="px-5 py-6 sm:px-8">
        <p className="mb-4 text-xs font-medium tracking-[0.16em] text-ink-soft uppercase">
          {level.mechanicLabel} shell
        </p>
        {children}
      </section>
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-paper px-5 py-4 sm:px-8">
        <p className="text-sm text-ink-soft">
          {isFinalFloor
            ? "Clearing this floor opens the victory screen."
            : "Clearing this floor unlocks the next one."}
        </p>
        <Button onClick={completeLevel}>Complete Level</Button>
      </footer>
      <GuideAgent key={level.slug} level={level} />
    </article>
  );
}

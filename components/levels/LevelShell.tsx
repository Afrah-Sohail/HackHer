"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { LevelDefinition } from "@/level-manager/types";
import { useGame } from "@/state/game-context";
import { Button } from "@/components/ui/Button";
import { GuideAgent } from "@/components/guide/GuideAgent";
import { StarConfetti } from "@/components/ui/StarConfetti";
import { PlanetBackdrop } from "@/components/story/PlanetBackdrop";
import { JOURNEY } from "@/story/journey";

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
  const footerRef = useRef<HTMLElement>(null);
  const story = JOURNEY[level.index];

  // The Complete button only appears once the level is solved; bring it into
  // view so the player always sees what to do next.
  useEffect(() => {
    if (canCompleteProp !== true) return;
    footerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [canCompleteProp]);

  return (
    <>
    <PlanetBackdrop planet={story.planet} />
    <article className="overflow-hidden rounded-3xl border border-line bg-paper-raised/75 shadow-sm">
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line px-5 py-2 sm:px-8">
        <h1 className="font-display text-xl leading-tight text-ink sm:text-2xl">
          <strong className="font-bold">{level.pioneer}</strong>
          <span className="font-normal">: {level.heading}</span>
        </h1>
        <details className="group text-sm text-ink-soft">
          <summary className="cursor-pointer select-none text-copper hover:text-ink">
            About this level
          </summary>
          <p className="mt-2 max-w-2xl leading-6">{level.narrative}</p>
        </details>
      </header>
      <section aria-label={`${level.mechanicLabel}${isStub ? " shell" : ""}`} className="px-5 py-4 sm:px-8">
        {children}
      </section>
      {canComplete && (
        <footer
          ref={footerRef}
          className="flex flex-wrap items-center justify-between gap-4 border-t border-line bg-paper px-5 py-3 sm:px-8"
        >
          <p className="text-base text-ink-soft">
            {story.fixed} {isFinalLevel ? "Time to fly home!" : "Ready to blast off?"}
          </p>
          <Button className="px-10 py-2.5 text-lg" onClick={() => completeLevel()}>
            {isFinalLevel ? "Fly home 🚀" : "Blast off 🚀"}
          </Button>
        </footer>
      )}
      {canCompleteProp === true && <StarConfetti />}
      <GuideAgent key={level.slug} level={level} />
    </article>
    </>
  );
}

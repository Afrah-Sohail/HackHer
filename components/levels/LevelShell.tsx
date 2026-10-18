"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { LevelDefinition } from "@/level-manager/types";
import { useGame } from "@/state/game-context";
import { Button } from "@/components/ui/Button";
import { GuideAgent } from "@/components/guide/GuideAgent";
import { StarConfetti } from "@/components/ui/StarConfetti";
import { PlanetBackdrop } from "@/components/story/PlanetBackdrop";
import { JOURNEY } from "@/story/journey";
import { LevelStatsProvider, scoreFor, useLevelStats } from "./LevelStats";

type ShellProps = {
  level: LevelDefinition;
  children: ReactNode;
  canComplete?: boolean;
};

// Tracks how the level goes (slips, hints, style) so the score can reflect it.
export function LevelShell(props: ShellProps) {
  return (
    <LevelStatsProvider>
      <LevelShellInner {...props} />
    </LevelStatsProvider>
  );
}

function LevelShellInner({
  level,
  children,
  canComplete: canCompleteProp,
}: ShellProps) {
  const { completeLevel } = useGame();
  const { result } = useLevelStats();
  const score = scoreFor(result);
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
    <article className="flex min-h-[var(--box-min,0px)] flex-col overflow-hidden rounded-3xl border border-line bg-paper-raised/75 shadow-sm">
      <header className="relative flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line px-5 py-2 sm:px-8">
        <h1 className="font-display text-xl leading-tight text-ink sm:text-2xl">
          <strong className="font-star font-normal tracking-wide">{level.pioneer}</strong>
          <span className="font-normal">: {level.heading}</span>
        </h1>
        {/* A popover, so opening it never pushes the game down. */}
        <details className="group text-lg text-ink-soft">
          <summary className="cursor-pointer select-none text-copper hover:text-ink">
            About this level
          </summary>
          <p className="absolute top-full right-4 z-20 mt-1 w-[min(28rem,calc(100%-2rem))] rounded-2xl border border-line bg-paper-raised p-4 text-base leading-7 text-ink shadow-xl sm:right-8">
            {level.narrative}
          </p>
        </details>
      </header>
      <section aria-label={`${level.mechanicLabel}${isStub ? " shell" : ""}`} className="flex-1 px-5 py-4 sm:px-8">
        {children}
      </section>
      {canComplete && (
        <footer
          ref={footerRef}
          className="flex flex-col items-center gap-3 border-t border-line bg-paper px-5 py-4 text-center [zoom:calc(1/var(--fit,1))] sm:px-8"
        >
          <p className="text-3xl text-ink">
            {story.fixed} {isFinalLevel ? "Time to fly home!" : "Ready to blast off?"}
          </p>
          <p className="text-2xl text-ink-soft" aria-live="polite">
            <strong className="text-copper">{score.total} points</strong>
            {" · "}clear {score.base}
            {score.clean > 0 ? ` · clean solve +${score.clean}` : ""}
            {score.curious > 0 ? ` · curious +${score.curious}` : ""}
            {score.style > 0 ? ` · ${score.styleLabel || "bonus"} +${score.style}` : ""}
          </p>
          <Button className="min-w-[28rem] px-28 py-7 text-5xl" onClick={() => completeLevel(score.total)}>
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

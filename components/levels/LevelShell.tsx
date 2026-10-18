"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import type { LevelDefinition } from "@/level-manager/types";
import { useGame } from "@/state/game-context";
import { Button } from "@/components/ui/Button";
import { GuideAgent } from "@/components/guide/GuideAgent";
import { StarConfetti } from "@/components/ui/StarConfetti";
import { PlanetBackdrop } from "@/components/story/PlanetBackdrop";
import { JOURNEY } from "@/story/journey";
import { LevelStatsProvider, scoreFor, useLevelStats } from "./LevelStats";

// Extra height, in pixels, kept free for what appears as you play.
const BOX_ROOM = 110;

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
  const articleRef = useRef<HTMLElement>(null);
  const story = JOURNEY[level.index];

  // Keep the box one size while you play. It starts with room for the things
  // that show up later (Sparkles' message, the next buttons) and only ever grows.
  useLayoutEffect(() => {
    const el = articleRef.current;
    if (!el) return;
    let floor = el.offsetHeight + BOX_ROOM;
    el.style.minHeight = `${floor}px`;
    const observer = new ResizeObserver(() => {
      if (el.offsetHeight > floor) {
        floor = el.offsetHeight;
        el.style.minHeight = `${floor}px`;
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The Complete button only appears once the level is solved; bring it into
  // view so the player always sees what to do next.
  useEffect(() => {
    if (canCompleteProp !== true) return;
    footerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [canCompleteProp]);

  return (
    <>
    <PlanetBackdrop planet={story.planet} />
    <article ref={articleRef} className="overflow-hidden rounded-3xl border border-line bg-paper-raised/75 shadow-sm">
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
      <section aria-label={`${level.mechanicLabel}${isStub ? " shell" : ""}`} className="px-5 py-4 sm:px-8">
        {children}
      </section>
      {canComplete && (
        <footer
          ref={footerRef}
          className="flex flex-col items-center gap-3 border-t border-line bg-paper px-5 py-4 text-center sm:px-8"
        >
          <p className="text-xl text-ink">
            {story.fixed} {isFinalLevel ? "Time to fly home!" : "Ready to blast off?"}
          </p>
          <p className="text-lg text-ink-soft" aria-live="polite">
            <strong className="text-copper">{score.total} points</strong>
            {" · "}clear {score.base}
            {score.clean > 0 ? ` · clean solve +${score.clean}` : ""}
            {score.curious > 0 ? ` · curious +${score.curious}` : ""}
            {score.style > 0 ? ` · style +${score.style}` : ""}
          </p>
          <Button className="px-16 py-4 text-2xl" onClick={() => completeLevel(score.total)}>
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

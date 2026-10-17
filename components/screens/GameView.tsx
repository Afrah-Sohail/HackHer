"use client";

import { useLayoutEffect, useRef } from "react";
import { LevelRouter } from "@/components/levels/LevelRouter";
import { useGame } from "@/state/game-context";

const MIN_ZOOM = 0.55;
const HEADROOM = 0.9;

// Shrinks the game just enough to fit on one screen, so nobody has to scroll
// up and down while playing.
export function GameView() {
  const { level } = useGame();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // The zoom is picked once per level (with a little headroom) and then only
    // goes down if a later round really needs it, so the game box stays the
    // same size as you play.
    let locked: number | null = null;

    const fit = () => {
      const header = document.querySelector("header");
      const room = window.innerHeight - (header?.getBoundingClientRect().height ?? 0);
      // Measure at full size, then pick the zoom (no paint in between).
      el.style.zoom = "1";
      const need = Math.min(1, Math.max(MIN_ZOOM, room / el.offsetHeight));
      locked =
        locked === null
          ? need < 1
            ? Math.max(MIN_ZOOM, need * HEADROOM)
            : 1
          : Math.min(locked, need);
      el.style.zoom = locked < 0.995 ? String(locked) : "1";
    };

    const refit = () => {
      locked = null;
      fit();
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    window.addEventListener("resize", refit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", refit);
    };
  }, [level.index]);

  return (
    <div ref={ref} className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6">
      <LevelRouter level={level} />
    </div>
  );
}

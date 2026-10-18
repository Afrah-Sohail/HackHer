"use client";

import { useLayoutEffect, useRef } from "react";
import { LevelRouter } from "@/components/levels/LevelRouter";
import { useGame } from "@/state/game-context";

const MIN_ZOOM = 0.7;
const MIN_ZOOM_PHONE = 0.85; // phones just scroll, so keep the text readable
const MAX_WIDTH = 1240; // the game box never gets wider than this, on screen (the sides show the planet)
// The game box keeps its own room for what shows up later, so no extra here.
const RESERVE = 0;

// Shrinks the game just enough to fit on one screen, so nobody has to scroll
// up and down while playing.
export function GameView() {
  const { level } = useGame();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // The zoom is picked once per level (with room for the feedback bubble) and then only
    // goes down if a later round really needs it, so the game box stays the
    // same size as you play.
    let locked: number | null = null;

    const fit = () => {
      const header = document.querySelector("header");
      const room = window.innerHeight - (header?.getBoundingClientRect().height ?? 0);
      // Measure at full size, then pick the zoom (no paint in between).
      el.style.zoom = "1";
      el.style.maxWidth = `${MAX_WIDTH}px`;
      const height = el.offsetHeight;
      const floor = window.innerWidth < 768 ? MIN_ZOOM_PHONE : MIN_ZOOM;
      const clamp = (value: number) => Math.min(1, Math.max(floor, value));
      // The first fit leaves room for the feedback bubble; after that the zoom
      // only drops if the content truly no longer fits.
      locked = locked === null ? clamp(room / (height + RESERVE)) : Math.min(locked, clamp(room / height));
      el.style.zoom = locked < 0.995 ? String(locked) : "1";
      // Lets parts of the page (like the Blast off footer) undo the shrink.
      el.style.setProperty("--fit", locked < 0.995 ? String(locked) : "1");
      // Zoom shrinks pixel sizes too, so give the max width back what it lost.
      if (locked < 0.995) el.style.maxWidth = `${MAX_WIDTH / locked}px`;
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
    <div ref={ref} className="mx-auto w-full px-4 py-3 sm:px-6">
      <LevelRouter level={level} />
    </div>
  );
}

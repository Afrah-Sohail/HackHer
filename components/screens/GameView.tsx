"use client";

import { useLayoutEffect, useRef } from "react";
import { LevelRouter } from "@/components/levels/LevelRouter";
import { useGame } from "@/state/game-context";

const MIN_ZOOM = 0.55;

// Shrinks the game just enough to fit on one screen, so nobody has to scroll
// up and down while playing.
export function GameView() {
  const { level } = useGame();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      const header = document.querySelector("header");
      const room = window.innerHeight - (header?.getBoundingClientRect().height ?? 0);
      // Measure at full size, then pick the zoom (no paint in between).
      el.style.zoom = "1";
      const zoom = Math.min(1, Math.max(MIN_ZOOM, room / el.offsetHeight));
      el.style.zoom = zoom < 0.995 ? String(zoom) : "1";
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    window.addEventListener("resize", fit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [level.index]);

  return (
    <div ref={ref} className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6">
      <LevelRouter level={level} />
    </div>
  );
}

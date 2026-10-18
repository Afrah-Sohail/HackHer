"use client";

import { useLayoutEffect, useRef } from "react";
import { LevelRouter } from "@/components/levels/LevelRouter";
import { useGame } from "@/state/game-context";

const MIN_ZOOM = 0.7;
const MIN_ZOOM_PHONE = 0.85; // phones just scroll, so keep the text readable
const MAX_WIDTH = 1240; // the game box never gets wider than this, on screen (the sides show the planet)
// Room kept in the zoom for what shows up later (Sparkles' message, the next
// buttons), so the box can grow without the whole game zooming out.
const RESERVE = 140;

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
    let fitting = false;

    const apply = (zoom: number) => {
      const text = zoom < 0.995 ? String(zoom) : "1";
      if (el.style.zoom === text) return;
      el.style.zoom = text;
      // Lets parts of the page (like the Blast off footer) undo the shrink.
      el.style.setProperty("--fit", text);
      // Zoom shrinks pixel sizes too, so give the max width back what it lost.
      el.style.maxWidth = zoom < 0.995 ? `${MAX_WIDTH / zoom}px` : `${MAX_WIDTH}px`;
    };

    const fit = () => {
      if (fitting) return;
      fitting = true;
      const header = document.querySelector("header");
      const room = window.innerHeight - (header?.getBoundingClientRect().height ?? 0);
      // Read the article, not the shell around it. The shell's height eases
      // toward the content, and measuring that animation walks the zoom down
      // so the puzzle boxes shrink while Sparkles appears.
      const article = el.querySelector("article");
      const shell = article?.parentElement ?? null;
      const scope = article ?? el;
      let ignored = 0;
      for (const node of scope.querySelectorAll<HTMLElement>("[data-fit-ignore]")) {
        ignored += node.offsetHeight;
      }
      const chrome = shell ? Math.max(0, el.offsetHeight - shell.offsetHeight) : 0;
      const height = Math.max(1, scope.offsetHeight - ignored + chrome);
      // Her comment is allowed to use the spare room, or scroll. It is not
      // allowed to zoom the puzzle boxes down.
      if (ignored > 0 && locked !== null) {
        fitting = false;
        return;
      }
      const floor = window.innerWidth < 768 ? MIN_ZOOM_PHONE : MIN_ZOOM;
      const clamp = (value: number) => Math.min(1, Math.max(floor, value));
      // The first fit leaves room for the feedback bubble; after that the zoom
      // only drops if the content truly no longer fits.
      const needed =
        locked === null ? clamp(room / (height + RESERVE)) : clamp(room / height);
      const next = locked === null ? needed : Math.min(locked, needed);
      // Sub-pixel jitter must not walk the zoom down when Sparkles appears.
      if (locked !== null && next > locked - 0.01) {
        fitting = false;
        return;
      }
      locked = next;
      apply(next);
      fitting = false;
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

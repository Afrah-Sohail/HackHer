"use client";

import { useState } from "react";
import { LEVELS } from "@/level-manager/catalog";
import { useGame } from "@/state/game-context";

export function DebugPanel() {
  const { state, jumpToLevel, forceWin } = useGame();
  const [open, setOpen] = useState(false);

  return (
    <aside className="fixed bottom-4 left-4 z-30 max-w-[calc(100vw-2rem)]">
      <div className="rounded-2xl border border-line bg-paper-raised/95 p-2 shadow-lg shadow-ink/10 backdrop-blur">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className="rounded-full px-3 py-1.5 text-xs font-medium tracking-wide text-ink-soft uppercase hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper"
        >
          Debug
        </button>
        {open ? (
          <div className="mt-2 flex max-w-sm flex-wrap gap-1.5 border-t border-line pt-2">
            {LEVELS.map((level) => {
              const active =
                state.screen === "playing" &&
                state.currentLevelIndex === level.index;

              return (
                <button
                  key={level.slug}
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => jumpToLevel(level.index)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${
                    active
                      ? "bg-ink text-paper-raised"
                      : "bg-paper text-ink hover:bg-signal-soft"
                  }`}
                >
                  Floor {level.floor}
                </button>
              );
            })}
            <button
              type="button"
              onClick={forceWin}
              disabled={state.screen === "victory"}
              className="rounded-full bg-copper px-2.5 py-1 text-xs font-medium text-paper-raised hover:bg-copper-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper"
            >
              Force Win
            </button>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

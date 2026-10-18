"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { LEVELS } from "@/level-manager/catalog";
import { useGame } from "@/state/game-context";

const HIDE_KEY = "debug-hidden";

// Whether the panel is hidden, kept outside React so the server render (always
// "shown") and the browser (which knows its screen) can agree after hydration.
let override: boolean | null = null;
const listeners = new Set<() => void>();

// Hidden by default on phones (until someone turns it on with Shift+D).
function readHidden(): boolean {
  if (override !== null) return override;
  try {
    const saved = window.localStorage.getItem(HIDE_KEY);
    if (saved !== null) return saved === "1";
  } catch {
    // Fall through to the screen-size default.
  }
  return window.innerWidth < 768;
}

function writeHidden(next: boolean) {
  override = next;
  try {
    window.localStorage.setItem(HIDE_KEY, next ? "1" : "0");
  } catch {
    // The panel still changes for this visit if storage is blocked.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function DebugPanel() {
  const { state, jumpToLevel, forceWin } = useGame();
  const [open, setOpen] = useState(false);
  const hidden = useSyncExternalStore(subscribe, readHidden, () => false);

  // Shift+D hides or brings back the panel.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (event.shiftKey && event.key.toLowerCase() === "d") {
        writeHidden(!hidden);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hidden]);

  if (hidden) return null;

  return (
    <aside className="fixed bottom-20 left-4 z-30 max-w-[calc(100vw-2rem)]">
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
                  Level {level.floor}
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
            <button
              type="button"
              onClick={() => writeHidden(true)}
              title="Shift+D brings it back"
              className="rounded-full border border-line px-2.5 py-1 text-xs font-medium text-ink-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper"
            >
              Hide (Shift+D)
            </button>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

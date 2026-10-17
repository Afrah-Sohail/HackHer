"use client";

import { LEVEL_COUNT } from "@/level-manager/types";
import { ConceptBadge } from "@/components/ui/ConceptBadge";
import { useGame } from "@/state/game-context";
import { JOURNEY } from "@/story/journey";

export function GameHeader() {
  const { state, level, score, cleared, showWelcome } = useGame();
  const inLobby = state.screen === "welcome";
  const clearedArchive = state.screen === "victory";

  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            data-plain
            onClick={showWelcome}
            className="font-display text-2xl tracking-tight text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper"
          >
            HackHer
          </button>
          <p className="text-sm text-ink-soft">
            <span className="font-medium text-ink">{score}</span> pts
            <span className="px-2 text-line">/</span>
            {cleared}/{LEVEL_COUNT} levels
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-xs font-semibold tracking-[0.14em] text-copper uppercase">
            {inLobby ? "Lobby" : clearedArchive ? "Archive clear" : `Level ${level.floor} · ${JOURNEY[level.index].name}`}
          </span>
          <span className="font-medium text-ink">
            {inLobby ? "Choose a level" : level.pioneer}
          </span>
          {inLobby ? null : <ConceptBadge label={level.concept} />}
        </div>
        <div
          className="h-1 overflow-hidden rounded-full bg-line"
          role="meter"
          aria-label="Levels cleared"
          aria-valuemin={0}
          aria-valuemax={LEVEL_COUNT}
          aria-valuenow={cleared}
        >
          <div
            className="h-full rounded-full bg-signal"
            style={{ width: `${(cleared / LEVEL_COUNT) * 100}%` }}
          />
        </div>
      </div>
    </header>
  );
}

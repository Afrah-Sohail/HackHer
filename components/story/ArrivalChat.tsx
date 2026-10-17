"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { getLevel } from "@/level-manager";
import { JOURNEY } from "@/story/journey";
import { Speech } from "./Speech";

// Only the latest few lines stay up, so the scene fits on one screen.
const MAX_VISIBLE = 3;

// "Ada Lovelace" -> "AL"; a group of women gets a star.
function badgeFor(pioneer: string): string {
  if (/[&,]/.test(pioneer)) return "★";
  return pioneer
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}

// The conversation after you land: you, the woman of the planet and Sparkles
// talk one line at a time, under the map. Then you head into the game.
export function ArrivalChat({ index, onDone }: { index: number; onDone: () => void }) {
  const story = JOURNEY[index];
  const pioneer = getLevel(index)?.pioneer ?? "";
  // The narrator line is already told by the animation.
  const beats = story.arrival.filter((beat) => beat.speaker !== "narrator");
  const [shown, setShown] = useState(1);
  const last = shown >= beats.length;

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-3">
      <div className="grid gap-3" aria-live="polite">
        {beats.slice(Math.max(0, shown - MAX_VISIBLE), shown).map((beat, i) => (
          <Speech
            key={i}
            speaker={beat.speaker}
            womanName={pioneer}
            womanBadge={badgeFor(pioneer)}
          >
            {beat.text}
          </Speech>
        ))}
      </div>
      <div className="flex justify-center">
        <Button
          className="px-10 py-3 text-lg"
          onClick={last ? onDone : () => setShown((count) => count + 1)}
        >
          {last ? "Fix the rocket →" : "Next"}
        </Button>
      </div>
    </div>
  );
}

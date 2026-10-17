"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { getLevel } from "@/level-manager";
import { JOURNEY } from "@/story/journey";
import { Speech } from "./Speech";

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
  const listRef = useRef<HTMLDivElement>(null);

  // Every line stays; the list scrolls down to the newest one.
  useEffect(() => {
    const list = listRef.current;
    list?.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [shown]);

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-3">
      <div ref={listRef} className="grid max-h-[40vh] gap-3 overflow-y-auto" aria-live="polite">
        {beats.slice(0, shown).map((beat, i) => (
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

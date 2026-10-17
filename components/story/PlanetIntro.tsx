"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { LevelDefinition } from "@/level-manager/types";
import { JOURNEY } from "@/story/journey";
import { Planet } from "./Planet";
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

// The scene that plays when Blip lands on a planet: what broke, who he meets,
// and what she is about to teach him. It shows before the level's tutorial.
export function PlanetIntro({
  level,
  onDone,
}: {
  level: LevelDefinition;
  onDone: () => void;
}) {
  const story = JOURNEY[level.index];
  const [shown, setShown] = useState(1);
  const last = shown >= story.arrival.length;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-void/85 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`Arriving on ${story.name}`}
        className="max-h-full w-full max-w-2xl overflow-y-auto rounded-3xl border-2 border-copper/40 p-6 shadow-2xl sm:p-8"
        style={{
          backgroundImage:
            'url("/tutorial-stars.jpg"), linear-gradient(160deg, #2b1670 0%, #1d2c80 55%, #1a1452 100%)',
          backgroundBlendMode: "screen",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex items-center gap-4">
          <Planet id={story.planet} size={88} />
          <div>
            <p className="text-sm font-medium tracking-[0.16em] text-copper uppercase">
              Level {level.floor} · {story.name}
            </p>
            <p className="mt-1 font-display text-2xl text-ink sm:text-3xl">
              🔧 {story.problem}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4" aria-live="polite">
          {story.arrival.slice(0, shown).map((beat, i) => (
            <Speech
              key={i}
              speaker={beat.speaker}
              womanName={level.pioneer}
              womanBadge={badgeFor(level.pioneer)}
            >
              {beat.text}
            </Speech>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button variant="ghost" className="px-5 py-3 text-lg" onClick={onDone}>
            Skip
          </Button>
          <Button
            className="px-9 py-3 text-lg"
            onClick={last ? onDone : () => setShown((count) => count + 1)}
          >
            {last ? "Fix the rocket →" : "Next"}
          </Button>
        </div>
      </section>
    </div>
  );
}

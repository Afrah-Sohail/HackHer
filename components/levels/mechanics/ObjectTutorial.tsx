"use client";

import type { ReactNode } from "react";
import { TutorialDialog } from "@/components/guide/TutorialDialog";

type Step = { title: string; body: ReactNode; visual: ReactNode };

function Card({ children, tone }: { children: ReactNode; tone: "blueprint" | "object" }) {
  return (
    <span
      className={`rounded-xl border-2 px-3 py-2 text-xs ${
        tone === "blueprint"
          ? "border-dashed border-copper/70 text-copper"
          : "border-signal/60 text-ink"
      }`}
    >
      {children}
    </span>
  );
}

function BlueprintDemo() {
  return (
    <div
      className="mx-auto flex w-fit flex-wrap items-center justify-center gap-3"
      aria-hidden="true"
    >
      <Card tone="blueprint">
        <strong className="block text-sm">Pet blueprint</strong>
        name · species · color
      </Card>
      <span className="text-copper">→</span>
      <span className="grid gap-1.5">
        <Card tone="object">Mochi · cat · orange</Card>
        <Card tone="object">Bailey · dog · brown</Card>
      </span>
    </div>
  );
}

const STEPS: Step[] = [
  {
    title: "The story",
    body: (
      <>
        In the 1970s at Xerox PARC, <strong>Adele Goldberg</strong> helped
        create <strong>Smalltalk</strong>, one of the first object-oriented
        languages. It came with windows, menus and a mouse, and she wanted
        learners, including children, to be able to program. Its big idea:
        build programs from <strong>objects</strong> made from blueprints
        called <strong>classes</strong>.
      </>
    ),
    visual: (
      <p className="text-center text-5xl" aria-hidden="true">
        📐 → 🐾
      </p>
    ),
  },
  {
    title: "Blueprints and objects",
    body: (
      <>
        A <strong>class</strong> is a blueprint. An <strong>object</strong> is
        one real thing built from it.
      </>
    ),
    visual: <BlueprintDemo />,
  },
  {
    title: "How to play",
    body: (
      <>
        Follow the goal, then press <strong>Check</strong>.
      </>
    ),
    visual: (
      <p className="text-center text-5xl" aria-hidden="true">
        ✅
      </p>
    ),
  },
];

export function ObjectTutorial({ onDone }: { onDone: () => void }) {
  return <TutorialDialog steps={STEPS} onDone={onDone} />;
}

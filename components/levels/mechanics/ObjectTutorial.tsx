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
        <Card tone="object">Pixel · dog · brown</Card>
      </span>
    </div>
  );
}

const STEPS: Step[] = [
  {
    title: "The mission",
    body: (
      <>
        <strong>Adele Goldberg</strong> helped create <strong>Smalltalk</strong>
        , one of the first object-oriented programming languages. It changed how
        people organize big programs. Today you&apos;ll learn its big idea.
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
        A <strong>class</strong> is a <strong>blueprint</strong>: it lists what
        every thing of that kind has. An <strong>object</strong> is one real
        thing built from the blueprint, with its own values. One blueprint can
        make as many objects as you like.
      </>
    ),
    visual: <BlueprintDemo />,
  },
  {
    title: "How to play",
    body: (
      <>
        Read the <strong>goal</strong> at the top of each round. You&apos;ll
        add properties to the blueprint, build objects, and teach them{" "}
        <strong>methods</strong> (things they can do). Press the{" "}
        <strong>check button</strong> when you&apos;re ready.
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

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

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
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDone();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-void/80 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-label="How to play"
        className="max-h-full w-full max-w-lg overflow-y-auto rounded-2xl border-2 border-copper/40 bg-paper-raised p-5 shadow-2xl sm:p-6"
      >
        <p className="text-xs font-medium tracking-[0.16em] text-copper uppercase">
          How to play · {index + 1} of {STEPS.length}
        </p>
        <h2 className="mt-1 font-display text-2xl text-ink">{step.title}</h2>
        <div className="my-5">{step.visual}</div>
        <p className="text-[15px] leading-7 text-ink">{step.body}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" onClick={onDone}>
            Skip
          </Button>
          <div className="flex gap-2">
            {index > 0 && (
              <Button variant="secondary" onClick={() => setIndex(index - 1)}>
                Back
              </Button>
            )}
            <Button onClick={isLast ? onDone : () => setIndex(index + 1)}>
              {isLast ? "Let's play!" : "Next"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

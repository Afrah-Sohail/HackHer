"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { UnicornSays } from "./Unicorn";

export type TutorialStep = { title: string; body: ReactNode; visual: ReactNode };

export function TutorialDialog({
  steps,
  onDone,
}: {
  steps: readonly TutorialStep[];
  onDone: () => void;
}) {
  const [index, setIndex] = useState(0);
  const step = steps[index];
  const isLast = index === steps.length - 1;

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
        className="max-h-full w-full max-w-2xl overflow-y-auto rounded-3xl border-2 border-copper/40 bg-paper-raised p-6 shadow-2xl sm:p-8"
      >
        <p className="text-sm font-medium tracking-[0.16em] text-copper uppercase">
          How to play · {index + 1} of {steps.length}
        </p>
        <h2 className="mt-1 font-display text-3xl text-ink sm:text-4xl">{step.title}</h2>
        <div className="my-6" style={{ zoom: 1.3 }}>
          {step.visual}
        </div>
        <UnicornSays size={72}>
          <span className="text-lg leading-8 sm:text-xl sm:leading-9">{step.body}</span>
        </UnicornSays>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" className="px-5 py-3 text-lg" onClick={onDone}>
            Skip
          </Button>
          <div className="flex gap-2">
            {index > 0 && (
              <Button
                variant="secondary"
                className="px-7 py-3 text-lg"
                onClick={() => setIndex(index - 1)}
              >
                Back
              </Button>
            )}
            <Button
              className="px-9 py-3 text-lg"
              onClick={isLast ? onDone : () => setIndex(index + 1)}
            >
              {isLast ? "Let's play!" : "Next"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

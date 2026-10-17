"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { THREADS, type Thread } from "./weave-rules";

type Step = { title: string; body: ReactNode; visual: ReactNode };

function Swatch({ thread }: { thread: Thread }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-base ${THREADS[thread].className}`}
    >
      {THREADS[thread].symbol}
    </span>
  );
}

function Row({ threads }: { threads: Thread[] }) {
  return (
    <span className="flex gap-1">
      {threads.map((thread, i) => (
        <Swatch key={i} thread={thread} />
      ))}
    </span>
  );
}

function PatternDemo() {
  return (
    <div className="mx-auto grid w-fit gap-3 text-xs text-ink-soft">
      <div>
        <p className="mb-1 uppercase tracking-wide">Target pattern</p>
        <Row threads={["A", "B", "C"]} />
      </div>
      <div>
        <p className="mb-1 uppercase tracking-wide">Your weave</p>
        <Row threads={["A", "B", "C"]} />
      </div>
    </div>
  );
}

function LoopDemo() {
  return (
    <div className="mx-auto flex w-fit flex-wrap items-center justify-center gap-3 text-sm text-ink">
      <span className="rounded-xl border-2 border-copper/60 p-2">
        <span className="mb-2 block text-xs font-medium text-copper">
          🔁 Repeat ×3
        </span>
        <Row threads={["A", "B"]} />
      </span>
      <span aria-hidden="true" className="text-xl text-copper">
        →
      </span>
      <Row threads={["A", "B", "A", "B", "A", "B"]} />
    </div>
  );
}

const STEPS: Step[] = [
  {
    title: "The mission",
    body: (
      <>
        Ada Lovelace saw that a machine could follow a list of instructions,
        just like a <strong>Jacquard loom</strong> weaves patterns from punched
        cards. Today <em>you</em> program the loom to weave a pattern.
      </>
    ),
    visual: (
      <p className="text-center text-5xl" aria-hidden="true">
        🧵 → 🧶
      </p>
    ),
  },
  {
    title: "How to play",
    body: (
      <>
        Tap a thread chip to add it to your <strong>punch card</strong>. The
        loom weaves your threads <strong>in order</strong>. Make{" "}
        <strong>your weave</strong> match the <strong>target pattern</strong>,
        but watch your chip budget!
      </>
    ),
    visual: <PatternDemo />,
  },
  {
    title: "The loop shortcut",
    body: (
      <>
        Short on chips? Tap chips on your punch card to{" "}
        <strong>select</strong> them, then tap{" "}
        <strong>🔁 Repeat these</strong>. Use the <strong>− and +</strong>{" "}
        buttons to choose how many times to repeat. Four chips can weave a very
        long pattern!
      </>
    ),
    visual: <LoopDemo />,
  },
];

export function WeaveTutorial({ onDone }: { onDone: () => void }) {
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

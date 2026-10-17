"use client";

import type { ReactNode } from "react";
import { TutorialDialog } from "@/components/guide/TutorialDialog";
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
  return <TutorialDialog steps={STEPS} onDone={onDone} />;
}

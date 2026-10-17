"use client";

import type { ReactNode } from "react";
import { TutorialDialog } from "@/components/guide/TutorialDialog";
import { THREADS, type Thread } from "./weave-rules";

type Step = { title: string; body: ReactNode; visual: ReactNode };

function Swatch({ thread }: { thread: Thread }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-xl ${THREADS[thread].className}`}
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
        <p className="mb-1 uppercase tracking-wide">Pattern</p>
        <Row threads={["A", "B", "C"]} />
      </div>
      <div>
        <p className="mb-1 uppercase tracking-wide">Yours</p>
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
    title: "Program the loom",
    body: (
      <>
        <strong>Ada Lovelace</strong> saw that a machine could follow a list of
        steps, like a <strong>loom</strong> weaving a pattern. Now you program
        the loom!
      </>
    ),
    visual: (
      <p className="text-center text-6xl" aria-hidden="true">
        🧵 → 🧶
      </p>
    ),
  },
  {
    title: "How to play",
    body: (
      <>
        Tap symbols to build your <strong>punch card</strong>. The loom weaves
        them in order. <strong>Match the pattern!</strong>
      </>
    ),
    visual: <PatternDemo />,
  },
  {
    title: "The loop shortcut",
    body: (
      <>
        Select chips, tap <strong>🔁 Repeat these</strong>, then pick how many
        times with <strong>− +</strong>.
      </>
    ),
    visual: <LoopDemo />,
  },
];

export function WeaveTutorial({ onDone }: { onDone: () => void }) {
  return <TutorialDialog steps={STEPS} onDone={onDone} />;
}

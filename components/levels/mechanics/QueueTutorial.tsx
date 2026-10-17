"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

type Step = { title: string; body: ReactNode; visual: ReactNode };

function Square({ className }: { className: string }) {
  return <span className={`h-4 w-4 rounded-sm ${className}`} />;
}

function MemoryDemo() {
  return (
    <div className="mx-auto w-fit text-xs text-ink-soft" aria-hidden="true">
      <p className="mb-1 uppercase tracking-wide">Memory: 5 squares</p>
      <div className="flex gap-1 rounded-lg bg-void p-2">
        <Square className="bg-red-400" />
        <Square className="bg-red-400" />
        <Square className="bg-copper" />
        <Square className="bg-ink/20" />
        <Square className="bg-ink/20" />
      </div>
    </div>
  );
}

function QueueDemo() {
  const rows = [
    { name: "Landing guidance", tag: "Critical", cls: "text-red-200", note: "runs" },
    { name: "Crew display", tag: "Routine", cls: "text-ink-soft", note: "runs" },
    { name: "Data log", tag: "Routine", cls: "text-ink-soft", note: "out of memory" },
  ];
  return (
    <ul className="mx-auto grid w-fit gap-1.5 text-sm" aria-hidden="true">
      {rows.map((row, i) => (
        <li
          key={row.name}
          className="flex items-center gap-3 rounded-lg border border-line bg-paper px-3 py-1.5"
        >
          <span className="text-ink-soft">{i + 1}</span>
          <span className={`w-16 text-xs ${row.cls}`}>{row.tag}</span>
          <span className="text-ink">{row.name}</span>
          <span
            className={`ml-auto text-xs ${row.note === "runs" ? "text-signal" : "text-red-400"}`}
          >
            {row.note === "runs" ? "✓ runs" : "✕ dropped"}
          </span>
        </li>
      ))}
    </ul>
  );
}

const STEPS: Step[] = [
  {
    title: "The mission",
    body: (
      <>
        <strong>Margaret Hamilton</strong> led the team that wrote the software
        for the Apollo spacecraft. Its computer had{" "}
        <strong>very little memory</strong>, so it could not run everything at
        once. Your job: decide what runs first.
      </>
    ),
    visual: (
      <p className="text-center text-5xl" aria-hidden="true">
        🛰️ → 🌙
      </p>
    ),
  },
  {
    title: "How a priority queue works",
    body: (
      <>
        The computer goes down the <strong>queue</strong> from the top. Each job
        needs some <strong>memory squares</strong>. If a job still fits, it
        runs. If it doesn&apos;t, it gets <strong>dropped</strong>. So the jobs
        at the top get the memory first.
      </>
    ),
    visual: <MemoryDemo />,
  },
  {
    title: "How to play",
    body: (
      <>
        Use the <strong>▲ and ▼</strong> buttons to reorder the queue. Put the
        most important jobs on top so they never get dropped. The green and red
        tags show what would run. When every must-run job is safe, press{" "}
        <strong>Run the computer</strong>.
      </>
    ),
    visual: <QueueDemo />,
  },
];

export function QueueTutorial({ onDone }: { onDone: () => void }) {
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

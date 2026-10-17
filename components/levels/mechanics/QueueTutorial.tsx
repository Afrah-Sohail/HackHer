"use client";

import type { ReactNode } from "react";
import { TutorialDialog } from "@/components/guide/TutorialDialog";

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
    title: "The story",
    body: (
      <>
        During the Apollo 11 landing on 20 July 1969, the computer flashed
        alarms 1201 and 1202: it was overloaded with extra work.{" "}
        <strong>Margaret Hamilton</strong>&apos;s team had designed the
        software to run by <strong>priority</strong>, so it dropped
        lower-priority jobs and kept the landing going. Now you decide what
        runs first!
      </>
    ),
    visual: (
      <p className="text-center text-5xl" aria-hidden="true">
        🛰️ → 🌙
      </p>
    ),
  },
  {
    title: "The queue",
    body: (
      <>
        The computer runs jobs from the <strong>top</strong>. If a job
        doesn&apos;t fit in memory, it gets <strong>dropped</strong>.
      </>
    ),
    visual: <MemoryDemo />,
  },
  {
    title: "How to play",
    body: (
      <>
        <strong>Drag</strong> jobs by the <strong>⠿</strong> handle to reorder them.
        Keep the must-run jobs safe, then press <strong>Run</strong>.
      </>
    ),
    visual: <QueueDemo />,
  },
];

export function QueueTutorial({ onDone }: { onDone: () => void }) {
  return <TutorialDialog steps={STEPS} onDone={onDone} />;
}

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
  return <TutorialDialog steps={STEPS} onDone={onDone} />;
}

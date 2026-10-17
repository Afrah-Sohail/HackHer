"use client";

import type { ReactNode } from "react";
import { TutorialDialog } from "@/components/guide/TutorialDialog";

type Step = { title: string; body: ReactNode; visual: ReactNode };

const cell = "h-6 rounded-md";

function MiniGrid() {
  // Channel picked per step in the example (rows are channels 1-3).
  const picks = [1, 3, 2, 1];
  return (
    <div
      className="mx-auto grid w-48 gap-1 rounded-xl bg-void p-2"
      aria-hidden="true"
    >
      {[1, 2, 3].map((channel) => (
        <div key={channel} className="grid grid-cols-4 gap-1">
          {picks.map((pick, step) => (
            <span
              key={step}
              className={`${cell} ${
                pick === channel ? "bg-copper" : "bg-ink/10"
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function Legend() {
  const items = [
    { swatch: "bg-copper", label: "Your channel pick" },
    { swatch: "bg-signal", label: "✓ Signal got through" },
    { swatch: "bg-red-700", label: "✕ Signal was jammed" },
  ];
  return (
    <ul className="mx-auto grid w-fit gap-2 text-sm text-ink">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-3">
          <span className={`h-5 w-5 rounded-md ${item.swatch}`} />
          {item.label}
        </li>
      ))}
      <li className="flex items-center gap-3">
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-red-500/15 text-sm">
          ⚡
        </span>
        Channel the jammer is blocking
      </li>
    </ul>
  );
}

const STEPS: Step[] = [
  {
    title: "The mission",
    body: (
      <>
        <strong>Hedy Lamarr</strong> had an idea: hop between radio channels
        so an enemy can&apos;t jam your signal. Your turn!
      </>
    ),
    visual: (
      <p className="text-center text-5xl" aria-hidden="true">
        📡 → 🚀
      </p>
    ),
  },
  {
    title: "How to play",
    body: (
      <>
        Each column is a step. Tap <strong>one channel</strong> per column,
        then press <strong>Transmit</strong>.
      </>
    ),
    visual: <MiniGrid />,
  },
  {
    title: "Beat the jammer",
    body: (
      <>
        <strong>⚡</strong> marks channels the jammer blocks. Land on a clear
        one every step.
      </>
    ),
    visual: <Legend />,
  },
];

export function WaveformTutorial({ onDone }: { onDone: () => void }) {
  return <TutorialDialog steps={STEPS} onDone={onDone} />;
}

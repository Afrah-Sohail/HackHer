"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

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
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-void">
          <span className="h-2 w-2 rounded-full bg-red-500" />
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
        It&apos;s World War II. Your radio-controlled torpedo is being{" "}
        <strong>jammed</strong>: the enemy blasts noise on your channel so
        your signal never arrives. Hedy Lamarr&apos;s clever fix: don&apos;t
        stay on one channel. <strong>Hop</strong> between channels so the
        jammer can never keep up.
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
        Each <strong>column</strong> is one moment in time (a step). In every
        column, tap <strong>one channel</strong> to say where your signal will
        be at that moment. Fill all 8 columns, then press{" "}
        <strong>Transmit</strong>.
      </>
    ),
    visual: <MiniGrid />,
  },
  {
    title: "Beat the jammer",
    body: (
      <>
        Every round the jammer follows a rule, shown above the grid. If you
        land on a channel it&apos;s blocking, that step gets jammed. Clear all
        8 steps to win the round. Stuck? Switch on{" "}
        <strong>Show jammer&apos;s next move</strong> to see what it&apos;ll
        block.
      </>
    ),
    visual: <Legend />,
  },
];

export function WaveformTutorial({ onDone }: { onDone: () => void }) {
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

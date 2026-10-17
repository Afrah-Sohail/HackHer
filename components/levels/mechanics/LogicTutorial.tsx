"use client";

import type { ReactNode } from "react";
import { TutorialDialog } from "@/components/guide/TutorialDialog";

type Step = { title: string; body: ReactNode; visual: ReactNode };

const GATE_CARDS = [
  {
    name: "AND",
    rule: "ON only if ALL inputs are ON",
    example: "ON + ON → ON",
    counter: "ON + OFF → OFF",
  },
  {
    name: "OR",
    rule: "ON if ANY input is ON",
    example: "ON + OFF → ON",
    counter: "OFF + OFF → OFF",
  },
  {
    name: "NOT",
    rule: "Flips the signal",
    example: "ON → OFF",
    counter: "OFF → ON",
  },
];

function GateCards() {
  return (
    <ul className="grid gap-2 sm:grid-cols-3">
      {GATE_CARDS.map((gate) => (
        <li
          key={gate.name}
          className="rounded-xl border border-line bg-paper-raised p-3 text-center"
        >
          <p className="inline-block rounded-lg border border-signal/40 bg-void px-3 py-1 text-sm font-semibold text-ink">
            {gate.name}
          </p>
          <p className="mt-2 text-sm font-medium text-ink">{gate.rule}</p>
          <p className="mt-1 text-xs text-ink-soft">{gate.example}</p>
          <p className="text-xs text-ink-soft">{gate.counter}</p>
        </li>
      ))}
    </ul>
  );
}

function MiniBoard() {
  return (
    <div
      className="mx-auto flex w-fit items-center gap-2 rounded-xl border border-line bg-paper-raised p-3"
      aria-hidden="true"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-signal text-sm font-semibold text-paper-raised">
        A
      </span>
      <span className="h-0.5 w-6 bg-signal" />
      <span className="rounded-lg border border-dashed border-copper px-3 py-1 text-sm text-copper">
        ?
      </span>
      <span className="h-0.5 w-6 bg-line" />
      <span className="h-6 w-6 rounded-full bg-line" />
    </div>
  );
}

const STEPS: Step[] = [
  {
    title: "The mission",
    body: (
      <>
        You&apos;re at <strong>Bletchley Park</strong>, where codebreakers like
        Joan Clarke cracked secret messages using strict logic. Every decision
        came down to simple rules: &quot;if this AND that, then…&quot;. Your
        job: build circuits that follow the rules.
      </>
    ),
    visual: (
      <p className="text-center text-5xl" aria-hidden="true">
        🔐 → 💡
      </p>
    ),
  },
  {
    title: "Meet the logic gates",
    body: (
      <>
        Signals are either <strong>ON</strong> or <strong>OFF</strong>. A gate
        takes signals in and decides what comes out. These three are all you
        need.
      </>
    ),
    visual: <GateCards />,
  },
  {
    title: "How to play",
    body: (
      <>
        Pick a gate, then <strong>tap an empty slot</strong> (the dashed box)
        to place it. Tap the switches on the left to test your circuit. The
        table shows what the circuit <em>should</em> do versus what it{" "}
        <em>actually</em> does. Make every row match to win the round.
      </>
    ),
    visual: <MiniBoard />,
  },
];

export function LogicTutorial({ onDone }: { onDone: () => void }) {
  return <TutorialDialog steps={STEPS} onDone={onDone} />;
}

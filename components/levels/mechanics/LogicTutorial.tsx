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
  {
    name: "XOR",
    rule: "ON if the inputs are DIFFERENT",
    example: "ON + OFF → ON",
    counter: "ON + ON → OFF",
  },
];

function GateCards() {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
    title: "The story",
    body: (
      <>
        In 1940, mathematician <strong>Joan Clarke</strong> joined the
        codebreakers at Bletchley Park. Women couldn&apos;t be paid as
        cryptanalysts then, so she was officially a &quot;linguist&quot;, yet
        she became deputy head of Hut 8, helping break the German
        Navy&apos;s <strong>Enigma</strong> messages with strict logic. Now
        build circuits that follow the rules!
      </>
    ),
    visual: (
      <p className="text-center text-5xl" aria-hidden="true">
        🔐 → 💡
      </p>
    ),
  },
  {
    title: "Meet the gates",
    body: (
      <>
        Signals are <strong>ON</strong> or <strong>OFF</strong>. Gates decide
        what comes out.
      </>
    ),
    visual: <GateCards />,
  },
  {
    title: "How to play",
    body: (
      <>
        <strong>Drag</strong> a gate onto a dashed slot (or tap a gate, then the
        slot). Tap the <strong>NOT</strong> bubble on an AND, OR or XOR gate to
        flip its answer. Tap the circles to test. Make every row match!
      </>
    ),
    visual: <MiniBoard />,
  },
];

export function LogicTutorial({ onDone }: { onDone: () => void }) {
  return <TutorialDialog steps={STEPS} onDone={onDone} />;
}

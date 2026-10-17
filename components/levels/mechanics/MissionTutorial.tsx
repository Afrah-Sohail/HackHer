"use client";

import type { ReactNode } from "react";
import { TutorialDialog } from "@/components/guide/TutorialDialog";
import { Tag } from "@/components/ui/Tag";

type Step = { title: string; body: ReactNode; visual: ReactNode };

function Pill({ children }: { children: ReactNode }) {
  return (
    <Tag tone="signal" size="md">
      {children}
    </Tag>
  );
}

function MachineDemo() {
  return (
    <div
      className="mx-auto flex w-fit flex-wrap items-center justify-center gap-2 text-ink"
      aria-hidden="true"
    >
      <Pill>input: 3</Pill>
      <span className="text-copper">→</span>
      <span className="rounded-xl border-2 border-copper/60 px-3 py-2 text-sm font-semibold">
        × 2 + 1
      </span>
      <span className="text-copper">→</span>
      <Pill>output: 7</Pill>
    </div>
  );
}

function TableDemo() {
  const rows = [
    { x: 1, needed: 3, yours: 2, ok: false },
    { x: 2, needed: 5, yours: 4, ok: false },
  ];
  return (
    <table className="mx-auto w-full max-w-xs text-center text-sm text-ink">
      <thead className="text-xs text-ink-soft">
        <tr>
          <th className="py-1 font-medium">Second</th>
          <th className="py-1 font-medium">Needed</th>
          <th className="py-1 font-medium">Yours</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.x} className="border-t border-line">
            <td className="py-1">{row.x}</td>
            <td className="py-1">{row.needed}</td>
            <td className="py-1 text-copper">{row.yours}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const STEPS: Step[] = [
  {
    title: "The mission",
    body: (
      <>
        It&apos;s the early days of the space race. Mathematicians like{" "}
        <strong>Katherine Johnson</strong>, <strong>Dorothy Vaughan</strong>{" "}
        and <strong>Mary Jackson</strong> worked out where a rocket must be at
        every moment. Your job: find the <strong>rule</strong> behind
        mission control&apos;s numbers.
      </>
    ),
    visual: (
      <p className="text-center text-5xl" aria-hidden="true">
        📋 → 🚀
      </p>
    ),
  },
  {
    title: "Meet the function machine",
    body: (
      <>
        A <strong>function</strong> is a machine: you feed in an{" "}
        <strong>input</strong> (the second after liftoff), it applies a{" "}
        <strong>rule</strong>, and out comes an <strong>output</strong> (the
        altitude). Put in the same input and you always get the same output.
      </>
    ),
    visual: <MachineDemo />,
  },
  {
    title: "How to play",
    body: (
      <>
        Use the <strong>− and +</strong> buttons to change the numbers in the
        machine. Compare <strong>Needed</strong> with <strong>Yours</strong> in
        the table, and watch your dots on the graph. When every row matches,
        press <strong>Launch</strong>!
      </>
    ),
    visual: <TableDemo />,
  },
];

export function MissionTutorial({ onDone }: { onDone: () => void }) {
  return <TutorialDialog steps={STEPS} onDone={onDone} />;
}

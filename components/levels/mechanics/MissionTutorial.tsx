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
    title: "The story",
    body: (
      <>
        In the 1940s and 50s, Black women mathematicians worked at
        NASA&apos;s predecessor in a segregated unit.{" "}
        <strong>Dorothy Vaughan</strong> led it and taught her team FORTRAN.{" "}
        <strong>Mary Jackson</strong> became NASA&apos;s first Black female
        engineer. <strong>Katherine Johnson</strong> calculated Alan
        Shepard&apos;s 1961 flight path, and John Glenn asked her to
        double-check the computer&apos;s numbers. Now find the{" "}
        <strong>rule</strong> behind mission control&apos;s numbers!
      </>
    ),
    visual: (
      <p className="text-center text-5xl" aria-hidden="true">
        📋 → 🚀
      </p>
    ),
  },
  {
    title: "The function machine",
    body: (
      <>
        Put in a number, a <strong>rule</strong> changes it, and a new number
        comes out. Same input, same output.
      </>
    ),
    visual: <MachineDemo />,
  },
  {
    title: "How to play",
    body: (
      <>
        Change the numbers with <strong>− +</strong> until{" "}
        <strong>Yours</strong> matches <strong>Needed</strong>. Then press
        Launch!
      </>
    ),
    visual: <TableDemo />,
  },
];

export function MissionTutorial({ onDone }: { onDone: () => void }) {
  return <TutorialDialog steps={STEPS} onDone={onDone} />;
}

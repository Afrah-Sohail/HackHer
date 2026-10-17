"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";
import { UnicornSays } from "@/components/guide/Unicorn";
import { LogicTutorial } from "./LogicTutorial";
import {
  GATE_ARITY,
  ROUNDS,
  allRows,
  emptyPlaced,
  evaluate,
  isSolved,
  type Gate,
  type Placed,
  type Round,
  type Signals,
} from "./logic-rules";

const GATES: Gate[] = ["AND", "OR", "NOT"];

function Dot({ on }: { on: boolean | null }) {
  if (on === null) {
    return <span className="text-ink-soft">—</span>;
  }
  return (
    <span
      role="img"
      aria-label={on ? "On" : "Off"}
      className={`inline-block h-4 w-4 rounded-full ${
        on ? "bg-signal" : "border border-ink-soft/50 bg-transparent"
      }`}
    />
  );
}

export function LogicGridMechanic({ onCleared }: { onCleared?: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [armed, setArmed] = useState<Gate | null>(null);
  const [placed, setPlaced] = useState<Placed>(() => emptyPlaced(ROUNDS[0]));
  const [switches, setSwitches] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const closeTutorial = useCallback(() => setShowTutorial(false), []);

  const round = ROUNDS[roundIndex];
  const isLastRound = roundIndex === ROUNDS.length - 1;
  const solved = isSolved(round, placed);
  const live = evaluate(round, placed, withDefaults(round, switches));

  function placeGate(slotId: string) {
    const slot = round.slots.find((s) => s.id === slotId);
    if (!slot || solved) return;

    if (!armed) {
      if (placed[slotId]) {
        setPlaced({ ...placed, [slotId]: null });
        setMessage(null);
      } else {
        setMessage("Pick a gate first.");
      }
      return;
    }

    if (GATE_ARITY[armed] !== slot.from.length) {
      setMessage(
        armed === "NOT"
          ? "NOT takes one wire. This slot has two."
          : `${armed} needs two wires. This slot has one.`,
      );
      return;
    }

    const next = { ...placed, [slotId]: armed };
    setPlaced(next);
    setMessage(null);
    if (isLastRound && isSolved(round, next)) onCleared?.();
  }

  function nextRound() {
    const next = ROUNDS[roundIndex + 1];
    setRoundIndex(roundIndex + 1);
    setPlaced(emptyPlaced(next));
    setSwitches({});
    setArmed(null);
    setMessage(null);
  }

  const rows = allRows(round);
  const activeRow = rows.findIndex((row) =>
    round.inputs.every((input) => row[input.id] === Boolean(switches[input.id])),
  );

  return (
    <>
      {showTutorial && (
        <LogicTutorial onDone={closeTutorial} />
      )}
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-base font-semibold text-ink">
            Round {roundIndex + 1} of {ROUNDS.length}
          </p>
          <ol className="flex gap-2" aria-label="Round progress">
            {ROUNDS.map((r, i) => (
              <li
                key={r.title}
                className={`h-2.5 w-10 rounded-full ${
                  i < roundIndex || (i === roundIndex && solved)
                    ? "bg-signal"
                    : i === roundIndex
                      ? "bg-copper"
                      : "bg-line"
                }`}
              />
            ))}
          </ol>
        </div>

        <p className="font-display text-2xl text-ink sm:text-3xl">{round.story}</p>

        <div
          className="flex flex-wrap items-center gap-3"
          role="group"
          aria-label="Gate toolbox"
        >
          {GATES.map((gate) => (
            <button
              key={gate}
              type="button"
              aria-pressed={armed === gate}
              disabled={solved}
              onClick={() => {
                setArmed(armed === gate ? null : gate);
                setMessage(null);
              }}
              className={`rounded-2xl px-8 py-4 text-xl font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper disabled:opacity-40 ${
                armed === gate
                  ? "bg-copper text-paper-raised ring-4 ring-ink"
                  : "border-2 border-line bg-paper-raised text-ink hover:border-ink"
              }`}
            >
              {gate}
            </button>
          ))}
          <span className="text-base text-ink-soft">
            {armed ? "Now tap a slot ↓" : "Pick a gate"}
          </span>
        </div>

        <Board
          round={round}
          placed={placed}
          signals={live}
          switches={switches}
          armed={armed}
          onSwitch={(id) =>
            setSwitches((prev) => ({ ...prev, [id]: !prev[id] }))
          }
          onSlot={placeGate}
        />

        <p className="min-h-6 text-base text-copper" aria-live="polite">
          {message ?? " "}
        </p>

        <ul className="grid gap-1 text-base text-ink-soft sm:grid-cols-2">
          {round.inputs.map((input) => (
            <li key={input.id}>
              <span className="font-semibold text-ink">{input.id}</span> ={" "}
              {input.label}
            </li>
          ))}
        </ul>

        <RequirementsTable
          round={round}
          placed={placed}
          rows={rows}
          activeRow={activeRow}
        />

        <div className="flex flex-wrap items-center gap-3">
          {solved ? (
            <>
              <UnicornSays tone="happy" className="w-full">
                <span aria-live="polite" className="block">
                  <strong className="text-signal">
                    {isLastRound ? "Level cleared!" : "It works!"}
                  </strong>{" "}
                  <span className="text-ink-soft">{round.lesson}</span>
                </span>
              </UnicornSays>
              {!isLastRound && (
                <Button className="px-10 py-3.5 text-lg" onClick={nextRound}>
                  Next round
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                className="px-6 py-3 text-base"
                onClick={() => {
                  setPlaced(emptyPlaced(round));
                  setMessage(null);
                }}
                disabled={Object.values(placed).every((gate) => gate === null)}
              >
                Clear
              </Button>
              <Button
                variant="ghost"
                className="px-4 py-3 text-base"
                onClick={() => setShowTutorial(true)}
              >
                Help
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function withDefaults(
  round: Round,
  switches: Record<string, boolean>,
): Record<string, boolean> {
  return Object.fromEntries(
    round.inputs.map((input) => [input.id, Boolean(switches[input.id])]),
  );
}

function Board({
  round,
  placed,
  signals,
  switches,
  armed,
  onSwitch,
  onSlot,
}: {
  round: Round;
  placed: Placed;
  signals: Signals;
  switches: Record<string, boolean>;
  armed: Gate | null;
  onSwitch: (id: string) => void;
  onSlot: (id: string) => void;
}) {
  const pos: Record<string, { x: number; y: number }> = {};
  for (const input of round.inputs) pos[input.id] = input;
  for (const slot of round.slots) pos[slot.id] = slot;
  const outputOn = signals[round.outputFrom] ?? null;

  const wires = [
    ...round.slots.flatMap((slot) =>
      slot.from.map((from) => ({
        key: `${from}-${slot.id}`,
        a: pos[from],
        b: slot,
        on: signals[from] === true,
      })),
    ),
    {
      key: "out",
      a: pos[round.outputFrom],
      b: round.outputPos,
      on: outputOn === true,
    },
  ];

  const place = (p: { x: number; y: number }) => ({
    left: `${p.x}%`,
    top: `${(p.y / 60) * 100}%`,
  });

  return (
    <div className="relative h-72 w-full rounded-3xl border border-line bg-paper sm:h-[26rem]">
      <svg
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {wires.map((wire) => (
          <line
            key={wire.key}
            x1={wire.a.x}
            y1={wire.a.y}
            x2={wire.b.x}
            y2={wire.b.y}
            vectorEffect="non-scaling-stroke"
            strokeWidth={5}
            strokeLinecap="round"
            className={wire.on ? "stroke-signal" : "stroke-line"}
          />
        ))}
      </svg>

      {round.inputs.map((input) => {
        const on = Boolean(switches[input.id]);
        return (
          <button
            key={input.id}
            type="button"
            aria-pressed={on}
            aria-label={`Input ${input.id}: ${input.label}, ${on ? "on" : "off"}`}
            onClick={() => onSwitch(input.id)}
            style={place(input)}
            className={`absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xl font-semibold transition sm:h-16 sm:w-16 sm:text-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${
              on
                ? "bg-signal text-paper-raised"
                : "border-2 border-line bg-paper-raised text-ink"
            }`}
          >
            {input.id}
          </button>
        );
      })}

      {round.slots.map((slot) => {
        const gate = placed[slot.id];
        const value = signals[slot.id];
        return (
          <button
            key={slot.id}
            type="button"
            onClick={() => onSlot(slot.id)}
            aria-label={`Slot ${slot.id}: ${gate ?? "empty"}`}
            style={place(slot)}
            className={`absolute flex h-14 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2 rounded-2xl text-xl font-semibold transition sm:h-16 sm:w-28 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${
              gate
                ? "border-2 border-signal bg-void text-ink"
                : `border-2 border-dashed bg-paper-raised text-copper ${
                    armed ? "border-copper" : "border-copper/50"
                  }`
            }`}
          >
            {gate ?? "?"}
            {gate && value !== null && (
              <span
                aria-hidden="true"
                className={`h-3 w-3 rounded-full ${
                  value ? "bg-signal" : "bg-ink/30"
                }`}
              />
            )}
          </button>
        );
      })}

      <div
        style={place(round.outputPos)}
        className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 select-none"
      >
        <span className="text-xs tracking-wide text-ink-soft uppercase">Output</span>
        <span
          role="img"
          aria-label={`${round.outputLabel}: ${
            outputOn === null ? "not connected" : outputOn ? "on" : "off"
          }`}
          className={`h-14 w-14 rounded-full transition sm:h-16 sm:w-16 ${
            outputOn
              ? "bg-signal shadow-[0_0_20px_var(--color-signal)]"
              : "bg-ink/10 shadow-[inset_0_2px_6px_rgb(0_0_0/0.5)]"
          }`}
        />
        <span className="max-w-24 text-center text-sm leading-tight text-ink-soft">
          {round.outputLabel}
        </span>
      </div>
    </div>
  );
}

function RequirementsTable({
  round,
  placed,
  rows,
  activeRow,
}: {
  round: Round;
  placed: Placed;
  rows: Record<string, boolean>[];
  activeRow: number;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-paper-raised">
      <table className="w-full text-center text-base">
        <caption className="px-4 pt-4 pb-1 text-left text-xs font-medium tracking-[0.14em] text-ink-soft uppercase">
          Rule check
        </caption>
        <thead>
          <tr className="text-sm text-ink-soft">
            {round.inputs.map((input) => (
              <th key={input.id} scope="col" className="px-3 py-3 font-medium">
                {input.id}
              </th>
            ))}
            <th scope="col" className="px-3 py-2 font-medium">
              Should be
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Yours
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              <span className="sr-only">Match</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const expected = round.target(row);
            const actual = evaluate(round, placed, row)[round.outputFrom];
            const match = actual === expected;
            return (
              <tr
                key={i}
                className={`border-t border-line ${
                  i === activeRow ? "bg-copper/5" : ""
                }`}
              >
                {round.inputs.map((input) => (
                  <td key={input.id} className="px-3 py-3">
                    <Dot on={row[input.id]} />
                  </td>
                ))}
                <td className="px-3 py-3">
                  <Dot on={expected} />
                </td>
                <td className="px-3 py-3">
                  <Dot on={actual ?? null} />
                </td>
                <td className="px-3 py-3 text-lg font-semibold">
                  {actual === null || actual === undefined ? (
                    <span className="text-ink-soft">·</span>
                  ) : match ? (
                    <span className="text-signal">✓</span>
                  ) : (
                    <span className="text-copper-deep">✕</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

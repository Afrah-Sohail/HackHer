"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
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
const SEEN_KEY = "hackher:floor3-tutorial-seen";

function tutorialSeen(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markTutorialSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Storage unavailable; the tutorial just shows again next visit.
  }
}

function Dot({ on }: { on: boolean | null }) {
  if (on === null) {
    return <span className="text-ink-soft">—</span>;
  }
  return (
    <span
      role="img"
      aria-label={on ? "On" : "Off"}
      className={`inline-block h-3.5 w-3.5 rounded-full ${
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
  const [showTutorial, setShowTutorial] = useState(() => !tutorialSeen());

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
        setMessage("Pick a gate first (AND, OR or NOT), then tap a slot.");
      }
      return;
    }

    if (GATE_ARITY[armed] !== slot.from.length) {
      setMessage(
        armed === "NOT"
          ? "NOT works on a single wire, but this slot has two wires coming in."
          : `${armed} needs two wires coming in, but this slot only has one.`,
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

  function closeTutorial() {
    markTutorialSeen();
    setShowTutorial(false);
  }

  if (showTutorial) {
    return <LogicTutorial onDone={closeTutorial} />;
  }

  const rows = allRows(round);
  const activeRow = rows.findIndex((row) =>
    round.inputs.every((input) => row[input.id] === Boolean(switches[input.id])),
  );

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-ink">
          Round {roundIndex + 1} of {ROUNDS.length}: {round.title}
        </p>
        <ol className="flex gap-1.5" aria-label="Round progress">
          {ROUNDS.map((r, i) => (
            <li
              key={r.title}
              className={`h-2 w-8 rounded-full ${
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

      <p className="rounded-xl border border-copper/30 bg-copper/5 px-4 py-3 text-sm leading-6 text-ink">
        <span className="font-semibold text-copper-deep">Rule: </span>
        {round.story}
      </p>

      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Gate toolbox"
      >
        <span className="text-sm text-ink-soft">1. Pick a gate:</span>
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
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper disabled:opacity-40 ${
              armed === gate
                ? "bg-copper text-paper-raised ring-2 ring-ink"
                : "border border-line bg-paper-raised text-ink hover:border-ink"
            }`}
          >
            {gate}
          </button>
        ))}
        <span className="text-sm text-ink-soft">2. Tap a slot.</span>
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

      <p className="min-h-5 text-sm text-copper-deep" aria-live="polite">
        {message ?? " "}
      </p>

      <ul className="grid gap-1 text-sm text-ink-soft sm:grid-cols-2">
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
            <p className="text-sm leading-6 text-signal" aria-live="polite">
              <strong>
                {isLastRound
                  ? "Cipher cracked! Floor cleared."
                  : "Circuit works!"}
              </strong>{" "}
              <span className="text-ink-soft">{round.lesson}</span>
            </p>
            {!isLastRound && <Button onClick={nextRound}>Next round</Button>}
          </>
        ) : (
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setPlaced(emptyPlaced(round));
                setMessage(null);
              }}
              disabled={Object.values(placed).every((gate) => gate === null)}
            >
              Clear gates
            </Button>
            <Button variant="ghost" onClick={() => setShowTutorial(true)}>
              How to play
            </Button>
          </>
        )}
      </div>
    </div>
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
    <div className="relative h-60 w-full rounded-2xl border border-line bg-paper sm:h-72">
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
            strokeWidth={3}
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
            className={`absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${
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
            className={`absolute flex h-11 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${
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
                className={`h-2 w-2 rounded-full ${
                  value ? "bg-signal" : "bg-ink/30"
                }`}
              />
            )}
          </button>
        );
      })}

      <div
        style={place(round.outputPos)}
        className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
      >
        <span
          role="img"
          aria-label={`${round.outputLabel}: ${
            outputOn === null ? "not connected" : outputOn ? "on" : "off"
          }`}
          className={`h-9 w-9 rounded-full border-2 transition ${
            outputOn
              ? "border-signal bg-signal shadow-[0_0_16px_var(--color-signal)]"
              : "border-line bg-paper-raised"
          }`}
        />
        <span className="max-w-20 text-center text-[11px] leading-tight text-ink-soft">
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
      <table className="w-full text-center text-sm">
        <caption className="px-4 pt-3 pb-1 text-left text-xs font-medium tracking-[0.14em] text-ink-soft uppercase">
          Does your circuit follow the rule?
        </caption>
        <thead>
          <tr className="text-xs text-ink-soft">
            {round.inputs.map((input) => (
              <th key={input.id} scope="col" className="px-3 py-2 font-medium">
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
                  <td key={input.id} className="px-3 py-2">
                    <Dot on={row[input.id]} />
                  </td>
                ))}
                <td className="px-3 py-2">
                  <Dot on={expected} />
                </td>
                <td className="px-3 py-2">
                  <Dot on={actual ?? null} />
                </td>
                <td className="px-3 py-2 font-semibold">
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

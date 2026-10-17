"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { BodyPortal } from "@/components/ui/BodyPortal";
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
  toggleNot,
  isNegated,
  type Gate,
  type Placed,
  type Round,
  type Signals,
} from "./logic-rules";

const GATES: Gate[] = ["AND", "OR", "NOT", "XOR"];

type Drag = {
  gate: Gate;
  /** Slot the gate came from, or null when dragged from the toolbox. */
  fromSlot: string | null;
  startX: number;
  startY: number;
  x: number;
  y: number;
  moved: boolean;
  /** Slot currently under the pointer. */
  over: string | null;
};

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
  const [drag, setDrag] = useState<Drag | null>(null);
  const dragRef = useRef<Drag | null>(null);
  const suppressClick = useRef(false);
  const closeTutorial = useCallback(() => setShowTutorial(false), []);

  const round = ROUNDS[roundIndex];
  const isLastRound = roundIndex === ROUNDS.length - 1;
  const solved = isSolved(round, placed);
  const live = evaluate(round, placed, withDefaults(round, switches));

  // Put `gate` in a slot (used by both tap-to-place and drag-and-drop).
  // `fromSlot` is set when an already-placed gate is being moved.
  function tryPlace(slotId: string, gate: Gate, fromSlot: string | null = null) {
    const slot = round.slots.find((item) => item.id === slotId);
    if (!slot || solved) return;

    if (GATE_ARITY[gate] !== slot.from.length) {
      setMessage(
        gate === "NOT"
          ? "NOT only likes one wire, and this slot has two."
          : `${gate} likes two wires, and this slot has one.`,
      );
      return;
    }

    const next = { ...placed, [slotId]: gate };
    if (fromSlot && fromSlot !== slotId) next[fromSlot] = null;
    setPlaced(next);
    setMessage(null);
    if (isLastRound && isSolved(round, next)) onCleared?.();
  }

  // The little NOT bubble on a placed gate: AND <-> NAND, OR <-> NOR, XOR <-> XNOR.
  function toggleSlotNot(slotId: string) {
    const gate = placed[slotId];
    const flipped = gate ? toggleNot(gate) : null;
    if (!gate || !flipped || solved) return;
    const next = { ...placed, [slotId]: flipped };
    setPlaced(next);
    setMessage(null);
    if (isLastRound && isSolved(round, next)) onCleared?.();
  }

  // Tap flow: pick a gate, then tap a slot (or tap a filled slot to empty it).
  function placeGate(slotId: string) {
    if (suppressClick.current || solved) return;
    if (!armed) {
      if (placed[slotId]) {
        setPlaced({ ...placed, [slotId]: null });
        setMessage(null);
      } else {
        setMessage("Try dragging a gate onto the slot!");
      }
      return;
    }
    tryPlace(slotId, armed);
  }

  // Drag flow: pointer events work for mouse and touch.
  function startDrag(
    event: ReactPointerEvent,
    gate: Gate,
    fromSlot: string | null,
  ) {
    if (solved || event.button !== 0) return;
    const next: Drag = {
      gate,
      fromSlot,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
      moved: false,
      over: null,
    };
    dragRef.current = next;
    setDrag(next);
  }

  function finishDrop(d: Drag, target: string | null) {
    if (target) {
      tryPlace(target, d.gate, d.fromSlot);
    } else if (d.fromSlot) {
      // Dragged a placed gate off the board: take it out.
      setPlaced((prev) => ({ ...prev, [d.fromSlot as string]: null }));
      setMessage(null);
    }
  }

  const dropRef = useRef(finishDrop);
  useEffect(() => {
    dropRef.current = finishDrop;
  });

  const dragging = drag !== null;
  useEffect(() => {
    if (!dragging) return;
    const slotAt = (x: number, y: number) =>
      document
        .elementFromPoint(x, y)
        ?.closest("[data-slot]")
        ?.getAttribute("data-slot") ?? null;

    const onMove = (event: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const moved =
        d.moved ||
        Math.hypot(event.clientX - d.startX, event.clientY - d.startY) > 8;
      const next: Drag = {
        ...d,
        x: event.clientX,
        y: event.clientY,
        moved,
        over: moved ? slotAt(event.clientX, event.clientY) : null,
      };
      dragRef.current = next;
      setDrag(next);
    };
    const onUp = (event: PointerEvent) => {
      const d = dragRef.current;
      dragRef.current = null;
      setDrag(null);
      // A press without movement is a normal tap; the click handlers deal with it.
      if (!d || !d.moved) return;
      suppressClick.current = true;
      setTimeout(() => {
        suppressClick.current = false;
      }, 0);
      dropRef.current(d, slotAt(event.clientX, event.clientY));
    };
    const onCancel = () => {
      dragRef.current = null;
      setDrag(null);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
    };
  }, [dragging]);

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
          <p className="text-lg font-semibold text-ink">
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
              onPointerDown={(event) => startDrag(event, gate, null)}
              onDragStart={(event) => event.preventDefault()}
              onClick={() => {
                if (suppressClick.current) return;
                setArmed(armed === gate ? null : gate);
                setMessage(null);
              }}
              style={{ cursor: solved ? "default" : "grab" }}
              className={`touch-none select-none rounded-2xl px-8 py-4 text-xl font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper disabled:opacity-40 ${
                armed === gate
                  ? "bg-copper text-paper-raised ring-4 ring-ink"
                  : "border-2 border-line bg-paper-raised text-ink hover:border-ink"
              }`}
            >
              {gate}
            </button>
          ))}
          <span className="text-lg text-ink-soft">
            {armed ? "Now tap a slot ↓" : "Drag a gate onto a slot ↓"}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-[3fr_2fr] md:items-start">
          <div className="grid gap-3">
        <Board
          round={round}
          placed={placed}
          signals={live}
          switches={switches}
          armed={armed}
          dragGate={drag?.moved ? drag.gate : null}
          dragOver={drag?.moved ? drag.over : null}
          dragFrom={drag?.moved ? drag.fromSlot : null}
          onSwitch={(id) =>
            setSwitches((prev) => ({ ...prev, [id]: !prev[id] }))
          }
          onSlot={placeGate}
          onToggleNot={toggleSlotNot}
          onSlotPointerDown={startDrag}
        />

        {drag?.moved && (
          <BodyPortal>
          <div
            aria-hidden="true"
            className="pointer-events-none fixed z-[80] -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-signal bg-void px-8 py-4 text-xl font-semibold text-ink shadow-2xl"
            style={{ left: drag.x, top: drag.y }}
          >
            {drag.gate}
          </div>
          </BodyPortal>
        )}

        <p className="text-lg text-copper empty:hidden" aria-live="polite">
          {message}
        </p>

          </div>
          <div className="grid gap-3">
        <ul className="grid gap-1 text-lg text-ink-soft">
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

          </div>
        </div>

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
                <Button className="px-10 py-3.5 text-xl" onClick={nextRound}>
                  Next round
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                className="px-6 py-3 text-lg"
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
                className="px-4 py-3 text-lg"
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
  dragGate,
  dragOver,
  dragFrom,
  onSwitch,
  onSlot,
  onToggleNot,
  onSlotPointerDown,
}: {
  round: Round;
  placed: Placed;
  signals: Signals;
  switches: Record<string, boolean>;
  armed: Gate | null;
  dragGate: Gate | null;
  dragOver: string | null;
  dragFrom: string | null;
  onSwitch: (id: string) => void;
  onSlot: (id: string) => void;
  onToggleNot: (id: string) => void;
  onSlotPointerDown: (
    event: ReactPointerEvent,
    gate: Gate,
    fromSlot: string | null,
  ) => void;
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
    <div className="relative h-72 w-full rounded-3xl border border-line bg-paper sm:h-[22rem]">
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
        const fits = dragGate !== null && GATE_ARITY[dragGate] === slot.from.length;
        const hovering = dragOver === slot.id;
        const dragRing = hovering
          ? fits
            ? "ring-4 ring-signal"
            : "ring-4 ring-red-500"
          : fits
            ? "ring-2 ring-copper/70"
            : "";
        return (
          <div key={slot.id} className="contents">
          <button
            type="button"
            data-slot={slot.id}
            onPointerDown={gate ? (event) => onSlotPointerDown(event, gate, slot.id) : undefined}
            onDragStart={(event) => event.preventDefault()}
            onClick={() => onSlot(slot.id)}
            aria-label={`Slot ${slot.id}: ${gate ?? "empty"}`}
            style={{ ...place(slot), ...(gate ? { cursor: "grab" } : {}) }}
            className={`${gate ? "touch-none select-none" : ""} absolute flex h-14 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2 rounded-2xl text-xl font-semibold transition sm:h-16 sm:w-28 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${dragRing} ${
              dragFrom === slot.id ? "opacity-40" : ""
            } ${
              gate
                ? "border-2 border-signal bg-void text-ink"
                : `border-2 border-dashed bg-paper-raised text-copper ${
                    armed || fits ? "border-copper" : "border-copper/50"
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
          {gate && toggleNot(gate) !== null && (
            <button
              type="button"
              onClick={() => onToggleNot(slot.id)}
              aria-pressed={isNegated(gate)}
              aria-label={`NOT on the ${slot.id} gate: ${isNegated(gate) ? "on" : "off"}`}
              style={{
                left: `calc(${slot.x}% + 2.6rem)`,
                top: `calc(${(slot.y / 60) * 100}% - 2.1rem)`,
              }}
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 px-2.5 py-0.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${
                isNegated(gate)
                  ? "border-copper bg-copper text-paper-raised"
                  : "border-line bg-paper-raised text-ink-soft hover:border-copper"
              }`}
            >
              NOT
            </button>
          )}
          </div>
        );
      })}

      <div
        style={place(round.outputPos)}
        className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 select-none"
      >
        <span className="text-sm tracking-wide text-ink-soft uppercase">Output</span>
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
      <table className="w-full text-center text-lg">
        <caption className="px-4 pt-4 pb-1 text-left text-sm font-medium tracking-[0.14em] text-ink-soft uppercase">
          Rule check
        </caption>
        <thead>
          <tr className="text-base text-ink-soft">
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
                <td className="px-3 py-3 text-xl font-semibold">
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

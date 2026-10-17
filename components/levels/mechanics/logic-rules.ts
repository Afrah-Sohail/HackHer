export type Gate = "AND" | "OR" | "NOT";

export const GATE_ARITY: Record<Gate, 1 | 2> = { AND: 2, OR: 2, NOT: 1 };

export type InputNode = { id: string; label: string; x: number; y: number };

export type GateSlot = {
  id: string;
  /** Ids of the nodes (inputs or other gates) wired into this slot. */
  from: readonly string[];
  x: number;
  y: number;
};

export type Round = {
  title: string;
  story: string;
  inputs: readonly InputNode[];
  slots: readonly GateSlot[];
  /** Id of the slot whose value lights the output lamp. */
  outputFrom: string;
  outputLabel: string;
  outputPos: { x: number; y: number };
  /** The rule the circuit must follow. */
  target: (values: Record<string, boolean>) => boolean;
  lesson: string;
};

export const ROUNDS: readonly Round[] = [
  {
    title: "The double check",
    story:
      "The codebreaking machine should only stop when BOTH clues are true. Wire up the rule.",
    inputs: [
      { id: "A", label: "Letters match", x: 10, y: 18 },
      { id: "B", label: "Rotors match", x: 10, y: 42 },
    ],
    slots: [{ id: "g1", from: ["A", "B"], x: 50, y: 30 }],
    outputFrom: "g1",
    outputLabel: "Stop machine",
    outputPos: { x: 90, y: 30 },
    target: (v) => v.A && v.B,
    lesson: "AND is strict: it only turns on when every input is on.",
  },
  {
    title: "Either clue",
    story:
      "A guess stays alive if EITHER clue fits. Just one is enough to keep checking it.",
    inputs: [
      { id: "A", label: "Fits spot 1", x: 10, y: 18 },
      { id: "B", label: "Fits spot 2", x: 10, y: 42 },
    ],
    slots: [{ id: "g1", from: ["A", "B"], x: 50, y: 30 }],
    outputFrom: "g1",
    outputLabel: "Keep guess",
    outputPos: { x: 90, y: 30 },
    target: (v) => v.A || v.B,
    lesson: "OR is relaxed: it turns on when at least one input is on.",
  },
  {
    title: "Never itself",
    story:
      "Fun fact: the Enigma machine never turned a letter into itself. So if a guess makes a letter match itself, it must be wrong. Throw it out!",
    inputs: [{ id: "A", label: "Letter maps to itself", x: 10, y: 30 }],
    slots: [{ id: "g1", from: ["A"], x: 50, y: 30 }],
    outputFrom: "g1",
    outputLabel: "Keep guess",
    outputPos: { x: 90, y: 30 },
    target: (v) => !v.A,
    lesson: "NOT flips a signal: on becomes off, and off becomes on.",
  },
  {
    title: "The full rule",
    story:
      "Put it all together. Keep a guess if (the crib fits spot 1 OR spot 2) AND the letter does NOT map to itself.",
    inputs: [
      { id: "A", label: "Fits spot 1", x: 8, y: 14 },
      { id: "B", label: "Fits spot 2", x: 8, y: 30 },
      { id: "C", label: "Letter maps to itself", x: 8, y: 48 },
    ],
    slots: [
      { id: "g1", from: ["A", "B"], x: 38, y: 22 },
      { id: "g2", from: ["C"], x: 38, y: 48 },
      { id: "g3", from: ["g1", "g2"], x: 66, y: 35 },
    ],
    outputFrom: "g3",
    outputLabel: "Keep guess",
    outputPos: { x: 92, y: 35 },
    target: (v) => (v.A || v.B) && !v.C,
    lesson:
      "Big decisions are just small gates chained together. That's how every computer works.",
  },
];

export type Placed = Record<string, Gate | null>;
export type Signals = Record<string, boolean | null>;

export function emptyPlaced(round: Round): Placed {
  return Object.fromEntries(round.slots.map((slot) => [slot.id, null]));
}

function apply(gate: Gate, inputs: boolean[]): boolean {
  if (gate === "NOT") return !inputs[0];
  if (gate === "AND") return inputs[0] && inputs[1];
  return inputs[0] || inputs[1];
}

/** Value of every node. A slot with no gate (or missing input) is null. */
export function evaluate(
  round: Round,
  placed: Placed,
  inputValues: Record<string, boolean>,
): Signals {
  const signals: Signals = { ...inputValues };
  for (const slot of round.slots) {
    const gate = placed[slot.id];
    const inputs = slot.from.map((id) => signals[id]);
    signals[slot.id] =
      gate && inputs.every((value) => value !== null && value !== undefined)
        ? apply(gate, inputs as boolean[])
        : null;
  }
  return signals;
}

export function allRows(round: Round): Record<string, boolean>[] {
  const ids = round.inputs.map((input) => input.id);
  return Array.from({ length: 2 ** ids.length }, (_, row) =>
    Object.fromEntries(
      ids.map((id, i) => [id, Boolean((row >> (ids.length - 1 - i)) & 1)]),
    ),
  );
}

export function isSolved(round: Round, placed: Placed): boolean {
  return allRows(round).every((row) => {
    const out = evaluate(round, placed, row)[round.outputFrom];
    return out === round.target(row);
  });
}

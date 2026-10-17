// NAND, NOR and XNOR are AND, OR and XOR with a NOT on the output.
export type Gate = "AND" | "OR" | "NOT" | "XOR" | "NAND" | "NOR" | "XNOR";

export const GATE_ARITY: Record<Gate, 1 | 2> = {
  AND: 2,
  OR: 2,
  NOT: 1,
  XOR: 2,
  NAND: 2,
  NOR: 2,
  XNOR: 2,
};

const NEGATED: Partial<Record<Gate, Gate>> = {
  AND: "NAND",
  NAND: "AND",
  OR: "NOR",
  NOR: "OR",
  XOR: "XNOR",
  XNOR: "XOR",
};

/** The gate with a NOT added to (or taken off) its output; null for NOT. */
export function toggleNot(gate: Gate): Gate | null {
  return NEGATED[gate] ?? null;
}

export function isNegated(gate: Gate): boolean {
  return gate === "NAND" || gate === "NOR" || gate === "XNOR";
}

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
      "Stop the machine only when BOTH clues are true.",
    inputs: [
      { id: "A", label: "Letters match", x: 10, y: 18 },
      { id: "B", label: "Rotors match", x: 10, y: 42 },
    ],
    slots: [{ id: "g1", from: ["A", "B"], x: 50, y: 30 }],
    outputFrom: "g1",
    outputLabel: "Stop machine",
    outputPos: { x: 80, y: 30 },
    target: (v) => v.A && v.B,
    lesson: "AND needs both.",
  },
  {
    title: "Either clue",
    story:
      "Keep this guess if EITHER clue fits.",
    inputs: [
      { id: "A", label: "Fits spot 1", x: 10, y: 18 },
      { id: "B", label: "Fits spot 2", x: 10, y: 42 },
    ],
    slots: [{ id: "g1", from: ["A", "B"], x: 50, y: 30 }],
    outputFrom: "g1",
    outputLabel: "Keep it",
    outputPos: { x: 80, y: 30 },
    target: (v) => v.A || v.B,
    lesson: "OR needs just one.",
  },
  {
    title: "Exactly one",
    story: "Stop the machine when EXACTLY ONE clue is true, not both.",
    inputs: [
      { id: "A", label: "Letters match", x: 10, y: 18 },
      { id: "B", label: "Rotors match", x: 10, y: 42 },
    ],
    slots: [{ id: "g1", from: ["A", "B"], x: 50, y: 30 }],
    outputFrom: "g1",
    outputLabel: "Stop machine",
    outputPos: { x: 80, y: 30 },
    target: (v) => v.A !== v.B,
    lesson: "XOR is on when the inputs differ.",
  },
  {
    title: "Never itself",
    story:
      "Enigma never turned a letter into itself. Toss those guesses!",
    inputs: [{ id: "A", label: "Letter maps to itself", x: 10, y: 30 }],
    slots: [{ id: "g1", from: ["A"], x: 50, y: 30 }],
    outputFrom: "g1",
    outputLabel: "Keep it",
    outputPos: { x: 80, y: 30 },
    target: (v) => !v.A,
    lesson: "NOT flips it.",
  },
  {
    title: "The full rule",
    story:
      "Keep a guess if A or B fits, and not C.",
    inputs: [
      { id: "A", label: "Fits spot 1", x: 8, y: 14 },
      { id: "B", label: "Fits spot 2", x: 8, y: 30 },
      { id: "C", label: "Letter maps to itself", x: 8, y: 48 },
    ],
    slots: [
      { id: "g1", from: ["A", "B"], x: 34, y: 22 },
      { id: "g2", from: ["C"], x: 34, y: 48 },
      { id: "g3", from: ["g1", "g2"], x: 58, y: 35 },
    ],
    outputFrom: "g3",
    outputLabel: "Keep it",
    outputPos: { x: 80, y: 35 },
    target: (v) => (v.A || v.B) && !v.C,
    lesson: "Small gates chained together make big decisions.",
  },
];

export type Placed = Record<string, Gate | null>;
export type Signals = Record<string, boolean | null>;

export function emptyPlaced(round: Round): Placed {
  return Object.fromEntries(round.slots.map((slot) => [slot.id, null]));
}

function apply(gate: Gate, inputs: boolean[]): boolean {
  switch (gate) {
    case "NOT":
      return !inputs[0];
    case "AND":
      return inputs[0] && inputs[1];
    case "NAND":
      return !(inputs[0] && inputs[1]);
    case "OR":
      return inputs[0] || inputs[1];
    case "NOR":
      return !(inputs[0] || inputs[1]);
    case "XOR":
      return inputs[0] !== inputs[1];
    case "XNOR":
      return inputs[0] === inputs[1];
  }
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

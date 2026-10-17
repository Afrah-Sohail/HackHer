export type Round = {
  title: string;
  story: string;
  /** Seconds after liftoff that mission control needs an altitude for. */
  inputs: readonly number[];
  /** Fixed value, or null when the player may change it. */
  aFixed: number | null;
  bFixed: number | null;
  /** The hidden rule that produces mission control's numbers. */
  solution: { a: number; b: number };
  lesson: string;
};

export const A_RANGE = { min: 0, max: 6 };
export const B_RANGE = { min: -5, max: 9 };

export const ROUNDS: readonly Round[] = [
  {
    title: "Add a boost",
    story:
      "Dorothy Vaughan's team worked these out by hand. Add the right boost.",
    inputs: [1, 2, 3, 4],
    aFixed: 1,
    bFixed: null,
    solution: { a: 1, b: 2 },
    lesson:
      "A function turns an input into an output using a rule.",
  },
  {
    title: "Scale it up",
    story:
      "Now multiply instead of adding.",
    inputs: [1, 2, 3, 4],
    aFixed: null,
    bFixed: 0,
    solution: { a: 3, b: 0 },
    lesson:
      "Same input, same output. Every time.",
  },
  {
    title: "Both together",
    story:
      "Use both: multiply, then add.",
    inputs: [1, 2, 3, 4],
    aFixed: null,
    bFixed: null,
    solution: { a: 2, b: 1 },
    lesson:
      "Functions can chain steps together.",
  },
  {
    title: "The real trajectory",
    story:
      "Katherine Johnson checked numbers like these for John Glenn. Find the rule!",
    inputs: [1, 2, 3, 4, 5],
    aFixed: null,
    bFixed: null,
    solution: { a: 3, b: -2 },
    lesson:
      "You found the rule behind the trajectory!",
  },
];

export function output(a: number, b: number, x: number): number {
  return a * x + b;
}

export type RowResult = {
  x: number;
  needed: number;
  yours: number;
  ok: boolean;
};

export function check(round: Round, a: number, b: number): RowResult[] {
  return round.inputs.map((x) => {
    const needed = output(round.solution.a, round.solution.b, x);
    const yours = output(a, b, x);
    return { x, needed, yours, ok: needed === yours };
  });
}

export function describeMiss(row: RowResult): string {
  const direction = row.yours < row.needed ? "too low" : "too high";
  return `Second ${row.x}: you're at ${row.yours} km, need ${row.needed} (${direction}).`;
}

export function formatRule(a: number, b: number): string {
  const bPart = b === 0 ? "" : b > 0 ? ` + ${b}` : ` − ${Math.abs(b)}`;
  return `y = ${a} × x${bPart}`;
}

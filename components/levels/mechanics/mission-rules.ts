export type Round = {
  title: string;
  story: string;
  /** Seconds after liftoff that mission control needs an altitude for. */
  inputs: readonly number[];
  /** The hidden rule that produces mission control's numbers. */
  solution: { a: number; b: number };
  lesson: string;
};

/** Both steppers start here in every round; the player can change either. */
export const START_A = 1;
export const START_B = 0;
export const A_RANGE = { min: 0, max: 6 };
export const B_RANGE = { min: -5, max: 9 };

export const ROUNDS: readonly Round[] = [
  {
    title: "Add a boost",
    story:
      "Dorothy Vaughan's team worked these out by hand. Add the right boost.",
    inputs: [1, 2, 3, 4],
    solution: { a: 1, b: 2 },
    lesson:
      "A function takes a number in and gives a number out, following a rule.",
  },
  {
    title: "Scale it up",
    story:
      "Now multiply instead of adding.",
    inputs: [1, 2, 3, 4],
    solution: { a: 3, b: 0 },
    lesson:
      "Put the same number in and you always get the same number out.",
  },
  {
    title: "Both together",
    story:
      "Use both: multiply, then add.",
    inputs: [1, 2, 3, 4],
    solution: { a: 2, b: 1 },
    lesson:
      "A function can have more than one step, like multiply and then add.",
  },
  {
    title: "The real trajectory",
    story:
      "Katherine Johnson checked numbers like these for John Glenn. Find the rule!",
    inputs: [1, 2, 3, 4, 5],
    solution: { a: 3, b: -2 },
    lesson:
      "You cracked the rule behind the trajectory!",
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
  const direction = row.yours < row.needed ? "a little low, nudge it up" : "a little high, nudge it down";
  return `At second ${row.x} you're at ${row.yours} km and we need ${row.needed}. That's ${direction}!`;
}

export function formatRule(a: number, b: number): string {
  const bPart = b === 0 ? "" : b > 0 ? ` + ${b}` : ` − ${Math.abs(b)}`;
  return `y = ${a} × x${bPart}`;
}

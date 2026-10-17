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
      "Before electronic computers, human \"computers\" like Dorothy Vaughan's team worked out numbers like these by hand. Mission control needs the altitude each second. Your machine only adds a boost. How big?",
    inputs: [1, 2, 3, 4],
    aFixed: 1,
    bFixed: null,
    solution: { a: 1, b: 2 },
    lesson:
      "A function takes an input, applies a rule, and gives an output. Here the rule was \"add 2\".",
  },
  {
    title: "Scale it up",
    story:
      "Engineers like Mary Jackson ran wind-tunnel experiments, hunting for rules that link one measurement to another. This time your machine multiplies. Which number turns each second into mission control's altitude?",
    inputs: [1, 2, 3, 4],
    aFixed: null,
    bFixed: 0,
    solution: { a: 3, b: 0 },
    lesson:
      "Same input, same output, every time. Multiplying scales every result by the same amount.",
  },
  {
    title: "Both together",
    story:
      "Now the rule uses both blocks: multiply first, then add a boost. Use the table to work out each number.",
    inputs: [1, 2, 3, 4],
    aFixed: null,
    bFixed: null,
    solution: { a: 2, b: 1 },
    lesson:
      "Functions can chain steps together: multiply, then add. Computers do this billions of times a second.",
  },
  {
    title: "The real trajectory",
    story:
      "Katherine Johnson calculated flight paths like this one. Before John Glenn's orbit, he asked for her to double-check the computer's numbers. Find the rule and get the rocket on course!",
    inputs: [1, 2, 3, 4, 5],
    aFixed: null,
    bFixed: null,
    solution: { a: 3, b: -2 },
    lesson:
      "You found the rule behind the numbers. That's what a trajectory is: a function that tells you where to be at every moment.",
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
  return `At second ${row.x} your rocket was at ${row.yours} km, but mission control needs ${row.needed} km (${direction}).`;
}

export function formatRule(a: number, b: number): string {
  const bPart = b === 0 ? "" : b > 0 ? ` + ${b}` : ` − ${Math.abs(b)}`;
  return `y = ${a} × x${bPart}`;
}

export type Thread = "A" | "B" | "C";

export const THREADS: Record<
  Thread,
  { symbol: string; name: string; className: string }
> = {
  A: { symbol: "◆", name: "gold", className: "bg-copper text-paper-raised" },
  B: { symbol: "▲", name: "cyan", className: "bg-signal text-paper-raised" },
  C: { symbol: "●", name: "pink", className: "bg-fuchsia-400 text-paper-raised" },
};

export const THREAD_IDS: Thread[] = ["A", "B", "C"];

export const MIN_REPEAT = 2;
export const MAX_REPEAT = 6;
/** Safety cap so nobody builds an endless card by hand. */
export const MAX_CHIPS = 14;

export type BodyThread = { id: number; thread: Thread };

export type Card =
  | { id: number; kind: "thread"; thread: Thread }
  | { id: number; kind: "repeat"; times: number; body: BodyThread[] };

/** A ready-made answer: single threads, or a repeat block with its threads. */
export type SolutionItem =
  | { thread: Thread }
  | { repeat: number; body: Thread[] };

export type Round = {
  title: string;
  story: string;
  target: Thread[];
  /** "Par": the chip count a clever solution (using a loop) needs. */
  budget: number;
  repeatAvailable: boolean;
  /** The par solution, shown by the "Show me the loop" learning moment. */
  solution: SolutionItem[];
  lesson: string;
};

function pattern(letters: string): Thread[] {
  return letters.split("") as Thread[];
}

export const ROUNDS: readonly Round[] = [
  {
    title: "One at a time",
    story:
      "Copy the pattern, in order.",
    target: pattern("ABC"),
    budget: 3,
    repeatAvailable: false,
    solution: [{ thread: "A" }, { thread: "B" }, { thread: "C" }],
    lesson: "That's a sequence: one step after another.",
  },
  {
    title: "Again and again",
    story:
      "Copy it any way you like. Can you do it in 3 chips?",
    target: pattern("ABABAB"),
    budget: 3,
    repeatAvailable: true,
    solution: [{ repeat: 3, body: ["A", "B"] }],
    lesson:
      "That's a loop: instead of writing the same steps over and over, you repeat them.",
  },
  {
    title: "A twist",
    story:
      "Start with ●, then the rest repeats. Aim for 4 chips.",
    target: pattern("CABABAB"),
    budget: 4,
    repeatAvailable: true,
    solution: [{ thread: "C" }, { repeat: 3, body: ["A", "B"] }],
    lesson: "See how a sequence and a loop team up? One step, then a loop.",
  },
  {
    title: "The big one",
    story:
      "Aim for 4 chips. Find the part that repeats!",
    target: pattern("AABAABAABAAB"),
    budget: 4,
    repeatAvailable: true,
    solution: [{ repeat: 4, body: ["A", "A", "B"] }],
    lesson:
      "One tiny loop made that whole big pattern. Pretty handy, right?",
  },
];

export function expand(cards: readonly Card[]): Thread[] {
  return cards.flatMap((card) =>
    card.kind === "thread"
      ? [card.thread]
      : Array.from({ length: card.times }, () =>
          card.body.map((item) => item.thread),
        ).flat(),
  );
}

export function chipCount(cards: readonly Card[]): number {
  return cards.reduce(
    (sum, card) => sum + (card.kind === "thread" ? 1 : 1 + card.body.length),
    0,
  );
}

/** Index of the first thread that differs, or -1 when the weave matches. */
export function firstMismatch(
  woven: readonly Thread[],
  target: readonly Thread[],
): number {
  const length = Math.max(woven.length, target.length);
  for (let i = 0; i < length; i += 1) {
    if (woven[i] !== target[i]) return i;
  }
  return -1;
}

export function describeMismatch(
  woven: readonly Thread[],
  target: readonly Thread[],
  index: number,
): string {
  const want = target[index];
  const got = woven[index];
  if (got === undefined) {
    return `Yours stops at ${woven.length}, but the pattern keeps going to ${target.length}.`;
  }
  if (want === undefined) {
    return `Yours has ${woven.length}, a few more than the pattern's ${target.length}.`;
  }
  return `Spot ${index + 1} wants a ${THREADS[want].symbol} instead of the ${THREADS[got].symbol}.`;
}

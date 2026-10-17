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

export type BodyThread = { id: number; thread: Thread };

export type Card =
  | { id: number; kind: "thread"; thread: Thread }
  | { id: number; kind: "repeat"; times: number; body: BodyThread[] };

export type Round = {
  title: string;
  story: string;
  target: Thread[];
  /** Most chips (threads plus repeat blocks) the player may use. */
  budget: number;
  repeatAvailable: boolean;
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
    lesson: "A sequence: steps in order.",
  },
  {
    title: "Again and again",
    story:
      "Only 3 chips! Add ◆ ▲, select them, tap 🔁 Repeat these.",
    target: pattern("ABABAB"),
    budget: 3,
    repeatAvailable: true,
    lesson:
      "A loop: repeat steps instead of writing them again.",
  },
  {
    title: "A twist",
    story:
      "Start with ●, then repeat the rest.",
    target: pattern("CABABAB"),
    budget: 4,
    repeatAvailable: true,
    lesson: "Sequences and loops work together.",
  },
  {
    title: "The big one",
    story:
      "Only 4 chips! Find the part that repeats.",
    target: pattern("AABAABAABAAB"),
    budget: 4,
    repeatAvailable: true,
    lesson:
      "A tiny loop makes a big pattern.",
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
    return `Yours stops at ${woven.length}, the pattern has ${target.length}.`;
  }
  if (want === undefined) {
    return `Yours has ${woven.length}, the pattern has ${target.length}.`;
  }
  return `Spot ${index + 1} should be ${THREADS[want].symbol}, not ${THREADS[got].symbol}.`;
}

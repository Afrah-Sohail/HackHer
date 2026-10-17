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
    title: "One thread at a time",
    story:
      "The loom weaves one thread after another, in the order you give it. Copy the pattern!",
    target: pattern("ABC"),
    budget: 3,
    repeatAvailable: false,
    lesson: "That's a sequence: steps done one after another, in order.",
  },
  {
    title: "Again and again",
    story:
      "The same two threads, over and over, and you only have 3 chips. Is there a shortcut? Try the 🔁 Repeat block!",
    target: pattern("ABABAB"),
    budget: 3,
    repeatAvailable: true,
    lesson:
      "That's a loop: repeat some steps instead of writing them out again and again.",
  },
  {
    title: "A twist at the start",
    story:
      "Start with one pink thread, then repeat a pattern. Mix a single step with a loop.",
    target: pattern("CABABAB"),
    budget: 4,
    repeatAvailable: true,
    lesson: "Sequences and loops work together: do one thing, then loop the rest.",
  },
  {
    title: "The big tapestry",
    story:
      "A long pattern, but only 4 chips. Find the small piece that repeats!",
    target: pattern("AABAABAABAAB"),
    budget: 4,
    repeatAvailable: true,
    lesson:
      "A tiny loop can make a huge pattern. Ada saw that the loom repeats a weave, and a computer can too.",
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
    return `Your weave stopped after ${woven.length} threads, but the pattern has ${target.length}.`;
  }
  if (want === undefined) {
    return `Your weave has ${woven.length} threads, but the pattern only has ${target.length}.`;
  }
  return `Thread ${index + 1} should be ${THREADS[want].symbol} ${THREADS[want].name}, but you wove ${THREADS[got].symbol} ${THREADS[got].name}.`;
}

export const CHANNEL_COUNT = 6;
export const STEP_COUNT = 8;

export type Plan = (number | null)[];

export type Round = {
  title: string;
  /** Plain-language description of how the jammer behaves. */
  rule: string;
  /** Channels the jammer blocks on a step, given the channels used so far. */
  blocked: (history: readonly number[]) => number[];
  /** Shown after winning: what this round teaches. */
  lesson: string;
  /** Whether the live jammer preview starts switched on. */
  previewByDefault: boolean;
};

function lastUsed(history: readonly number[], count: number): number[] {
  return history.slice(-count);
}

export const ROUNDS: readonly Round[] = [
  {
    title: "Parked jammer",
    rule: "Jammer sits on Ch 4.",
    blocked: () => [4],
    lesson: "A jammer that never moves is easy to dodge.",
    previewByDefault: true,
  },
  {
    title: "Follower",
    rule: "Jammer blocks the channel you just used.",
    blocked: (history) => lastUsed(history, 1),
    lesson: "Stay put and you get jammed. Hop!",
    previewByDefault: true,
  },
  {
    title: "Pattern spotter",
    rule: "Jammer blocks your last 2 channels.",
    blocked: (history) => lastUsed(history, 2),
    lesson: "Switching between two is too easy to spot. Hedy's design used a player-piano-style roll to keep both sides in sync.",
    previewByDefault: false,
  },
  {
    title: "Mastermind",
    rule: "Jammer blocks your last 3 channels.",
    blocked: (history) => lastUsed(history, 3),
    lesson: "Hedy and composer George Antheil patented hopping in 1942. Ideas like it live on in Bluetooth.",
    previewByDefault: false,
  },
];

export type StepResult = {
  channel: number;
  blocked: number[];
  ok: boolean;
};

export function isPlanComplete(plan: Plan): plan is number[] {
  return plan.length === STEP_COUNT && plan.every((channel) => channel !== null);
}

export function simulate(round: Round, plan: readonly number[]): StepResult[] {
  return plan.map((channel, step) => {
    const blocked = round.blocked(plan.slice(0, step));
    return { channel, blocked, ok: !blocked.includes(channel) };
  });
}

/** Blocked channels per step, assuming steps 1..filled are already chosen. */
export function previewBlocked(
  round: Round,
  plan: Plan,
  step: number,
): number[] | null {
  const prior = plan.slice(0, step);
  if (prior.some((channel) => channel === null)) return null;
  return round.blocked(prior as number[]);
}

export function describeFailure(result: StepResult, step: number): string {
  return `Step ${step + 1}: Ch ${result.channel} was blocked.`;
}

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
    rule: "The jammer is parked on channel 4 and never moves. Stay off channel 4!",
    blocked: () => [4],
    lesson: "Easy so far: a jammer that never moves is simple to avoid.",
    previewByDefault: true,
  },
  {
    title: "Follower",
    rule: "The jammer blocks whichever channel you used on the step before. Never use the same channel twice in a row!",
    blocked: (history) => lastUsed(history, 1),
    lesson: "Staying on one channel gets you jammed. Hopping keeps you a step ahead.",
    previewByDefault: true,
  },
  {
    title: "Pattern spotter",
    rule: "The jammer blocks the last 2 channels you used. Each step must be different from the 2 steps before it.",
    blocked: (history) => lastUsed(history, 2),
    lesson: "Switching back and forth between two channels is too easy to spot.",
    previewByDefault: false,
  },
  {
    title: "Mastermind",
    rule: "The jammer blocks the last 3 channels you used. Each step must be different from the 3 steps before it.",
    blocked: (history) => lastUsed(history, 3),
    lesson: "A longer, less predictable hop pattern is harder to jam. That's Hedy's big idea!",
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
  const list = result.blocked.join(" and ");
  const noun = result.blocked.length === 1 ? "channel" : "channels";
  return `Step ${step + 1} got jammed: the jammer was blocking ${noun} ${list}, and you picked channel ${result.channel}.`;
}

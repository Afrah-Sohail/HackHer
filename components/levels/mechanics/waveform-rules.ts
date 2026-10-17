export const CHANNEL_COUNT = 6;
export const STEP_COUNT = 8;

export type Plan = (number | null)[];

export type Round = {
  title: string;
  /** Plain-language description of how the jammer behaves. */
  rule: string;
  /** Channels the jammer blocks on a step, given the channels used so far. */
  blocked: (history: readonly number[]) => number[];
};

function lastUsed(history: readonly number[], count: number): number[] {
  return history.slice(-count);
}

export const ROUNDS: readonly Round[] = [
  {
    title: "Parked jammer",
    rule: "The jammer is parked on channel 4 and never moves.",
    blocked: () => [4],
  },
  {
    title: "Follower",
    rule: "The jammer blocks the channel you used on the previous step.",
    blocked: (history) => lastUsed(history, 1),
  },
  {
    title: "Pattern spotter",
    rule: "The jammer blocks the last 2 channels you used.",
    blocked: (history) => lastUsed(history, 2),
  },
  {
    title: "Mastermind",
    rule: "The jammer blocks the last 3 channels you used.",
    blocked: (history) => lastUsed(history, 3),
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

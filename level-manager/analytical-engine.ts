export type Operation = "flip" | "stamp";

export type Cartridge = {
  id: string;
  pattern: "every" | "repeat";
  count: number;
  operation: Operation;
  title: string;
  action: string;
};

export type DataBall = {
  index: number;
  track: number;
  depth: number;
  value: number;
  operation: Operation;
  cleared: boolean;
  jammed: boolean;
};

export type Strike = {
  index: number;
  matched: boolean;
  comboAfter: number;
};

export type ProgramResult = {
  balls: DataBall[];
  strikes: Strike[];
  scoreGained: number;
  combo: number;
  clearedAll: boolean;
};

export const BALL_COUNT = 16;
export const TRACK_COUNT = 4;
export const MAX_PROGRAM_LENGTH = 4;

export const CARTRIDGES: readonly Cartridge[] = [
  {
    id: "every-2-flip",
    pattern: "every",
    count: 2,
    operation: "flip",
    title: "EVERY 2nd ITEM",
    action: "FLIP LEVER",
  },
  {
    id: "repeat-4-stamp",
    pattern: "repeat",
    count: 4,
    operation: "stamp",
    title: "REPEAT 4×",
    action: "STAMP & BOOST",
  },
  {
    id: "every-2-stamp",
    pattern: "every",
    count: 2,
    operation: "stamp",
    title: "EVERY 2nd ITEM",
    action: "STAMP & BOOST",
  },
  {
    id: "repeat-4-flip",
    pattern: "repeat",
    count: 4,
    operation: "flip",
    title: "REPEAT 4×",
    action: "FLIP LEVER",
  },
];

export function cartridgeLabel(cartridge: Cartridge): string {
  return `${cartridge.title} → ${cartridge.action}`;
}

export function createBalls(): DataBall[] {
  return Array.from({ length: BALL_COUNT }, (_, offset) => {
    const index = offset + 1;
    return {
      index,
      track: Math.floor(offset / TRACK_COUNT),
      depth: offset % TRACK_COUNT,
      value: ((index * 3) % 9) + 1,
      operation: index % 2 === 0 ? "flip" : "stamp",
      cleared: false,
      jammed: false,
    };
  });
}

export function activeBalls(balls: readonly DataBall[]): DataBall[] {
  return balls.filter((ball) => !ball.cleared).sort((a, b) => a.index - b.index);
}

export function selectTargets(
  balls: readonly DataBall[],
  cartridge: Cartridge,
): DataBall[] {
  const active = activeBalls(balls);
  if (cartridge.pattern === "repeat") {
    return active.slice(0, cartridge.count);
  }

  return active.filter((ball) => ball.index % cartridge.count === 0);
}

export function runCartridge(
  balls: readonly DataBall[],
  cartridge: Cartridge,
  comboStart: number,
): { balls: DataBall[]; strikes: Strike[]; combo: number; score: number } {
  const targets = selectTargets(balls, cartridge);
  const strikes: Strike[] = [];
  let combo = comboStart;
  let score = 0;
  const next = balls.map((ball) => ({ ...ball, jammed: false }));

  for (const target of targets) {
    const matched = target.operation === cartridge.operation;
    const ball = next.find((item) => item.index === target.index);
    if (!ball) {
      continue;
    }

    if (matched) {
      combo += 1;
      score += 25 * combo;
      ball.cleared = true;
      ball.jammed = false;
    } else {
      combo = 0;
      ball.jammed = true;
    }

    strikes.push({ index: target.index, matched, comboAfter: combo });
  }

  return { balls: next, strikes, combo, score };
}

export function runProgram(
  balls: readonly DataBall[],
  program: readonly Cartridge[],
): ProgramResult {
  let current = balls.map((ball) => ({ ...ball }));
  let combo = 0;
  let scoreGained = 0;
  const strikes: Strike[] = [];

  for (const cartridge of program) {
    const result = runCartridge(current, cartridge, combo);
    current = result.balls;
    combo = result.combo;
    scoreGained += result.score;
    strikes.push(...result.strikes);
  }

  return {
    balls: current,
    strikes,
    scoreGained,
    combo,
    clearedAll: current.every((ball) => ball.cleared),
  };
}

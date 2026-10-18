export type Priority = "critical" | "important" | "routine";

export const PRIORITY_LABEL: Record<Priority, string> = {
  critical: "Critical",
  important: "Important",
  routine: "Routine",
};

export const PRIORITY_CLASS: Record<Priority, string> = {
  critical: "border-red-400/60 bg-red-500/15 text-red-200",
  important: "border-copper/60 bg-copper/15 text-copper",
  routine: "border-line bg-paper text-ink-soft",
};

export type Task = {
  id: string;
  name: string;
  priority: Priority;
  /** Memory slots the task needs while it runs. */
  cost: number;
};

export type Round = {
  title: string;
  story: string;
  capacity: number;
  /** Tasks in the order they start in the queue. */
  tasks: readonly Task[];
  /** Every task with one of these priorities must run. */
  mustRun: readonly Priority[];
  /** Also keep as much valuable work as the memory allows (a real puzzle). */
  maximize?: boolean;
  lesson: string;
};

/** How much a running job is worth, for the "keep the most" rounds. */
export const PRIORITY_VALUE: Record<Priority, number> = {
  critical: 5,
  important: 3,
  routine: 1,
};

export const ROUNDS: readonly Round[] = [
  {
    title: "Order matters",
    story:
      "Memory fits 3 jobs. Put both critical jobs on top.",
    capacity: 3,
    tasks: [
      { id: "lights", name: "Cabin lights", priority: "routine", cost: 1 },
      { id: "display", name: "Crew display", priority: "routine", cost: 1 },
      { id: "landing", name: "Landing guidance", priority: "critical", cost: 1 },
      { id: "altitude", name: "Altitude radar", priority: "critical", cost: 1 },
      { id: "log", name: "Data log", priority: "routine", cost: 1 },
    ],
    mustRun: ["critical"],
    lesson:
      "Whatever sits at the top of the queue grabs memory first.",
  },
  {
    title: "Big jobs, small memory",
    story:
      "Memory fits 7 squares. Keep the critical and important jobs.",
    capacity: 7,
    tasks: [
      { id: "log", name: "Data log", priority: "routine", cost: 1 },
      { id: "display", name: "Crew display", priority: "routine", cost: 1 },
      { id: "landing", name: "Landing guidance", priority: "critical", cost: 2 },
      { id: "engine", name: "Descent engine", priority: "critical", cost: 2 },
      { id: "nav", name: "Navigation update", priority: "important", cost: 3 },
    ],
    mustRun: ["critical", "important"],
    lesson:
      "A priority queue lets the important jobs go first.",
  },
  {
    title: "Apollo 11 alarms",
    story:
      "Apollo 11: too much work at once! Keep critical and important jobs running.",
    capacity: 6,
    tasks: [
      { id: "rendezvous", name: "Rendezvous radar", priority: "routine", cost: 3 },
      { id: "landing", name: "Landing guidance", priority: "critical", cost: 2 },
      { id: "engine", name: "Descent engine", priority: "critical", cost: 2 },
      { id: "display", name: "Crew display", priority: "important", cost: 1 },
      { id: "log", name: "Data log", priority: "routine", cost: 1 },
    ],
    mustRun: ["critical", "important"],
    lesson:
      "Apollo 11's computer dropped the low-priority jobs so the landing could keep going.",
  },
  {
    title: "Every alarm at once",
    story:
      "Seven jobs, 8 squares. Keep critical and important jobs.",
    capacity: 8,
    tasks: [
      { id: "telemetry", name: "Telemetry", priority: "routine", cost: 2 },
      { id: "lights", name: "Cabin lights", priority: "routine", cost: 1 },
      { id: "rendezvous", name: "Rendezvous radar", priority: "routine", cost: 3 },
      { id: "landing", name: "Landing guidance", priority: "critical", cost: 3 },
      { id: "engine", name: "Descent engine", priority: "critical", cost: 2 },
      { id: "hazard", name: "Hazard alert", priority: "important", cost: 2 },
      { id: "display", name: "Crew display", priority: "important", cost: 1 },
    ],
    mustRun: ["critical", "important"],
    lesson:
      "Your phone and laptop use priority queues like this all the time.",
  },
  {
    title: "Squeeze it in",
    story:
      "8 squares, and not everything fits. Keep landing guidance, then as much important work as you can.",
    capacity: 8,
    tasks: [
      { id: "nav", name: "Navigation update", priority: "important", cost: 4 },
      { id: "data", name: "Data log", priority: "routine", cost: 1 },
      { id: "display", name: "Crew display", priority: "important", cost: 2 },
      { id: "landing", name: "Landing guidance", priority: "critical", cost: 3 },
      { id: "hazard", name: "Hazard alert", priority: "important", cost: 2 },
    ],
    mustRun: ["critical"],
    maximize: true,
    lesson:
      "Priority isn't the whole story: a few small jobs can add up to more than one big one.",
  },
];

export type Outcome = { task: Task; runs: boolean; usedAfter: number };

/** Walk the queue in order; a task runs only if it still fits in memory. */
export function simulate(round: Round, queue: readonly Task[]): Outcome[] {
  let used = 0;
  return queue.map((task) => {
    const runs = used + task.cost <= round.capacity;
    if (runs) used += task.cost;
    return { task, runs, usedAfter: used };
  });
}

export function missedTasks(round: Round, outcomes: readonly Outcome[]): Task[] {
  return outcomes
    .filter((o) => !o.runs && round.mustRun.includes(o.task.priority))
    .map((o) => o.task);
}

/** Total worth of the jobs that actually run. */
export function runValue(outcomes: readonly Outcome[]): number {
  return outcomes
    .filter((o) => o.runs)
    .reduce((sum, o) => sum + PRIORITY_VALUE[o.task.priority], 0);
}

/** The most worth that fits in memory (any job set that fits can be ordered first). */
export function bestValue(round: Round): number {
  let best = 0;
  const count = round.tasks.length;
  for (let mask = 0; mask < 1 << count; mask += 1) {
    let cost = 0;
    let value = 0;
    for (let i = 0; i < count; i += 1) {
      if (mask & (1 << i)) {
        cost += round.tasks[i].cost;
        value += PRIORITY_VALUE[round.tasks[i].priority];
      }
    }
    if (cost <= round.capacity && value > best) best = value;
  }
  return best;
}

export function describeMiss(missed: readonly Task[]): string {
  const names = missed
    .map((task) => `${task.name} (${PRIORITY_LABEL[task.priority].toLowerCase()})`)
    .join(" and ");
  return `${names} didn't get a turn. Try moving ${missed.length === 1 ? "it" : "them"} up a bit!`;
}

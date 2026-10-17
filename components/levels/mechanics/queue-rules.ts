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
  lesson: string;
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
      "The top of the queue gets memory first.",
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
      "A priority queue puts important jobs first.",
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
      "Apollo 11 dropped low-priority tasks and kept landing.",
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
      "Operating systems use priority queues too.",
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

export function describeMiss(missed: readonly Task[]): string {
  const names = missed
    .map((task) => `${task.name} (${PRIORITY_LABEL[task.priority].toLowerCase()})`)
    .join(" and ");
  return `${names} got dropped. Move ${missed.length === 1 ? "it" : "them"} up.`;
}

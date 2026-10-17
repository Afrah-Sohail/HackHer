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
      "Margaret Hamilton led the team that wrote Apollo's flight software. Its computer had very little memory. In this practice round, memory fits only 3 jobs. Reorder the queue so both critical jobs run.",
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
      "The computer works down the queue until memory runs out. Whatever is at the top gets the memory first.",
  },
  {
    title: "Big jobs, small memory",
    story:
      "Jobs now take different amounts of memory (the little squares). Memory fits 7 squares. Both critical jobs and the important one must run.",
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
      "A priority queue puts the most important jobs first, so they always get the memory they need.",
  },
  {
    title: "Apollo 11 alarms",
    story:
      "July 20, 1969, minutes from landing. The computer is overloaded with extra work and flashes alarms 1201 and 1202. Hamilton's team designed the software to run by priority. Show the computer what matters most.",
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
      "That is what happened on Apollo 11: the computer dropped lower-priority tasks and kept running the landing tasks.",
  },
  {
    title: "Every alarm at once",
    story:
      "Seven jobs are fighting for 8 squares of memory. Keep every critical and important job running, and let the routine ones wait.",
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
      "Priority scheduling is a core idea in modern operating systems and safety-critical software.",
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
  return `${names} never ran: the computer ran out of memory before reaching ${missed.length === 1 ? "it" : "them"}.`;
}

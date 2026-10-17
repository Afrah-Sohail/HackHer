"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { UnicornSays } from "@/components/guide/Unicorn";
import { QueueTutorial } from "./QueueTutorial";
import {
  PRIORITY_LABEL,
  ROUNDS,
  describeMiss,
  missedTasks,
  simulate,
  type Priority,
  type Task,
} from "./queue-rules";

type Phase = "build" | "running" | "result";

const PRIORITY_TONE = {
  critical: "critical",
  important: "copper",
  routine: "neutral",
} as const;

const MEMORY_COLOR: Record<Priority, string> = {
  critical: "bg-red-400",
  important: "bg-copper",
  routine: "bg-ink/40",
};

function mustRunText(priorities: readonly Priority[]): string {
  return priorities.map((p) => PRIORITY_LABEL[p].toLowerCase()).join(" and ");
}

export function AlarmQueueMechanic({ onCleared }: { onCleared?: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [queue, setQueue] = useState<Task[]>(() => [...ROUNDS[0].tasks]);
  const [phase, setPhase] = useState<Phase>("build");
  const [revealed, setRevealed] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const closeTutorial = useCallback(() => setShowTutorial(false), []);

  const round = ROUNDS[roundIndex];
  const isLastRound = roundIndex === ROUNDS.length - 1;
  const outcomes = simulate(round, queue);
  const missed = missedTasks(round, outcomes);
  const success = missed.length === 0;
  const shown = phase === "build" ? outcomes.length : revealed;

  useEffect(() => {
    if (phase !== "running") return;
    if (revealed >= queue.length) {
      const timer = setTimeout(() => {
        setPhase("result");
        if (success && roundIndex === ROUNDS.length - 1) onCleared?.();
      }, 450);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setRevealed((count) => count + 1), 450);
    return () => clearTimeout(timer);
  }, [phase, revealed, queue.length, success, roundIndex, onCleared]);

  function move(index: number, delta: number) {
    if (phase !== "build") return;
    const target = index + delta;
    if (target < 0 || target >= queue.length) return;
    setQueue((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function run() {
    setRevealed(0);
    setPhase("running");
  }

  function tryAgain() {
    setRevealed(0);
    setPhase("build");
  }

  function nextRound() {
    setRoundIndex(roundIndex + 1);
    setQueue([...ROUNDS[roundIndex + 1].tasks]);
    setRevealed(0);
    setPhase("build");
  }

  // Memory squares filled by the tasks that run, in queue order.
  const cells: (Priority | null)[] = Array.from({ length: round.capacity }, () => null);
  let cursor = 0;
  for (const outcome of outcomes.slice(0, shown)) {
    if (!outcome.runs) continue;
    for (let i = 0; i < outcome.task.cost; i += 1) {
      cells[cursor] = outcome.task.priority;
      cursor += 1;
    }
  }

  const locked = phase !== "build";

  return (
    <>
      {showTutorial && <QueueTutorial onDone={closeTutorial} />}
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-base font-semibold text-ink">
            Round {roundIndex + 1} of {ROUNDS.length}
          </p>
          <ol className="flex gap-2" aria-label="Round progress">
            {ROUNDS.map((r, i) => (
              <li
                key={r.title}
                className={`h-2.5 w-10 rounded-full ${
                  i < roundIndex || (i === roundIndex && phase === "result" && success)
                    ? "bg-signal"
                    : i === roundIndex
                      ? "bg-copper"
                      : "bg-line"
                }`}
              />
            ))}
          </ol>
        </div>

        <div>
          <p className="font-display text-2xl text-ink sm:text-3xl">
            Keep every {mustRunText(round.mustRun)} job running
          </p>
          <p className="mt-1 text-base text-ink-soft">{round.story}</p>
        </div>

        <div className="rounded-3xl border border-line bg-void p-4 sm:p-6">
          <p className="mb-3 text-xs tracking-wide text-ink-soft uppercase">
            Memory ({cursor}/{round.capacity})
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="img"
            aria-label={`Memory: ${cursor} of ${round.capacity} squares used`}
          >
            {cells.map((priority, i) => (
              <span
                key={i}
                className={`h-9 w-9 rounded-lg transition sm:h-11 sm:w-11 ${
                  priority ? MEMORY_COLOR[priority] : "border border-line"
                } ${phase === "build" ? "opacity-60" : ""}`}
              />
            ))}
          </div>
        </div>

        <ol
          aria-label="Job queue"
          className="grid gap-3 rounded-3xl border border-line bg-paper p-3 sm:p-4"
        >
          {queue.map((task, index) => {
            const outcome = outcomes[index];
            const active = phase === "running" && index === revealed - 1;
            const marked = phase === "build" || index < shown;
            return (
              <li
                key={task.id}
                className={`flex flex-wrap items-center gap-3 rounded-2xl border px-4 py-3 sm:gap-4 ${
                  active ? "border-copper bg-copper/10" : "border-line bg-paper-raised/60"
                }`}
              >
                <span className="w-6 text-center text-lg text-ink-soft">{index + 1}</span>
                <span className="flex flex-col">
                  <button
                    type="button"
                    disabled={locked || index === 0}
                    onClick={() => move(index, -1)}
                    aria-label={`Move ${task.name} up`}
                    className="h-9 w-11 rounded-lg border border-line text-sm text-ink transition hover:border-copper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={locked || index === queue.length - 1}
                    onClick={() => move(index, 1)}
                    aria-label={`Move ${task.name} down`}
                    className="mt-1 h-9 w-11 rounded-lg border border-line text-sm text-ink transition hover:border-copper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper disabled:opacity-30"
                  >
                    ▼
                  </button>
                </span>
                <Tag tone={PRIORITY_TONE[task.priority]} size="md" caps className="w-28 justify-center">
                  {PRIORITY_LABEL[task.priority]}
                </Tag>
                <span className="min-w-0 flex-1 text-lg font-medium text-ink">{task.name}</span>
                <span
                  className="flex gap-0.5"
                  role="img"
                  aria-label={`Needs ${task.cost} memory squares`}
                >
                  {Array.from({ length: task.cost }, (_, i) => (
                    <span key={i} className="h-4 w-4 rounded-sm bg-ink/50" />
                  ))}
                </span>
                <span
                  className={`w-28 text-right text-base font-semibold ${
                    !marked
                      ? "text-ink-soft"
                      : outcome.runs
                        ? "text-signal"
                        : "text-red-400"
                  }`}
                >
                  {!marked ? "·" : outcome.runs ? "✓ runs" : "✕ dropped"}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-wrap items-center gap-3">
          {phase === "build" && (
            <>
              <Button className="px-10 py-3.5 text-lg" onClick={run}>
                Run
              </Button>
              <Button
                variant="secondary"
                className="px-6 py-3 text-base"
                onClick={() => setQueue([...round.tasks])}
              >
                Reset
              </Button>
              <Button
                variant="ghost"
                className="px-4 py-3 text-base"
                onClick={() => setShowTutorial(true)}
              >
                Help
              </Button>
            </>
          )}
          {phase === "running" && (
            <p className="text-lg text-ink-soft" aria-live="polite">
              Running…
            </p>
          )}
          {phase === "result" && success && (
            <>
              <UnicornSays tone="happy" className="w-full">
                <span aria-live="polite" className="block">
                  <strong className="text-signal">
                    {isLastRound ? "Level cleared!" : "All safe!"}
                  </strong>{" "}
                  <span className="text-ink-soft">{round.lesson}</span>
                </span>
              </UnicornSays>
              {!isLastRound && (
                <Button className="px-10 py-3.5 text-lg" onClick={nextRound}>
                  Next round
                </Button>
              )}
            </>
          )}
          {phase === "result" && !success && (
            <>
              <UnicornSays tone="oops" className="w-full">
                <span aria-live="polite" className="block">
                  <strong className="text-copper">Alarm!</strong> {describeMiss(missed)}
                </span>
              </UnicornSays>
              <Button className="px-10 py-3.5 text-lg" onClick={tryAgain}>
                Try again
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

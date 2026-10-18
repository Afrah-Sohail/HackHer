"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { UnicornSays } from "@/components/guide/Unicorn";
import { useLevelStats } from "../LevelStats";

import { QueueTutorial } from "./QueueTutorial";
import {
  PRIORITY_LABEL,
  ROUNDS,
  bestValue,
  describeMiss,
  missedTasks,
  runValue,
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
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragIdRef = useRef<string | null>(null);
  const rowRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const closeTutorial = useCallback(() => setShowTutorial(false), []);

  const round = ROUNDS[roundIndex];
  const isLastRound = roundIndex === ROUNDS.length - 1;
  const outcomes = simulate(round, queue);
  const missed = missedTasks(round, outcomes);
  const { mistake } = useLevelStats();
  const best = round.maximize ? bestValue(round) : 0;
  const kept = runValue(outcomes);
  const missedValue = missed.length === 0 && round.maximize && kept < best;
  const success = missed.length === 0 && !missedValue;
  const shown = phase === "build" ? outcomes.length : revealed;

  useEffect(() => {
    if (phase !== "running") return;
    if (revealed >= queue.length) {
      const timer = setTimeout(() => {
        setPhase("result");
        if (!success) mistake();
        if (success && roundIndex === ROUNDS.length - 1) onCleared?.();
      }, 450);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setRevealed((count) => count + 1), 450);
    return () => clearTimeout(timer);
  }, [phase, revealed, queue.length, success, roundIndex, onCleared, mistake]);

  function startDrag(event: ReactPointerEvent, id: string) {
    if (phase !== "build" || event.button !== 0) return;
    event.preventDefault();
    dragIdRef.current = id;
    setDraggingId(id);
  }

  // While a job is held, it takes the place of whichever row the pointer is
  // over, so the other jobs make room and the memory preview updates live.
  const dragging = draggingId !== null;
  useEffect(() => {
    if (!dragging) return;

    const onMove = (event: PointerEvent) => {
      const id = dragIdRef.current;
      if (!id) return;
      if (event.clientY < 90) window.scrollBy(0, -14);
      else if (event.clientY > window.innerHeight - 90) window.scrollBy(0, 14);
      setQueue((prev) => {
        const from = prev.findIndex((task) => task.id === id);
        if (from === -1) return prev;
        let to = prev.length - 1;
        for (let i = 0; i < prev.length; i += 1) {
          const rect = rowRefs.current[prev[i].id]?.getBoundingClientRect();
          if (rect && event.clientY <= rect.bottom) {
            to = i;
            break;
          }
        }
        if (to === from) return prev;
        const next = [...prev];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        return next;
      });
    };
    const stop = () => {
      dragIdRef.current = null;
      setDraggingId(null);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, [dragging]);

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
          <p className="text-lg font-semibold text-ink">
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
        </div>

        <div className="rounded-3xl border border-line bg-void p-3 sm:p-4">
          <p className="mb-3 text-sm tracking-wide text-ink-soft uppercase">
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
                className={`h-8 w-8 rounded-lg transition sm:h-9 sm:w-9 ${
                  priority ? MEMORY_COLOR[priority] : "border border-line"
                } ${phase === "build" ? "opacity-60" : ""}`}
              />
            ))}
          </div>
        </div>

        {phase === "build" && (
          <p className="-mb-2 text-base text-ink-soft sm:text-lg">
            Drag the <span aria-hidden="true">⠿</span> handle to reorder the jobs.
          </p>
        )}
        <ol
          aria-label="Job queue"
          className={`grid gap-2 rounded-3xl border border-line bg-paper p-2 sm:p-3 ${
            dragging ? "select-none" : ""
          }`}
        >
          {queue.map((task, index) => {
            const outcome = outcomes[index];
            const active = phase === "running" && index === revealed - 1;
            const marked = phase === "build" || index < shown;
            return (
              <li
                key={task.id}
                ref={(el) => {
                  rowRefs.current[task.id] = el;
                }}
                className={`flex flex-wrap items-center gap-3 rounded-2xl border px-4 py-2 transition-shadow sm:gap-4 ${
                  draggingId === task.id
                    ? "border-copper bg-copper/15 shadow-xl ring-2 ring-copper"
                    : active
                      ? "border-copper bg-copper/10"
                      : "border-line bg-paper-raised/60"
                }`}
              >
                <span
                  role="button"
                  tabIndex={locked ? -1 : 0}
                  aria-label={`Move ${task.name}: drag, or use the up and down arrow keys`}
                  aria-disabled={locked}
                  onPointerDown={(event) => startDrag(event, task.id)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                      event.preventDefault();
                      move(index, event.key === "ArrowUp" ? -1 : 1);
                    }
                  }}
                  className={`touch-none rounded-lg px-2 py-1.5 text-3xl leading-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${
                    locked ? "text-ink-soft/30" : "text-ink-soft hover:text-ink"
                  }`}
                  style={{
                    cursor: locked ? "default" : dragging ? "grabbing" : "grab",
                  }}
                >
                  ⠿
                </span>
                <span className="w-6 text-center text-xl text-ink-soft">{index + 1}</span>
                <Tag tone={PRIORITY_TONE[task.priority]} size="md" caps className="w-28 justify-center">
                  {PRIORITY_LABEL[task.priority]}
                </Tag>
                <span className="min-w-0 flex-1 text-xl font-medium text-ink">{task.name}</span>
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
                  className={`w-28 text-right text-lg font-semibold ${
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
              <Button className="px-10 py-3.5 text-xl" onClick={run}>
                Run
              </Button>
              <Button
                variant="secondary"
                className="px-6 py-3 text-lg"
                onClick={() => setQueue([...round.tasks])}
              >
                Reset
              </Button>
              <Button
                variant="ghost"
                className="px-4 py-3 text-lg"
                onClick={() => setShowTutorial(true)}
              >
                Help
              </Button>
            </>
          )}
          {phase === "running" && (
            <p className="text-xl text-ink-soft" aria-live="polite">
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
                <Button className="px-10 py-3.5 text-xl" onClick={nextRound}>
                  Next round
                </Button>
              )}
            </>
          )}
          {phase === "result" && !success && (
            <>
              <UnicornSays tone="oops" className="w-full">
                <span aria-live="polite" className="block">
                  <strong className="text-copper">{missedValue ? "So close!" : "Whoops!"}</strong>{" "}
                  {missedValue
                    ? `Everything critical runs, but you could keep ${best} points of work and this keeps ${kept}. Try putting smaller jobs ahead of the big one.`
                    : describeMiss(missed)}
                </span>
              </UnicornSays>
              <Button className="px-10 py-3.5 text-xl" onClick={tryAgain}>
                Try again
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

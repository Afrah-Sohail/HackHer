"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  CHANNEL_COUNT,
  ROUNDS,
  STEP_COUNT,
  isPlanComplete,
  simulate,
  type Plan,
  type StepResult,
} from "./waveform-rules";

type Phase = "plan" | "running" | "result";

const CHANNELS = Array.from({ length: CHANNEL_COUNT }, (_, i) => i + 1);
const STEPS = Array.from({ length: STEP_COUNT }, (_, i) => i);
const emptyPlan = (): Plan => Array.from({ length: STEP_COUNT }, () => null);

export function WaveformMechanic({ onCleared }: { onCleared?: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [plan, setPlan] = useState<Plan>(emptyPlan);
  const [phase, setPhase] = useState<Phase>("plan");
  const [results, setResults] = useState<StepResult[]>([]);
  const [revealed, setRevealed] = useState(0);

  const round = ROUNDS[roundIndex];
  const isLastRound = roundIndex === ROUNDS.length - 1;
  const delivered = results.length > 0 && results.every((r) => r.ok);

  useEffect(() => {
    if (phase !== "running") return;
    if (revealed >= STEP_COUNT) {
      const timer = setTimeout(() => {
        setPhase("result");
        if (results.every((r) => r.ok) && roundIndex === ROUNDS.length - 1) {
          onCleared?.();
        }
      }, 400);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setRevealed((count) => count + 1), 350);
    return () => clearTimeout(timer);
  }, [phase, revealed, results, roundIndex, onCleared]);

  function pick(step: number, channel: number) {
    if (phase !== "plan") return;
    setPlan((prev) =>
      prev.map((current, i) =>
        i === step ? (current === channel ? null : channel) : current,
      ),
    );
  }

  function transmit() {
    if (!isPlanComplete(plan)) return;
    setResults(simulate(round, plan));
    setRevealed(0);
    setPhase("running");
  }

  function nextRound() {
    setRoundIndex((index) => index + 1);
    setPlan(emptyPlan());
    setResults([]);
    setRevealed(0);
    setPhase("plan");
  }

  function editPattern() {
    setResults([]);
    setRevealed(0);
    setPhase("plan");
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-ink">
          Round {roundIndex + 1} of {ROUNDS.length}: {round.title}
        </p>
        <ol className="flex gap-1.5" aria-label="Round progress">
          {ROUNDS.map((r, i) => (
            <li
              key={r.title}
              className={`h-2 w-8 rounded-full ${
                i < roundIndex
                  ? "bg-signal"
                  : i === roundIndex
                    ? "bg-copper"
                    : "bg-line"
              }`}
            />
          ))}
        </ol>
      </div>

      <p className="rounded-xl border border-copper/30 bg-copper/5 px-4 py-3 text-sm leading-6 text-ink">
        <span className="font-semibold text-copper-deep">Jammer: </span>
        {round.rule} Pick one channel for each of the {STEP_COUNT} steps so
        every step gets through. Your receiver hops on the same pattern, so
        you stay in sync.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-line bg-ink p-3 text-paper-raised sm:p-4">
        <div
          className="grid min-w-[20rem] gap-1.5"
          style={{
            gridTemplateColumns: `3.25rem repeat(${STEP_COUNT}, minmax(0, 1fr))`,
          }}
          role="group"
          aria-label="Hop pattern"
        >
          <span aria-hidden="true" />
          {STEPS.map((step) => (
            <span
              key={step}
              className="text-center text-xs text-paper/70"
              aria-hidden="true"
            >
              {step + 1}
            </span>
          ))}
          {CHANNELS.map((channel) => (
            <ChannelRow
              key={channel}
              channel={channel}
              plan={plan}
              results={results}
              revealed={phase === "plan" ? 0 : revealed}
              locked={phase !== "plan"}
              onPick={pick}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {phase === "plan" && (
          <Button onClick={transmit} disabled={!isPlanComplete(plan)}>
            Transmit
          </Button>
        )}
        {phase === "running" && (
          <p className="text-sm text-ink-soft" aria-live="polite">
            Transmitting…
          </p>
        )}
        {phase === "result" && delivered && (
          <>
            <p className="text-sm font-medium text-signal" aria-live="polite">
              {isLastRound
                ? "Message delivered through every jammer! Floor cleared."
                : "Message delivered!"}
            </p>
            {!isLastRound && <Button onClick={nextRound}>Next round</Button>}
          </>
        )}
        {phase === "result" && !delivered && (
          <>
            <p className="text-sm font-medium text-copper-deep" aria-live="polite">
              Jammed! The red dots show what the jammer blocked.
            </p>
            <Button onClick={editPattern}>Edit pattern</Button>
          </>
        )}
        {phase === "plan" && (
          <Button
            variant="ghost"
            onClick={() => setPlan(emptyPlan())}
            disabled={plan.every((c) => c === null)}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

function ChannelRow({
  channel,
  plan,
  results,
  revealed,
  locked,
  onPick,
}: {
  channel: number;
  plan: Plan;
  results: StepResult[];
  revealed: number;
  locked: boolean;
  onPick: (step: number, channel: number) => void;
}) {
  const frequency = (2.1 + channel * 0.15).toFixed(2);

  return (
    <>
      <span className="flex flex-col justify-center text-xs leading-tight text-paper/80">
        <span className="font-medium text-paper-raised">Ch {channel}</span>
        <span className="text-[10px]">{frequency} MHz</span>
      </span>
      {STEPS.map((step) => {
        const selected = plan[step] === channel;
        const result = step < revealed ? results[step] : undefined;
        const jammedHere = result?.blocked.includes(channel) ?? false;
        const outcome =
          selected && result ? (result.ok ? "clear" : "jammed") : null;

        let style = "bg-paper-raised/10 hover:bg-paper-raised/20";
        if (selected) style = "bg-copper text-paper-raised";
        if (outcome === "clear") style = "bg-signal text-paper-raised";
        if (outcome === "jammed") style = "bg-red-700 text-paper-raised";

        return (
          <button
            key={step}
            type="button"
            disabled={locked}
            aria-pressed={selected}
            aria-label={`Step ${step + 1}, channel ${channel}${
              outcome ? `, ${outcome}` : ""
            }`}
            onClick={() => onPick(step, channel)}
            className={`relative flex h-9 items-center justify-center rounded-lg text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper-raised disabled:cursor-default ${style}`}
          >
            {outcome === "clear" && "✓"}
            {outcome === "jammed" && "✕"}
            {jammedHere && !selected && (
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-red-500"
              />
            )}
          </button>
        );
      })}
    </>
  );
}

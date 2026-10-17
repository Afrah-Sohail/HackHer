"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { WaveformTutorial } from "./WaveformTutorial";
import {
  CHANNEL_COUNT,
  ROUNDS,
  STEP_COUNT,
  describeFailure,
  isPlanComplete,
  previewBlocked,
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
  const [showTutorial, setShowTutorial] = useState(true);
  const closeTutorial = useCallback(() => setShowTutorial(false), []);
  const [showPreview, setShowPreview] = useState(ROUNDS[0].previewByDefault);

  const round = ROUNDS[roundIndex];
  const nextStep = plan.indexOf(null);
  const filled = plan.filter((channel) => channel !== null).length;
  const firstFailure = results.findIndex((r) => !r.ok);
  const previews =
    phase === "plan" && showPreview
      ? STEPS.map((step) => previewBlocked(round, plan, step))
      : [];
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
    setShowPreview(ROUNDS[roundIndex + 1].previewByDefault);
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
    <>
      {showTutorial && (
        <WaveformTutorial onDone={closeTutorial} />
      )}
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
          <span className="font-semibold text-copper-deep">Jammer rule: </span>
          {round.rule}
        </p>

        <p className="text-sm text-ink-soft" aria-live="polite">
          {phase === "plan"
            ? nextStep === -1
              ? "All 8 steps set. Press Transmit!"
              : `Step ${nextStep + 1}: tap a channel in the highlighted column. (${filled} of ${STEP_COUNT} set)`
            : "\u00a0"}
        </p>

        <div className="overflow-x-auto rounded-2xl border border-line bg-void p-3 text-ink sm:p-4">
          <div
            className="grid min-w-[20rem] gap-1.5"
            style={{
              gridTemplateColumns: `3.25rem repeat(${STEP_COUNT}, minmax(0, 1fr))`,
            }}
            role="group"
            aria-label="Hop pattern"
          >
            <span
              aria-hidden="true"
              className="self-end text-[10px] tracking-wide text-ink-soft uppercase"
            >
              Step
            </span>
            {STEPS.map((step) => (
              <span
                key={step}
                aria-hidden="true"
                className={`rounded-md text-center text-xs leading-6 ${
                  phase === "plan" && step === nextStep
                    ? "bg-copper font-semibold text-paper-raised"
                    : "text-ink-soft"
                }`}
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
                previews={previews}
                revealed={phase === "plan" ? 0 : revealed}
                locked={phase !== "plan"}
                onPick={pick}
              />
            ))}
          </div>
        </div>

        {phase === "plan" && (
          <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={showPreview}
              onChange={(event) => setShowPreview(event.target.checked)}
              className="h-4 w-4 accent-[var(--color-copper)]"
            />
            Show jammer&apos;s next move (red dots)
          </label>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {phase === "plan" && (
            <>
              <Button onClick={transmit} disabled={!isPlanComplete(plan)}>
                Transmit
              </Button>
              <Button
                variant="secondary"
                onClick={() => setPlan(emptyPlan())}
                disabled={filled === 0}
              >
                Clear
              </Button>
              <Button variant="ghost" onClick={() => setShowTutorial(true)}>
                How to play
              </Button>
            </>
          )}
          {phase === "running" && (
            <p className="text-sm text-ink-soft" aria-live="polite">
              Transmitting…
            </p>
          )}
          {phase === "result" && delivered && (
            <>
              <p className="text-sm leading-6 text-signal" aria-live="polite">
                <strong>
                  {isLastRound
                    ? "Message delivered through every jammer! Floor cleared."
                    : "Message delivered!"}
                </strong>{" "}
                <span className="text-ink-soft">{round.lesson}</span>
              </p>
              {!isLastRound && <Button onClick={nextRound}>Next round</Button>}
            </>
          )}
          {phase === "result" && !delivered && (
            <>
              <p
                className="text-sm leading-6 text-copper-deep"
                aria-live="polite"
              >
                <strong>Jammed!</strong>{" "}
                {describeFailure(results[firstFailure], firstFailure)} Red dots
                show everything it blocked.
              </p>
              <Button onClick={editPattern}>Try again</Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function ChannelRow({
  channel,
  plan,
  results,
  previews,
  revealed,
  locked,
  onPick,
}: {
  channel: number;
  plan: Plan;
  results: StepResult[];
  previews: (number[] | null)[];
  revealed: number;
  locked: boolean;
  onPick: (step: number, channel: number) => void;
}) {
  const frequency = (2.1 + channel * 0.15).toFixed(2);

  return (
    <>
      <span className="flex flex-col justify-center text-xs leading-tight text-ink-soft">
        <span className="font-medium text-ink">Ch {channel}</span>
        <span className="text-[10px]">{frequency} MHz</span>
      </span>
      {STEPS.map((step) => {
        const selected = plan[step] === channel;
        const result = step < revealed ? results[step] : undefined;
        const previewHere = previews[step]?.includes(channel) ?? false;
        const jammedHere = (result?.blocked.includes(channel) ?? false) || previewHere;
        const outcome =
          selected && result ? (result.ok ? "clear" : "jammed") : null;

        let style = "bg-ink/10 hover:bg-ink/20";
        if (selected) style = "bg-copper text-paper-raised";
        if (outcome === "clear") style = "bg-signal text-paper-raised";
        if (outcome === "jammed") style = "bg-red-700 text-white";
        if (selected && previewHere) style += " ring-2 ring-red-400";

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
            className={`relative flex h-9 items-center justify-center rounded-lg text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-default ${style}`}
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

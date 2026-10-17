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
const PATH_STEPS = STEPS.slice(0, -1);
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

  const pathSegments = PATH_STEPS.flatMap((step) => {
    const from = plan[step];
    const to = plan[step + 1];
    if (from === null || to === null) return [];
    const landed = phase !== "plan" && step + 1 < revealed;
    const ok = landed ? results[step + 1]?.ok !== false : true;
    return [
      {
        key: step,
        x1: step + 0.5,
        y1: from - 0.5,
        x2: step + 1.5,
        y2: to - 0.5,
        solid: landed,
        className: !landed
          ? "stroke-copper/70"
          : ok
            ? "stroke-signal"
            : "stroke-red-500",
      },
    ];
  });

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

        <div className="rounded-xl border border-line bg-paper-raised/60 p-4">
          <div
            className="flex items-center gap-2 text-sm font-medium text-ink"
            aria-hidden="true"
          >
            <span className="rounded-full bg-signal/20 px-3 py-1">📡 Sender</span>
            <span className="flex-1 border-t-2 border-dashed border-copper/60" />
            <span className="text-copper">▶</span>
            <span className="rounded-full bg-signal/20 px-3 py-1">
              🚀 Receiver
            </span>
          </div>
          <p className="mt-3 text-[15px] leading-6 text-ink">
            <strong className="text-copper">Your goal:</strong> choose one
            channel for each of the {STEP_COUNT} steps so your signal reaches
            the receiver. Never land on a channel marked{" "}
            <span aria-label="lightning">⚡</span>.
          </p>
        </div>

        <p className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm leading-6 text-ink">
          <span className="font-semibold text-red-300">⚡ Jammer rule: </span>
          {round.rule}
        </p>

        <p
          className="text-sm font-medium text-ink"
          aria-live="polite"
        >
          {phase === "plan"
            ? nextStep === -1
              ? "✅ All 8 steps set. Press Transmit!"
              : `👉 Step ${nextStep + 1}: tap a channel in the glowing column (${filled} of ${STEP_COUNT} set)`
            : "\u00a0"}
        </p>

        <div className="overflow-x-auto rounded-2xl border border-line bg-void p-3 text-ink sm:p-4">
          <div className="relative min-w-[20rem]">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `3.25rem repeat(${STEP_COUNT}, minmax(0, 1fr))`,
              }}
              role="group"
              aria-label="Hop pattern"
            >
              <span
                aria-hidden="true"
                className="flex h-6 items-end text-[10px] tracking-wide text-ink-soft uppercase"
              >
                Step
              </span>
              {STEPS.map((step) => (
                <span
                  key={step}
                  aria-hidden="true"
                  className={`mx-[3px] h-6 rounded-md text-center text-xs leading-6 ${
                    phase === "plan" && step === nextStep
                      ? "bg-copper font-semibold text-paper-raised motion-safe:animate-pulse"
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
                  activeStep={phase === "plan" ? nextStep : -1}
                  onPick={pick}
                />
              ))}
            </div>
            <svg
              viewBox={`0 0 ${STEP_COUNT} ${CHANNEL_COUNT}`}
              preserveAspectRatio="none"
              className="pointer-events-none absolute top-6 left-[3.25rem] z-[1] h-60 w-[calc(100%-3.25rem)]"
              aria-hidden="true"
            >
              {pathSegments.map((segment) => (
                <line
                  key={segment.key}
                  x1={segment.x1}
                  y1={segment.y1}
                  x2={segment.x2}
                  y2={segment.y2}
                  vectorEffect="non-scaling-stroke"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeDasharray={segment.solid ? undefined : "2 6"}
                  className={segment.className}
                />
              ))}
            </svg>
          </div>
          <p className="mt-2 text-right text-[10px] tracking-wide text-ink-soft uppercase">
            Time → each column is one moment
          </p>
        </div>

        <ul
          className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft"
          aria-label="Legend"
        >
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded bg-copper" /> Your pick
          </li>
          <li className="flex items-center gap-1.5">⚡ Blocked by jammer</li>
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded bg-signal" /> ✓ Got
            through
          </li>
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded bg-red-700" /> ✕ Jammed
          </li>
        </ul>

        {phase === "plan" && (
          <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={showPreview}
              onChange={(event) => setShowPreview(event.target.checked)}
              className="h-4 w-4 accent-[var(--color-copper)]"
            />
            Show jammer&apos;s next move (⚡)
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
                {describeFailure(results[firstFailure], firstFailure)} ⚡ marks
                everything it blocked.
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
  activeStep,
  onPick,
}: {
  channel: number;
  plan: Plan;
  results: StepResult[];
  previews: (number[] | null)[];
  revealed: number;
  locked: boolean;
  activeStep: number;
  onPick: (step: number, channel: number) => void;
}) {
  const frequency = (2.1 + channel * 0.15).toFixed(2);

  return (
    <>
      <span className="flex h-10 flex-col justify-center text-xs leading-tight text-ink-soft">
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

        const isActive = step === activeStep && !selected;
        let style = isActive
          ? "bg-copper/20 ring-1 ring-copper/60 hover:bg-copper/30"
          : "bg-ink/10 hover:bg-ink/20";
        if (jammedHere && !selected) style = "bg-red-500/15 hover:bg-red-500/25";
        if (selected) style = "z-10 bg-copper text-paper-raised";
        if (outcome === "clear") style = "z-10 bg-signal text-paper-raised";
        if (outcome === "jammed") style = "z-10 bg-red-700 text-white";
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
            className={`relative m-[3px] flex h-[calc(2.5rem-6px)] items-center justify-center rounded-lg text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-default ${style}`}
          >
            {outcome === "clear" && "✓"}
            {outcome === "jammed" && "✕"}
            {jammedHere && !selected && (
              <span aria-hidden="true" className="text-base leading-none">
                ⚡
              </span>
            )}
          </button>
        );
      })}
    </>
  );
}

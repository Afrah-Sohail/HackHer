"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { UnicornSays } from "@/components/guide/Unicorn";
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
          <p className="text-lg font-semibold text-ink">
            Round {roundIndex + 1} of {ROUNDS.length}
          </p>
          <ol className="flex gap-2" aria-label="Round progress">
            {ROUNDS.map((r, i) => (
              <li
                key={r.title}
                className={`h-2.5 w-10 rounded-full ${
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

        <div className="rounded-2xl border border-line bg-paper-raised/60 p-3 sm:p-4">
          <div
            className="flex items-center gap-3 text-lg font-medium text-ink"
            aria-hidden="true"
          >
            <Tag tone="signal" size="md">📡 Sender</Tag>
            <span className="flex-1 border-t-2 border-dashed border-copper/60" />
            <span className="text-copper">▶</span>
            <Tag tone="signal" size="md">
              🚀 Receiver
            </Tag>
          </div>
          <p className="mt-2 font-display text-2xl text-ink sm:text-3xl">
            Hop to a clear channel
            <span className="ml-2 text-lg font-sans text-ink-soft sm:text-xl">
              every step
            </span>
          </p>
          <p className="mt-1 text-lg text-ink">
            <span className="font-semibold text-red-300">⚡ {round.rule}</span>
          </p>
        </div>

        <p className="text-lg font-semibold text-ink" aria-live="polite">
          {phase === "plan"
            ? nextStep === -1
              ? "✅ Ready! Press Transmit."
              : `👉 Step ${nextStep + 1}: pick a channel (${filled}/${STEP_COUNT})`
            : "\u00a0"}
        </p>

        <div className="overflow-x-auto rounded-3xl border border-line bg-void p-3 text-ink sm:p-4">
          <div className="relative min-w-[22rem]">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `3.5rem repeat(${STEP_COUNT}, minmax(0, 1fr))`,
              }}
              role="group"
              aria-label="Hop pattern"
            >
              <span
                aria-hidden="true"
                className="flex h-8 items-end pb-1 text-sm tracking-wide text-ink-soft uppercase"
              >
                Step
              </span>
              {STEPS.map((step) => (
                <span
                  key={step}
                  aria-hidden="true"
                  className={`mx-1 h-8 rounded-lg text-center text-lg leading-8 ${
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
              className="pointer-events-none absolute top-8 left-[3.5rem] z-[1] h-[16.5rem] w-[calc(100%-3.5rem)]"
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
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeDasharray={segment.solid ? undefined : "2 6"}
                  className={segment.className}
                />
              ))}
            </svg>
          </div>
        </div>

        <ul
          className="flex flex-wrap gap-x-5 gap-y-1 text-base text-ink-soft"
          aria-label="Legend"
        >
          <li>⚡ blocked</li>
          <li className="text-signal">✓ clear</li>
          <li className="text-red-400">✕ jammed</li>
        </ul>

        {phase === "plan" && (
          <label className="flex w-fit cursor-pointer items-center gap-2 text-lg text-ink">
            <input
              type="checkbox"
              checked={showPreview}
              onChange={(event) => setShowPreview(event.target.checked)}
              className="h-5 w-5 accent-[var(--color-copper)]"
            />
            Show ⚡ hints
          </label>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {phase === "plan" && (
            <>
              <Button
                className="px-10 py-3.5 text-xl"
                onClick={transmit}
                disabled={!isPlanComplete(plan)}
              >
                Transmit
              </Button>
              <Button
                variant="secondary"
                className="px-6 py-3 text-lg"
                onClick={() => setPlan(emptyPlan())}
                disabled={filled === 0}
              >
                Clear
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
              Transmitting…
            </p>
          )}
          {phase === "result" && delivered && (
            <>
              <UnicornSays tone="happy" className="w-full">
                <span aria-live="polite" className="block">
                  <strong className="text-signal">
                    {isLastRound ? "Level cleared!" : "Delivered!"}
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
          {phase === "result" && !delivered && (
            <>
              <UnicornSays tone="oops" className="w-full">
                <span aria-live="polite" className="block">
                  <strong className="text-copper">Oh no, a little jam!</strong>{" "}
                  {describeFailure(results[firstFailure], firstFailure)}
                </span>
              </UnicornSays>
              <Button className="px-10 py-3.5 text-xl" onClick={editPattern}>
                Try again
              </Button>
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
  return (
    <>
      <span className="flex h-11 items-center text-lg font-semibold text-ink">
        Ch {channel}
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
            className={`relative m-1 flex h-[calc(2.75rem-8px)] items-center justify-center rounded-xl text-xl font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-default ${style}`}
          >
            {outcome === "clear" && "✓"}
            {outcome === "jammed" && "✕"}
            {jammedHere && !selected && (
              <span aria-hidden="true" className="text-xl leading-none">
                ⚡
              </span>
            )}
          </button>
        );
      })}
    </>
  );
}

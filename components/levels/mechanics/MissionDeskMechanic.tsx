"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { UnicornSays } from "@/components/guide/Unicorn";
import { MissionTutorial } from "./MissionTutorial";
import {
  A_RANGE,
  B_RANGE,
  ROUNDS,
  START_A,
  START_B,
  check,
  describeMiss,
  formatRule,
  output,
  type Round,
  type RowResult,
} from "./mission-rules";

type Phase = "build" | "launching" | "result";

function Pill({ children }: { children: ReactNode }) {
  return (
    <Tag tone="signal" size="md">
      {children}
    </Tag>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-2xl border-2 border-copper/60 bg-paper px-3 py-2 text-center">
      <p className="text-sm tracking-wide text-ink-soft uppercase">{label}</p>
      <div className="mt-1 flex items-center justify-center gap-2">
        <button
          type="button"
          disabled={disabled || value <= min}
          onClick={() => onChange(value - 1)}
          aria-label={`${label}: decrease`}
          className="h-11 w-11 rounded-xl border border-line text-2xl text-ink transition hover:border-copper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper disabled:opacity-30"
        >
          −
        </button>
        <span
          className="min-w-12 text-center font-display text-4xl text-ink"
          aria-live="polite"
        >
          {value}
        </span>
        <button
          type="button"
          disabled={disabled || value >= max}
          onClick={() => onChange(value + 1)}
          aria-label={`${label}: increase`}
          className="h-11 w-11 rounded-xl border border-line text-2xl text-ink transition hover:border-copper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  );
}

function Graph({
  round,
  a,
  b,
  rows,
  revealed,
  phase,
}: {
  round: Round;
  a: number;
  b: number;
  rows: RowResult[];
  revealed: number;
  phase: Phase;
}) {
  const xMax = round.inputs[round.inputs.length - 1] + 1;
  const targetMax = Math.max(...rows.map((row) => row.needed));
  const yMin = -2;
  const yMax = Math.ceil((targetMax + 3) / 2) * 2;
  const px = (x: number) => 12 + (x / xMax) * 84;
  const py = (y: number) => {
    const clamped = Math.min(yMax, Math.max(yMin, y));
    return 62 - ((clamped - yMin) / (yMax - yMin)) * 54;
  };

  const ticks: number[] = [];
  for (let y = 0; y <= yMax; y += 2) ticks.push(y);

  const mine = round.inputs.map((x) => ({ x, y: output(a, b, x) }));
  const shownCount = phase === "build" ? mine.length : revealed;
  const line = mine
    .slice(0, shownCount)
    .map((point) => `${px(point.x)},${py(point.y)}`)
    .join(" ");

  return (
    <div className="flex h-full items-center rounded-3xl border border-line bg-void p-3">
    <svg
      viewBox="0 0 100 76"
      className="h-auto w-full"
      role="img"
      aria-label="Graph of altitude against seconds after liftoff. Hollow gold circles are mission control's targets; filled dots are your rocket."
    >
      {ticks.map((y) => (
        <g key={y}>
          <line
            x1={12}
            x2={96}
            y1={py(y)}
            y2={py(y)}
            className={y === 0 ? "stroke-ink-soft" : "stroke-line"}
            strokeWidth={0.4}
          />
          <text x={9} y={py(y) + 1.2} textAnchor="end" className="fill-ink-soft" fontSize={3.8}>
            {y}
          </text>
        </g>
      ))}
      {round.inputs.map((x) => (
        <text key={x} x={px(x)} y={69} textAnchor="middle" className="fill-ink-soft" fontSize={3.8}>
          {x}
        </text>
      ))}
      <text x={54} y={75} textAnchor="middle" className="fill-ink-soft" fontSize={3.4}>
        seconds after liftoff
      </text>
      <text x={2} y={5} className="fill-ink-soft" fontSize={3.4}>
        altitude (km)
      </text>

      {line && (
        <polyline
          points={line}
          fill="none"
          className="stroke-signal/60"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {rows.map((row) => (
        <circle
          key={`t${row.x}`}
          cx={px(row.x)}
          cy={py(row.needed)}
          r={3.3}
          fill="none"
          className="stroke-copper"
          strokeWidth={0.9}
        />
      ))}

      {mine.map((point, i) => {
        if (i >= shownCount) return null;
        const landed = phase !== "build";
        const ok = rows[i]?.ok;
        return (
          <circle
            key={`m${point.x}`}
            cx={px(point.x)}
            cy={py(point.y)}
            r={2.2}
            className={landed ? (ok ? "fill-signal" : "fill-red-500") : "fill-signal/70"}
          />
        );
      })}

      {phase === "launching" && revealed > 0 && revealed <= mine.length && (
        <text
          x={px(mine[revealed - 1].x)}
          y={py(mine[revealed - 1].y) - 4.5}
          textAnchor="middle"
          fontSize={7}
        >
          🚀
        </text>
      )}
    </svg>
    </div>
  );
}

export function MissionDeskMechanic({ onCleared }: { onCleared?: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [aValue, setAValue] = useState(START_A);
  const [bValue, setBValue] = useState(START_B);
  const [phase, setPhase] = useState<Phase>("build");
  const [revealed, setRevealed] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const closeTutorial = useCallback(() => setShowTutorial(false), []);

  const round = ROUNDS[roundIndex];
  const isLastRound = roundIndex === ROUNDS.length - 1;
  const a = aValue;
  const b = bValue;
  const rows = check(round, a, b);
  const allOk = rows.every((row) => row.ok);
  const firstMiss = rows.find((row) => !row.ok);

  useEffect(() => {
    if (phase !== "launching") return;
    if (revealed >= round.inputs.length) {
      const timer = setTimeout(() => {
        setPhase("result");
        if (allOk && roundIndex === ROUNDS.length - 1) onCleared?.();
      }, 450);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setRevealed((count) => count + 1), 400);
    return () => clearTimeout(timer);
  }, [phase, revealed, round.inputs.length, allOk, roundIndex, onCleared]);

  function launch() {
    setRevealed(0);
    setPhase("launching");
  }

  function tryAgain() {
    setRevealed(0);
    setPhase("build");
  }

  function nextRound() {
    setRoundIndex(roundIndex + 1);
    setAValue(START_A);
    setBValue(START_B);
    setRevealed(0);
    setPhase("build");
  }

  const locked = phase !== "build";

  return (
    <>
      {showTutorial && <MissionTutorial onDone={closeTutorial} />}
      <div className="grid gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="font-display text-xl text-ink sm:text-2xl">
            Match mission control
            <span className="ml-2 text-lg font-sans text-ink-soft">every second</span>
          </p>
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold text-ink">
              Round {roundIndex + 1} of {ROUNDS.length}
            </span>
            <ol className="flex gap-1.5" aria-label="Round progress">
              {ROUNDS.map((r, i) => (
                <li
                  key={r.title}
                  className={`h-2 w-8 rounded-full ${
                    i < roundIndex || (i === roundIndex && phase === "result" && allOk)
                      ? "bg-signal"
                      : i === roundIndex
                        ? "bg-copper"
                        : "bg-line"
                  }`}
                />
              ))}
            </ol>
          </div>
        </div>

        <div className="grid gap-2 rounded-3xl border border-line bg-void p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <Pill>second x</Pill>
            <span aria-hidden="true" className="text-copper">
              →
            </span>
            <Stepper
              label="Multiply by"
              value={a}
              min={A_RANGE.min}
              max={A_RANGE.max}
              disabled={locked}
              onChange={setAValue}
            />
            <span aria-hidden="true" className="text-copper">
              →
            </span>
            <Stepper
              label="Then add"
              value={b}
              min={B_RANGE.min}
              max={B_RANGE.max}
              disabled={locked}
              onChange={setBValue}
            />
            <span aria-hidden="true" className="text-copper">
              →
            </span>
            <Pill>altitude y</Pill>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <p className="font-mono text-lg text-copper sm:text-xl">{formatRule(a, b)}</p>
            {phase === "build" && (
              <div className="flex items-center gap-3">
                <Button className="px-8 py-3 text-xl" onClick={launch}>
                  Launch 🚀
                </Button>
                <Button
                  variant="ghost"
                  className="px-3 py-2.5 text-lg"
                  onClick={() => setShowTutorial(true)}
                >
                  Help
                </Button>
              </div>
            )}
            {phase === "launching" && (
              <p className="text-xl text-ink-soft" aria-live="polite">
                Launching…
              </p>
            )}
            {phase === "result" && allOk && !isLastRound && (
              <Button className="px-8 py-3 text-xl" onClick={nextRound}>
                Next round
              </Button>
            )}
            {phase === "result" && !allOk && (
              <Button className="px-8 py-3 text-xl" onClick={tryAgain}>
                Try again
              </Button>
            )}
          </div>
        </div>

        {phase === "result" && allOk && (
          <UnicornSays tone="happy" className="w-full">
            <span aria-live="polite" className="block">
              <strong className="text-signal">
                {isLastRound ? "Level cleared!" : "Perfect launch!"}
              </strong>{" "}
              <span className="text-ink-soft">{round.lesson}</span>
            </span>
          </UnicornSays>
        )}
        {phase === "result" && !allOk && firstMiss && (
          <UnicornSays tone="oops" className="w-full">
            <span aria-live="polite" className="block">
              <strong className="text-copper">Almost there!</strong> {describeMiss(firstMiss)}
            </span>
          </UnicornSays>
        )}

        <div className="grid items-stretch gap-4 md:grid-cols-[3fr_2fr]">
          <Graph
            round={round}
            a={a}
            b={b}
            rows={rows}
            revealed={revealed}
            phase={phase}
          />

          <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-paper-raised">
            <p className="px-4 pt-3 pb-1 text-sm font-medium tracking-[0.14em] text-ink-soft uppercase">
              Rocket check
            </p>
            <div className="flex-1 overflow-x-auto">
            <table
              aria-label="Rocket check"
              className="h-full w-full text-center text-lg"
            >
              <thead>
                <tr className="text-sm text-ink-soft">
                  <th scope="col" className="px-3 py-2 font-medium">
                    Second
                  </th>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Needed
                  </th>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Yours
                  </th>
                  <th scope="col" className="px-3 py-2 font-medium">
                    <span className="sr-only">Match</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const marked =
                    phase === "result" || (phase === "launching" && i < revealed);
                  return (
                    <tr key={row.x} className="border-t border-line">
                      <td className="px-3 py-2 text-xl text-ink">{row.x}</td>
                      <td className="px-3 py-2 text-xl text-copper">{row.needed}</td>
                      <td className="px-3 py-2 text-xl text-ink">{row.yours}</td>
                      <td className="px-3 py-2 text-xl font-semibold">
                        {marked ? (
                          row.ok ? (
                            <span className="text-signal">✓</span>
                          ) : (
                            <span className="text-red-400">✕</span>
                          )
                        ) : (
                          <span className="text-ink-soft">·</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

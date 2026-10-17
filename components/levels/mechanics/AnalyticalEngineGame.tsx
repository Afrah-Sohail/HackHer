"use client";

import { useRef, useState } from "react";
import type { LevelDefinition } from "@/level-manager/types";
import {
  CARTRIDGES,
  MAX_PROGRAM_LENGTH,
  cartridgeLabel,
  createBalls,
  runProgram,
  selectTargets,
  type Cartridge,
  type DataBall,
} from "@/level-manager/analytical-engine";
import { useGame } from "@/state/game-context";
import { Button } from "@/components/ui/Button";

type LoadedCard = {
  uid: number;
  cartridge: Cartridge;
};

const TRACKS = [0, 1, 2, 3] as const;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function gearPoints(teeth: number): string {
  const points: string[] = [];
  const inner = 18;
  const outer = 26;
  const span = (Math.PI * 2) / teeth;
  for (let tooth = 0; tooth < teeth; tooth += 1) {
    const start = tooth * span;
    const samples = [
      [start + span * 0.08, inner],
      [start + span * 0.22, outer],
      [start + span * 0.48, outer],
      [start + span * 0.64, inner],
    ] as const;
    for (const [angle, radius] of samples) {
      points.push(`${32 + Math.cos(angle) * radius},${32 + Math.sin(angle) * radius}`);
    }
  }
  return points.join(" ");
}

function Gear({
  name,
  className,
  duration,
  reverse = false,
}: {
  name: string;
  className?: string;
  duration: string;
  reverse?: boolean;
}) {
  const gradientId = `brass-gear-${name}`;
  return (
    <svg
      viewBox="0 0 64 64"
      className={`motion-safe:animate-spin ${className ?? ""}`}
      style={{
        animationDuration: duration,
        animationDirection: reverse ? "reverse" : "normal",
      }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradientId} cx="35%" cy="30%">
          <stop offset="0%" stopColor="#fff1c4" />
          <stop offset="45%" stopColor="#e2ae4e" />
          <stop offset="100%" stopColor="#7a4b16" />
        </radialGradient>
      </defs>
      <polygon points={gearPoints(10)} fill={`url(#${gradientId})`} />
      <circle cx="32" cy="32" r="8" fill="#2a160c" />
      <circle cx="32" cy="32" r="3" fill="#f0c36a" />
    </svg>
  );
}

function VacuumTube({ hue }: { hue: "cyan" | "violet" }) {
  const glow = hue === "cyan" ? "bg-signal shadow-signal" : "bg-fuchsia-300 shadow-fuchsia-400";
  return (
    <div className="flex h-20 w-8 flex-col items-center rounded-full border border-white/20 bg-gradient-to-b from-white/25 to-white/5 px-1 py-2 shadow-[0_0_18px_rgb(138_231_255_/_0.28)]">
      <span className={`h-8 w-3 rounded-full motion-safe:animate-tube ${glow}`} />
      <span className="mt-auto h-2 w-4 rounded-sm bg-copper/80" />
    </div>
  );
}

function DataSphere({
  ball,
  previewed,
  striking,
}: {
  ball: DataBall;
  previewed: boolean;
  striking: boolean;
}) {
  const needsFlip = ball.operation === "flip";
  return (
    <div
      className={`relative z-10 flex flex-col items-center gap-1 transition duration-200 ${
        ball.cleared ? "scale-75 opacity-0" : "opacity-100"
      }`}
    >
      <span className="text-[10px] font-medium tracking-wide text-ink">{ball.index}</span>
      <div
        className={`grid h-12 w-12 place-items-center rounded-full text-sm font-semibold text-[#2a1608] transition duration-200 sm:h-14 sm:w-14 ${
          striking ? "scale-110" : ""
        } ${
          previewed && !ball.cleared ? "ring-2 ring-signal ring-offset-2 ring-offset-void" : ""
        } ${ball.jammed ? "ring-2 ring-fuchsia-400" : ""}`}
        style={{
          background:
            "radial-gradient(circle at 32% 28%, #fff6d8, #f0c36a 40%, #b26d24 74%, #5a3412)",
          boxShadow:
            "inset -5px -7px 10px rgb(70 36 8 / 0.55), inset 3px 3px 6px rgb(255 244 214 / 0.75), 0 8px 12px rgb(0 0 0 / 0.4)",
        }}
        role="img"
        aria-label={`Ball ${ball.index}, value ${ball.value}, needs ${needsFlip ? "flip lever" : "stamp and boost"}${ball.cleared ? ", cleared" : ""}`}
      >
        {ball.value}
      </div>
      <span className="text-[10px] text-ink-soft uppercase">
        {needsFlip ? "Lever" : "Stamp"}
      </span>
    </div>
  );
}

export function AnalyticalEngineGame({ level }: { level: LevelDefinition }) {
  const { completeLevel } = useGame();
  const [balls, setBalls] = useState<DataBall[]>(createBalls);
  const [program, setProgram] = useState<LoadedCard[]>([]);
  const [preview, setPreview] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState(false);
  const scoreRef = useRef(0);
  const runToken = useRef(0);
  const cardUid = useRef(0);
  const cleared = balls.filter((ball) => ball.cleared).length;

  function loadCartridge(cartridge: Cartridge) {
    if (running || won || program.length >= MAX_PROGRAM_LENGTH) {
      return;
    }
    cardUid.current += 1;
    setProgram((current) => [...current, { uid: cardUid.current, cartridge }]);
  }

  function removeCartridge(uid: number) {
    if (running || won) {
      return;
    }
    setProgram((current) => current.filter((card) => card.uid !== uid));
  }

  function resetRun() {
    runToken.current += 1;
    scoreRef.current = 0;
    setBalls(createBalls());
    setProgram([]);
    setPreview([]);
    setActiveIndex(null);
    setCombo(0);
    setScore(0);
    setRunning(false);
    setWon(false);
  }

  async function fireEngine() {
    if (running || won || program.length === 0) {
      return;
    }

    const token = runToken.current + 1;
    runToken.current = token;
    const result = runProgram(
      balls,
      program.map((card) => card.cartridge),
    );
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setRunning(true);
    setPreview([]);
    let working = balls.map((ball) => ({ ...ball, jammed: false }));

    for (const strike of result.strikes) {
      if (runToken.current !== token) {
        return;
      }
      working = working.map((ball) => {
        if (ball.index !== strike.index) {
          return ball;
        }
        return strike.matched
          ? { ...ball, cleared: true, jammed: false }
          : { ...ball, jammed: true };
      });
      setBalls(working);
      setCombo(strike.comboAfter);
      setActiveIndex(strike.index);
      await wait(reduceMotion ? 20 : 125);
    }

    if (runToken.current !== token) {
      return;
    }

    const nextScore = scoreRef.current + result.scoreGained;
    scoreRef.current = nextScore;
    setScore(nextScore);
    setBest((current) => Math.max(current, nextScore));
    setBalls(result.balls);
    setActiveIndex(null);
    setProgram([]);
    setRunning(false);
    if (result.clearedAll) {
      setWon(true);
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-line bg-paper-raised/80 shadow-[0_0_80px_rgb(88_40_160_/_0.28)]">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line px-5 py-5 sm:px-8">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-copper uppercase">
            Level {level.floor} · {level.pioneer}
          </p>
          <h1 className="mt-1 font-display text-3xl text-ink sm:text-4xl">
            The Analytical Engine
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
            Numbered brass balls roll toward the furnace. Load a loop cartridge
            and fire it: every matching strike clears a ball and extends the combo.
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-3 text-right">
          <div>
            <dt className="text-[10px] tracking-wide text-ink-soft uppercase">Score</dt>
            <dd className="font-display text-2xl text-ink">{score}</dd>
          </div>
          <div>
            <dt className="text-[10px] tracking-wide text-ink-soft uppercase">Combo</dt>
            <dd className="font-display text-2xl text-signal">{combo}</dd>
          </div>
          <div>
            <dt className="text-[10px] tracking-wide text-ink-soft uppercase">Best</dt>
            <dd className="font-display text-2xl text-copper">{best}</dd>
          </div>
        </dl>
      </header>

      <div className="relative px-4 py-6 sm:px-8">
        {won ? (
          <div className="absolute inset-4 z-20 flex items-center justify-center rounded-3xl bg-void/80 p-6 backdrop-blur-sm sm:inset-8">
            <div className="max-w-md text-center">
              <p className="text-xs font-medium tracking-[0.18em] text-signal uppercase">
                Chain reaction
              </p>
              <h2 className="mt-2 font-display text-4xl text-ink">16 balls cleared</h2>
              <p className="mt-2 text-sm text-ink-soft">
                The punch arms ran the whole tape. Chain score {score}.
              </p>
              <Button className="mt-5" onClick={() => completeLevel(score)}>
                Continue
              </Button>
            </div>
          </div>
        ) : null}
        <div className="pointer-events-none absolute inset-x-8 top-4 hidden items-end justify-between sm:flex">
          <Gear name="left" className="h-20 w-20" duration={running ? "0.7s" : "10s"} />
          <Gear name="mid" className="h-14 w-14" duration={running ? "0.45s" : "7s"} reverse />
          <VacuumTube hue="cyan" />
          <Gear name="center" className="h-24 w-24" duration={running ? "0.8s" : "13s"} />
          <VacuumTube hue="violet" />
          <Gear name="right" className="h-16 w-16" duration={running ? "0.55s" : "8s"} reverse />
        </div>

        <div className="relative mt-2 [perspective:1100px] sm:mt-16">
          <div className="origin-bottom [transform:rotateX(14deg)]">
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {TRACKS.map((track) => (
                <div
                  key={track}
                  className="relative flex flex-col items-center gap-2 rounded-t-3xl border border-copper/30 bg-gradient-to-b from-white/5 to-copper/15 px-1 py-3"
                >
                  <span className="absolute inset-y-3 left-1/2 w-2 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#6a4518] via-copper to-[#fff1c9]" />
                  <p className="relative z-10 text-[10px] tracking-[0.16em] text-copper uppercase">
                    Track {track + 1}
                  </p>
                  {balls
                    .filter((ball) => ball.track === track)
                    .sort((a, b) => b.depth - a.depth)
                    .map((ball) => (
                      <DataSphere
                        key={ball.index}
                        ball={ball}
                        previewed={preview.includes(ball.index)}
                        striking={activeIndex === ball.index}
                      />
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mt-3 overflow-hidden rounded-2xl border border-fuchsia-500/40 bg-gradient-to-r from-orange-950 via-fuchsia-950 to-violet-950 px-4 py-3 text-center">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-around">
            {TRACKS.map((track) => (
              <span
                key={track}
                className="h-8 w-8 rounded-full bg-fuchsia-300/50 blur-md motion-safe:animate-steam"
                style={{ animationDelay: `${track * 0.4}s` }}
              />
            ))}
          </div>
          <p className="relative text-xs font-medium tracking-[0.2em] text-copper uppercase">
            Overflow furnace · {cleared}/16 cleared
          </p>
        </div>

        <p className="mt-4 text-xs leading-5 text-ink-soft">
          Read order is the small number on each ball. EVERY 2nd ITEM strikes 2, 4, 6, and so on.
          REPEAT 4× strikes the next four balls still on the tracks. Levers clear only on FLIP
          LEVER. Stamps clear only on STAMP &amp; BOOST.
        </p>
      </div>

      <div className="border-t border-line px-4 py-5 sm:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-medium tracking-[0.16em] text-ink-soft uppercase">
            Drive slot
          </p>
          {program.length === 0 ? (
            <p className="text-sm text-ink-soft">Drop a loop cartridge.</p>
          ) : (
            program.map((card, position) => (
              <button
                key={card.uid}
                type="button"
                disabled={running || won}
                onClick={() => removeCartridge(card.uid)}
                className="rounded-full border border-copper/50 bg-void px-3 py-1.5 text-left font-mono text-[11px] text-copper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper"
              >
                {position + 1}. {cartridgeLabel(card.cartridge)}
              </button>
            ))
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => void fireEngine()} disabled={running || won || program.length === 0}>
            {running ? "Gears engaged" : "Fire the Engine"}
          </Button>
          <Button variant="secondary" onClick={resetRun} disabled={running || won}>
            Reset run
          </Button>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {CARTRIDGES.map((cartridge) => {
            const strikes = selectTargets(balls, cartridge).length;
            return (
              <button
                key={cartridge.id}
                type="button"
                disabled={running || won || program.length >= MAX_PROGRAM_LENGTH}
                onClick={() => loadCartridge(cartridge)}
                onMouseEnter={() =>
                  setPreview(selectTargets(balls, cartridge).map((ball) => ball.index))
                }
                onMouseLeave={() => setPreview([])}
                onFocus={() =>
                  setPreview(selectTargets(balls, cartridge).map((ball) => ball.index))
                }
                onBlur={() => setPreview([])}
                className="rounded-2xl border border-line bg-void/70 px-4 py-3 text-left transition hover:border-copper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper disabled:opacity-40"
              >
                <span className="block font-mono text-xs text-copper">{cartridge.title}</span>
                <span className="mt-1 block text-sm text-ink">→ {cartridge.action}</span>
                <span className="mt-1 block text-xs text-ink-soft">
                  Strikes {strikes} ball{strikes === 1 ? "" : "s"} now
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Combo {combo}. Score {score}. {cleared} of 16 balls cleared.
      </p>
    </section>
  );
}

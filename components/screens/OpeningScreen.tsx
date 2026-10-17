"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Explosion } from "@/components/story/JourneyMap";
import { PlanetArt } from "@/components/story/Planet";
import { RocketArt } from "@/components/story/Characters";
import { ArrivalChat } from "@/components/story/ArrivalChat";
import { useGame } from "@/state/game-context";

// Timeline of the opening, in milliseconds.
const SCAN = 3600; // the rocket scans the Sun
const BOOM = 1100; // the engine blows up
const DRIFT = 1900; // limp over to Mercury
const TOTAL = SCAN + BOOM + DRIFT;

const SUN = { x: 210, y: 250, r: 150 };
const MERCURY = { x: 880, y: 250, r: 46 };
const HOVER_X = 560;

const ease = (x: number) => {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// The very first scene: you study the Sun, then the rocket breaks and you
// have to land on Mercury.
export function OpeningScreen() {
  const { arrive } = useGame();
  const [ticked, setElapsed] = useState(() => (prefersReducedMotion() ? TOTAL : 0));
  const [skipped, setSkipped] = useState(false);
  // Skip jumps to the end and stays there, even while the clock still ticks.
  const elapsed = skipped ? TOTAL : ticked;

  useEffect(() => {
    if (ticked >= TOTAL) return;
    let frame = 0;
    const start = performance.now() - ticked;
    const tick = (now: number) => {
      const next = Math.min(now - start, TOTAL);
      setElapsed(next);
      if (next < TOTAL) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // Start the clock once; later updates come from the animation frames.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scanning = elapsed < SCAN;
  const exploding = elapsed >= SCAN && elapsed < SCAN + BOOM;
  const landed = elapsed >= TOTAL;
  const driftT = ease((elapsed - SCAN - BOOM) / DRIFT);

  // Rocket pose: hover with its nose at the Sun, spin out of control, then
  // wobble across to Mercury.
  let x = HOVER_X;
  let y = SUN.y + (scanning ? Math.sin(elapsed / 300) * 5 : 0);
  let angle = -90;
  if (exploding) {
    angle = -90 + 180 * ease((elapsed - SCAN) / BOOM) + Math.sin(elapsed / 40) * 10;
  } else if (!scanning) {
    angle = 90 + (landed ? 18 : Math.sin(elapsed / 60) * 14);
    x = HOVER_X + (MERCURY.x - 70 - HOVER_X) * driftT;
    y = SUN.y - Math.sin(driftT * Math.PI) * 40;
  }

  // The scanner beam sweeps across the face of the Sun.
  const sweep = (Math.sin(elapsed / 420) * 38 * Math.PI) / 180;
  const edge = (a: number) => `${SUN.x + SUN.r * Math.cos(a)},${SUN.y + SUN.r * Math.sin(a)}`;
  const progress = Math.min(100, Math.round((elapsed / SCAN) * 100));

  const status = scanning
    ? `☀️ Scanning the Sun... ${progress}%`
    : exploding
      ? "💥 The engine blows up!"
      : landed
        ? "Crash landing on Mercury!"
        : "The rocket spirals down toward Mercury...";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-3 px-4 py-4 sm:px-6">
      <svg
        viewBox="0 0 1000 500"
        className="mx-auto max-h-[38vh] w-full"
        role="img"
        aria-label="Your rocket studies the Sun, then breaks down and heads for Mercury"
      >
        <defs>
          <radialGradient id="sun-body" cx="40%" cy="38%" r="75%">
            <stop offset="0" stopColor="#fff7c2" />
            <stop offset="0.55" stopColor="#ffc93c" />
            <stop offset="1" stopColor="#f2711c" />
          </radialGradient>
          <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0.5" stopColor="#ffb02e" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffb02e" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={SUN.x} cy={SUN.y} r={SUN.r * 1.35} fill="url(#sun-glow)" />
        <circle cx={SUN.x} cy={SUN.y} r={SUN.r} fill="url(#sun-body)" />

        {scanning && (
          <g>
            <polygon
              points={`${HOVER_X - 70},${y} ${edge(sweep - 0.28)} ${edge(sweep + 0.28)}`}
              fill="#8ae7ff"
              opacity="0.3"
            />
            <line
              x1={HOVER_X - 70}
              y1={y}
              x2={SUN.x + SUN.r * Math.cos(sweep)}
              y2={SUN.y + SUN.r * Math.sin(sweep)}
              stroke="#8ae7ff"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle
              cx={SUN.x + SUN.r * Math.cos(sweep)}
              cy={SUN.y + SUN.r * Math.sin(sweep)}
              r="9"
              fill="none"
              stroke="#e6fbff"
              strokeWidth="3"
            />
          </g>
        )}

        <g transform={`translate(${MERCURY.x} ${MERCURY.y}) scale(${MERCURY.r / 46}) translate(-50 -50)`}>
          <g opacity={landed ? 1 : 0.5}>
            <PlanetArt id="mercury" uid="-open" />
          </g>
        </g>

        <g transform={`translate(${x} ${y}) rotate(${angle}) scale(1.5) translate(-20 -35)`}>
          <RocketArt flame={!scanning && !exploding && !landed} broken={!scanning} />
        </g>
        {exploding && elapsed < SCAN + 900 && <Explosion key="boom" x={x} y={y} />}
      </svg>

      <p
        className="text-center font-display text-xl text-ink sm:text-2xl"
        aria-live="polite"
      >
        {status}
      </p>

      {landed ? (
        <ArrivalChat index={0} onDone={arrive} />
      ) : (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="px-5 py-2.5 text-base"
            onClick={() => setSkipped(true)}
          >
            Skip
          </Button>
        </div>
      )}
    </div>
  );
}

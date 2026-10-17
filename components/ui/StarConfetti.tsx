"use client";

import { useEffect, useState, type CSSProperties } from "react";

const COLORS = [
  "text-copper",
  "text-signal",
  "text-fuchsia-400",
  "text-emerald-300",
  "text-violet-400",
  "text-orange-300",
];

// A tiny seeded generator keeps every render pure while still scattering the
// stars. Each burst looks the same for the same seed, which is fine for confetti.
function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

// Stars rain down the whole screen for a few seconds, then remove themselves.
// Reduced-motion users get nothing (see globals.css).
export function StarConfetti({ count = 44, seed = 7 }: { count?: number; seed?: number }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 5600);
    return () => clearTimeout(timer);
  }, []);

  if (done) return null;

  const next = seeded(seed);
  const stars = Array.from({ length: count }, (_, i) => ({
    left: next() * 100,
    delay: next() * 1,
    duration: 2.6 + next() * 1.8,
    size: 18 + next() * 24,
    sway: (next() - 0.5) * 180,
    rotation: (next() - 0.5) * 720,
    color: COLORS[i % COLORS.length],
    glyph: i % 5 === 0 ? "⭐" : "★",
  }));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
    >
      {stars.map((star, i) => (
        <span
          key={i}
          className={`confetti-star absolute top-0 ${star.color}`}
          style={
            {
              left: `${star.left}%`,
              fontSize: star.size,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              "--sway": `${star.sway}px`,
              "--rot": `${star.rotation}deg`,
            } as CSSProperties
          }
        >
          {star.glyph}
        </span>
      ))}
    </div>
  );
}

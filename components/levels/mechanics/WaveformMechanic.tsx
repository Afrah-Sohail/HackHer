"use client";

import { useState } from "react";

const CHANNELS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export function WaveformMechanic() {
  const [channel, setChannel] = useState<(typeof CHANNELS)[number]>(1);
  const frequency = (2.1 + channel * 0.15).toFixed(2);

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-line bg-void px-4 py-5 text-ink">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm text-ink-soft">Channel {channel}</p>
          <p className="font-display text-2xl">{frequency} MHz</p>
        </div>
        <svg
          viewBox="0 0 360 88"
          className="mt-4 h-24 w-full"
          role="img"
          aria-label={`Waveform stub on channel ${channel}`}
        >
          <path
            d="M0 44 C 20 44, 20 12, 40 12 S 60 76, 80 76 S 100 20, 120 20 S 140 68, 160 68 S 180 8, 200 8 S 220 80, 240 80 S 260 28, 280 28 S 300 60, 320 60 S 340 44, 360 44"
            fill="none"
            stroke="#f3eee6"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="motion-safe:animate-pulse"
            style={{ transform: `translateY(${(channel % 3) - 1}px)` }}
          />
        </svg>
      </div>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Channel selection"
      >
        {CHANNELS.map((option) => {
          const selected = option === channel;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => setChannel(option)}
              className={`h-10 w-10 rounded-full text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${
                selected
                  ? "bg-signal text-paper-raised"
                  : "border border-line bg-paper-raised text-ink hover:border-signal"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

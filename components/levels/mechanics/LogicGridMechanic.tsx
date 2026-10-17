"use client";

import { useState } from "react";

const GATES = ["AND", "OR", "NOT"] as const;
type Gate = (typeof GATES)[number];
const ZONE_COUNT = 6;

export function LogicGridMechanic() {
  const [armed, setArmed] = useState<Gate | null>(null);
  const [zones, setZones] = useState<Array<Gate | null>>(
    Array.from({ length: ZONE_COUNT }, () => null),
  );

  function placeGate(zoneIndex: number) {
    if (!armed) {
      return;
    }

    setZones((current) =>
      current.map((zone, index) => (index === zoneIndex ? armed : zone)),
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)]">
      <div className="flex flex-row flex-wrap gap-2 lg:flex-col">
        {GATES.map((gate) => (
          <button
            key={gate}
            type="button"
            aria-pressed={armed === gate}
            onClick={() => setArmed(gate)}
            className={`rounded-xl px-4 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${
              armed === gate
                ? "bg-ink text-paper-raised"
                : "border border-line bg-paper text-ink hover:border-ink"
            }`}
          >
            {gate}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setZones(Array.from({ length: ZONE_COUNT }, () => null))}
          className="rounded-xl px-4 py-3 text-sm text-ink-soft hover:text-ink"
        >
          Clear
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {zones.map((zone, index) => (
          <button
            key={index}
            type="button"
            onClick={() => placeGate(index)}
            className="flex min-h-24 flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-paper text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper"
          >
            <span className="text-xs tracking-wide text-ink-soft uppercase">
              Drop zone {index + 1}
            </span>
            <span className="mt-1 font-medium text-ink">
              {zone ?? "Empty"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

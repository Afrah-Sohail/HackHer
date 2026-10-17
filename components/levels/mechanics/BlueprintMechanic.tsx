"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type InstanceRecord = {
  id: number;
};

export function BlueprintMechanic() {
  const [instances, setInstances] = useState<InstanceRecord[]>([]);

  function instantiate() {
    setInstances((current) => [...current, { id: current.length + 1 }]);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-2xl border border-line bg-paper p-4">
        <p className="text-xs font-medium tracking-[0.16em] text-copper uppercase">
          Class
        </p>
        <h2 className="mt-2 font-display text-3xl text-ink">PioneerCard</h2>
        <ul className="mt-4 space-y-2 font-mono text-sm text-ink-soft">
          <li>name: string</li>
          <li>concept: string</li>
          <li>draw()</li>
          <li>describe()</li>
        </ul>
        <Button className="mt-5" onClick={instantiate}>
          Instantiate()
        </Button>
      </section>
      <section
        aria-label="Object instances"
        className="min-h-52 rounded-2xl border border-dashed border-line bg-paper-raised p-4"
      >
        <p className="text-sm font-medium text-ink">Instances</p>
        {instances.length === 0 ? (
          <p className="mt-6 text-sm text-ink-soft">
            The canvas is empty. Instantiate() will place an object here.
          </p>
        ) : (
          <ul className="mt-4 grid gap-2">
            {instances.map((instance) => (
              <li
                key={instance.id}
                className="rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink"
              >
                PioneerCard #{instance.id}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

const DESKS = [
  {
    pioneer: "Dorothy Vaughan",
    stage: "Compiler",
    readout: "Source listing waiting",
  },
  {
    pioneer: "Mary Jackson",
    stage: "Aerodynamics",
    readout: "Tunnel data waiting",
  },
  {
    pioneer: "Katherine Johnson",
    stage: "Functions",
    readout: "Trajectory function waiting",
  },
] as const;

export function MissionDeskMechanic() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {DESKS.map((desk, index) => (
        <section
          key={desk.pioneer}
          className="flex min-h-48 flex-col rounded-2xl border border-line bg-paper p-4"
        >
          <p className="text-xs font-medium tracking-[0.16em] text-copper uppercase">
            Stage {index + 1}
          </p>
          <h2 className="mt-2 font-display text-2xl text-ink">{desk.stage}</h2>
          <p className="mt-1 text-sm text-ink-soft">{desk.pioneer}</p>
          <p className="mt-auto rounded-xl border border-dashed border-line bg-paper-raised px-3 py-3 font-mono text-xs text-ink-soft">
            {desk.readout}
          </p>
        </section>
      ))}
    </div>
  );
}

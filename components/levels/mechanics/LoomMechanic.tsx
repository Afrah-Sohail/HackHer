const SEQUENCE = ["Punch", "Advance", "Weave"] as const;

export function LoomMechanic() {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <div className="rounded-2xl border border-line bg-paper p-4">
        <p className="text-sm font-medium text-ink">Punch card</p>
        <div className="mt-4 grid grid-cols-8 gap-2" aria-hidden="true">
          {Array.from({ length: 32 }, (_, hole) => (
            <span
              key={hole}
              className={`h-3 rounded-full ${
                hole % 5 === 0 ? "bg-ink" : "bg-line"
              }`}
            />
          ))}
        </div>
        <ol className="mt-5 flex flex-wrap gap-2">
          {SEQUENCE.map((step, index) => (
            <li
              key={step}
              className="rounded-xl border border-line bg-paper-raised px-3 py-2 text-sm text-ink"
            >
              <span className="mr-2 text-ink-soft">{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
      <div className="flex min-h-36 flex-col justify-between rounded-2xl border border-dashed border-copper/50 bg-copper/5 p-4">
        <p className="text-sm font-medium text-copper-deep">repeat</p>
        <p className="text-sm leading-6 text-ink-soft">
          Slot for a repeat block. The sequence above will loop from here.
        </p>
        <span className="text-xs tracking-wide text-copper uppercase">
          Placeholder
        </span>
      </div>
    </div>
  );
}

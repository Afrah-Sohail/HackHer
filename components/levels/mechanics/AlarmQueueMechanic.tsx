const ALARMS = [
  { priority: "P1", label: "1202 alarm", detail: "Executive overflow" },
  { priority: "P2", label: "Display refresh", detail: "Landing readout" },
  { priority: "P3", label: "Telemetry log", detail: "Can wait" },
] as const;

const MEMORY_USED = 72;

export function AlarmQueueMechanic() {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <ol className="relative max-h-72 space-y-2 overflow-hidden rounded-2xl border border-line bg-paper p-3">
        {ALARMS.map((alarm) => (
          <li
            key={alarm.label}
            className="motion-safe:animate-pulse rounded-xl border border-line bg-paper-raised px-4 py-3"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-ink">{alarm.label}</p>
              <span className="rounded-full bg-ink px-2 py-0.5 text-xs text-paper-raised">
                {alarm.priority}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-soft">{alarm.detail}</p>
          </li>
        ))}
      </ol>
      <div className="rounded-2xl border border-line bg-paper p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-medium text-ink">Memory</p>
          <p className="font-display text-2xl text-ink">{MEMORY_USED}%</p>
        </div>
        <div
          className="mt-4 h-3 overflow-hidden rounded-full bg-line"
          role="meter"
          aria-label="Memory used"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={MEMORY_USED}
        >
          <div
            className="h-full rounded-full bg-copper"
            style={{ width: `${MEMORY_USED}%` }}
          />
        </div>
        <p className="mt-3 text-sm leading-6 text-ink-soft">
          The meter is a stub. Priority will decide which falling task stays in memory.
        </p>
      </div>
    </div>
  );
}

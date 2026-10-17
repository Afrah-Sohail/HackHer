export function ConceptBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex max-w-full items-center rounded-full border border-signal/20 bg-signal-soft px-2.5 py-1 text-xs font-medium leading-5 text-signal">
      {label}
    </span>
  );
}

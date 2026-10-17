import { Tag } from "./Tag";

export function ConceptBadge({ label }: { label: string }) {
  return (
    <Tag tone="signal" className="max-w-full leading-5">
      {label}
    </Tag>
  );
}

import type { ReactNode } from "react";

// A static label. It is deliberately flat (no border, square-ish corners, default
// cursor) so it never looks like a button. Real buttons are rounded and bordered.
const TONES = {
  neutral: "bg-ink/10 text-ink-soft",
  signal: "bg-signal/10 text-signal",
  copper: "bg-copper/10 text-copper",
  critical: "bg-red-500/10 text-red-300",
} as const;

export function Tag({
  children,
  tone = "neutral",
  size = "sm",
  caps = false,
  className = "",
}: {
  children: ReactNode;
  tone?: keyof typeof TONES;
  size?: "sm" | "md";
  caps?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex cursor-default items-center rounded-md font-medium select-none ${
        size === "md" ? "px-2.5 py-1 text-sm" : "px-2 py-0.5 text-xs"
      } ${caps ? "tracking-wide uppercase" : ""} ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

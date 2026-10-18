import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    "bg-copper text-paper-raised hover:bg-copper-deep disabled:hover:bg-copper",
  secondary:
    "border border-line bg-paper-raised text-ink hover:border-copper disabled:hover:border-line",
  ghost: "bg-transparent text-ink-soft hover:text-ink",
};

// Callers usually pass their own text size; only fall back to the default if not.
const HAS_TEXT_SIZE = /(^|\s)(?:[a-z0-9-]+:)*text-(?:xs|sm|base|lg|xl|[2-9]xl)(\s|$)/;

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type="button"
      className={`inline-flex items-center justify-center rounded-full px-4 py-2 ${HAS_TEXT_SIZE.test(className) ? "" : "text-sm"} font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper disabled:cursor-not-allowed disabled:opacity-40 ${VARIANT_CLASS[variant]} ${className}`}
    />
  );
}

import { createPortal } from "react-dom";
import type { ReactNode } from "react";

// Renders fixed overlays (dialogs, the guide, confetti) outside the game area,
// so the fit-to-screen zoom on the game never scales or shifts them.
export function BodyPortal({ children }: { children: ReactNode }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

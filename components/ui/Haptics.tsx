"use client";

import { useEffect } from "react";

// A tiny vibration when a button is pressed, on devices that support it
// (most Android phones; iPhones ignore it). Skipped for "reduce motion".
export function Haptics() {
  useEffect(() => {
    if (typeof navigator.vibrate !== "function") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onPress = (event: PointerEvent) => {
      if (reduceMotion.matches) return;
      const button = (event.target as Element | null)?.closest("button");
      if (button && !button.disabled) navigator.vibrate(8);
    };

    document.addEventListener("pointerdown", onPress, { passive: true });
    return () => document.removeEventListener("pointerdown", onPress);
  }, []);

  return null;
}

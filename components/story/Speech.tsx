import type { ReactNode } from "react";
import { UnicornAvatar } from "@/components/guide/Unicorn";
import { GUIDE_NAME } from "@/guide/config";
import type { Speaker } from "@/story/journey";
import { Alien } from "./Characters";

function WomanAvatar({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-copper bg-gradient-to-br from-fuchsia-400/40 to-violet-500/40 font-display text-xl text-copper"
    >
      {label}
    </span>
  );
}

// A line of dialogue: You, Sparkles, the woman of the planet, or the narrator.
export function Speech({
  speaker,
  children,
  womanName,
  womanBadge,
}: {
  speaker: Speaker;
  children: ReactNode;
  womanName?: string;
  womanBadge?: string;
}) {
  if (speaker === "narrator") {
    return <p className="text-center text-lg text-ink-soft sm:text-xl">{children}</p>;
  }
  const isSparkles = speaker === "sparkles";
  const isYou = speaker === "you";
  const tone = isSparkles
    ? { box: "border-signal/40 bg-signal/10", name: "text-signal" }
    : isYou
      ? { box: "border-emerald-300/50 bg-emerald-400/10", name: "text-emerald-300" }
      : { box: "border-copper/50 bg-copper/10", name: "text-copper" };
  return (
    // Every avatar sits in the same 64px square, so the bubbles line up.
    <div className="flex items-center gap-3">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center">
        {isSparkles ? (
          <UnicornAvatar size={64} />
        ) : isYou ? (
          <Alien size={64} />
        ) : (
          <WomanAvatar label={womanBadge ?? "★"} />
        )}
      </div>
      <div className={`min-w-0 flex-1 rounded-2xl border px-4 py-3 ${tone.box}`}>
        <span className={`mb-0.5 block text-xs font-semibold tracking-wide uppercase ${tone.name}`}>
          {isSparkles ? GUIDE_NAME : isYou ? "You" : womanName}
        </span>
        <span className="text-base text-ink sm:text-lg">{children}</span>
      </div>
    </div>
  );
}

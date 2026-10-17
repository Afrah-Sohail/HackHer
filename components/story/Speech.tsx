import type { ReactNode } from "react";
import { UnicornSays } from "@/components/guide/Unicorn";
import { GUIDE_NAME } from "@/guide/config";
import { ALIEN_NAME, type Speaker } from "@/story/journey";
import { Alien } from "./Characters";

function WomanAvatar({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-copper bg-gradient-to-br from-fuchsia-400/40 to-violet-500/40 font-display text-xl text-copper"
    >
      {label}
    </span>
  );
}

// A line of dialogue: Blip, Sparkles, the woman of the planet, or the narrator.
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
  if (speaker === "sparkles") {
    return (
      <UnicornSays size={64}>
        <span className="mb-0.5 block text-xs font-semibold tracking-wide text-copper uppercase">
          {GUIDE_NAME}
        </span>
        <span className="text-base sm:text-lg">{children}</span>
      </UnicornSays>
    );
  }
  const isBlip = speaker === "blip";
  return (
    <div className="flex items-start gap-3">
      {isBlip ? <Alien size={64} /> : <WomanAvatar label={womanBadge ?? "★"} />}
      <div
        className={`min-w-0 flex-1 rounded-2xl rounded-tl-sm border px-4 py-3 ${
          isBlip ? "border-emerald-300/50 bg-emerald-400/10" : "border-copper/50 bg-copper/10"
        }`}
      >
        <span
          className={`mb-0.5 block text-xs font-semibold tracking-wide uppercase ${
            isBlip ? "text-emerald-300" : "text-copper"
          }`}
        >
          {isBlip ? ALIEN_NAME : womanName}
        </span>
        <span className="text-base text-ink sm:text-lg">{children}</span>
      </div>
    </div>
  );
}

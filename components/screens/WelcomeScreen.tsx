"use client";

import { useGame } from "@/state/game-context";
import { Button } from "@/components/ui/Button";
import { UnicornSays } from "@/components/guide/Unicorn";
import { GUIDE_NAME } from "@/guide/config";

const HIGHLIGHTS = [
  { icon: "🧩", label: "Play puzzles" },
  { icon: "💡", label: "Learn the big idea" },
  { icon: "👩‍💻", label: "Meet the pioneers" },
];

export function WelcomeScreen() {
  const { start } = useGame();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
      <h1 className="font-display text-7xl tracking-tight text-ink drop-shadow-[0_0_28px_rgb(176_140_255_/_0.7)] sm:text-8xl">
        HackHer
      </h1>
      <p className="mt-3 text-sm font-medium tracking-[0.2em] text-copper uppercase">
        ✦ Six levels, eight pioneers ✦
      </p>

      <p className="mt-6 max-w-xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
        Six short puzzle games inspired by real women who shaped computing.
        Weave patterns with loops, outsmart a radio jammer, wire up logic
        gates, plot a rocket&apos;s path, keep Apollo&apos;s computer running
        and build with classes and objects.
      </p>

      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-soft">
        {HIGHLIGHTS.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-2"
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </li>
        ))}
      </ul>

      <div className="mt-8 w-full max-w-md text-left">
        <UnicornSays size={64}>
          <strong className="text-copper">Hi, I&apos;m {GUIDE_NAME}!</strong> I&apos;ll
          be your guide on the way up. Stuck or curious? Just ask me. Ready to
          climb?
        </UnicornSays>
      </div>

      <Button
        className="mt-8 px-10 py-3 text-base shadow-[0_0_28px_rgb(240_195_106_/_0.35)]"
        onClick={() => start(0)}
      >
        Start
      </Button>

      <p className="mt-10 text-sm text-ink-soft">
        Made with 💜 by <strong className="font-semibold text-ink">Afrah</strong>,{" "}
        <strong className="font-semibold text-ink">Emily</strong> &amp;{" "}
        <strong className="font-semibold text-ink">Valentina</strong>
      </p>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { UnicornSays } from "@/components/guide/Unicorn";
import { WeaveTutorial } from "./WeaveTutorial";
import {
  MAX_REPEAT,
  MIN_REPEAT,
  ROUNDS,
  THREADS,
  THREAD_IDS,
  chipCount,
  describeMismatch,
  expand,
  firstMismatch,
  type Card,
  type Thread,
} from "./weave-rules";

type Phase = "build" | "weaving" | "result";

function ThreadCell({
  thread,
  ring,
  dim,
}: {
  thread: Thread;
  ring?: "match" | "miss";
  dim?: boolean;
}) {
  const ringClass =
    ring === "match"
      ? "ring-2 ring-white/80"
      : ring === "miss"
        ? "ring-2 ring-red-500"
        : "";
  return (
    <span
      role="img"
      aria-label={`${THREADS[thread].name} thread`}
      className={`flex h-8 w-8 items-center justify-center rounded-md text-base transition ${THREADS[thread].className} ${ringClass} ${dim ? "opacity-50" : ""}`}
    >
      {THREADS[thread].symbol}
    </span>
  );
}

function EmptyCell() {
  return (
    <span
      aria-hidden="true"
      className="h-8 w-8 rounded-md border border-dashed border-line"
    />
  );
}

export function WeaveMechanic({ onCleared }: { onCleared?: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [focusId, setFocusId] = useState<number | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>("build");
  const [revealed, setRevealed] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const closeTutorial = useCallback(() => setShowTutorial(false), []);
  const nextId = useRef(1);

  const round = ROUNDS[roundIndex];
  const isLastRound = roundIndex === ROUNDS.length - 1;
  const woven = expand(cards);
  const used = chipCount(cards);
  const mismatch = firstMismatch(woven, round.target);
  const matches = woven.length > 0 && mismatch === -1;
  const stripLength = Math.max(round.target.length, woven.length);

  useEffect(() => {
    if (phase !== "weaving") return;
    if (revealed >= woven.length) {
      const timer = setTimeout(() => {
        setPhase("result");
        if (mismatch === -1 && roundIndex === ROUNDS.length - 1) onCleared?.();
      }, 350);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setRevealed((count) => count + 1), 250);
    return () => clearTimeout(timer);
  }, [phase, revealed, woven.length, mismatch, roundIndex, onCleared]);

  function outOfChips(): boolean {
    if (used < round.budget) return false;
    setMessage(
      "Out of chips! Remove one, or use a 🔁 Repeat block to do more with fewer chips.",
    );
    return true;
  }

  function addThread(thread: Thread) {
    if (phase !== "build" || outOfChips()) return;
    setMessage(null);
    const id = nextId.current++;
    setCards((prev) =>
      focusId === null
        ? [...prev, { id, kind: "thread", thread }]
        : prev.map((card) =>
            card.id === focusId && card.kind === "repeat"
              ? { ...card, body: [...card.body, { id, thread }] }
              : card,
          ),
    );
  }

  function addRepeat() {
    if (phase !== "build" || outOfChips()) return;
    setMessage(null);
    const id = nextId.current++;
    setCards((prev) => [...prev, { id, kind: "repeat", times: MIN_REPEAT, body: [] }]);
    setFocusId(id);
  }

  function removeBlock(id: number) {
    if (phase !== "build") return;
    setCards((prev) => prev.filter((card) => card.id !== id));
    setFocusId((current) => (current === id ? null : current));
    setSelected([]);
    setMessage(null);
  }

  function toggleSelect(id: number) {
    if (phase !== "build") return;
    setMessage(null);
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  function removeSelected() {
    if (phase !== "build") return;
    setCards((prev) =>
      prev
        .filter((card) => !(card.kind === "thread" && selected.includes(card.id)))
        .map((card) =>
          card.kind === "repeat"
            ? { ...card, body: card.body.filter((item) => !selected.includes(item.id)) }
            : card,
        ),
    );
    setSelected([]);
    setMessage(null);
  }

  // Wrap the selected main-card threads into a new Repeat block.
  function repeatSelected() {
    if (phase !== "build" || !round.repeatAvailable) return;
    const picked = cards.filter(
      (card): card is Extract<Card, { kind: "thread" }> =>
        card.kind === "thread" && selected.includes(card.id),
    );
    if (picked.length === 0 || picked.length !== selected.length) {
      setMessage(
        "Select thread chips on the main card (not inside a Repeat block) to repeat them.",
      );
      return;
    }
    if (used + 1 > round.budget) {
      setMessage(
        "Out of chips! A Repeat block costs 1 chip too. Remove a chip first.",
      );
      return;
    }
    const firstIndex = cards.findIndex((card) => card.id === picked[0].id);
    const block: Card = {
      id: nextId.current++,
      kind: "repeat",
      times: MIN_REPEAT,
      body: picked.map((card) => ({ id: card.id, thread: card.thread })),
    };
    setCards((prev) => {
      const rest = prev.filter((card) => !picked.some((item) => item.id === card.id));
      rest.splice(Math.min(firstIndex, rest.length), 0, block);
      return rest;
    });
    setSelected([]);
    setFocusId(null);
    setMessage("Now choose how many times to repeat with the − and + buttons.");
  }

  function changeTimes(id: number, delta: number) {
    if (phase !== "build") return;
    setCards((prev) =>
      prev.map((card) =>
        card.id === id && card.kind === "repeat"
          ? {
              ...card,
              times: Math.min(MAX_REPEAT, Math.max(MIN_REPEAT, card.times + delta)),
            }
          : card,
      ),
    );
  }

  function weave() {
    if (woven.length === 0) {
      setMessage("Add some threads to your punch card first!");
      return;
    }
    setMessage(null);
    setFocusId(null);
    setSelected([]);
    setRevealed(0);
    setPhase("weaving");
  }

  function tryAgain() {
    setRevealed(0);
    setPhase("build");
  }

  function nextRound() {
    setRoundIndex((index) => index + 1);
    setCards([]);
    setFocusId(null);
    setSelected([]);
    setRevealed(0);
    setMessage(null);
    setPhase("build");
  }

  const locked = phase !== "build";

  return (
    <>
      {showTutorial && <WeaveTutorial onDone={closeTutorial} />}
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-ink">
            Round {roundIndex + 1} of {ROUNDS.length}: {round.title}
          </p>
          <ol className="flex gap-1.5" aria-label="Round progress">
            {ROUNDS.map((r, i) => (
              <li
                key={r.title}
                className={`h-2 w-8 rounded-full ${
                  i < roundIndex || (i === roundIndex && phase === "result" && matches)
                    ? "bg-signal"
                    : i === roundIndex
                      ? "bg-copper"
                      : "bg-line"
                }`}
              />
            ))}
          </ol>
        </div>

        <div className="rounded-xl border border-line bg-paper-raised/60 p-4">
          <p className="text-[15px] leading-6 text-ink">
            <strong className="text-copper">Your goal:</strong> make{" "}
            <strong>your weave</strong> match the{" "}
            <strong>target pattern</strong> using at most{" "}
            <strong>{round.budget} chips</strong>.
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">{round.story}</p>
        </div>

        <div className="grid gap-3 rounded-2xl border border-line bg-void p-4">
          <div>
            <p className="mb-1.5 text-[10px] tracking-wide text-ink-soft uppercase">
              Target pattern
            </p>
            <div className="flex flex-wrap gap-1" aria-label="Target pattern">
              {round.target.map((thread, i) => (
                <ThreadCell key={i} thread={thread} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-[10px] tracking-wide text-ink-soft uppercase">
              Your weave {phase === "build" && "(live preview)"}
            </p>
            <div className="flex flex-wrap gap-1" aria-label="Your weave">
              {Array.from({ length: stripLength }, (_, i) => {
                const thread = woven[i];
                if (thread === undefined) return <EmptyCell key={i} />;
                const shown = phase === "result" || (phase === "weaving" && i < revealed);
                return (
                  <ThreadCell
                    key={i}
                    thread={thread}
                    dim={!shown}
                    ring={
                      shown
                        ? thread === round.target[i]
                          ? "match"
                          : "miss"
                        : undefined
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Chips">
            <span className="text-sm text-ink-soft">1. Add chips:</span>
            {THREAD_IDS.map((thread) => (
              <button
                key={thread}
                type="button"
                disabled={locked}
                onClick={() => addThread(thread)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper disabled:opacity-40 ${THREADS[thread].className}`}
              >
                <span aria-hidden="true">{THREADS[thread].symbol}</span>
                {THREADS[thread].name}
              </button>
            ))}
            {round.repeatAvailable && (
              <button
                type="button"
                disabled={locked}
                onClick={addRepeat}
                className="rounded-lg border-2 border-copper px-3 py-2 text-sm font-semibold text-copper transition hover:bg-copper/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper disabled:opacity-40"
              >
                🔁 Repeat block
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
            <span>Chips used:</span>
            <span className="flex gap-1" aria-hidden="true">
              {Array.from({ length: round.budget }, (_, i) => (
                <span
                  key={i}
                  className={`h-3 w-3 rounded-full ${i < used ? "bg-copper" : "border border-line"}`}
                />
              ))}
            </span>
            <span className="font-medium text-ink">
              {used} / {round.budget}
            </span>
          </div>
        </div>

        <div
          aria-label="Punch card"
          className="min-h-24 rounded-2xl border border-line bg-paper p-3"
        >
          <p className="mb-2 text-[10px] tracking-wide text-ink-soft uppercase">
            2. Your punch card (tap chips to select them)
          </p>
          {cards.length === 0 && (
            <p className="text-sm text-ink-soft">
              Empty. Tap a thread above to start.
            </p>
          )}
          <div className="flex flex-wrap items-start gap-2">
            {cards.map((card) =>
              card.kind === "thread" ? (
                <button
                  key={card.id}
                  type="button"
                  disabled={locked}
                  aria-pressed={selected.includes(card.id)}
                  onClick={() => toggleSelect(card.id)}
                  aria-label={`${THREADS[card.thread].name} thread (tap to select)`}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${THREADS[card.thread].className} ${
                    selected.includes(card.id) ? "-translate-y-1 ring-2 ring-ink" : ""
                  }`}
                >
                  {THREADS[card.thread].symbol}
                </button>
              ) : (
                <div
                  key={card.id}
                  className={`rounded-xl border-2 p-2 ${
                    focusId === card.id
                      ? "border-copper bg-copper/10"
                      : "border-copper/40"
                  }`}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-semibold text-copper">🔁 Repeat</span>
                    <button
                      type="button"
                      disabled={locked || card.times <= MIN_REPEAT}
                      onClick={() => changeTimes(card.id, -1)}
                      aria-label="Repeat fewer times"
                      className="h-8 w-8 rounded-lg border border-line text-lg text-ink transition hover:border-copper disabled:opacity-30"
                    >
                      −
                    </button>
                    <span className="min-w-14 text-center font-semibold text-ink">
                      ×{card.times} times
                    </span>
                    <button
                      type="button"
                      disabled={locked || card.times >= MAX_REPEAT}
                      onClick={() => changeTimes(card.id, 1)}
                      aria-label="Repeat more times"
                      className="h-8 w-8 rounded-lg border border-line text-lg text-ink transition hover:border-copper disabled:opacity-30"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      disabled={locked}
                      onClick={() => removeBlock(card.id)}
                      aria-label="Remove repeat block"
                      className="ml-1 text-ink-soft hover:text-ink"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex min-h-10 flex-wrap items-center gap-1.5">
                    {card.body.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        disabled={locked}
                        aria-pressed={selected.includes(item.id)}
                        onClick={() => toggleSelect(item.id)}
                        aria-label={`${THREADS[item.thread].name} thread in repeat block (tap to select)`}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${THREADS[item.thread].className} ${
                          selected.includes(item.id) ? "-translate-y-1 ring-2 ring-ink" : ""
                        }`}
                      >
                        {THREADS[item.thread].symbol}
                      </button>
                    ))}
                    {card.body.length === 0 && (
                      <span className="text-xs text-ink-soft">
                        {focusId === card.id
                          ? "Tap a thread above to add it in here"
                          : "Empty block"}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={locked}
                    aria-pressed={focusId === card.id}
                    onClick={() =>
                      setFocusId((current) => (current === card.id ? null : card.id))
                    }
                    className={`mt-2 rounded-lg px-2.5 py-1 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${
                      focusId === card.id
                        ? "bg-copper text-paper-raised"
                        : "border border-copper/60 text-copper hover:bg-copper/10"
                    }`}
                  >
                    {focusId === card.id ? "✓ Done adding" : "+ Add threads here"}
                  </button>
                </div>
              ),
            )}
          </div>

          {selected.length > 0 && phase === "build" && (
            <div
              className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-copper/10 p-2"
              role="group"
              aria-label="Selected chips"
            >
              <span className="text-xs text-copper">{selected.length} selected:</span>
              {round.repeatAvailable && (
                <Button className="px-3 py-1.5 text-xs" onClick={repeatSelected}>
                  🔁 Repeat these
                </Button>
              )}
              <Button
                variant="secondary"
                className="px-3 py-1.5 text-xs"
                onClick={removeSelected}
              >
                Remove
              </Button>
              <Button
                variant="ghost"
                className="px-3 py-1.5 text-xs"
                onClick={() => setSelected([])}
              >
                Deselect
              </Button>
            </div>
          )}
        </div>

        <p className="min-h-5 text-sm text-copper" aria-live="polite">
          {message ?? " "}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {phase === "build" && (
            <>
              <Button onClick={weave} disabled={cards.length === 0}>
                Weave!
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setCards([]);
                  setFocusId(null);
                  setSelected([]);
                  setMessage(null);
                }}
                disabled={cards.length === 0}
              >
                Clear
              </Button>
              <Button variant="ghost" onClick={() => setShowTutorial(true)}>
                How to play
              </Button>
            </>
          )}
          {phase === "weaving" && (
            <p className="text-sm text-ink-soft" aria-live="polite">
              Weaving…
            </p>
          )}
          {phase === "result" && matches && (
            <>
              <UnicornSays tone="happy" className="w-full">
                <span aria-live="polite" className="block">
                  <strong className="text-signal">
                    {isLastRound ? "Tapestry complete! Level cleared." : "Perfect weave!"}
                  </strong>{" "}
                  <span className="text-ink-soft">{round.lesson}</span>
                </span>
              </UnicornSays>
              {!isLastRound && <Button onClick={nextRound}>Next round</Button>}
            </>
          )}
          {phase === "result" && !matches && (
            <>
              <UnicornSays tone="oops" className="w-full">
                <span aria-live="polite" className="block">
                  <strong className="text-copper">Not quite.</strong>{" "}
                  {describeMismatch(woven, round.target, mismatch)} Red outlines mark
                  the wrong threads.
                  {cards.some((card) => card.kind === "repeat") &&
                    " Tip: check how many times your 🔁 block repeats (− and +)."}
                </span>
              </UnicornSays>
              <Button onClick={tryAgain}>Try again</Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

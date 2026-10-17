"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { UnicornSays } from "@/components/guide/Unicorn";
import { WeaveTutorial } from "./WeaveTutorial";
import {
  MAX_CHIPS,
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

// Symbols only: no color names anywhere on screen.
const BEAD = "h-11 w-11 text-xl sm:h-14 sm:w-14 sm:text-2xl";
const CHIP = "h-14 w-14 text-2xl sm:h-16 sm:w-16 sm:text-3xl";

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
        ? "ring-4 ring-red-500"
        : "";
  return (
    <span
      role="img"
      aria-label={`${THREADS[thread].name} thread`}
      className={`flex ${BEAD} cursor-default items-center justify-center rounded-full select-none transition ${THREADS[thread].className} ${ringClass} ${dim ? "opacity-50" : ""}`}
    >
      {THREADS[thread].symbol}
    </span>
  );
}

function EmptyCell() {
  return (
    <span
      aria-hidden="true"
      className={`${BEAD} rounded-full border-2 border-dashed border-line`}
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
    if (used < MAX_CHIPS) return false;
    setMessage("That's a lot of chips! Try a 🔁 loop.");
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
      setMessage("Select chips outside a 🔁 block to repeat them.");
      return;
    }
    if (used + 1 > MAX_CHIPS) {
      setMessage("That's a lot of chips! Remove a few first.");
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
    setMessage("Now set how many times with − and +.");
  }

  // The palette's 🔁 button: confirm a selection, offer to repeat the chips
  // already on the card, or start an empty block when there is nothing yet.
  function onRepeatButton() {
    if (phase !== "build") return;
    if (selected.length > 0) {
      repeatSelected();
      return;
    }
    const onCard = cards.filter((card) => card.kind === "thread");
    if (onCard.length > 0) {
      setSelected(onCard.map((card) => card.id));
      setMessage("Tap to deselect any you don't want repeated. Then 🔁 Repeat these.");
      return;
    }
    addRepeat();
  }

  // The learning moment: swap the player's long answer for the loop version.
  function showLoop() {
    const next: Card[] = round.solution.map((item) =>
      "thread" in item
        ? { id: nextId.current++, kind: "thread", thread: item.thread }
        : {
            id: nextId.current++,
            kind: "repeat",
            times: item.repeat,
            body: item.body.map((thread) => ({ id: nextId.current++, thread })),
          },
    );
    setCards(next);
    setFocusId(null);
    setSelected([]);
    setRevealed(0);
    setPhase("build");
    setMessage("Here's the loop! Press Weave to try it.");
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
      setMessage("Add some chips first!");
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
  const canTeachLoop = matches && round.repeatAvailable && used > round.budget;

  return (
    <>
      {showTutorial && <WeaveTutorial onDone={closeTutorial} />}
      <div className="grid gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-base font-semibold text-ink">
            Round {roundIndex + 1} of {ROUNDS.length}
          </p>
          <ol className="flex gap-2" aria-label="Round progress">
            {ROUNDS.map((r, i) => (
              <li
                key={r.title}
                className={`h-2.5 w-10 rounded-full ${
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

        <div>
          <p className="font-display text-2xl text-ink sm:text-3xl">
            Match the pattern
            <span className="ml-3 text-base font-sans text-ink-soft sm:text-lg">
              aim for {round.budget} chips
            </span>
          </p>
          <p className="mt-1 text-base text-ink-soft">{round.story}</p>
        </div>

        <div className="grid gap-5 rounded-3xl border border-line bg-void p-5 sm:p-7">
          <div>
            <p className="mb-2 text-xs font-medium tracking-wide text-ink-soft uppercase">
              Pattern
            </p>
            <div className="flex flex-wrap gap-2" aria-label="Target pattern">
              {round.target.map((thread, i) => (
                <ThreadCell key={i} thread={thread} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium tracking-wide text-ink-soft uppercase">
              Yours
            </p>
            <div className="flex flex-wrap gap-2" aria-label="Your weave">
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
          <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Chips">
            {THREAD_IDS.map((thread) => (
              <button
                key={thread}
                type="button"
                disabled={locked}
                onClick={() => addThread(thread)}
                aria-label={`Add ${THREADS[thread].name} thread`}
                className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl font-semibold transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper disabled:opacity-40 sm:h-20 sm:w-20 sm:text-4xl ${THREADS[thread].className}`}
              >
                {THREADS[thread].symbol}
              </button>
            ))}
            {round.repeatAvailable && (
              <button
                type="button"
                disabled={locked}
                onClick={onRepeatButton}
                aria-label="Add repeat block"
                className="flex h-16 items-center justify-center gap-2 rounded-2xl border-2 border-copper px-5 text-2xl text-copper transition hover:bg-copper/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper disabled:opacity-40 sm:h-20 sm:text-3xl"
              >
                🔁
                <span className="text-base font-semibold">Repeat</span>
              </button>
            )}
            <span
              className="ml-auto flex items-center gap-1.5 text-sm text-ink-soft"
              aria-label={`${used} chips used, aim for ${round.budget}`}
            >
              {Array.from({ length: Math.max(round.budget, used) }, (_, i) => (
                <span
                  key={i}
                  className={`h-3.5 w-3.5 rounded-full ${
                    i >= used
                      ? "border border-line"
                      : i >= round.budget
                        ? "bg-red-400"
                        : "bg-copper"
                  }`}
                />
              ))}
              <span className="ml-1 font-medium text-ink">
                {used}
                <span className="font-normal text-ink-soft"> / aim {round.budget}</span>
              </span>
            </span>
          </div>
        </div>

        <div
          aria-label="Punch card"
          className="min-h-28 rounded-3xl border border-line bg-paper p-4 sm:p-5"
        >
          <p className="mb-3 text-xs font-medium tracking-wide text-ink-soft uppercase">
            Punch card
          </p>
          {cards.length === 0 && (
            <p className="text-base text-ink-soft">Tap a symbol above to start.</p>
          )}
          <div className="flex flex-wrap items-start gap-3">
            {cards.map((card) =>
              card.kind === "thread" ? (
                <button
                  key={card.id}
                  type="button"
                  disabled={locked}
                  aria-pressed={selected.includes(card.id)}
                  onClick={() => toggleSelect(card.id)}
                  aria-label={`${THREADS[card.thread].name} thread (tap to select)`}
                  className={`flex ${CHIP} items-center justify-center rounded-xl transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${THREADS[card.thread].className} ${
                    selected.includes(card.id) ? "-translate-y-1.5 ring-4 ring-ink" : ""
                  }`}
                >
                  {THREADS[card.thread].symbol}
                </button>
              ) : (
                <div
                  key={card.id}
                  className={`rounded-2xl border-2 p-3 ${
                    focusId === card.id
                      ? "border-copper bg-copper/10"
                      : "border-copper/40"
                  }`}
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="text-2xl" aria-hidden="true">
                      🔁
                    </span>
                    <button
                      type="button"
                      disabled={locked || card.times <= MIN_REPEAT}
                      onClick={() => changeTimes(card.id, -1)}
                      aria-label="Repeat fewer times"
                      className="h-11 w-11 rounded-xl border border-line text-2xl text-ink transition hover:border-copper disabled:opacity-30"
                    >
                      −
                    </button>
                    <span className="min-w-12 text-center font-display text-3xl text-ink">
                      ×{card.times}
                    </span>
                    <button
                      type="button"
                      disabled={locked || card.times >= MAX_REPEAT}
                      onClick={() => changeTimes(card.id, 1)}
                      aria-label="Repeat more times"
                      className="h-11 w-11 rounded-xl border border-line text-2xl text-ink transition hover:border-copper disabled:opacity-30"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      disabled={locked}
                      onClick={() => removeBlock(card.id)}
                      aria-label="Remove repeat block"
                      className="ml-1 h-11 w-11 rounded-xl text-lg text-ink-soft hover:text-ink"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex min-h-14 flex-wrap items-center gap-2">
                    {card.body.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        disabled={locked}
                        aria-pressed={selected.includes(item.id)}
                        onClick={() => toggleSelect(item.id)}
                        aria-label={`${THREADS[item.thread].name} thread in repeat block (tap to select)`}
                        className={`flex ${CHIP} items-center justify-center rounded-xl transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${THREADS[item.thread].className} ${
                          selected.includes(item.id) ? "-translate-y-1.5 ring-4 ring-ink" : ""
                        }`}
                      >
                        {THREADS[item.thread].symbol}
                      </button>
                    ))}
                    {card.body.length === 0 && (
                      <span className="text-sm text-ink-soft">
                        {focusId === card.id ? "Tap a symbol above" : "Empty"}
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
                    className={`mt-3 rounded-xl px-3.5 py-1.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${
                      focusId === card.id
                        ? "bg-copper text-paper-raised"
                        : "border border-copper/60 text-copper hover:bg-copper/10"
                    }`}
                  >
                    {focusId === card.id ? "✓ Done" : "+ Add here"}
                  </button>
                </div>
              ),
            )}
          </div>

          {selected.length > 0 && phase === "build" && (
            <div
              className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-copper/10 p-3"
              role="group"
              aria-label="Selected chips"
            >
              {round.repeatAvailable && (
                <Button className="px-4 py-2 text-sm" onClick={repeatSelected}>
                  🔁 Repeat these
                </Button>
              )}
              <Button variant="secondary" className="px-4 py-2 text-sm" onClick={removeSelected}>
                Remove
              </Button>
              <Button variant="ghost" className="px-4 py-2 text-sm" onClick={() => setSelected([])}>
                Deselect
              </Button>
            </div>
          )}
        </div>

        <p className="min-h-6 text-base text-copper" aria-live="polite">
          {message ?? " "}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          {phase === "build" && (
            <>
              <Button
                className="px-10 py-3.5 text-lg"
                onClick={weave}
                disabled={cards.length === 0}
              >
                Weave!
              </Button>
              <Button
                variant="secondary"
                className="px-6 py-3 text-base"
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
              <Button
                variant="ghost"
                className="px-4 py-3 text-base"
                onClick={() => setShowTutorial(true)}
              >
                Help
              </Button>
            </>
          )}
          {phase === "weaving" && (
            <p className="text-lg text-ink-soft" aria-live="polite">
              Weaving…
            </p>
          )}
          {phase === "result" && matches && (
            <>
              {canTeachLoop ? (
                <UnicornSays tone="happy" className="w-full">
                  <span aria-live="polite" className="block">
                    <strong className="text-signal">It works! 🎉</strong> But
                    there&apos;s a shortcut: a 🔁 loop can do this in just{" "}
                    <strong>{round.budget} chips</strong>.
                  </span>
                </UnicornSays>
              ) : (
                <UnicornSays tone="happy" className="w-full">
                  <span aria-live="polite" className="block">
                    <strong className="text-signal">
                      {isLastRound ? "Level cleared!" : "Perfect!"}
                    </strong>{" "}
                    <span className="text-ink-soft">{round.lesson}</span>
                  </span>
                </UnicornSays>
              )}
              {canTeachLoop && (
                <Button className="px-8 py-3.5 text-lg" onClick={showLoop}>
                  Show me the loop
                </Button>
              )}
              {!isLastRound && (
                <Button
                  variant={canTeachLoop ? "secondary" : "primary"}
                  className="px-8 py-3.5 text-lg"
                  onClick={nextRound}
                >
                  Next round
                </Button>
              )}
            </>
          )}
          {phase === "result" && !matches && (
            <>
              <UnicornSays tone="oops" className="w-full">
                <span aria-live="polite" className="block">
                  <strong className="text-copper">Not quite.</strong>{" "}
                  {describeMismatch(woven, round.target, mismatch)}
                  {cards.some((card) => card.kind === "repeat") &&
                    " Check the ×N on your 🔁."}
                </span>
              </UnicornSays>
              <Button className="px-10 py-3.5 text-lg" onClick={tryAgain}>
                Try again
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

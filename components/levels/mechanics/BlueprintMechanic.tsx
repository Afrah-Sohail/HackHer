"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { UnicornSays } from "@/components/guide/Unicorn";
import { ObjectTutorial } from "./ObjectTutorial";
import {
  METHODS,
  PROPS,
  ROUNDS,
  buildCheck,
  describeDesign,
  designCheck,
  greeting,
  petText,
  type MethodId,
  type Pet,
  type PropId,
} from "./object-rules";

type Feedback = { ok: boolean; text: string } | null;

const EMPTY_PET: Pet = { name: "", species: "", color: "" };

function valueOf(pet: Pet, id: PropId): string {
  if (id === "name" || id === "species" || id === "color") return pet[id] || "—";
  return PROPS[id].fixed ?? "—";
}

export function BlueprintMechanic({ onCleared }: { onCleared?: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [added, setAdded] = useState<PropId[]>([]);
  const [made, setMade] = useState<Pet[]>([]);
  const [methods, setMethods] = useState<MethodId[]>([]);
  const [sent, setSent] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [solved, setSolved] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const closeTutorial = useCallback(() => setShowTutorial(false), []);

  const round = ROUNDS[roundIndex];
  const isLastRound = roundIndex === ROUNDS.length - 1;
  const blueprint: PropId[] = [...round.baseProps, ...added];
  const objects: Pet[] = round.mode === "build" ? made : [...round.objects];
  const editable = !solved;

  function touch() {
    setFeedback(null);
    setSent(false);
  }

  function toggleProp(id: PropId) {
    if (!editable) return;
    touch();
    setAdded((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  function toggleMethod(id: MethodId) {
    if (!editable) return;
    touch();
    setMethods((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
  }

  function makePet() {
    if (!editable || made.length >= round.requests.length) return;
    touch();
    setMade((prev) => [...prev, { ...EMPTY_PET }]);
  }

  function editPet(index: number, key: keyof Pet, value: string) {
    if (!editable) return;
    touch();
    setMade((prev) => prev.map((pet, i) => (i === index ? { ...pet, [key]: value } : pet)));
  }

  function win(text: string) {
    setFeedback({ ok: true, text });
    setSolved(true);
    if (isLastRound) onCleared?.();
  }

  function check() {
    if (round.mode === "design") {
      const result = designCheck(round, blueprint);
      if (result.ok) win(round.lesson);
      else setFeedback({ ok: false, text: describeDesign(result.missing, result.extra) });
      return;
    }

    if (round.mode === "build") {
      const result = buildCheck(round, made);
      if (result.ok) {
        win(round.lesson);
        return;
      }
      const need = round.requests.length - made.length;
      setFeedback({
        ok: false,
        text:
          need > 0
            ? `Make ${need} more ${need === 1 ? "pet" : "pets"}, then choose their values.`
            : `No pet matches ${petText(result.unmatched[0])} yet. Check each pet's values.`,
      });
      return;
    }

    // method mode
    setSent(true);
    const wrong = methods.find((m) => m !== "greet");
    if (wrong) {
      setFeedback({
        ok: false,
        text: `Pets don't need "${METHODS[wrong].label}". Remove it and try again.`,
      });
    } else if (!methods.includes("greet")) {
      setFeedback({ ok: false, text: "Add a method so every pet can say hello." });
    } else {
      win(round.lesson);
    }
  }

  function nextRound() {
    setRoundIndex(roundIndex + 1);
    setAdded([]);
    setMade([]);
    setMethods([]);
    setSent(false);
    setFeedback(null);
    setSolved(false);
  }

  const showGreetings = round.mode === "method" && sent && methods.includes("greet");
  const checkLabel =
    round.mode === "design"
      ? "Check blueprint"
      : round.mode === "build"
        ? "Check pets"
        : "Send message to all pets";

  return (
    <>
      {showTutorial && <ObjectTutorial onDone={closeTutorial} />}
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
                  i < roundIndex || (i === roundIndex && solved)
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
            <strong className="text-copper">Your goal:</strong> {round.goal}
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">{round.story}</p>
        </div>

        <div className="rounded-2xl border border-line bg-void p-4">
          <p className="mb-2 text-[10px] tracking-wide text-ink-soft uppercase">
            Mission board
          </p>
          {round.requests.length > 0 ? (
            <ul className="flex flex-wrap gap-2" aria-label="Pets requested">
              {round.requests.map((pet) => (
                <li key={pet.name}>
                  <Tag tone="copper" size="md">
                    🐾 {petText(pet)}
                  </Tag>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink">
              🩺 Vet rule: every pet record must show{" "}
              <strong className="text-copper">vaccinated: yes</strong>.
            </p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <section
            aria-label="Pet blueprint"
            className="rounded-2xl border-2 border-dashed border-copper/60 bg-paper p-4"
          >
            <h3 className="font-display text-lg text-copper">📐 Pet blueprint (class)</h3>
            <p className="mb-3 text-xs text-ink-soft">What every pet has and can do</p>

            <p className="mb-1 text-[10px] tracking-wide text-ink-soft uppercase">
              Properties
            </p>
            <div className="flex flex-wrap gap-1.5">
              {blueprint.length === 0 && (
                <span className="text-sm text-ink-soft">Empty so far</span>
              )}
              {blueprint.map((id) => {
                if (round.baseProps.includes(id)) {
                  return (
                    <Tag key={id} size="md">
                      {PROPS[id].label}
                    </Tag>
                  );
                }
                return (
                  <button
                    key={id}
                    type="button"
                    disabled={!editable}
                    onClick={() => toggleProp(id)}
                    aria-label={`Remove ${PROPS[id].label}`}
                    className="rounded-full border border-copper bg-copper/15 px-3 py-1 text-sm text-copper hover:bg-copper/25"
                  >
                    {PROPS[id].label} ✕
                  </button>
                );
              })}
            </div>

            {round.mode === "design" && (
              <div className="mt-3">
                <p className="mb-1 text-[10px] tracking-wide text-ink-soft uppercase">
                  Add a property
                </p>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="Property palette">
                  {round.palette
                    .filter((id) => !blueprint.includes(id))
                    .map((id) => (
                      <button
                        key={id}
                        type="button"
                        disabled={!editable}
                        onClick={() => toggleProp(id)}
                        className="rounded-full border border-dashed border-ink-soft/60 px-3 py-1 text-sm text-ink transition hover:border-copper hover:text-copper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper disabled:opacity-40"
                      >
                        + {PROPS[id].label}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {round.mode === "method" && (
              <div className="mt-3">
                <p className="mb-1 text-[10px] tracking-wide text-ink-soft uppercase">
                  Methods (things pets can do)
                </p>
                <div className="grid gap-1.5" role="group" aria-label="Method palette">
                  {(Object.keys(METHODS) as MethodId[]).map((id) => {
                    const on = methods.includes(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={on}
                        disabled={!editable}
                        onClick={() => toggleMethod(id)}
                        className={`rounded-xl border px-3 py-2 text-left text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${
                          on
                            ? "border-copper bg-copper/15 text-ink"
                            : "border-line text-ink hover:border-copper"
                        }`}
                      >
                        <strong className="text-copper">{on ? "✓ " : "+ "}{METHODS[id].label}()</strong>
                        <span className="block text-xs text-ink-soft">
                          {METHODS[id].description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          <section
            aria-label="Pets"
            className="rounded-2xl border border-signal/40 bg-paper p-4"
          >
            <h3 className="font-display text-lg text-signal">🐾 Pets (objects)</h3>
            <p className="mb-3 text-xs text-ink-soft">Each one is built from the blueprint</p>

            <ul className="grid gap-2">
              {objects.length === 0 && (
                <li className="text-sm text-ink-soft">
                  {round.mode === "build"
                    ? "No pets yet. Tap \"Make a pet\"."
                    : "No pets yet. The blueprint comes first!"}
                </li>
              )}
              {objects.map((pet, index) => (
                <li
                  key={index}
                  className="rounded-xl border border-line bg-paper-raised/60 p-3 text-sm"
                >
                  {round.mode === "build" ? (
                    <div className="grid gap-2 sm:grid-cols-3">
                      {(["name", "species", "color"] as const).map((key) => (
                        <label key={key} className="grid gap-0.5 text-xs text-ink-soft">
                          {PROPS[key].label}
                          <select
                            value={pet[key]}
                            disabled={!editable}
                            onChange={(event) => editPet(index, key, event.target.value)}
                            className="rounded-lg border border-line bg-void px-2 py-1.5 text-sm text-ink"
                          >
                            <option value="">Choose…</option>
                            {PROPS[key].options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
                      {blueprint.map((id) => (
                        <div key={id} className="contents">
                          <dt className="text-xs text-ink-soft">{PROPS[id].label}</dt>
                          <dd
                            className={
                              id === "vaccinated" ? "font-medium text-signal" : "text-ink"
                            }
                          >
                            {valueOf(pet, id)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {showGreetings && (
                    <p className="mt-2 rounded-lg bg-signal/15 px-3 py-1.5 text-signal">
                      💬 {greeting(pet)}
                    </p>
                  )}
                </li>
              ))}
            </ul>

            {round.mode === "build" && (
              <Button
                variant="secondary"
                className="mt-3"
                disabled={!editable || made.length >= round.requests.length}
                onClick={makePet}
              >
                Make a pet
              </Button>
            )}
          </section>
        </div>

        <div aria-live="polite">
          {feedback && (
            <UnicornSays tone={feedback.ok ? "happy" : "oops"}>
              {feedback.ok ? (
                <>
                  <strong className="text-signal">
                    {isLastRound ? "Blueprint complete! Level cleared." : "Nice work!"}
                  </strong>{" "}
                  <span className="text-ink-soft">{feedback.text}</span>
                </>
              ) : (
                feedback.text
              )}
            </UnicornSays>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!solved && (
            <>
              <Button onClick={check}>{checkLabel}</Button>
              <Button variant="ghost" onClick={() => setShowTutorial(true)}>
                How to play
              </Button>
            </>
          )}
          {solved && !isLastRound && <Button onClick={nextRound}>Next round</Button>}
        </div>
      </div>
    </>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { UnicornSays } from "@/components/guide/Unicorn";
import { useLevelStats } from "../LevelStats";

import { ObjectTutorial } from "./ObjectTutorial";
import { PetSprite } from "./PetSprite";
import {
  METHODS,
  PROPS,
  ROUNDS,
  buildCheck,
  describeDesign,
  describeWrongMethods,
  designCheck,
  greeting,
  petText,
  samePet,
  speak,
  type MethodId,
  type Pet,
  type PropId,
} from "./object-rules";

type Feedback = { ok: boolean; text: string } | null;

const EMPTY_PET: Pet = { name: "", species: "", color: "" };

// A built pet "is right" when it matches one of the pets mission asked for.
function matchesRequest(round: { requests: readonly Pet[] }, pet: Pet): boolean {
  return round.requests.some((request) => samePet(pet, request));
}

function valueOf(pet: Pet, id: PropId): string {
  if (id === "name" || id === "species" || id === "color") return pet[id] || "—";
  if (id === "breed") return pet.breed || "—";
  if (id === "coat") return pet.coat || "—";
  return PROPS[id].fixed ?? "—";
}

function classNameFor(pet: Pet): "Dog" | "Cat" {
  return pet.species === "dog" ? "Dog" : "Cat";
}

function extraKey(pet: Pet): "breed" | "coat" {
  return pet.breed !== undefined ? "breed" : "coat";
}

function methodLine(method: MethodId | undefined, pet: Pet): string {
  return method === "speak" ? speak(pet) : greeting(pet);
}

function ClassPetFields({
  pet,
  slot,
  editable,
  onChange,
}: {
  pet: Pet;
  slot: Pet | undefined;
  editable: boolean;
  onChange: (key: keyof Pet, value: string) => void;
}) {
  const blueprint = slot ? classNameFor(slot) : classNameFor(pet);
  const extra = slot ? extraKey(slot) : extraKey(pet);
  return (
    <div className="grid gap-2">
      <p className="text-base text-copper">
        {blueprint} blueprint
        <span className="text-ink-soft"> · inherits Pet</span>
      </p>
      <p className="text-base text-ink-soft">
        species <strong className="text-ink">{pet.species}</strong>
        <span> · from {blueprint}</span>
      </p>
      <div className="grid grid-cols-1 gap-2 min-[560px]:grid-cols-3">
        {(["name", "color", extra] as const).map((key) => (
          <label key={key} className="grid min-w-0 gap-1 text-base text-ink-soft">
            <span className="sr-only">{PROPS[key].label}</span>
            <select
              value={pet[key] ?? ""}
              disabled={!editable}
              onChange={(event) => onChange(key, event.target.value)}
              className="w-full min-w-0 rounded-xl border border-line bg-void px-2 py-2 text-lg text-ink"
            >
              <option value="">{PROPS[key].label}…</option>
              {PROPS[key].options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </div>
  );
}

export function BlueprintMechanic({ onCleared }: { onCleared?: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [added, setAdded] = useState<PropId[]>([]);
  const [made, setMade] = useState<Pet[]>([]);
  const [methods, setMethods] = useState<MethodId[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [solved, setSolved] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const closeTutorial = useCallback(() => setShowTutorial(false), []);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const round = ROUNDS[roundIndex];
  const isLastRound = roundIndex === ROUNDS.length - 1;
  const blueprint: PropId[] = [...round.baseProps, ...added];
  const objects: Pet[] = round.mode === "build" ? made : [...round.objects];
  const editable = !solved;

  function touch() {
    setFeedback(null);
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
    const request = round.requests[made.length];
    if (round.fromClass && request) {
      setMade((prev) => [
        ...prev,
        {
          name: "",
          species: request.species,
          color: "",
          ...(request.breed !== undefined ? { breed: "" } : {}),
          ...(request.coat !== undefined ? { coat: "" } : {}),
        },
      ]);
      return;
    }
    setMade((prev) => [...prev, { ...EMPTY_PET }]);
  }

  function editPet(index: number, key: keyof Pet, value: string) {
    if (!editable) return;
    touch();
    setMade((prev) => prev.map((pet, i) => (i === index ? { ...pet, [key]: value } : pet)));
  }

  const { mistake } = useLevelStats();

  function fail(text: string) {
    mistake();
    setFeedback({ ok: false, text });
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
      else fail(describeDesign(result.missing, result.extra, round.who));
      return;
    }

    if (round.mode === "build") {
      const result = buildCheck(round, made);
      if (result.ok) {
        win(round.lesson);
        return;
      }
      const need = round.requests.length - made.length;
      fail(
        need > 0
          ? `Let's make ${need} more ${need === 1 ? "pet" : "pets"}!`
          : `Hmm, no pet matches ${petText(result.unmatched[0])} yet.`,
      );
      return;
    }

    const wanted = round.method ?? "greet";
    const wrong = methods.filter((method) => method !== wanted);
    const hasWanted = methods.includes(wanted);
    if (!hasWanted && wrong.length === 0) {
      fail(`Add ${wanted}() so each pet can answer.`);
    } else if (!hasWanted) {
      fail(`${describeWrongMethods(wrong)} Add ${wanted}() instead.`);
    } else if (wrong.length > 0) {
      fail(describeWrongMethods(wrong));
    } else {
      win(round.lesson);
    }
  }

  function nextRound() {
    setRoundIndex(roundIndex + 1);
    setAdded([]);
    setMade([]);
    setMethods([]);
    setFeedback(null);
    setSolved(false);
  }

  const showLines = round.mode === "method" && solved;

  useEffect(() => {
    if (!feedback) return;
    feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [feedback]);
  const checkLabel =
    round.mode === "design"
      ? "Check"
      : round.mode === "build"
        ? "Check"
        : "Send message";

  return (
    <>
      {showTutorial && <ObjectTutorial onDone={closeTutorial} />}
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-lg font-semibold text-ink">
            Round {roundIndex + 1} of {ROUNDS.length}
          </p>
          <ol className="flex gap-2" aria-label="Round progress">
            {ROUNDS.map((r, i) => (
              <li
                key={r.title}
                className={`h-2.5 w-10 rounded-full ${
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

        <div>
          <p className="font-display text-2xl text-ink sm:text-3xl">{round.goal}</p>
        </div>

        {round.chain ? (
          <div className="grid gap-3 rounded-3xl border border-line bg-void p-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <div>
              <p className="text-sm tracking-wide text-ink-soft uppercase">Parent class</p>
              <p className="font-display text-2xl text-ink">{round.chain.parent}</p>
              <p className="text-lg text-ink-soft">{round.chain.parentProps}</p>
              <p className="mt-1 text-base text-ink-soft">Every child keeps these.</p>
            </div>
            <p className="text-center text-lg text-copper">passes these down</p>
            <div>
              <p className="text-sm tracking-wide text-copper uppercase">Child class</p>
              <p className="font-display text-2xl text-copper">{round.chain.child}</p>
              <p className="text-lg text-ink-soft">
                keeps all of {round.chain.parent}, and adds {round.chain.childAdds}
              </p>
              {round.chain.sibling ? (
                <p className="mt-1 text-base text-ink-soft">
                  {round.chain.sibling.name} already added {round.chain.sibling.adds}.{" "}
                  {round.chain.child} does not get that.
                </p>
              ) : (
                <p className="mt-1 text-base text-ink-soft">Nothing else gets copied in.</p>
              )}
            </div>
          </div>
        ) : null}

        <div className="rounded-3xl border border-line bg-void p-4 sm:p-5">
          <p className="mb-3 text-sm tracking-wide text-ink-soft uppercase">
            Wanted
          </p>
          {round.requests.length > 0 ? (
            <ul className="flex flex-wrap gap-2" aria-label="Pets requested">
              {round.requests.map((pet) => (
                <li key={pet.name}>
                  <Tag tone="copper" size="md" className="text-lg sm:text-xl">
                    🐾 {petText(pet)}
                  </Tag>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xl text-ink">Follow the blueprint below.</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:items-start">
          <section
            aria-label={
              round.fromClass
                ? "Pet, already inherited"
                : round.child
                  ? `${round.child} blueprint`
                  : "Pet blueprint"
            }
            className="shrink-0 rounded-2xl border-2 border-dashed border-copper/60 bg-paper p-4"
          >
            <h3 className={`font-display text-2xl text-copper ${round.parent || round.fromClass ? "" : "mb-4"}`}>
              📐{" "}
              {round.fromClass
                ? "Pet, already inherited"
                : round.child
                  ? `${round.child} blueprint`
                  : "Pet blueprint"}
            </h3>
            {round.fromClass ? (
              <p className="mt-1 mb-4 text-base text-ink-soft">
                Dog and Cat already keep these. Fill in each child on the right.
              </p>
            ) : round.parent ? (
              <p className="mt-1 mb-4 text-base text-ink-soft">
                These locked properties already come from{" "}
                <strong className="text-copper">{round.parent}</strong>. Leave them. Add only
                what is new.
              </p>
            ) : null}

            <p className="mb-2 text-sm tracking-wide text-ink-soft uppercase">
              Properties
            </p>
            <div className="flex flex-wrap gap-1.5">
              {blueprint.length === 0 && (
                <span className="text-lg text-ink-soft">Empty</span>
              )}
              {blueprint.map((id) => {
                if (round.baseProps.includes(id)) {
                  return (
                    <Tag key={id} size="md" className="py-2 text-xl">
                      {PROPS[id].label}
                      {round.parent ? (
                        <span className="text-ink-soft"> · from {round.parent}</span>
                      ) : null}
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
                    className="rounded-full border border-copper bg-copper/15 px-4 py-2 text-xl text-copper hover:bg-copper/25"
                  >
                    {PROPS[id].label} ✕
                  </button>
                );
              })}
            </div>

            {round.mode === "design" && (
              <div className="mt-3">
                <p className="mb-2 text-sm tracking-wide text-ink-soft uppercase">
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
                        className="rounded-full border border-dashed border-ink-soft/60 px-4 py-2 text-xl text-ink transition hover:border-copper hover:text-copper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper disabled:opacity-40"
                      >
                        + {PROPS[id].label}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {round.mode === "method" && (
              <div className="mt-3">
                <p className="mb-2 text-sm tracking-wide text-ink-soft uppercase">
                  Methods (messages every pet understands)
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
                        className={`rounded-2xl border px-4 py-3 text-left text-xl transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${
                          on
                            ? "border-copper bg-copper/15 text-ink"
                            : "border-line text-ink hover:border-copper"
                        }`}
                      >
                        <strong className="text-copper">{on ? "✓ " : "+ "}{METHODS[id].label}()</strong>
                        <span className="block text-base text-ink-soft">
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
            className="shrink-0 rounded-2xl border border-signal/40 bg-paper p-4"
          >
            <h3 className="mb-4 font-display text-2xl text-signal">🐾 Pets</h3>

            <ul className="grid gap-2">
              {objects.length === 0 && (
                <li className="text-lg text-ink-soft">
                  {round.mode === "build"
                    ? "No pets yet."
                    : "No pets yet."}
                </li>
              )}
              {objects.map((pet, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 rounded-2xl border border-line bg-paper-raised/60 p-3 text-xl"
                >
                  <div className="flex w-16 shrink-0 flex-col items-center gap-0.5">
                    {round.mode !== "build" || matchesRequest(round, pet) ? (
                      <PetSprite
                        species={pet.species}
                        color={pet.color}
                        size={64}
                        className="pet-pop"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-line text-3xl text-ink-soft/60"
                      >
                        ?
                      </span>
                    )}
                    {round.mode === "build" && matchesRequest(round, pet) && (
                      <span className="text-base font-semibold text-signal">✓ {pet.name}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                  {round.mode === "build" ? (
                    round.fromClass ? (
                      <ClassPetFields
                        pet={pet}
                        slot={round.requests[index]}
                        editable={editable}
                        onChange={(key, value) => editPet(index, key, value)}
                      />
                    ) : (
                    <div className="grid grid-cols-1 gap-2 min-[560px]:grid-cols-3">
                      {(["name", "species", "color"] as const).map((key) => (
                        <label key={key} className="grid min-w-0 gap-1 text-base text-ink-soft">
                          <span className="sr-only">{PROPS[key].label}</span>
                          <select
                            value={pet[key]}
                            disabled={!editable}
                            onChange={(event) => editPet(index, key, event.target.value)}
                            className="w-full min-w-0 rounded-xl border border-line bg-void px-2 py-2 text-lg text-ink"
                          >
                            <option value="">{PROPS[key].label}…</option>
                            {PROPS[key].options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </label>
                      ))}
                    </div>
                    )
                  ) : (
                    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
                      {blueprint.map((id) => (
                        <div key={id} className="contents">
                          <dt className="text-base text-ink-soft">{PROPS[id].label}</dt>
                          <dd
                            className={
                              round.baseProps.includes(id) ? "text-ink" : "font-medium text-signal"
                            }
                          >
                            {valueOf(pet, id)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {showLines && (
                    <p className="mt-2 rounded-xl bg-signal/15 px-4 py-2 text-xl text-signal">
                      💬 {methodLine(round.method, pet)}
                    </p>
                  )}
                  </div>
                </li>
              ))}
            </ul>

            {round.mode === "build" && made.length < round.requests.length && (
              <Button
                variant="secondary"
                className="mt-4 px-6 py-3 text-lg"
                disabled={!editable || made.length >= round.requests.length}
                onClick={makePet}
              >
                {round.fromClass && round.requests[made.length]
                  ? `Make a ${classNameFor(round.requests[made.length]).toLowerCase()}`
                  : "Make a pet"}
              </Button>
            )}
          </section>
        </div>

        <div ref={feedbackRef} aria-live="polite">
          {feedback && (
            <UnicornSays big tone={feedback.ok ? "happy" : "oops"}>
              {feedback.ok ? (
                <>
                  <strong className="text-signal">
                    {isLastRound ? "Level cleared!" : "Nice work!"}
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
              <Button className="px-10 py-3.5 text-xl" onClick={check}>
                {checkLabel}
              </Button>
              <Button
                variant="ghost"
                className="px-4 py-3 text-lg"
                onClick={() => setShowTutorial(true)}
              >
                Help
              </Button>
            </>
          )}
          {solved && !isLastRound && (
            <Button className="px-10 py-3.5 text-xl" onClick={nextRound}>
              Next round
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

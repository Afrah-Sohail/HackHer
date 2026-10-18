export type PropId =
  | "name"
  | "species"
  | "color"
  | "breed"
  | "coat"
  | "wheels"
  | "wings";

export const PROPS: Record<
  PropId,
  { label: string; options?: readonly string[]; fixed?: string }
> = {
  name: { label: "name", options: ["Mochi", "Bailey", "Nova", "Kiki"] },
  species: { label: "species", options: ["cat", "dog", "bunny"] },
  color: { label: "color", options: ["orange", "brown", "black", "white"] },
  breed: { label: "breed", options: ["husky", "poodle", "mutt"] },
  coat: { label: "coat", options: ["tabby", "solid", "spotted"] },
  wheels: { label: "wheels", fixed: "0" },
  wings: { label: "wings", fixed: "no" },
};

export type MethodId = "speak" | "greet" | "fly" | "recharge";

export const METHODS: Record<MethodId, { label: string; description: string }> = {
  speak: { label: "speak", description: "Answer in its own way: meow, woof or squeak" },
  greet: { label: "greet", description: "Say hello using its own name and species" },
  fly: { label: "fly", description: "Flap its wings and take off" },
  recharge: { label: "recharge", description: "Charge its battery" },
};

export type Pet = {
  name: string;
  species: string;
  color: string;
  breed?: string;
  coat?: string;
};

export function petText(pet: Pet): string {
  return [pet.name, pet.species, pet.color, pet.breed, pet.coat].filter(Boolean).join(" · ");
}

export function samePet(pet: Pet, request: Pet): boolean {
  return (
    pet.name === request.name &&
    pet.species === request.species &&
    pet.color === request.color &&
    (request.breed === undefined || pet.breed === request.breed) &&
    (request.coat === undefined || pet.coat === request.coat)
  );
}

export function greeting(pet: Pet): string {
  return `Hi, I'm ${pet.name} the ${pet.species}!`;
}

export function speak(pet: Pet): string {
  const sound = pet.species === "cat" ? "Meow!" : pet.species === "dog" ? "Woof!" : "Squeak!";
  return `${pet.name} says ${sound}`;
}

export type Mode = "design" | "build" | "method";

export type Round = {
  title: string;
  story: string;
  goal: string;
  mode: Mode;
  /** Properties the blueprint starts with (locked). */
  baseProps: readonly PropId[];
  /** Design rounds: the exact set the blueprint must end up with. */
  required: readonly PropId[];
  /** Design rounds: properties the player can add. */
  palette: readonly PropId[];
  /** Design rounds that build a subclass. Locked properties come from this class. */
  parent?: string;
  /** Name of the class being designed, when it isn't Pet. */
  child?: string;
  /** Method rounds: the one method the class should answer. */
  method?: MethodId;
  /** Who the feedback is about, so the hint can say "Dogs" or "Cats". */
  who?: string;
  /** Shown above the puzzle so a child class is easy to see. */
  chain?: {
    parent: string;
    parentProps: string;
    child: string;
    childAdds: string;
    sibling?: { name: string; adds: string };
  };
  /**
   * Both child classes, side by side. Pets already exist.
   * A finished child already added its own property.
   */
  children?: readonly {
    name: string;
    adds: PropId;
    done: boolean;
    pets: readonly Pet[];
  }[];
  /** Pets mission control asks for. */
  requests: readonly Pet[];
  /** Pets that already exist at the start of the round. */
  objects: readonly Pet[];
  lesson: string;
};

const MOCHI: Pet = { name: "Mochi", species: "cat", color: "orange" };
const BAILEY: Pet = { name: "Bailey", species: "dog", color: "brown" };
const KIKI: Pet = { name: "Kiki", species: "dog", color: "white" };
const BAILEY_HUSKY: Pet = { ...BAILEY, breed: "husky" };
const KIKI_POODLE: Pet = { ...KIKI, breed: "poodle" };
const MOCHI_TABBY: Pet = { ...MOCHI, coat: "tabby" };

export const ROUNDS: readonly Round[] = [
  {
    title: "Draw the blueprint",
    story: "A class is a blueprint shared by every object.",
    goal: "Add only the properties every pet has. Leave off anything that isn't.",
    mode: "design",
    baseProps: [],
    required: ["name", "species", "color"],
    palette: ["name", "species", "color", "wheels", "wings"],
    who: "Pets",
    requests: [MOCHI, BAILEY, KIKI],
    objects: [],
    lesson: "A class lists the properties every object gets. Not every idea belongs on it.",
  },
  {
    title: "Build the pets",
    story: "Each pet is an object, one instance of the class.",
    goal: "Make all 3 pets. Watch out: two of them are dogs.",
    mode: "build",
    baseProps: ["name", "species", "color"],
    required: [],
    palette: [],
    requests: [MOCHI, BAILEY, KIKI],
    objects: [],
    lesson: "Bailey and Kiki are both dogs, and each one is still its own object.",
  },
  {
    title: "Send a message",
    story: "A method is a message the whole class understands.",
    goal: "Add speak(), and leave off anything a pet can't do.",
    mode: "method",
    method: "speak",
    baseProps: ["name", "species", "color"],
    required: [],
    palette: [],
    requests: [MOCHI, BAILEY, KIKI],
    objects: [MOCHI, BAILEY, KIKI],
    lesson: "speak() is one method. Each object answers in its own way. That's polymorphism.",
  },
  {
    title: "Dog is a kind of Pet",
    story: "A child class starts from a class that already exists.",
    goal: "Dog keeps name, species, and color from Pet. Don't copy them. Add the one new thing only a dog has.",
    mode: "design",
    parent: "Pet",
    child: "Dog",
    who: "Dogs",
    baseProps: ["name", "species", "color"],
    required: ["name", "species", "color", "breed"],
    palette: ["breed", "wheels", "wings"],
    chain: {
      parent: "Pet",
      parentProps: "name · species · color",
      child: "Dog",
      childAdds: "breed",
    },
    requests: [BAILEY_HUSKY, KIKI_POODLE],
    objects: [BAILEY_HUSKY, KIKI_POODLE],
    lesson: "That's inheritance. Dog is a Pet, plus breed. The old properties come along for free.",
  },
  {
    title: "Two children of Pet",
    story: "Dog and Cat are both child classes. The pets you already made stay as they are.",
    goal: "Dog already added breed. Give Cat the one new thing only a cat has. Don't copy breed onto Cat.",
    mode: "design",
    parent: "Pet",
    child: "Cat",
    who: "Cats",
    baseProps: ["name", "species", "color"],
    required: ["name", "species", "color", "coat"],
    palette: ["coat", "breed", "wheels", "wings"],
    children: [
      { name: "Dog", adds: "breed", done: true, pets: [BAILEY_HUSKY, KIKI_POODLE] },
      { name: "Cat", adds: "coat", done: false, pets: [MOCHI_TABBY] },
    ],
    requests: [],
    objects: [],
    lesson:
      "Dog and Cat are both children of Pet. They keep the parent's properties, and each child adds its own.",
  },
];

export function designCheck(
  round: Round,
  props: readonly PropId[],
): { ok: boolean; missing: PropId[]; extra: PropId[] } {
  const missing = round.required.filter((id) => !props.includes(id));
  const extra = props.filter((id) => !round.required.includes(id));
  return { ok: missing.length === 0 && extra.length === 0, missing, extra };
}

function quoteList(labels: readonly string[]): string {
  const quoted = labels.map((label) => `"${label}"`);
  if (quoted.length <= 1) return quoted.join("");
  return `${quoted.slice(0, -1).join(", ")} and ${quoted[quoted.length - 1]}`;
}

/** Say everything that is off, not just the first thing. */
export function describeDesign(
  missing: readonly PropId[],
  extra: readonly PropId[],
  who = "Pets",
): string {
  const parts: string[] = [];
  if (missing.length > 0) {
    parts.push(`${who} will need ${quoteList(missing.map((id) => PROPS[id].label))} too!`);
  }
  if (extra.length > 0) {
    parts.push(
      `${who} don't need ${quoteList(extra.map((id) => PROPS[id].label))}, so let's take ${extra.length === 1 ? "it" : "them"} out.`,
    );
  }
  return parts.join(" ");
}

export function describeWrongMethods(wrong: readonly MethodId[]): string {
  return `Pets don't need ${quoteList(wrong.map((id) => METHODS[id].label))}, so let's take ${wrong.length === 1 ? "it" : "them"} off.`;
}

export function buildCheck(
  round: Round,
  objects: readonly Pet[],
): { ok: boolean; unmatched: Pet[] } {
  const pool = [...objects];
  const unmatched: Pet[] = [];
  for (const request of round.requests) {
    const index = pool.findIndex((pet) => samePet(pet, request));
    if (index === -1) unmatched.push(request);
    else pool.splice(index, 1);
  }
  return { ok: unmatched.length === 0, unmatched };
}

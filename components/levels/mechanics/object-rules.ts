export type PropId =
  | "name"
  | "species"
  | "color"
  | "vaccinated"
  | "wheels"
  | "wings";

export const PROPS: Record<
  PropId,
  { label: string; options?: readonly string[]; fixed?: string }
> = {
  name: { label: "name", options: ["Mochi", "Pixel", "Nova", "Biscuit"] },
  species: { label: "species", options: ["cat", "dog", "bunny"] },
  color: { label: "color", options: ["orange", "brown", "black", "white"] },
  vaccinated: { label: "vaccinated", fixed: "yes" },
  wheels: { label: "wheels", fixed: "0" },
  wings: { label: "wings", fixed: "no" },
};

export type MethodId = "greet" | "fly" | "recharge";

export const METHODS: Record<MethodId, { label: string; description: string }> = {
  greet: { label: "greet", description: "Say hello using its own name and species" },
  fly: { label: "fly", description: "Flap its wings and take off" },
  recharge: { label: "recharge", description: "Charge its battery" },
};

export type Pet = { name: string; species: string; color: string };

export function petText(pet: Pet): string {
  return `${pet.name} · ${pet.species} · ${pet.color}`;
}

export function greeting(pet: Pet): string {
  return `Hi, I'm ${pet.name} the ${pet.species}!`;
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
  /** Pets mission control asks for. */
  requests: readonly Pet[];
  /** Pets that already exist at the start of the round. */
  objects: readonly Pet[];
  lesson: string;
};

const MOCHI: Pet = { name: "Mochi", species: "cat", color: "orange" };
const PIXEL: Pet = { name: "Pixel", species: "dog", color: "brown" };
const NOVA: Pet = { name: "Nova", species: "cat", color: "black" };
const BISCUIT: Pet = { name: "Biscuit", species: "bunny", color: "white" };

export const ROUNDS: readonly Round[] = [
  {
    title: "Draw the blueprint",
    story:
      "A class is a blueprint.",
    goal: "Add what every pet needs. Nothing extra.",
    mode: "design",
    baseProps: [],
    required: ["name", "species", "color"],
    palette: ["name", "species", "color", "wheels", "wings"],
    requests: [MOCHI, PIXEL, NOVA],
    objects: [],
    lesson:
      "A blueprint lists what every object has.",
  },
  {
    title: "Build the pets",
    story:
      "Each pet is an object built from the blueprint.",
    goal: "Make 3 pets that match the list.",
    mode: "build",
    baseProps: ["name", "species", "color"],
    required: [],
    palette: [],
    requests: [MOCHI, PIXEL, NOVA],
    objects: [],
    lesson:
      "Same blueprint, different values.",
  },
  {
    title: "Teach them to talk",
    story:
      "A method is something every pet can do.",
    goal: "Teach the pets to say hello.",
    mode: "method",
    baseProps: ["name", "species", "color"],
    required: [],
    palette: [],
    requests: [MOCHI, PIXEL, NOVA],
    objects: [MOCHI, PIXEL, NOVA],
    lesson:
      "Same method, but each pet uses its own values.",
  },
  {
    title: "One change, every pet",
    story:
      "Vet rule: every pet must show vaccinated.",
    goal: "Make all 4 pets show it with one change.",
    mode: "design",
    baseProps: ["name", "species", "color"],
    required: ["name", "species", "color", "vaccinated"],
    palette: ["vaccinated", "wheels", "wings"],
    requests: [],
    objects: [MOCHI, PIXEL, NOVA, BISCUIT],
    lesson:
      "Change the blueprint once and every object updates.",
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

export function describeDesign(missing: readonly PropId[], extra: readonly PropId[]): string {
  if (missing.length > 0) {
    return `Pets need "${PROPS[missing[0]].label}".`;
  }
  return `Pets don't need "${PROPS[extra[0]].label}". Remove it.`;
}

export function buildCheck(
  round: Round,
  objects: readonly Pet[],
): { ok: boolean; unmatched: Pet[] } {
  const pool = [...objects];
  const unmatched: Pet[] = [];
  for (const request of round.requests) {
    const index = pool.findIndex(
      (pet) =>
        pet.name === request.name &&
        pet.species === request.species &&
        pet.color === request.color,
    );
    if (index === -1) unmatched.push(request);
    else pool.splice(index, 1);
  }
  return { ok: unmatched.length === 0, unmatched };
}

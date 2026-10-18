// The story that wraps the six games. You are an alien trying to fly home out of
// the solar system, but your rocket keeps breaking down. On every planet you
// meet one of the women, learn her idea, and use it to fix the rocket.
// Sparkles is your space unicorn friend: great moral support, no hands.

export type PlanetId = "mercury" | "venus" | "mars" | "jupiter" | "saturn" | "uranus";

export type Speaker = "narrator" | "you" | "sparkles" | "woman";

export type Beat = { speaker: Speaker; text: string };

export type PlanetStory = {
  planet: PlanetId;
  name: string;
  /** Short line shown as what is wrong with the rocket. */
  problem: string;
  /** The arrival scene, shown before the level's tutorial. */
  arrival: Beat[];
  /** Shown when the level is solved. */
  fixed: string;
  /** What happens when the rocket breaks down on the way to the next planet. */
  breakdown: string;
};

// Index matches the level index (0 = Mercury ... 5 = Uranus).
export const JOURNEY: readonly PlanetStory[] = [
  {
    planet: "mercury",
    name: "Mercury",
    problem: "The autopilot repeats tiny steps one by one, and froze.",
    arrival: [
      { speaker: "narrator", text: "🔥 Your rocket sputters and crash-lands on Mercury." },
      { speaker: "you", text: "The Sun scan was soooo cool! But KABOOM, we're crashing on Mercury, hold my antennae!" },
      { speaker: "you", text: "Okay, let me poke around... aha! The autopilot does everything one teeny step at a time, and now it's frozen." },
      {
        speaker: "woman",
        text: "Welcome to Mercury! I'm Ada Lovelace. I've been thinking about machines like yours for a long time. A machine follows a list of steps, and a loop repeats them for you, just like a loom. Let me show you how to program your autopilot.",
      },
      { speaker: "sparkles", text: "A loom! I'm picturing a very fancy sweater for a unicorn. Okay, focus: you've got this!" },
    ],
    fixed: "The autopilot hums back to life!",
    breakdown: "The engine coughs... and sputters out again!",
  },
  {
    planet: "venus",
    name: "Venus",
    problem: "Storms are jamming the radio, so you can't call home.",
    arrival: [
      { speaker: "narrator", text: "☁️ The rocket coughs and drops through Venus's thick clouds." },
      { speaker: "you", text: "Bleep bloop, my radio is just screaming static! Mom's gonna ground me if I can't call home!" },
      {
        speaker: "woman",
        text: "Welcome to Venus! I'm Hedy Lamarr. Those storms are a nuisance, but this is a problem I know well. If a jammer can't guess your channel, it can't block you. Let's hop between channels and get your signal through.",
      },
      { speaker: "sparkles", text: "Hopping? I'm a professional! Tiny hops, big hops, spinning hops. Let's hop that signal home!" },
    ],
    fixed: "The radio crackles: signal clear!",
    breakdown: "The radio sparks and the fuel line pops!",
  },
  {
    planet: "mars",
    name: "Mars",
    problem: "The ignition lock is scrambled and won't open.",
    arrival: [
      { speaker: "narrator", text: "🔴 Smoke trails behind the rocket as it thumps down on Mars." },
      { speaker: "you", text: "Yikes, the ignition lock is all scrambled. I tried the code '1234' and it laughed at me." },
      {
        speaker: "woman",
        text: "Welcome to Mars! I'm Joan Clarke. A scrambled lock is a puzzle I enjoy. We cracked secret codes with careful logic: AND, OR and NOT. Let's wire up the gates and see what opens it.",
      },
      { speaker: "sparkles", text: "AND, OR, NOT... that's exactly how I pick between snacks! Logic time, let's gooo!" },
    ],
    fixed: "Click! The ignition lock opens.",
    breakdown: "A thruster flies off and the rocket spins!",
  },
  {
    planet: "jupiter",
    name: "Jupiter",
    problem: "The flight computer lost all its numbers! I asked it which way is home and it just said 'banana'.",
    arrival: [
      { speaker: "narrator", text: "🌪️ Your rocket lurches down into Jupiter's stormy clouds." },
      { speaker: "you", text: "The flight computer lost its numbers. Which way is home?" },
      {
        speaker: "woman",
        text: "Welcome to Jupiter! We're Katherine Johnson, Dorothy Vaughan and Mary Jackson. Numbers are our trade. A function is a rule that turns one number into another. Find the rule, and you'll find your way home.",
      },
      { speaker: "sparkles", text: "Three brilliant women AND a giant stormy planet? Best day ever. I'll sparkle at the numbers for luck!" },
    ],
    fixed: "The flight path lights up: course set!",
    breakdown: "The flight computer flickers and the engine dies!",
  },
  {
    planet: "saturn",
    name: "Saturn",
    problem: "Alarms everywhere: the computer is overloaded with jobs.",
    arrival: [
      { speaker: "narrator", text: "🪐 Sparks fly as the rocket limps in past Saturn's rings." },
      { speaker: "you", text: "Beep beep BEEP! Every alarm is going off and I think one of them is just my snack timer!" },
      {
        speaker: "woman",
        text: "Welcome to Saturn! I'm Margaret Hamilton. Alarms are never fun, but they're solvable. When memory runs short, run the most important jobs first. That's a priority queue.",
      },
      { speaker: "sparkles", text: "I'm your official alarm cheerleader! Critical jobs FIRST, snack jobs LAST! Give me an S! Give me an... okay, you do the work!" },
    ],
    fixed: "The alarms go quiet: the right jobs are running.",
    breakdown: "Every alarm blares at once and the rocket shudders!",
  },
  {
    planet: "uranus",
    name: "Uranus",
    problem: "The repair bots are a mess. Nobody knows who does what.",
    arrival: [
      { speaker: "narrator", text: "🧊 The rocket tumbles onto icy, sideways Uranus." },
      { speaker: "you", text: "My repair bots are in a tangle. One is vacuuming the ceiling and nobody knows who's supposed to fix the engine!" },
      {
        speaker: "woman",
        text: "Welcome to Uranus! I'm Adele Goldberg. Your bots are missing a design, not a repair. A class is a blueprint, and objects are built from it. Give them a blueprint and they'll work together.",
      },
      { speaker: "sparkles", text: "Robot blueprints! I'd design a bot that only gives hugs. Okay okay, engine first, hugs second." },
    ],
    fixed: "The bots whir to life: the rocket is ready!",
    breakdown: "",
  },
];

export const HOME_NAME = "Home";

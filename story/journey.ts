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
      { speaker: "you", text: "Not again! The autopilot keeps repeating tiny steps, one by one, and now it's frozen." },
      {
        speaker: "woman",
        text: "I'm Ada Lovelace. A machine can follow a list of steps, and a loop repeats them for you. Let me show you how to program the autopilot like a loom.",
      },
      { speaker: "sparkles", text: "Ooh, I love a good loom! You've got this, I'm right here." },
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
      { speaker: "you", text: "Storms are jamming my radio. I can't even call home!" },
      {
        speaker: "woman",
        text: "I'm Hedy Lamarr. If a jammer can't guess your channel, it can't block you. Hop between channels and get the signal through.",
      },
      { speaker: "sparkles", text: "Hopping is my specialty! Let's hop that signal through." },
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
      { speaker: "you", text: "The ignition lock is scrambled. It won't open without the right code." },
      {
        speaker: "woman",
        text: "I'm Joan Clarke. We cracked secret codes with strict logic: AND, OR and NOT. Wire up the gates and the lock will open.",
      },
      { speaker: "sparkles", text: "Logic puzzles are the best. You've totally got this!" },
    ],
    fixed: "Click! The ignition lock opens.",
    breakdown: "A thruster flies off and the rocket spins!",
  },
  {
    planet: "jupiter",
    name: "Jupiter",
    problem: "The flight computer lost its numbers. Which way is home?",
    arrival: [
      { speaker: "narrator", text: "🌪️ Your rocket lurches down into Jupiter's stormy clouds." },
      { speaker: "you", text: "The flight computer lost its numbers. Which way is home?" },
      {
        speaker: "woman",
        text: "We're Katherine Johnson, Dorothy Vaughan and Mary Jackson. A function is a rule that turns one number into another. Find the rule and you'll find your flight path.",
      },
      { speaker: "sparkles", text: "Three brilliant women! I'll stand here looking sparkly." },
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
      { speaker: "you", text: "Alarms everywhere! The computer is overloaded with jobs." },
      {
        speaker: "woman",
        text: "I'm Margaret Hamilton. When memory runs short, run the most important jobs first. That's a priority queue.",
      },
      { speaker: "sparkles", text: "I can't press buttons, but I can shout 'critical jobs first!' very loudly." },
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
      { speaker: "you", text: "My repair bots are a mess, and nobody knows what each one is supposed to do!" },
      {
        speaker: "woman",
        text: "I'm Adele Goldberg. A class is a blueprint, and objects are built from it. Give your bots a blueprint and they'll work together.",
      },
      { speaker: "sparkles", text: "I love the bots! Moral support only, sorry." },
    ],
    fixed: "The bots whir to life: the rocket is ready!",
    breakdown: "",
  },
];

export const HOME_NAME = "Home";

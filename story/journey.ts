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
      { speaker: "you", text: "Ouch, my bum! Not again! The autopilot does everything one teeny step at a time, and now it's frozen. Even my antennae are tingling!" },
      {
        speaker: "woman",
        text: "Oh, you poor thing, welcome to Mercury! I'm Ada Lovelace. Let's get you fixed up. A machine follows a list of steps, and a loop repeats them for you, just like a loom. Come, I'll show you how to program the autopilot.",
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
      { speaker: "you", text: "Bleep bloop, my radio is just screaming static! Mom's gonna ground me if I can't call home!" },
      {
        speaker: "woman",
        text: "Welcome to Venus, dear traveler! I'm Hedy Lamarr. Don't worry about the storms. If a jammer can't guess your channel, it can't block you, so we'll hop between channels together and get your signal through.",
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
      { speaker: "you", text: "Yikes, the ignition lock is all scrambled. I tried the code '1234' and it laughed at me." },
      {
        speaker: "woman",
        text: "Hello there, welcome to Mars! I'm Joan Clarke. Tea's on, and the lock is no trouble at all. We cracked secret codes with a little logic: AND, OR and NOT. Let's wire up the gates together.",
      },
      { speaker: "sparkles", text: "Logic puzzles are the best. You've totally got this!" },
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
        text: "Welcome to Jupiter, friend! We're Katherine Johnson, Dorothy Vaughan and Mary Jackson, so glad you dropped in. A function is a rule that turns one number into another. Let's find the rule, and we'll find your way home.",
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
      { speaker: "you", text: "Beep beep BEEP! Every alarm is going off and I think one of them is just my snack timer!" },
      {
        speaker: "woman",
        text: "Welcome to Saturn, sweetheart! I'm Margaret Hamilton. Those alarms sound scary, but we can sort it out. When memory runs short, we run the most important jobs first. That's a priority queue.",
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
      { speaker: "you", text: "My repair bots are in a tangle. One is vacuuming the ceiling and nobody knows who's supposed to fix the engine!" },
      {
        speaker: "woman",
        text: "Welcome to Uranus, I'm so happy you're here! I'm Adele Goldberg. Those bots just need a little guidance. A class is a blueprint, and objects are built from it. Give them a blueprint and they'll work together.",
      },
      { speaker: "sparkles", text: "I love the bots! Moral support only, sorry." },
    ],
    fixed: "The bots whir to life: the rocket is ready!",
    breakdown: "",
  },
];

export const HOME_NAME = "Home";

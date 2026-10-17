import type { LevelDefinition } from "./types";

export const LEVELS = [
  {
    index: 0,
    floor: 1,
    slug: "ada-lovelace",
    title: "Ada Lovelace & The Analytical Engine",
    pioneer: "Ada Lovelace",
    concept: "Sequences & Loops",
    narrative:
      "Ada Lovelace described how Babbage's Analytical Engine could follow a sequence of operations, and repeat a pattern the way a Jacquard loom repeats a weave.",
    blurb:
      "Did you know the world's first computer programmer lived in Victorian England? Ada Lovelace realized a machine could follow **sequences** and repeat steps in **loops**, just like a loom weaving a pattern. She even imagined computers making art and music, about a century before anyone built one. 👩‍💻✨",
    mechanicId: "loom",
    mechanicLabel: "Loom",
  },
  {
    index: 1,
    floor: 2,
    slug: "hedy-lamarr",
    title: "Hedy Lamarr & The Secret Wave Jumper",
    pioneer: "Hedy Lamarr",
    concept: "Frequency Hopping & Encryption",
    narrative:
      "Hedy Lamarr co-invented a scheme that hops a radio signal across frequencies so a transmission never stays on one channel long enough to be easily intercepted.",
    blurb:
      "Did you know this Hollywood star was also a secret inventor? During World War II, Hedy Lamarr co-invented **frequency hopping**, which bounces a radio signal between channels so enemies can't jam it. That same idea echoes in the **encryption** and wireless tech behind Wi-Fi and Bluetooth today. 📡✨",
    mechanicId: "waveform",
    mechanicLabel: "Radio signal",
  },
  {
    index: 2,
    floor: 3,
    slug: "joan-clarke",
    title: "Joan Clarke & The Bletchley Park Cipher Machine",
    pioneer: "Joan Clarke",
    concept: "Logic Gates (AND / OR / NOT)",
    narrative:
      "Joan Clarke was a cryptanalyst at Bletchley Park, where ciphers were broken by strict logical rules. This floor is the board those rules will be built on.",
    blurb:
      "Did you know a codebreaker helped crack Nazi messages at Bletchley Park? Joan Clarke used sharp **logic** to break Enigma ciphers. Computers still run on that kind of thinking: **AND, OR and NOT** gates that turn simple yes/no rules into big decisions. 🔐✨",
    mechanicId: "logic-grid",
    mechanicLabel: "Cipher board",
  },
  {
    index: 3,
    floor: 4,
    slug: "hidden-figures",
    title: "Hidden Figures (Johnson, Jackson, Vaughan)",
    pioneer: "Johnson, Jackson & Vaughan",
    concept: "Compilers, Aerodynamics, & Functions",
    narrative:
      "Dorothy Vaughan, Mary Jackson, and Katherine Johnson turned early compilers, wind-tunnel engineering, and trajectory functions into flight.",
    blurb:
      "Before computers took over, three women did the math that sent Americans into space. Dorothy Vaughan, Mary Jackson and Katherine Johnson worked on early **programming**, **aerodynamics** and **trajectory functions**, the calculations that made orbital flight possible. Every rocket launch since builds on their work. 🚀✨",
    mechanicId: "mission-desk",
    mechanicLabel: "Mission control",
  },
  {
    index: 4,
    floor: 5,
    slug: "margaret-hamilton",
    title: "Margaret Hamilton & Apollo 11 Alarm Priority",
    pioneer: "Margaret Hamilton",
    concept: "Priority Queues & Memory Management",
    narrative:
      "Margaret Hamilton's Apollo flight software had to rank alarms when memory ran short, keeping the landing computer on the work that mattered.",
    blurb:
      "Minutes before Apollo 11 landed, the computer started flashing alarms! Margaret Hamilton's software used **priority queues** to drop unimportant jobs and keep the landing on track, a smart kind of **memory management** under pressure. Your phone does the same trick today. 🚀🌕",
    mechanicId: "alarm-queue",
    mechanicLabel: "Alarm queue",
  },
  {
    index: 5,
    floor: 6,
    slug: "adele-goldberg",
    title: "Adele Goldberg & The Object Blueprint",
    pioneer: "Adele Goldberg",
    concept: "Object-Oriented Programming (Classes & Objects)",
    narrative:
      "Adele Goldberg helped shape Smalltalk, where a class is a blueprint and an object is a living instance of that blueprint.",
    blurb:
      "Did you know Adele Goldberg helped create **Smalltalk**, one of the first **object-oriented** languages? In it, a **class** is a blueprint and an **object** is a living copy built from it. Her team's ideas also shaped the windows and icons on your screen. 💻✨",
    mechanicId: "blueprint",
    mechanicLabel: "Blueprint",
  },
] as const satisfies readonly LevelDefinition[];

export function getLevel(index: number): LevelDefinition | undefined {
  return LEVELS.find((level) => level.index === index);
}

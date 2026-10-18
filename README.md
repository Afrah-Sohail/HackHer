# Lost in Computation

Lost in Computation is a cosmic puzzle game about women who shaped computing. You are an alien trying to fly home. The rocket keeps breaking down, and on each planet a real pioneer teaches one computer science idea you use to fix it.

Play it at [lostincomputation.design](https://www.lostincomputation.design).

## The journey

The home screen is the lobby. It shows the title, a short intro, the map from the Sun out past Uranus, and **Sparkles**, your space unicorn. **Start the journey** plays the opening: the rocket studies the Sun, the engine blows, and you limp down to Mercury. After that, the same button reads **Continue the journey** and drops you on the next planet that is still open.

The map is the level select. A planet stays locked until the one before it is cleared. The title in the header also returns you to the map.

Each planet has the same shape:

1. **Travel.** Between planets the rocket flies, breaks down, and drifts in. You can skip the flight. The first visit to a planet opens with a short conversation: you, the pioneer, and Sparkles.
2. **Tutorial.** A few cards explain the idea. Skip them, or open them again with **Help**.
3. **Rounds.** The puzzle is a handful of short rounds. You weave the loom, transmit the radio plan, place gates, launch the trajectory, run the queue, or press **Check**. A failed attempt stays on that round and counts as a slip. On the cipher board, a slip is dropping a gate on a slot with the wrong number of wires.
4. **About this level.** The header popover is a one-paragraph history of that pioneer's real work.
5. **Blast off.** When the last round is solved, the footer shows the points for this planet and a **Blast off** button. Level 6 says **Fly home** instead.

Clearing level 6 plays the flight home. The victory screen shows your total, which planets are fixed, **Back to the map**, and **Play again**. Play again starts a new run. Progress lives in the browser tab: a refresh starts over.

The header during a puzzle shows the planet, the pioneer, the concept, your total points, and how many of the six levels are cleared.

## Points

Every planet pays out once, the first time you clear it. Playing it again does not replace that score. The header total is the sum of those six scores.

The footer breaks a planet's score into parts before you blast off:

| Part | Points | How you earn it |
| --- | --- | --- |
| Clear | 100 | Finish the planet. Slips do not take this away. |
| Clean solve | up to 40 | Start at 40. Each wrong check takes 8 away, down to 0. Five slips spends the whole bonus. |
| Curious | 20 | Open **Ask Sparkles** on that planet. Once is enough. |
| Style | up to 40 | Extra credit from the puzzle itself. Only the loom awards this today. |

On Mercury, a round that can use a loop pays a **loop bonus** of 10 when the pattern matches and the card stays inside the chip budget. Three of the four loom rounds can pay it, so the style bonus there is at most 30.

A clean run that also opens Sparkles is 160 points on most planets, and 190 on Mercury if every loop bonus lands. The clean and curious bonuses are optional. A messy solve still banks the 100 for clearing.

## The six levels

| Level | Planet | Pioneer | Concept | Rounds |
| --- | --- | --- | --- | --- |
| 1 | Mercury | Ada Lovelace | Sequences & loops | 4 |
| 2 | Venus | Hedy Lamarr | Frequency hopping & encryption | 4 |
| 3 | Mars | Joan Clarke | Logic gates (AND, OR, NOT, XOR) | 6 |
| 4 | Jupiter | Katherine Johnson, Mary Jackson & Dorothy Vaughan | Compilers, aerodynamics & functions | 4 |
| 5 | Saturn | Margaret Hamilton | Priority queues & memory management | 5 |
| 6 | Uranus | Adele Goldberg | Classes, objects & inheritance | 5 |

**Mercury, the loom.** Ada's autopilot is stuck doing one tiny step at a time. You copy a woven pattern with thread chips. The first round is a plain sequence. Later rounds add a repeat block, which is a loop, and ask you to hit the pattern in fewer chips.

**Venus, the radio.** Storms are jamming the call home. You plan eight hops across six channels. The jammer starts parked on one channel, then remembers the last channel you used, then the last two, then the last three. A later round hides the live preview until you have a plan.

**Mars, the cipher board.** The ignition lock is a logic puzzle. You drop gates onto a board so the output lamp follows the rule: AND, OR, XOR, and NOT. A NOT on a gate's output turns it into NAND, NOR, or XNOR. The last round wires three gates together.

**Jupiter, mission control.** The flight computer lost its numbers. Each round hides a rule of the form `altitude = a × seconds + b`. You nudge `a` and `b` until your column matches the altitudes mission control already has.

**Saturn, the alarm queue.** Too many jobs, not enough memory. You reorder the queue. Critical jobs have to run, and later rounds add important ones. Each job takes a number of memory slots, and the computer only keeps what fits from the top. The last round also asks you to keep as much useful work as the remaining memory allows.

**Uranus, the blueprint.** The repair bots have no design. You build object-oriented programming in five steps, with the same pets carried forward:

1. Design a **Pet** class with name, species, and color. Wheels and wings do not belong on it.
2. Build three objects from that class: Mochi the orange cat, Bailey the brown dog, and Kiki the white dog.
3. Add a `speak()` method. The cat meows and the dogs woof. That is one method with a different answer from each object.
4. Make **Dog** a child of Pet. Name, species, and color stay locked, inherited from Pet. The new property is breed: Bailey is a husky and Kiki is a poodle.
5. Show **Cat** as the other child. The pets already exist, so you do not build them again. Dog already added breed. Cat adds coat, and Mochi the tabby keeps the cat you made earlier.

## Sparkles

Sparkles rides along on every puzzle. **Ask Sparkles** opens a panel about that level's pioneer. The overview is written into the game. **Life**, **work**, and **legacy** are written on the spot by Gemini (`gemini-3.1-flash-lite`) through `POST /api/guide`.

Those answers may only use the facts stored in `guide/facts.ts`, so she does not invent history. A reply is cached in the browser for the rest of the visit. Opening the panel is what pays the curious bonus, whether or not a later request succeeds.

The puzzles run with no API key. Sparkles' life, work, and legacy answers need `GEMINI_API_KEY`. The route reads it on the server. Leave the `NEXT_PUBLIC_` prefix off, or the key would ship to the browser.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint

## Stack

[Next.js](https://nextjs.org) 16 (App Router), React 19, TypeScript, Tailwind CSS, and ESLint. The game is one page. Welcome, the Sun opening, travel, play, and victory are client state in a reducer. No extra libraries beyond that stack.

## Run it locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Sparkles needs a Gemini API key in `.env.local` (this file stays on your machine):

```bash
GEMINI_API_KEY=your-key
```

On Vercel, add `GEMINI_API_KEY` as an environment variable for Production, then redeploy. Next.js reads the variable at build time.

## Credits

This project was made by Afrah Sohail, Emily New, and Valentina Sanchez-patout.

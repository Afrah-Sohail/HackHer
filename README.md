# HackHer

HackHer is a cosmic puzzle game about women who shaped computing. Six short levels each teach one computer science idea through a real pioneer's work: play the puzzle, read the story, and ask **Sparkles**, the unicorn guide, when you want more.

Play it at [lostincomputation.design](www.lostincomputation.design).

## How it plays

The home screen is the title, a short intro, and a **Start** button. Start opens level 1. Clearing a level unlocks the next one and adds to your score. The header shows the current level, the pioneer, the concept, your points, and how many levels you have cleared.

Each level has a few short rounds and a tutorial. Sparkles introduces the pioneer on the home screen and stays with you during play. On a level you can ask her about their **life**, **work**, or **legacy**. Those answers come from Gemini (`gemini-3.1-flash-lite`) through `/api/guide`, written from facts stored in the repo so she stays on the real history.

Finishing level 6 opens the victory screen with your score and the levels you cleared.

## The six levels

| Level | Pioneer | Concept | Puzzle |
| --- | --- | --- | --- |
| 1 | Ada Lovelace | Sequences & loops | Weave a pattern on a loom by placing threads and repeat blocks |
| 2 | Hedy Lamarr | Frequency hopping & encryption | Hop a radio signal across channels so a jammer cannot stay on it |
| 3 | Joan Clarke | Logic gates (AND, OR, NOT, XOR) | Wire a cipher board so the output lamp follows the rule |
| 4 | Katherine Johnson, Mary Jackson & Dorothy Vaughan | Compilers, aerodynamics & functions | Find the altitude rule mission control is using |
| 5 | Margaret Hamilton | Priority queues & memory management | Reorder the Apollo alarm queue so the jobs that matter fit in memory |
| 6 | Adele Goldberg | Classes & objects | Design a class blueprint, then build living objects from it |

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint

## Stack

[Next.js](https://nextjs.org) 16 (App Router), React 19, TypeScript, Tailwind CSS, and ESLint. The game is one page: welcome, play, and victory are client state. No extra libraries beyond that stack.

## Run it locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Sparkles needs a Gemini API key. Put it in `.env.local` (this file stays on your machine):

```bash
GEMINI_API_KEY=your-key
```

The puzzles run without a key. Sparkles answers only after `GEMINI_API_KEY` is set. The route reads the key on the server, so leave the `NEXT_PUBLIC_` prefix off.

On Vercel, add `GEMINI_API_KEY` as an environment variable for Production, then redeploy. Next.js reads the variable at build time.

## Credits

This project was made by Afrah Sohail, Emily New, and Valentina Sanchez-patout.

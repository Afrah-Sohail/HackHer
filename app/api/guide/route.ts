import { getLevel } from "@/level-manager/catalog";
import { GEMINI_MODEL, GUIDE_NAME, HINTS_ENABLED } from "@/guide/config";
import { FACTS } from "@/guide/facts";

type GuideMode = "learn" | "hint";
type LearnTopic = "life" | "work" | "legacy";

const TOPIC_BRIEF: Record<LearnTopic, string> = {
  life: "her life: where she came from, what she was like, and one surprising or inspiring moment from her story",
  work: "her work: what she actually built or figured out, explained simply with a fun comparison a teen would get",
  legacy: "her legacy: how her ideas show up in technology and everyday life today, and why she is remembered",
};

function isTopic(value: unknown): value is LearnTopic {
  return value === "life" || value === "work" || value === "legacy";
}

const SYSTEM_PROMPT =
  `You are ${GUIDE_NAME}, a friendly space unicorn who rides along with Blip the ` +
  "alien as he tries to fly his broken rocket home. On each planet Blip meets one of " +
  "the real women who shaped computing. You cannot fix anything yourself (no hands, " +
  "only hooves), so you cheer him on and tell players about the women. " +
  "Write for curious teenagers in a warm, playful voice. You may use the first " +
  `person as ${GUIDE_NAME}, but never invent facts about the women or about yourself. ` +
  "Be accurate; if you are unsure of a detail, leave it out rather than guess. " +
  "Plain text only: no headings, lists or links. The only formatting allowed is " +
  "wrapping the 3 or 4 most important words or short phrases in **double " +
  "asterisks** for bold, and up to 2 relevant emojis.";

function buildPrompt(
  mode: GuideMode,
  level: NonNullable<ReturnType<typeof getLevel>>,
  hintLevel: number,
  topic: LearnTopic,
): string {
  const context =
    `Level ${level.floor}: ${level.title}\n` +
    `Pioneer: ${level.pioneer}\n` +
    `Concept: ${level.concept}\n` +
    `Level story: ${level.narrative}`;

  if (mode === "learn") {
    const facts = FACTS[level.slug][topic].map((fact) => `- ${fact}`).join("\n");
    return (
      `${context}\n\nThe player already read this overview, so do not repeat it:\n` +
      `${level.blurb}\n\nVERIFIED FACTS (the only facts you may use):\n${facts}\n\n` +
      `Write about 60 words on ${TOPIC_BRIEF[topic]} (subject: ${level.pioneer}). ` +
      `Use ONLY the verified facts above; the level details at the top are for orientation only, so take no claims from them and make no claims about modern technology unless a fact says so. Do not add any name, date, number, ` +
      `quote or claim that is not in that list, and do not guess. Pick the 2 or 3 ` +
      `most interesting facts. Open with a hook, no greeting, no "Welcome". Keep it ` +
      `upbeat, a little playful, and easy to read for a 12 to 16 year old. ` +
      `Bold the key ideas with **double asterisks**.`
    );
  }

  const strength =
    hintLevel <= 1
      ? "a gentle nudge that only points the player toward the right way of thinking"
      : "a more specific hint that narrows the approach";
  return (
    `${context}\n\nThe player is stuck on this level's puzzle (mechanic: ` +
    `${level.mechanicLabel}). Give ${strength} in at most 2 sentences. ` +
    `Never give the full solution.`
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Guide is not configured." }, { status: 503 });
  }

  let body: {
    slug?: unknown;
    mode?: unknown;
    hintLevel?: unknown;
    topic?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const mode: GuideMode = body.mode === "hint" ? "hint" : "learn";
  if (mode === "hint" && !HINTS_ENABLED) {
    return Response.json({ error: "Hints are disabled." }, { status: 403 });
  }

  const level = [0, 1, 2, 3, 4, 5]
    .map((index) => getLevel(index))
    .find((candidate) => candidate?.slug === body.slug);
  if (!level) {
    return Response.json({ error: "Unknown level." }, { status: 400 });
  }

  if (mode === "learn" && (!isTopic(body.topic) || !FACTS[level.slug])) {
    return Response.json({ error: "Unknown topic." }, { status: 400 });
  }
  const topic: LearnTopic = isTopic(body.topic) ? body.topic : "life";
  const hintLevel = body.hintLevel === 2 ? 2 : 1;

  const callGemini = () =>
    fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [
            {
              role: "user",
              parts: [{ text: buildPrompt(mode, level, hintLevel, topic) }],
            },
          ],
          generationConfig: {
            temperature: mode === "learn" ? 0.4 : 0.7,
            maxOutputTokens: 2000,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      },
    );

  try {
    // Gemini occasionally stalls; one quick retry beats a failed panel.
    const response = await callGemini().catch(() => callGemini());

    if (!response.ok) {
      return Response.json({ error: "Guide is unavailable." }, { status: 502 });
    }

    const data = (await response.json()) as {
      candidates?: {
        finishReason?: string;
        content?: { parts?: { text?: string }[] };
      }[];
    };
    if (data.candidates?.[0]?.finishReason !== "STOP") {
      return Response.json({ error: "Guide was cut off." }, { status: 502 });
    }
    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();

    if (!text) {
      return Response.json({ error: "Guide had nothing to say." }, { status: 502 });
    }
    return Response.json({ text });
  } catch {
    return Response.json({ error: "Guide is unavailable." }, { status: 502 });
  }
}

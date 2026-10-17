import { getLevel } from "@/level-manager/catalog";
import { GEMINI_MODEL, HINTS_ENABLED } from "@/guide/config";

type GuideMode = "background" | "hint";

const SYSTEM_PROMPT =
  "You are the friendly in-game guide for HackHer, a puzzle game that teaches " +
  "computing concepts through women who shaped computer science. Write for " +
  "curious teenagers. Be accurate; if you are unsure of a detail, leave it out " +
  "rather than guess. Plain text only: no headings, lists or links. The only " +
  "formatting allowed is wrapping the 3 or 4 most important words or short " +
  "phrases in **double asterisks** for bold, and up to 2 relevant emojis.";

function buildPrompt(
  mode: GuideMode,
  level: NonNullable<ReturnType<typeof getLevel>>,
  hintLevel: number,
): string {
  const context =
    `Floor ${level.floor}: ${level.title}\n` +
    `Pioneer: ${level.pioneer}\n` +
    `Concept: ${level.concept}\n` +
    `Floor story: ${level.narrative}`;

  if (mode === "background") {
    return (
      `${context}\n\nWrite about 60 words, in at most 3 short sentences or one ` +
      `short paragraph, about ${level.pioneer}. Open with a surprising, ` +
      `attention-grabbing hook, then say in plain words what she did and why ` +
      `it still matters today (tie it to "${level.concept}"). Do not greet the ` +
      `player or say "Welcome". Keep it upbeat, a little playful, and easy to ` +
      `read for a 12 to 16 year old. Bold the key ideas with **double asterisks**.`
    );
  }

  const strength =
    hintLevel <= 1
      ? "a gentle nudge that only points the player toward the right way of thinking"
      : "a more specific hint that narrows the approach";
  return (
    `${context}\n\nThe player is stuck on this floor's puzzle (mechanic: ` +
    `${level.mechanicLabel}). Give ${strength} in at most 2 sentences. ` +
    `Never give the full solution.`
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Guide is not configured." }, { status: 503 });
  }

  let body: { slug?: unknown; mode?: unknown; hintLevel?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const mode: GuideMode = body.mode === "hint" ? "hint" : "background";
  if (mode === "hint" && !HINTS_ENABLED) {
    return Response.json({ error: "Hints are disabled." }, { status: 403 });
  }

  const level = [0, 1, 2, 3, 4, 5]
    .map((index) => getLevel(index))
    .find((candidate) => candidate?.slug === body.slug);
  if (!level) {
    return Response.json({ error: "Unknown level." }, { status: 400 });
  }

  const hintLevel = body.hintLevel === 2 ? 2 : 1;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [
            {
              role: "user",
              parts: [{ text: buildPrompt(mode, level, hintLevel) }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      },
    );

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

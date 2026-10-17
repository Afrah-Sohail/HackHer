"use client";

import { useState } from "react";
import { BodyPortal } from "@/components/ui/BodyPortal";
import { GUIDE_NAME, HINTS_ENABLED } from "@/guide/config";
import type { LevelDefinition } from "@/level-manager/types";
import { Button } from "@/components/ui/Button";
import { ConceptBadge } from "@/components/ui/ConceptBadge";
import { UnicornAvatar } from "./Unicorn";

type Topic = "life" | "work" | "legacy";
type View = "overview" | Topic | "hint";

function topicsFor(pioneer: string): { id: Topic; label: string }[] {
  const pronoun = /[&,]/.test(pioneer) ? "Their" : "Her";
  return [
    { id: "life", label: `🌱 ${pronoun} life` },
    { id: "work", label: `🛠️ ${pronoun} work` },
    { id: "legacy", label: `🌟 ${pronoun} legacy` },
  ];
}

// Renders **bold** spans as <strong> without ever injecting HTML.
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((part, i) =>
        i % 2 === 1 ? (
          <strong
            key={i}
            className="rounded bg-copper/10 px-1 font-semibold text-copper-deep"
          >
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

async function fetchGuide(
  slug: string,
  body: { mode: "learn"; topic: Topic } | { mode: "hint"; hintLevel: number },
): Promise<string> {
  const response = await fetch("/api/guide", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, ...body }),
  });
  if (!response.ok) throw new Error("guide request failed");
  const data = (await response.json()) as { text: string };
  return data.text;
}

function readCache(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeCache(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Storage unavailable; the guide still works, just uncached.
  }
}

export function GuideAgent({ level }: { level: LevelDefinition }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("overview");
  const [texts, setTexts] = useState<Partial<Record<View, string>>>({});
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [hintCount, setHintCount] = useState(0);

  // "Who was Hedy Lamarr?" / "Who were the Hidden Figures?" so the button is
  // clearly about the woman (or women), not a general help button.
  const isGroup = /[&,]/.test(level.pioneer);
  const question = isGroup
    ? `Who were the ${level.heading}?`
    : `Who was ${level.pioneer}?`;

  async function show(next: View) {
    setView(next);
    setFailed(false);
    if (next === "overview") return;

    if (next !== "hint") {
      if (texts[next]) return;
      const cacheKey = `guide:v4:${level.slug}:${next}`;
      const cached = readCache(cacheKey);
      if (cached) {
        setTexts((prev) => ({ ...prev, [next]: cached }));
        return;
      }
    }

    setLoading(true);
    try {
      const text =
        next === "hint"
          ? await fetchGuide(level.slug, {
              mode: "hint",
              hintLevel: hintCount >= 1 ? 2 : 1,
            })
          : await fetchGuide(level.slug, { mode: "learn", topic: next });
      if (next === "hint") {
        setHintCount((count) => count + 1);
      } else {
        writeCache(`guide:v4:${level.slug}:${next}`, text);
      }
      setTexts((prev) => ({ ...prev, [next]: text }));
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  const body = view === "overview" ? level.blurb : texts[view];

  return (
    <BodyPortal>
    <div className="fixed right-4 bottom-4 z-40 flex max-w-sm flex-col items-end gap-3">
      {open && (
        <section
          aria-label="Guide"
          className="max-h-[70vh] w-full overflow-y-auto rounded-2xl border-2 border-copper/30 bg-paper-raised p-4 shadow-xl"
        >
          <div className="mb-3 flex items-center gap-3">
            <UnicornAvatar size={52} />
            <div className="min-w-0">
              <p className="text-[11px] font-medium tracking-[0.14em] text-copper uppercase">
                {GUIDE_NAME} tells you about
              </p>
              <p className="font-display text-lg leading-tight text-ink">
                {level.pioneer}
              </p>
              <div className="mt-1">
                <ConceptBadge label={level.concept} />
              </div>
            </div>
          </div>

          {loading && (
            <div aria-label="Loading" className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-line" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-line" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-line" />
            </div>
          )}
          {!loading && failed && (
            <p className="text-sm leading-6 text-ink-soft">
              Couldn&apos;t reach the guide right now. Try again in a moment.
            </p>
          )}
          {!loading && !failed && body && (
            <p className="text-[15px] leading-7 whitespace-pre-line text-ink">
              <RichText text={body} />
            </p>
          )}

          <div className="mt-4 border-t border-line pt-3">
            <p className="mb-2 text-xs font-medium tracking-[0.14em] text-ink-soft uppercase">
              {view === "overview" ? "Learn more about…" : "Keep exploring"}
            </p>
            <div className="flex flex-wrap gap-2">
              {view !== "overview" && (
                <Button variant="ghost" onClick={() => void show("overview")}>
                  ← Overview
                </Button>
              )}
              {topicsFor(level.pioneer)
                .filter((topic) => topic.id !== view)
                .map((topic) => (
                <Button
                  key={topic.id}
                  variant="secondary"
                  disabled={loading}
                  onClick={() => void show(topic.id)}
                >
                  {topic.label}
                </Button>
              ))}
              {HINTS_ENABLED && (
                <Button
                  variant="secondary"
                  disabled={loading}
                  onClick={() => void show("hint")}
                >
                  💡 Hint
                </Button>
              )}
            </div>
          </div>
        </section>
      )}
      {open ? (
        <Button className="px-6 py-3 text-base" onClick={() => setOpen(false)} aria-expanded>
          Close
        </Button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          aria-label={`Ask ${GUIDE_NAME}: ${question}`}
          className="flex items-center gap-3 rounded-3xl bg-copper py-2 pr-5 pl-2 text-left text-paper-raised shadow-lg hover:bg-copper-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper"
        >
          <UnicornAvatar size={44} />
          <span className="leading-tight">
            <span className="block text-xs font-medium opacity-80">
              Ask {GUIDE_NAME}
            </span>
            <span className="block text-base font-semibold">{question}</span>
          </span>
        </button>
      )}
    </div>
    </BodyPortal>
  );
}

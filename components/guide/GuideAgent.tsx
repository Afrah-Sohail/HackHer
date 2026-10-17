"use client";

import { useState } from "react";
import { HINTS_ENABLED } from "@/guide/config";
import type { LevelDefinition } from "@/level-manager/types";
import { Button } from "@/components/ui/Button";
import { ConceptBadge } from "@/components/ui/ConceptBadge";

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

type Tab = "background" | "hint";

async function fetchGuide(
  slug: string,
  mode: Tab,
  hintLevel?: number,
): Promise<string> {
  const response = await fetch("/api/guide", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, mode, hintLevel }),
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
  const [tab, setTab] = useState<Tab>("background");
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [hintCount, setHintCount] = useState(0);

  async function load(nextTab: Tab, nextHintCount = hintCount) {
    setTab(nextTab);
    setFailed(false);

    if (nextTab === "background") {
      const cacheKey = `guide:background:v3:${level.slug}`;
      const cached = readCache(cacheKey);
      if (cached) {
        setText(cached);
        return;
      }
      setText(null);
      setLoading(true);
      try {
        const result = await fetchGuide(level.slug, "background");
        writeCache(cacheKey, result);
        setText(result);
      } catch {
        setFailed(true);
      } finally {
        setLoading(false);
      }
      return;
    }

    setText(null);
    setLoading(true);
    try {
      setText(await fetchGuide(level.slug, "hint", nextHintCount >= 1 ? 2 : 1));
      setHintCount(nextHintCount + 1);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && text === null && !loading) void load("background");
  }

  return (
    <div className="fixed right-4 bottom-4 z-40 flex max-w-sm flex-col items-end gap-3">
      {open && (
        <section
          aria-label="Guide"
          className="max-h-[55vh] w-full overflow-y-auto rounded-2xl border-2 border-copper/30 bg-paper-raised p-4 shadow-xl"
        >
          <div className="mb-3 flex items-center gap-3">
            <span
              aria-hidden
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-copper text-lg text-paper-raised"
            >
              ✦
            </span>
            <div className="min-w-0">
              <p className="font-display text-lg leading-tight text-ink">
                {level.pioneer}
              </p>
              <div className="mt-1">
                <ConceptBadge label={level.concept} />
              </div>
            </div>
          </div>
          {HINTS_ENABLED && (
            <div className="mb-3 flex gap-2">
              <Button
                variant={tab === "background" ? "primary" : "secondary"}
                onClick={() => void load("background")}
              >
                About her
              </Button>
              <Button
                variant={tab === "hint" ? "primary" : "secondary"}
                onClick={() => void load("hint")}
              >
                Hint
              </Button>
            </div>
          )}
          {loading && (
            <div aria-label="Loading" className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-line" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-line" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-line" />
            </div>
          )}
          {!loading && failed && (
            <p className="text-sm leading-6 text-ink-soft">
              The guide is unavailable right now. {level.narrative}
            </p>
          )}
          {!loading && !failed && text && (
            <p className="text-[15px] leading-7 whitespace-pre-line text-ink">
              <RichText text={text} />
            </p>
          )}
        </section>
      )}
      <Button onClick={toggle} aria-expanded={open}>
        {open ? "Close" : `✦ Who was ${level.pioneer}?`}
      </Button>
    </div>
  );
}

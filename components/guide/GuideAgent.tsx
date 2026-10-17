"use client";

import { useState } from "react";
import { HINTS_ENABLED } from "@/guide/config";
import type { LevelDefinition } from "@/level-manager/types";
import { Button } from "@/components/ui/Button";

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
      const cacheKey = `guide:background:${level.slug}`;
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
          className="w-full rounded-2xl border border-line bg-paper-raised p-4 shadow-lg"
        >
          {HINTS_ENABLED && (
            <div className="mb-3 flex gap-2">
              <Button
                variant={tab === "background" ? "primary" : "secondary"}
                onClick={() => void load("background")}
              >
                About {level.pioneer}
              </Button>
              <Button
                variant={tab === "hint" ? "primary" : "secondary"}
                onClick={() => void load("hint")}
              >
                Hint
              </Button>
            </div>
          )}
          {loading && <p className="text-sm text-ink-soft">Thinking…</p>}
          {!loading && failed && (
            <p className="text-sm leading-6 text-ink-soft">
              The guide is unavailable right now. {level.narrative}
            </p>
          )}
          {!loading && !failed && text && (
            <p className="text-sm leading-6 whitespace-pre-line text-ink">
              {text}
            </p>
          )}
        </section>
      )}
      <Button onClick={toggle} aria-expanded={open}>
        {open ? "Close guide" : `Who was ${level.pioneer}?`}
      </Button>
    </div>
  );
}

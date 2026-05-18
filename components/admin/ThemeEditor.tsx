"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { THEME_TOKENS, type ThemeColors } from "@/lib/theme";
import { saveTheme } from "@/app/admin/theme/actions";

export function ThemeEditor({ initial }: { initial: ThemeColors }) {
  const router = useRouter();
  const [colors, setColors] = useState<ThemeColors>(initial);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");

  function setColor(key: string, value: string) {
    setColors((prev) => ({ ...prev, [key]: value }));
    setFeedback("");
  }

  async function handleSave() {
    setBusy(true);
    setFeedback("Saving…");
    try {
      await saveTheme(colors);
      setFeedback("Saved — the live site has been updated.");
      router.refresh();
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="border border-divider rounded-lg bg-page overflow-hidden">
        {THEME_TOKENS.map((token) => (
          <div
            key={token.key}
            className="flex items-center gap-4 px-4 py-3 border-b border-divider last:border-0"
          >
            <input
              type="color"
              value={colors[token.key] ?? "#000000"}
              onChange={(e) => setColor(token.key, e.target.value)}
              aria-label={`${token.label} colour`}
              className="w-10 h-10 rounded border border-divider cursor-pointer shrink-0 bg-page"
            />
            <div className="flex-1 min-w-0">
              <p className="font-body text-small font-medium text-ink">
                {token.label}
              </p>
              <p className="font-body text-label text-ink-soft">{token.role}</p>
            </div>
            <input
              type="text"
              value={colors[token.key] ?? ""}
              onChange={(e) => setColor(token.key, e.target.value)}
              spellCheck={false}
              className="font-body text-small text-ink bg-page border border-divider rounded-md px-3 py-2 w-28 focus:outline-none focus:border-ink"
            />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={busy}
          className="font-body text-small font-medium bg-ink text-on-dark rounded-md px-4 py-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          Save colours
        </button>
        {feedback && (
          <span className="font-body text-small text-ink-soft">{feedback}</span>
        )}
      </div>
    </div>
  );
}

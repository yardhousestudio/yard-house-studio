"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveWhatsAppSettings } from "@/app/admin/whatsapp/actions";
import {
  slugifyRouteId,
  type WhatsAppModalOption,
  type WhatsAppSettings,
} from "@/lib/whatsapp";

const inputClass =
  "font-body text-small text-ink bg-page border border-divider rounded-md px-3 py-2 focus:outline-none focus:border-ink w-full";

type Props = { initial: WhatsAppSettings };

export function WhatsAppEditor({ initial }: Props) {
  const router = useRouter();
  const [professional, setProfessional] = useState(initial.professional_number);
  const [personal, setPersonal] = useState(initial.personal_number);
  const [floatingEnabled, setFloatingEnabled] = useState(initial.floating_enabled);
  const [options, setOptions] = useState<WhatsAppModalOption[]>(
    initial.modal_options,
  );
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");

  function touch() {
    setFeedback("");
  }

  function setOption(i: number, patch: Partial<WhatsAppModalOption>) {
    setOptions((prev) =>
      prev.map((o, idx) => (idx === i ? { ...o, ...patch } : o)),
    );
    touch();
  }

  function moveOption(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= options.length) return;
    setOptions((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    touch();
  }

  function addOption() {
    const title = "New option";
    setOptions((prev) => [
      ...prev,
      {
        id: slugifyRouteId(`${title}-${prev.length + 1}`),
        title,
        subtitle: "",
        message: "",
      },
    ]);
    touch();
  }

  function removeOption(i: number) {
    if (options.length <= 1) {
      setFeedback("Keep at least one modal option.");
      return;
    }
    setOptions((prev) => prev.filter((_, idx) => idx !== i));
    touch();
  }

  async function handleSave() {
    setBusy(true);
    setFeedback("Saving…");
    try {
      await saveWhatsAppSettings({
        professional_number: professional,
        personal_number: personal,
        floating_enabled: floatingEnabled,
        modal_options: options,
      });
      setFeedback("Saved — the live site has been updated.");
      router.refresh();
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <section className="flex flex-col gap-3">
        <h2 className="font-body text-small font-medium text-ink">
          Phone numbers
        </h2>
        <p className="font-body text-label text-ink-secondary -mt-1">
          UK numbers can be entered as 077… or 4477… — we convert 0-prefixed
          numbers to international format for WhatsApp. Uses professional if set,
          otherwise personal. If both are empty, WhatsApp actions are hidden.
        </p>
        <label className="flex flex-col gap-1.5">
          <span className="font-body text-label uppercase tracking-[0.05em] text-ink-secondary">
            Professional / primary
          </span>
          <input
            value={professional}
            onChange={(e) => {
              setProfessional(e.target.value);
              touch();
            }}
            placeholder="447712345678"
            className={inputClass}
            inputMode="numeric"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-body text-label uppercase tracking-[0.05em] text-ink-secondary">
            Personal / secondary
          </span>
          <input
            value={personal}
            onChange={(e) => {
              setPersonal(e.target.value);
              touch();
            }}
            placeholder="447712345678"
            className={inputClass}
            inputMode="numeric"
          />
        </label>
      </section>

      <section className="flex flex-col gap-3 border-t border-divider pt-8">
        <h2 className="font-body text-small font-medium text-ink">
          Floating icon
        </h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={floatingEnabled}
            onChange={(e) => {
              setFloatingEnabled(e.target.checked);
              touch();
            }}
            className="h-4 w-4 rounded border-divider accent-ink"
          />
          <span className="font-body text-small text-ink">
            Show floating WhatsApp button on all pages
          </span>
        </label>
        <p className="font-body text-label text-ink-secondary">
          Does not affect header CTAs, page-builder primary buttons, or inline
          contact links — those use per-button “Open WhatsApp router” in the page
          editor.
        </p>
      </section>

      <section className="flex flex-col gap-3 border-t border-divider pt-8">
        <h2 className="font-body text-small font-medium text-ink">
          Modal options
        </h2>
        <p className="font-body text-label text-ink-secondary -mt-1">
          Shown when a visitor opens the WhatsApp router. Route id is used in
          the redirect URL (lowercase, hyphens).
        </p>

        <div className="flex flex-col gap-4">
          {options.map((opt, i) => (
            <div
              key={`${opt.id}-${i}`}
              className="border border-divider rounded-lg bg-page p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-body text-label uppercase tracking-[0.05em] text-ink-secondary">
                  Option {i + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveOption(i, -1)}
                    disabled={i === 0 || busy}
                    className="font-body text-label text-ink-secondary hover:text-ink border border-divider rounded px-2 py-1 disabled:opacity-40"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveOption(i, 1)}
                    disabled={i === options.length - 1 || busy}
                    className="font-body text-label text-ink-secondary hover:text-ink border border-divider rounded px-2 py-1 disabled:opacity-40"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    disabled={busy}
                    className="font-body text-label text-ink-secondary hover:text-ink border border-divider rounded px-2 py-1 disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="font-body text-label text-ink-secondary">
                  Route id
                </span>
                <input
                  value={opt.id}
                  onChange={(e) =>
                    setOption(i, {
                      id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                    })
                  }
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-body text-label text-ink-secondary">
                  Title
                </span>
                <input
                  value={opt.title}
                  onChange={(e) => setOption(i, { title: e.target.value })}
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-body text-label text-ink-secondary">
                  Subtitle / description
                </span>
                <input
                  value={opt.subtitle}
                  onChange={(e) => setOption(i, { subtitle: e.target.value })}
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-body text-label text-ink-secondary">
                  Prefilled message
                </span>
                <textarea
                  value={opt.message}
                  onChange={(e) => setOption(i, { message: e.target.value })}
                  rows={3}
                  className={`${inputClass} resize-y`}
                />
                <span className="font-body text-label text-ink-muted">
                  Supports ${"{KEY}"} site variables (e.g. ${"{LOCATION}"}).
                </span>
              </label>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addOption}
          className="self-start font-body text-small text-ink-secondary hover:text-ink border border-divider rounded-md px-3 py-2 transition-colors"
        >
          + Add option
        </button>
      </section>

      <div className="flex items-center gap-2 border-t border-divider pt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={busy}
          className="font-body text-small font-medium bg-ink text-on-dark rounded-md px-4 py-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          Save changes
        </button>
        {feedback && (
          <span className="font-body text-small text-ink-secondary">{feedback}</span>
        )}
      </div>
    </div>
  );
}

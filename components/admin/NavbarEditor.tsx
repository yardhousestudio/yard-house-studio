"use client";

import { useState } from "react";
import { updateNavbar } from "@/app/admin/navigation/actions";
import type { NavbarRow, NavbarLink } from "@/lib/types";

const inputClass =
  "font-body text-small text-ink bg-page border border-divider rounded-md px-3 py-2 focus:outline-none focus:border-ink w-full";

export function NavbarEditor({ navbar }: { navbar: NavbarRow }) {
  const [logoText, setLogoText] = useState(navbar.logo?.text ?? "");
  const [logoHref, setLogoHref] = useState(navbar.logo?.href ?? "/");
  const [links, setLinks] = useState<NavbarLink[]>(
    [...(navbar.links ?? [])].sort((a, b) => a.order - b.order),
  );
  const [ctaLabel, setCtaLabel] = useState(navbar.cta_button?.label ?? "");
  const [ctaHref, setCtaHref] = useState(navbar.cta_button?.href ?? "");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");

  function setLink(i: number, patch: Partial<NavbarLink>) {
    setLinks((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
    setFeedback("");
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= links.length) return;
    setLinks((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setFeedback("");
  }

  async function handleSave() {
    setBusy(true);
    setFeedback("Saving…");
    try {
      await updateNavbar({
        logo: { text: logoText, href: logoHref },
        links: links.map((l, i) => ({ label: l.label, href: l.href, order: i })),
        cta_button: ctaLabel.trim()
          ? { label: ctaLabel, href: ctaHref }
          : null,
      });
      setFeedback("Saved — the live site has been updated.");
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="border border-divider rounded-lg bg-page p-5 flex flex-col gap-4">
        <h2 className="font-body text-body font-medium text-ink">Logo</h2>
        <label className="flex flex-col gap-1.5">
          <span className="font-body text-small font-medium text-ink">Text</span>
          <input
            value={logoText}
            onChange={(e) => setLogoText(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-body text-small font-medium text-ink">Link</span>
          <input
            value={logoHref}
            onChange={(e) => setLogoHref(e.target.value)}
            className={inputClass}
          />
        </label>
      </section>

      <section className="border border-divider rounded-lg bg-page p-5 flex flex-col gap-3">
        <h2 className="font-body text-body font-medium text-ink">Links</h2>
        {links.map((link, i) => (
          <div
            key={i}
            className="border border-divider rounded-md p-3 bg-surface flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-body text-label uppercase tracking-[0.05em] text-ink-2">
                Link {i + 1}
              </span>
              <div className="flex gap-1">
                <SmallBtn onClick={() => move(i, -1)} disabled={i === 0}>
                  ↑
                </SmallBtn>
                <SmallBtn
                  onClick={() => move(i, 1)}
                  disabled={i === links.length - 1}
                >
                  ↓
                </SmallBtn>
                <SmallBtn
                  onClick={() =>
                    setLinks((prev) => prev.filter((_, idx) => idx !== i))
                  }
                >
                  Remove
                </SmallBtn>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="font-body text-small text-ink-2">Label</span>
                <input
                  value={link.label}
                  onChange={(e) => setLink(i, { label: e.target.value })}
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-body text-small text-ink-2">
                  Link (e.g. #services)
                </span>
                <input
                  value={link.href}
                  onChange={(e) => setLink(i, { href: e.target.value })}
                  className={inputClass}
                />
              </label>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setLinks((prev) => [
              ...prev,
              { label: "New link", href: "#", order: prev.length },
            ])
          }
          className="font-body text-small text-ink-2 hover:text-ink border border-divider rounded-md px-3 py-2 self-start transition-colors"
        >
          + Add link
        </button>
      </section>

      <section className="border border-divider rounded-lg bg-page p-5 flex flex-col gap-4">
        <h2 className="font-body text-body font-medium text-ink">
          Call-to-action button
        </h2>
        <p className="font-body text-small text-ink-2">
          Leave the label empty to hide the button.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="font-body text-small text-ink-2">Label</span>
            <input
              value={ctaLabel}
              onChange={(e) => {
                setCtaLabel(e.target.value);
                setFeedback("");
              }}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-body text-small text-ink-2">Link</span>
            <input
              value={ctaHref}
              onChange={(e) => {
                setCtaHref(e.target.value);
                setFeedback("");
              }}
              className={inputClass}
            />
          </label>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={busy}
          className="font-body text-small font-medium bg-ink text-on-dark rounded-md px-4 py-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          Save navigation
        </button>
        {feedback && (
          <span className="font-body text-small text-ink-2">{feedback}</span>
        )}
      </div>
    </div>
  );
}

function SmallBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="font-body text-label text-ink-2 hover:text-ink border border-divider rounded px-2 py-1 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}

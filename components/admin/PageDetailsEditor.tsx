"use client";

import { useState } from "react";
import { savePageDetails } from "@/app/admin/pages/actions";

type PageType = "standard" | "pillar" | "cluster";

type Props = {
  pageId: string;
  isHomepage: boolean;
  pillars: { id: string; title: string }[];
  initial: {
    title: string;
    slug: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    pageType: PageType;
    pillarId: string;
  };
};

const inputClass =
  "font-body text-small text-ink bg-page border border-divider rounded-md px-3 py-2 focus:outline-none focus:border-ink w-full";

export function PageDetailsEditor({
  pageId,
  isHomepage,
  pillars,
  initial,
}: Props) {
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [description, setDescription] = useState(initial.description);
  const [ogTitle, setOgTitle] = useState(initial.ogTitle);
  const [ogDescription, setOgDescription] = useState(initial.ogDescription);
  const [ogImage, setOgImage] = useState(initial.ogImage);
  const [pageType, setPageType] = useState<PageType>(initial.pageType);
  const [pillarId, setPillarId] = useState(initial.pillarId);

  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  // Wrap a setState so every edit also marks the form dirty and clears
  // any stale feedback/error.
  function edit<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setDirty(true);
      setFeedback("");
      setError("");
    };
  }

  async function handleSave() {
    setBusy(true);
    setError("");
    setFeedback("Saving…");
    try {
      await savePageDetails(pageId, {
        title,
        slug,
        description,
        ogTitle,
        ogDescription,
        ogImage,
        pageType,
        pillarId: pageType === "cluster" ? pillarId : "",
      });
      setDirty(false);
      setFeedback("Details saved");
    } catch (e) {
      setFeedback("");
      setError(e instanceof Error ? e.message : "Could not save details");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Section title="Basic Information">
        <Field label="Page Title" required>
          <input
            value={title}
            onChange={(e) => edit(setTitle)(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field
          label="Slug"
          hint={
            isHomepage
              ? "This is the homepage — it always lives at the site root."
              : 'Leave blank for the homepage. Use "/" for child pages (e.g. "download/mac").'
          }
        >
          <div className="flex items-center gap-1.5">
            <span className="font-body text-small text-ink-muted">/</span>
            <input
              value={slug}
              onChange={(e) => edit(setSlug)(e.target.value)}
              disabled={isHomepage}
              placeholder="e.g. pricing, download/mac"
              className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
            />
          </div>
        </Field>

        <Field
          label="Page type"
          hint={
            pageType === "pillar"
              ? "A pillar page covers a broad topic. Cluster pages link up to it."
              : pageType === "cluster"
                ? "A cluster page covers one subtopic and belongs to a pillar."
                : "A standard page — not part of the pillar/cluster SEO model."
          }
        >
          <select
            value={pageType}
            onChange={(e) => edit(setPageType)(e.target.value as PageType)}
            className={inputClass}
          >
            <option value="standard">Standard page</option>
            <option value="pillar">Pillar page</option>
            <option value="cluster">Cluster page</option>
          </select>
        </Field>

        {pageType === "cluster" && (
          <Field
            label="Pillar page"
            required
            hint={
              pillars.length === 0
                ? "No pillar pages exist yet — create one first, then assign it here."
                : "The pillar this cluster page belongs to and links back to."
            }
          >
            <select
              value={pillarId}
              onChange={(e) => edit(setPillarId)(e.target.value)}
              disabled={pillars.length === 0}
              className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <option value="">— Select a pillar page —</option>
              {pillars.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => edit(setDescription)(e.target.value)}
            rows={3}
            className={`${inputClass} resize-y`}
          />
        </Field>
      </Section>

      <Section title="SEO & Open Graph">
        <Field label="OG Title">
          <input
            value={ogTitle}
            onChange={(e) => edit(setOgTitle)(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="OG Description">
          <textarea
            value={ogDescription}
            onChange={(e) => edit(setOgDescription)(e.target.value)}
            rows={3}
            className={`${inputClass} resize-y`}
          />
        </Field>

        <Field label="OG Image">
          <input
            value={ogImage}
            onChange={(e) => edit(setOgImage)(e.target.value)}
            placeholder="/images/og-image.png"
            className={inputClass}
          />
        </Field>
      </Section>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={busy || !dirty || !title.trim()}
          className="font-body text-small font-medium bg-ink text-on-dark rounded-md px-4 py-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {busy ? "Saving…" : "Save details"}
        </button>
        {feedback && (
          <span className="font-body text-small text-ink-secondary">
            {feedback}
          </span>
        )}
        {error && (
          <span className="font-body text-small text-accent">{error}</span>
        )}
      </div>
    </div>
  );
}

// A collapsible card — matches the component cards in the page editor.
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-divider rounded-lg bg-page overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="font-display text-card-title text-ink">{title}</span>
        <span className="font-body text-label text-ink-secondary">
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && (
        <div className="border-t border-divider px-5 py-5 bg-surface flex flex-col gap-4">
          {children}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-body text-small font-medium text-ink">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {children}
      {hint && (
        <span className="font-body text-label text-ink-muted">{hint}</span>
      )}
    </label>
  );
}

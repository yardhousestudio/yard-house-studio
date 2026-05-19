"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPage } from "@/app/admin/pages/actions";

const inputClass =
  "font-body text-small text-ink bg-page border border-divider rounded-md px-3 py-2 focus:outline-none focus:border-ink w-full";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function NewPageForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function reset() {
    setTitle("");
    setSlug("");
    setSlugTouched(false);
    setError("");
  }

  async function handleCreate() {
    setBusy(true);
    setError("");
    try {
      const id = await createPage({ title, slug });
      router.push(`/admin/pages/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create page");
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-body text-small font-medium bg-ink text-on-dark rounded-md px-4 py-2 hover:opacity-90 transition-opacity"
      >
        + New page
      </button>
    );
  }

  return (
    <div className="border border-divider rounded-lg bg-page p-4 flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="font-body text-small font-medium text-ink">
            Page title
          </span>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
              setError("");
            }}
            placeholder="Our Services"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-body text-small font-medium text-ink">
            Slug (the URL path)
          </span>
          <input
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
              setError("");
            }}
            placeholder="our-services"
            className={inputClass}
          />
        </label>
      </div>
      {error && (
        <p className="font-body text-small text-ink bg-frame rounded-md px-3 py-2">
          {error}
        </p>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCreate}
          disabled={busy || !title.trim() || !slug.trim()}
          className="font-body text-small font-medium bg-ink text-on-dark rounded-md px-4 py-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {busy ? "Creating…" : "Create page"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            reset();
          }}
          disabled={busy}
          className="font-body text-small text-ink-secondary hover:text-ink border border-divider rounded-md px-4 py-2 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

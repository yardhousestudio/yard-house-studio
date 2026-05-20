"use client";

import { useRef, useState } from "react";
import { formatMediaSize, useMediaLibrary } from "./useMediaLibrary";

export function MediaLibrary() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const { items, loading, busy, feedback, publicUrl, upload, remove } =
    useMediaLibrary();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await upload(file);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function copyUrl(path: string) {
    await navigator.clipboard.writeText(publicUrl(path));
    setCopied(path);
    setTimeout(() => setCopied((c) => (c === path ? null : c)), 1500);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <label className="font-body text-small font-medium bg-ink text-on-dark rounded-md px-4 py-2 cursor-pointer hover:opacity-90 transition-opacity">
          {busy ? "Working…" : "Upload image"}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={busy}
            className="hidden"
          />
        </label>
        {feedback && (
          <span className="font-body text-small text-ink-secondary">{feedback}</span>
        )}
      </div>

      {loading ? (
        <p className="font-body text-small text-ink-secondary">Loading…</p>
      ) : items.length === 0 ? (
        <p className="font-body text-small text-ink-secondary">
          No images yet. Upload one to get started.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="border border-divider rounded-lg bg-page overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/3] bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={publicUrl(item.storage_path)}
                  alt={item.filename}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 flex flex-col gap-2">
                <p
                  className="font-body text-small text-ink truncate"
                  title={item.filename}
                >
                  {item.filename}
                </p>
                <p className="font-body text-label text-ink-secondary">
                  {formatMediaSize(item.size_bytes)}
                </p>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => copyUrl(item.storage_path)}
                    className="font-body text-label text-ink-secondary hover:text-ink border border-divider rounded px-2 py-1 transition-colors"
                  >
                    {copied === item.storage_path ? "Copied!" : "Copy URL"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        !confirm(
                          `Delete ${item.filename}? This cannot be undone.`,
                        )
                      )
                        return;
                      remove(item);
                    }}
                    disabled={busy}
                    className="font-body text-label text-ink-secondary hover:text-ink border border-divider rounded px-2 py-1 disabled:opacity-40 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

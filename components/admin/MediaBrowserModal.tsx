"use client";

import { useEffect, useRef } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { formatMediaSize, useMediaLibrary } from "./useMediaLibrary";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
};

export function MediaBrowserModal({
  open,
  onClose,
  onSelect,
  title = "Choose image",
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { items, loading, busy, feedback, refresh, publicUrl, upload } =
    useMediaLibrary();

  useEffect(() => {
    if (!open) return;
    refresh();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, refresh]);

  if (!open) return null;

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload(file);
    if (fileRef.current) fileRef.current.value = "";
    if (url) onSelect(url);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-browser-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[min(90vh,820px)] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-divider bg-page shadow-[0_24px_80px_-12px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between gap-4 border-b border-divider px-5 py-4">
          <h2
            id="media-browser-title"
            className="font-display text-card-title text-ink"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-secondary hover:text-ink p-1 rounded transition-colors"
            aria-label="Close"
          >
            <Cross2Icon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 border-b border-divider px-5 py-3">
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
            <span className="font-body text-small text-ink-secondary">
              {feedback}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <p className="font-body text-small text-ink-secondary">Loading…</p>
          ) : items.length === 0 ? (
            <p className="font-body text-small text-ink-secondary">
              No images yet. Upload one to use it here.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {items.map((item) => {
                const url = publicUrl(item.storage_path);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelect(url)}
                    className="group text-left border border-divider rounded-lg bg-surface overflow-hidden hover:border-ink transition-colors focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink"
                  >
                    <div className="aspect-[4/3] bg-page">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={item.filename}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2">
                      <p
                        className="font-body text-label text-ink truncate"
                        title={item.filename}
                      >
                        {item.filename}
                      </p>
                      <p className="font-body text-label text-ink-secondary">
                        {formatMediaSize(item.size_bytes)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

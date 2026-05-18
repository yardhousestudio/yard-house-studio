"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type MediaItem = {
  id: string;
  storage_path: string;
  filename: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

function formatSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function MediaLibrary() {
  const [supabase] = useState(() => createClient());
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const publicUrl = useCallback(
    (path: string) =>
      supabase.storage.from("media").getPublicUrl(path).data.publicUrl,
    [supabase],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("media")
      .select("id, storage_path, filename, mime_type, size_bytes, created_at")
      .order("created_at", { ascending: false });
    setItems((data ?? []) as MediaItem[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setFeedback("Uploading…");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${Date.now()}-${safeName}`;

    const { error: upErr } = await supabase.storage
      .from("media")
      .upload(path, file);
    if (upErr) {
      setFeedback(upErr.message);
      setBusy(false);
      return;
    }
    const { error: rowErr } = await supabase.from("media").insert({
      storage_path: path,
      filename: file.name,
      mime_type: file.type,
      size_bytes: file.size,
    });
    if (rowErr) {
      setFeedback(rowErr.message);
      setBusy(false);
      return;
    }
    setFeedback("");
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
    refresh();
  }

  async function handleDelete(item: MediaItem) {
    if (!confirm(`Delete ${item.filename}? This cannot be undone.`)) return;
    setBusy(true);
    await supabase.storage.from("media").remove([item.storage_path]);
    await supabase.from("media").delete().eq("id", item.id);
    setBusy(false);
    refresh();
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
          <span className="font-body text-small text-ink-soft">{feedback}</span>
        )}
      </div>

      {loading ? (
        <p className="font-body text-small text-ink-soft">Loading…</p>
      ) : items.length === 0 ? (
        <p className="font-body text-small text-ink-soft">
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
                <p className="font-body text-label text-ink-soft">
                  {formatSize(item.size_bytes)}
                </p>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => copyUrl(item.storage_path)}
                    className="font-body text-label text-ink-soft hover:text-ink border border-divider rounded px-2 py-1 transition-colors"
                  >
                    {copied === item.storage_path ? "Copied!" : "Copy URL"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    disabled={busy}
                    className="font-body text-label text-ink-soft hover:text-ink border border-divider rounded px-2 py-1 disabled:opacity-40 transition-colors"
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

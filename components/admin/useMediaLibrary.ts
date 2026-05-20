"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type MediaItem = {
  id: string;
  storage_path: string;
  filename: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

export function formatMediaSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function useMediaLibrary() {
  const [supabase] = useState(() => createClient());
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");

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

  async function upload(file: File): Promise<string | null> {
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
      return null;
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
      return null;
    }
    setFeedback("");
    setBusy(false);
    await refresh();
    return publicUrl(path);
  }

  async function remove(item: MediaItem) {
    setBusy(true);
    await supabase.storage.from("media").remove([item.storage_path]);
    await supabase.from("media").delete().eq("id", item.id);
    setBusy(false);
    await refresh();
  }

  return {
    items,
    loading,
    busy,
    feedback,
    setFeedback,
    refresh,
    publicUrl,
    upload,
    remove,
  };
}

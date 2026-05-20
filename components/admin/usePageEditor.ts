"use client";

import { useState } from "react";
import { componentSchemas } from "@/app/admin/components/componentSchemas";
import {
  saveDraft,
  publishDraft,
  discardDraft,
} from "@/app/admin/pages/actions";
import type { ComponentInstance } from "@/lib/types";

function withDefaults(c: ComponentInstance): ComponentInstance {
  const schema = componentSchemas[c.type];
  if (!schema) return c;
  return { ...c, props: { ...schema.defaults, ...c.props } };
}

export function usePageEditor({
  pageId,
  initialComponents,
  initialHasDraft,
}: {
  pageId: string;
  initialComponents: ComponentInstance[];
  initialHasDraft: boolean;
}) {
  const [components, setComponents] = useState<ComponentInstance[]>(
    initialComponents.map(withDefaults),
  );
  const [hasDraft, setHasDraft] = useState(initialHasDraft);
  const [dirty, setDirty] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [addType, setAddType] = useState(
    () => Object.keys(componentSchemas)[0] ?? "",
  );

  function touch() {
    setDirty(true);
    setFeedback("");
  }

  function updateProps(contentKey: string, key: string, value: unknown) {
    setComponents((prev) =>
      prev.map((c) =>
        c.contentKey === contentKey
          ? { ...c, props: { ...c.props, [key]: value } }
          : c,
      ),
    );
    touch();
  }

  function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= components.length) return;
    setComponents((prev) => {
      const next = [...prev];
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
    touch();
  }

  function removeComponent(contentKey: string) {
    setComponents((prev) => prev.filter((c) => c.contentKey !== contentKey));
    touch();
  }

  function addComponent() {
    const schema = componentSchemas[addType];
    if (!schema) return;
    const anchor =
      typeof schema.defaults.anchor === "string"
        ? schema.defaults.anchor
        : addType;
    setComponents((prev) => [
      ...prev,
      {
        type: addType,
        order: prev.length,
        contentKey: crypto.randomUUID(),
        props: { ...schema.defaults },
        anchorId: anchor,
      },
    ]);
    touch();
  }

  function normalized() {
    return components.map((c, i) => ({ ...c, order: i }));
  }

  async function handleSaveDraft() {
    setBusy(true);
    setFeedback("Saving…");
    try {
      await saveDraft(pageId, normalized());
      setHasDraft(true);
      setDirty(false);
      setFeedback("Draft saved");
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function handlePublish() {
    setBusy(true);
    setFeedback("Publishing…");
    try {
      await saveDraft(pageId, normalized());
      await publishDraft(pageId);
      window.location.reload();
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Publish failed");
      setBusy(false);
    }
  }

  async function handleDiscard() {
    if (!confirm("Discard the draft and revert to the published version?"))
      return;
    setBusy(true);
    try {
      await discardDraft(pageId);
      window.location.reload();
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Discard failed");
      setBusy(false);
    }
  }

  return {
    components,
    hasDraft,
    dirty,
    feedback,
    busy,
    expanded,
    setExpanded,
    addType,
    setAddType,
    updateProps,
    move,
    removeComponent,
    addComponent,
    handleSaveDraft,
    handlePublish,
    handleDiscard,
  };
}

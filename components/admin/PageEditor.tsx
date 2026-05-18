"use client";

import { useState } from "react";
import { FieldRenderer } from "./FieldRenderer";
import { componentSchemas } from "@/app/admin/components/componentSchemas";
import {
  saveDraft,
  publishDraft,
  discardDraft,
} from "@/app/admin/pages/actions";
import type { ComponentInstance } from "@/lib/types";

type Props = {
  pageId: string;
  pageTitle: string;
  initialComponents: ComponentInstance[];
  initialHasDraft: boolean;
};

const TYPE_OPTIONS = Object.entries(componentSchemas).map(([type, s]) => ({
  type,
  label: s.label,
}));

// Merge schema defaults into each component so the editor always shows
// the full set of fields, not just stored overrides.
function withDefaults(c: ComponentInstance): ComponentInstance {
  const schema = componentSchemas[c.type];
  if (!schema) return c;
  return { ...c, props: { ...schema.defaults, ...c.props } };
}

export function PageEditor({
  pageId,
  pageTitle,
  initialComponents,
  initialHasDraft,
}: Props) {
  const [components, setComponents] = useState<ComponentInstance[]>(
    initialComponents.map(withDefaults),
  );
  const [hasDraft, setHasDraft] = useState(initialHasDraft);
  const [dirty, setDirty] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [addType, setAddType] = useState(TYPE_OPTIONS[0]?.type ?? "");

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
    if (
      !confirm("Discard the draft and revert to the published version?")
    )
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

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-section text-ink">{pageTitle}</h1>
          <p className="font-body text-small text-ink-secondary mt-1">
            {dirty
              ? "Unsaved changes"
              : hasDraft
                ? "Draft saved — not yet published"
                : "Published — no draft"}
            {feedback && ` · ${feedback}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasDraft && (
            <button
              type="button"
              onClick={handleDiscard}
              disabled={busy}
              className="font-body text-small text-ink-secondary hover:text-ink border border-divider rounded-md px-3 py-2 disabled:opacity-50 transition-colors"
            >
              Discard draft
            </button>
          )}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={busy}
            className="font-body text-small text-ink border border-ink rounded-md px-3 py-2 disabled:opacity-50 hover:bg-frame transition-colors"
          >
            Save draft
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={busy}
            className="font-body text-small font-medium bg-ink text-on-dark rounded-md px-4 py-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            Publish
          </button>
        </div>
      </div>

      {/* Component list */}
      <div className="flex flex-col gap-3">
        {components.map((c, i) => {
          const schema = componentSchemas[c.type];
          const isOpen = expanded === c.contentKey;
          return (
            <div
              key={c.contentKey}
              className="border border-divider rounded-lg bg-page overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : c.contentKey)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <span className="font-body text-label text-ink-secondary w-5">
                    {i + 1}
                  </span>
                  <span className="font-body text-body font-medium text-ink">
                    {schema?.label ?? c.type}
                  </span>
                  <span className="font-body text-label text-ink-secondary">
                    {isOpen ? "▲" : "▼"}
                  </span>
                </button>
                <div className="flex items-center gap-1">
                  <CardBtn onClick={() => move(i, -1)} disabled={i === 0}>
                    ↑
                  </CardBtn>
                  <CardBtn
                    onClick={() => move(i, 1)}
                    disabled={i === components.length - 1}
                  >
                    ↓
                  </CardBtn>
                  <CardBtn onClick={() => removeComponent(c.contentKey)}>
                    Remove
                  </CardBtn>
                </div>
              </div>
              {isOpen && (
                <div className="border-t border-divider px-4 py-4 bg-surface">
                  {!schema ? (
                    <p className="font-body text-small text-ink-secondary">
                      Unknown component type “{c.type}”.
                    </p>
                  ) : schema.fields.length === 0 ? (
                    <p className="font-body text-small text-ink-secondary">
                      This component has no editable options.
                    </p>
                  ) : (
                    <FieldRenderer
                      fields={schema.fields}
                      values={c.props}
                      onChange={(k, v) => updateProps(c.contentKey, k, v)}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add component */}
      <div className="flex items-center gap-2 border-t border-divider pt-5">
        <select
          value={addType}
          onChange={(e) => setAddType(e.target.value)}
          className="font-body text-small text-ink bg-page border border-divider rounded-md px-3 py-2 focus:outline-none focus:border-ink"
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.type} value={o.type}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addComponent}
          className="font-body text-small text-ink-secondary hover:text-ink border border-divider rounded-md px-3 py-2 transition-colors"
        >
          + Add component
        </button>
      </div>
    </div>
  );
}

function CardBtn({
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
      className="font-body text-label text-ink-secondary hover:text-ink border border-divider rounded px-2 py-1 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}

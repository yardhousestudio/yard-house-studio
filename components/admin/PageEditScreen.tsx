"use client";

import { useState } from "react";
import { FieldRenderer } from "./FieldRenderer";
import { PageDetailsEditor } from "./PageDetailsEditor";
import { componentSchemas } from "@/app/admin/components/componentSchemas";
import { usePageEditor } from "./usePageEditor";
import type { ComponentInstance } from "@/lib/types";

type PageType = "standard" | "pillar" | "cluster";

type Props = {
  pageId: string;
  isHomepage: boolean;
  pillars: { id: string; title: string }[];
  initialTitle: string;
  initialDetails: {
    slug: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    pageType: PageType;
    pillarId: string;
  };
  initialComponents: ComponentInstance[];
  initialHasDraft: boolean;
};

const TYPE_OPTIONS = Object.entries(componentSchemas).map(([type, s]) => ({
  type,
  label: s.label,
}));

export function PageEditScreen({
  pageId,
  isHomepage,
  pillars,
  initialTitle,
  initialDetails,
  initialComponents,
  initialHasDraft,
}: Props) {
  const [displayTitle, setDisplayTitle] = useState(initialTitle);
  const editor = usePageEditor({
    pageId,
    initialComponents,
    initialHasDraft,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-divider pb-6">
        <div className="flex-1 min-w-[200px]">
          <h1 className="font-display text-section text-ink">{displayTitle}</h1>
          <p className="font-body text-small text-ink-secondary mt-1">
            {editor.dirty
              ? "Unsaved component changes"
              : editor.hasDraft
                ? "Draft saved — not yet published"
                : "Published — no draft"}
            {editor.feedback && ` · ${editor.feedback}`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {editor.hasDraft && (
            <button
              type="button"
              onClick={editor.handleDiscard}
              disabled={editor.busy}
              className="font-body text-small text-ink-secondary hover:text-ink border border-divider rounded-md px-3 py-2 disabled:opacity-50 transition-colors"
            >
              Discard draft
            </button>
          )}
          <button
            type="button"
            onClick={editor.handleSaveDraft}
            disabled={editor.busy}
            className="font-body text-small text-ink border border-ink rounded-md px-3 py-2 disabled:opacity-50 hover:bg-frame transition-colors"
          >
            Save draft
          </button>
          <button
            type="button"
            onClick={editor.handlePublish}
            disabled={editor.busy}
            className="font-body text-small font-medium bg-ink text-on-dark rounded-md px-4 py-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            Publish
          </button>
        </div>
      </div>

      <PageDetailsEditor
        pageId={pageId}
        isHomepage={isHomepage}
        pillars={pillars}
        onTitleSaved={setDisplayTitle}
        initial={{ title: initialTitle, ...initialDetails }}
      />

      {/* Page components */}
      <div className="flex flex-col gap-3">
        <h2 className="font-display text-card-title text-ink">Page components</h2>
        {editor.components.map((c, i) => {
          const schema = componentSchemas[c.type];
          const isOpen = editor.expanded === c.contentKey;
          return (
            <div
              key={c.contentKey}
              className="border border-divider rounded-lg bg-page overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <button
                  type="button"
                  onClick={() =>
                    editor.setExpanded(isOpen ? null : c.contentKey)
                  }
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
                  <CardBtn
                    onClick={() => editor.move(i, -1)}
                    disabled={i === 0}
                  >
                    ↑
                  </CardBtn>
                  <CardBtn
                    onClick={() => editor.move(i, 1)}
                    disabled={i === editor.components.length - 1}
                  >
                    ↓
                  </CardBtn>
                  <CardBtn onClick={() => editor.removeComponent(c.contentKey)}>
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
                      onChange={(k, v) => editor.updateProps(c.contentKey, k, v)}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 border-t border-divider pt-5">
        <select
          value={editor.addType}
          onChange={(e) => editor.setAddType(e.target.value)}
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
          onClick={editor.addComponent}
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

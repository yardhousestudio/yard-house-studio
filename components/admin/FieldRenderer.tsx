"use client";

import type { Field } from "@/lib/types";

type Values = Record<string, unknown>;

const inputClass =
  "font-body text-small text-ink bg-page border border-divider rounded-md px-3 py-2 focus:outline-none focus:border-ink w-full";

export function FieldRenderer({
  fields,
  values,
  onChange,
}: {
  fields: Field[];
  values: Values;
  onChange: (key: string, value: unknown) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {fields.map((field) => (
        <SingleField
          key={field.key}
          field={field}
          value={values[field.key]}
          onChange={(v) => onChange(field.key, v)}
        />
      ))}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-body text-small font-medium text-ink">
      {children}
    </span>
  );
}

function SingleField({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  if (field.type === "array") {
    return (
      <ArrayField
        field={field}
        value={Array.isArray(value) ? value : []}
        onChange={onChange}
      />
    );
  }

  if (field.type === "textarea") {
    return (
      <label className="flex flex-col gap-1.5">
        <FieldLabel>{field.label}</FieldLabel>
        <textarea
          rows={4}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} resize-y leading-relaxed`}
        />
      </label>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 accent-[var(--color-ink)]"
        />
        <FieldLabel>{field.label}</FieldLabel>
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className="flex flex-col gap-1.5">
        <FieldLabel>{field.label}</FieldLabel>
        <select
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        >
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "number") {
    return (
      <label className="flex flex-col gap-1.5">
        <FieldLabel>{field.label}</FieldLabel>
        <input
          type="number"
          value={value === undefined || value === null ? "" : Number(value)}
          onChange={(e) =>
            onChange(e.target.value === "" ? "" : Number(e.target.value))
          }
          className={inputClass}
        />
      </label>
    );
  }

  // text, image, color, date, page-selector → text-style input
  return (
    <label className="flex flex-col gap-1.5">
      <FieldLabel>{field.label}</FieldLabel>
      {field.type === "image" && (
        <span className="font-body text-label text-ink-2">
          Paste an image URL — a media picker is coming in a later update.
        </span>
      )}
      <input
        type={field.type === "date" ? "date" : field.type === "color" ? "color" : "text"}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </label>
  );
}

function ArrayField({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown[];
  onChange: (value: unknown[]) => void;
}) {
  const itemSchema = field.itemSchema ?? [];
  // An itemSchema of a single empty-key field means the items are plain
  // strings (e.g. dark-two-column paragraphs), not objects.
  const isScalar = itemSchema.length === 1 && itemSchema[0].key === "";

  function makeDefaultItem(): unknown {
    if (isScalar) return "";
    const obj: Values = {};
    for (const f of itemSchema) {
      obj[f.key] = f.default ?? (f.type === "checkbox" ? false : "");
    }
    return obj;
  }

  function update(next: unknown[]) {
    onChange(next);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  }

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>{field.label}</FieldLabel>
      {value.map((item, i) => (
        <div
          key={i}
          className="border border-divider rounded-md p-3 flex flex-col gap-3 bg-surface"
        >
          <div className="flex items-center justify-between">
            <span className="font-body text-label uppercase tracking-[0.05em] text-ink-2">
              {field.label} {i + 1}
            </span>
            <div className="flex items-center gap-1">
              <ArrayBtn onClick={() => move(i, -1)} disabled={i === 0}>
                ↑
              </ArrayBtn>
              <ArrayBtn
                onClick={() => move(i, 1)}
                disabled={i === value.length - 1}
              >
                ↓
              </ArrayBtn>
              <ArrayBtn
                onClick={() => update(value.filter((_, idx) => idx !== i))}
              >
                Remove
              </ArrayBtn>
            </div>
          </div>
          {isScalar ? (
            <textarea
              rows={3}
              value={String(item ?? "")}
              onChange={(e) => {
                const next = [...value];
                next[i] = e.target.value;
                update(next);
              }}
              className={`${inputClass} resize-y leading-relaxed`}
            />
          ) : (
            <FieldRenderer
              fields={itemSchema}
              values={item as Values}
              onChange={(k, v) => {
                const next = [...value];
                next[i] = { ...(item as Values), [k]: v };
                update(next);
              }}
            />
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => update([...value, makeDefaultItem()])}
        className="font-body text-small text-ink-2 hover:text-ink border border-divider rounded-md px-3 py-2 self-start transition-colors"
      >
        + Add {field.label.toLowerCase()}
      </button>
    </div>
  );
}

function ArrayBtn({
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

"use client";

import { useState } from "react";
import { saveVariables, deleteVariable } from "@/app/admin/variables/actions";

type Variable = { id?: string; key: string; value: string };

const inputClass =
  "font-body text-small text-ink bg-page border border-divider rounded-md px-3 py-2 focus:outline-none focus:border-ink w-full";

export function VariablesEditor({ initial }: { initial: Variable[] }) {
  const [vars, setVars] = useState<Variable[]>(initial);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");

  function setVar(i: number, patch: Partial<Variable>) {
    setVars((prev) => prev.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));
    setFeedback("");
  }

  async function handleDelete(i: number) {
    const v = vars[i];
    if (v.id) {
      if (!confirm(`Delete the variable ${v.key}?`)) return;
      setBusy(true);
      try {
        await deleteVariable(v.id);
      } catch (e) {
        setFeedback(e instanceof Error ? e.message : "Delete failed");
        setBusy(false);
        return;
      }
      setBusy(false);
    }
    setVars((prev) => prev.filter((_, idx) => idx !== i));
    setFeedback("");
  }

  async function handleSave() {
    setBusy(true);
    setFeedback("Saving…");
    try {
      await saveVariables(vars);
      setFeedback("Saved — the live site has been updated.");
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="border border-divider rounded-lg bg-page overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-divider bg-surface">
              <th className="text-left font-body text-label uppercase tracking-[0.05em] text-ink-secondary px-4 py-3 w-[280px]">
                Key
              </th>
              <th className="text-left font-body text-label uppercase tracking-[0.05em] text-ink-secondary px-4 py-3">
                Value
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {vars.map((v, i) => (
              <tr
                key={v.id ?? `new-${i}`}
                className="border-b border-divider last:border-0"
              >
                <td className="px-4 py-3 align-middle">
                  {v.id ? (
                    <code className="font-body text-small text-ink">
                      ${"{"}
                      {v.key}
                      {"}"}
                    </code>
                  ) : (
                    <input
                      value={v.key}
                      placeholder="NEW_KEY"
                      onChange={(e) =>
                        setVar(i, { key: e.target.value.toUpperCase() })
                      }
                      className={inputClass}
                    />
                  )}
                </td>
                <td className="px-4 py-3 align-middle">
                  <input
                    value={v.value}
                    onChange={(e) => setVar(i, { value: e.target.value })}
                    className={inputClass}
                  />
                </td>
                <td className="px-4 py-3 align-middle text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(i)}
                    disabled={busy}
                    className="font-body text-label text-ink-secondary hover:text-ink border border-divider rounded px-2 py-1 disabled:opacity-40 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setVars((prev) => [...prev, { key: "", value: "" }])}
          className="font-body text-small text-ink-secondary hover:text-ink border border-divider rounded-md px-3 py-2 transition-colors"
        >
          + Add variable
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={busy}
          className="font-body text-small font-medium bg-ink text-on-dark rounded-md px-4 py-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          Save changes
        </button>
        {feedback && (
          <span className="font-body text-small text-ink-secondary">{feedback}</span>
        )}
      </div>
    </div>
  );
}

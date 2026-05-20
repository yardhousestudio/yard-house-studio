"use client";

import { useState } from "react";
import { MediaBrowserModal } from "./MediaBrowserModal";

const inputClass =
  "font-body text-small text-ink bg-page border border-divider rounded-md px-3 py-2 focus:outline-none focus:border-ink w-full";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function ImageFieldInput({ label, value, onChange }: Props) {
  const [browserOpen, setBrowserOpen] = useState(false);
  const url = String(value ?? "").trim();

  function select(url: string) {
    onChange(url);
    setBrowserOpen(false);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-body text-small font-medium text-ink">{label}</span>

      {url ? (
        <div className="flex gap-3 items-start">
          <div className="w-24 shrink-0 rounded-md border border-divider overflow-hidden bg-surface aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => onChange(e.target.value)}
              className={inputClass}
              placeholder="Image URL"
            />
            <div className="flex flex-wrap gap-2">
              <FieldBtn onClick={() => setBrowserOpen(true)}>
                Change image
              </FieldBtn>
              <FieldBtn onClick={() => onChange("")}>Remove</FieldBtn>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setBrowserOpen(true)}
            className="font-body text-small text-ink border border-ink rounded-md px-3 py-2 self-start hover:bg-frame transition-colors"
          >
            Browse media…
          </button>
          <input
            type="text"
            value=""
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
            placeholder="Or paste an image URL"
          />
        </div>
      )}

      <MediaBrowserModal
        open={browserOpen}
        onClose={() => setBrowserOpen(false)}
        onSelect={select}
        title={label}
      />
    </div>
  );
}

function FieldBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-body text-label text-ink-secondary hover:text-ink border border-divider rounded-md px-2.5 py-1 transition-colors"
    >
      {children}
    </button>
  );
}

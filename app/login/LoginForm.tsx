"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "sending" | "sent" | "error";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <p className="font-body text-body text-ink-2 leading-relaxed">
        Check <span className="text-ink">{email}</span> for a sign-in link.
        You can close this tab once you&apos;ve clicked it.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="font-body text-small text-ink-2 flex flex-col gap-2">
        Email address
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="font-body text-body text-ink bg-page border border-divider rounded-md px-3 py-2 focus:outline-none focus:border-ink"
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="font-body text-small font-medium bg-ink text-on-dark rounded-md px-4 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send sign-in link"}
      </button>
      {status === "error" && (
        <p className="font-body text-small text-ink-2">{message}</p>
      )}
    </form>
  );
}

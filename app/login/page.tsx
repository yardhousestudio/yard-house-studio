import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in — Yard House Studio",
  robots: { index: false },
};

const ERRORS: Record<string, string> = {
  auth: "That sign-in link was invalid or expired. Request a new one.",
  forbidden: "That account doesn't have admin access to this site.",
};

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await props.searchParams;
  const errorMessage = error ? ERRORS[error] : undefined;

  return (
    <main className="min-h-screen bg-frame flex items-center justify-center px-6">
      <div className="w-full max-w-[400px] bg-page border border-divider rounded-lg p-8">
        <p className="font-brand italic text-[1.375rem] text-ink">
          Yard House Studio
        </p>
        <h1 className="font-display text-card-title text-ink mt-6">
          Admin sign in
        </h1>
        <p className="font-body text-small text-ink-secondary mt-2 mb-6 leading-relaxed">
          Enter your email and we&apos;ll send a one-time sign-in link.
        </p>
        {errorMessage && (
          <p className="font-body text-small text-ink bg-frame rounded-md px-3 py-2 mb-4">
            {errorMessage}
          </p>
        )}
        <LoginForm />
      </div>
    </main>
  );
}

"use client";

import { useState, useRef, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const from         = searchParams.get("from") ?? "/";

  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.replace(from);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Incorrect password");
        setPassword("");
        inputRef.current?.focus();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "var(--c-bg)", fontFamily: "var(--font-sans)" }}
    >
      {/* Card */}
      <div
        className="w-full max-w-sm rounded-3xl overflow-hidden"
        style={{
          background: "var(--c-surface)",
          border: "1px solid var(--c-border)",
          boxShadow: "0 8px 40px rgba(183,28,28,.12)",
        }}
      >
        {/* Header */}
        <div
          className="px-8 pt-8 pb-6 text-center"
          style={{ background: "linear-gradient(135deg, #7F0000 0%, #B71C1C 100%)" }}
        >
          <span className="text-5xl block mb-3">🪷</span>
          <h1 className="text-white font-bold text-[22px] leading-tight">
            Gurjar Matrimony
          </h1>
          <p className="text-red-200 text-[12px] mt-1 tracking-wide uppercase">
            Community Directory
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-7 flex flex-col gap-4">
          <div>
            <p
              className="text-center text-[15px] font-semibold mb-1"
              style={{ color: "var(--c-text)" }}
            >
              Members only
            </p>
            <p
              className="text-center text-[13px]"
              style={{ color: "var(--c-muted)" }}
            >
              Enter the community password to access profiles
            </p>
          </div>

          {/* Password input */}
          <div className="relative">
            <input
              ref={inputRef}
              type="password"
              placeholder="Community password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              autoFocus
              autoComplete="current-password"
              required
              className="w-full rounded-xl px-4 py-3.5 text-[15px] outline-none text-center tracking-[0.2em] placeholder:tracking-normal"
              style={{
                border: error
                  ? "1.5px solid #EF4444"
                  : "1.5px solid var(--c-border)",
                color: "var(--c-text)",
                background: error ? "#FEF2F2" : "var(--c-surface)",
              }}
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-center text-[13px] font-medium" style={{ color: "#EF4444" }}>
              {error}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-xl py-3.5 text-[15px] font-bold transition-opacity disabled:opacity-50"
            style={{ background: "var(--c-red)", color: "#fff" }}
          >
            {loading ? "Checking…" : "Enter Directory →"}
          </button>

          {/* Help text */}
          <p className="text-center text-[12px]" style={{ color: "var(--c-muted)" }}>
            Don&apos;t have the password? Contact{" "}
            <a
              href="tel:9811017754"
              className="font-semibold underline underline-offset-2"
              style={{ color: "var(--c-red)" }}
            >
              9811017754
            </a>
          </p>
        </form>
      </div>

      {/* Footer credit */}
      <p className="mt-6 text-[11px]" style={{ color: "var(--c-muted)" }}>
        Developed by{" "}
        <a
          href="https://softles.in"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold"
          style={{ color: "var(--c-red)" }}
        >
          Softles
        </a>
      </p>
    </div>
  );
}

// Wrap in Suspense because useSearchParams() needs it
export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

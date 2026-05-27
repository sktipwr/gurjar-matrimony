"use client";

import { useState } from "react";
import { Profile } from "@/types/profile";
import { formatIncome } from "@/lib/getData";

const isFresh = (ts: string) => {
  try { return Date.now() - new Date(ts).getTime() < 30 * 24 * 60 * 60 * 1000; }
  catch { return false; }
};

export default function ProfileCard({ profile }: { profile: Profile }) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError]  = useState(false);

  const female  = profile.gender === "Female";
  const initials = profile.name.split(" ").map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  const avatarGrad = female
    ? "linear-gradient(135deg,#F48FB1,#C2185B)"
    : "linear-gradient(135deg,#90CAF9,#1565C0)";

  const incomeShort = formatIncome(profile.income);

  const gotraShort = (() => {
    const g = profile.gotra?.trim();
    if (!g) return null;
    const first = g.split(/[/,\s]+/)[0].trim();
    if (/^(self|father|mother|nana|dada|paternal|maternal)$/i.test(first)) return null;
    return first.length <= 14 ? first : first.slice(0, 14);
  })();

  const subtitle = [
    profile.age ? `${profile.age} yrs` : null,
    profile.height || null,
    gotraShort || null,
  ].filter(Boolean).join(" · ");

  const hasMore = !!(profile.aboutPerson || profile.aboutFamily || profile.lookingFor);
  const fresh   = isFresh(profile.timestamp);

  return (
    <article
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: "var(--c-surface)",
        border: "1px solid var(--c-border)",
        boxShadow: "0 1px 4px rgba(183,28,28,.06)",
      }}
    >
      {/* ── Header: avatar + name ──────────────── */}
      <div className="flex items-start gap-3 px-3.5 pt-3.5 pb-2">
        {/* avatar */}
        <div className="shrink-0 relative">
          {profile.photoUrl && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.photoUrl}
              alt={profile.name}
              className="w-11 h-11 rounded-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
              style={{ background: avatarGrad }}
            >
              <span className="text-white font-extrabold text-[15px] select-none">
                {initials}
              </span>
            </div>
          )}
        </div>

        {/* name + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1.5">
            <p
              className="font-bold text-[14px] leading-tight truncate"
              style={{ color: "var(--c-text)" }}
            >
              {profile.name}
            </p>
            {/* gender badge */}
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide leading-none mt-0.5"
              style={{
                background: female ? "#FDE8F0" : "#E3EDF9",
                color: female ? "#C2185B" : "#1565C0",
              }}
            >
              {female ? "Bride" : "Groom"}
            </span>
          </div>

          {/* subtitle: age · height · gotra */}
          {subtitle && (
            <p className="text-[12px] mt-0.5 truncate" style={{ color: "var(--c-muted)" }}>
              {subtitle}
            </p>
          )}

          {/* location tags */}
          <div className="flex flex-wrap gap-1 mt-1.5">
            {profile.currentLocation && (
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none max-w-[160px] truncate"
                style={{ background: "#FEE2E2", color: "var(--c-red)" }}
                title={profile.currentLocation}
              >
                📍 {profile.currentLocation}
              </span>
            )}
            {fresh && (
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold leading-none uppercase tracking-wide"
                style={{ background: "#DCFCE7", color: "#166534" }}
              >
                New
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Info rows ─────────────────────────── */}
      <div
        className="mx-3.5 rounded-xl px-3 py-2.5 flex flex-col gap-1.5"
        style={{ background: "#FAF5F5" }}
      >
        {profile.qualification && (
          <div className="flex items-start gap-2 text-[12px]" style={{ color: "var(--c-text)" }}>
            <span className="shrink-0">🎓</span>
            <span className="line-clamp-1">{profile.qualification}</span>
          </div>
        )}
        {profile.profession && (
          <div className="flex items-start gap-2 text-[12px]" style={{ color: "var(--c-text)" }}>
            <span className="shrink-0">💼</span>
            <span className="line-clamp-1">{profile.profession}</span>
          </div>
        )}
        {incomeShort && (
          <div className="flex items-start gap-2 text-[12px]" style={{ color: "var(--c-text)" }}>
            <span className="shrink-0">💰</span>
            <span>{incomeShort}</span>
          </div>
        )}
        {profile.hometown && profile.hometown !== profile.currentLocation && (
          <div className="flex items-start gap-2 text-[12px]" style={{ color: "var(--c-muted)" }}>
            <span className="shrink-0">🏡</span>
            <span className="line-clamp-1">{profile.hometown}</span>
          </div>
        )}
      </div>

      {/* ── Expandable details ────────────────── */}
      {hasMore && (
        <div className="px-3.5 pt-1.5">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[12px] font-semibold w-fit"
            style={{ color: "var(--c-red)" }}
          >
            <span
              className="inline-block transition-transform duration-200"
              style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              ▾
            </span>
            {expanded ? "Less" : "More details"}
          </button>

          {expanded && (
            <div
              className="mt-1.5 mb-1 rounded-xl p-3 flex flex-col gap-2 text-[12px] leading-relaxed"
              style={{ background: "#FEF2F2" }}
            >
              {profile.aboutPerson && (
                <div>
                  <p className="font-bold text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "var(--c-red)" }}>About</p>
                  <p className="opacity-75 line-clamp-4">{profile.aboutPerson}</p>
                </div>
              )}
              {profile.aboutFamily && (
                <div>
                  <p className="font-bold text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "var(--c-red)" }}>Family</p>
                  <p className="opacity-75 line-clamp-4">{profile.aboutFamily}</p>
                </div>
              )}
              {profile.lookingFor && (
                <div>
                  <p className="font-bold text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "var(--c-red)" }}>Looking for</p>
                  <p className="opacity-75 line-clamp-3">{profile.lookingFor}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Action bar ────────────────────────── */}
      <div
        className="flex items-center gap-2 px-3.5 py-2.5 mt-auto"
        style={{ borderTop: "1px solid var(--c-border)" }}
      >
        {profile.contact ? (
          <a
            href={`tel:${profile.contact}`}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-[13px] font-semibold transition-opacity active:opacity-70"
            style={{ background: "#FEE2E2", color: "var(--c-red)" }}
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/>
            </svg>
            Call
          </a>
        ) : (
          <div className="flex-1" />
        )}

        {profile.bioDataUrl && (
          <a
            href={profile.bioDataUrl.replace("thumbnail?", "uc?export=download&")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-opacity active:opacity-70"
            style={{ background: "var(--c-red)", color: "#fff" }}
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zm-3-7H9v-2h6v2zm2 3H9v-2h8v2z"/>
            </svg>
            Bio Data
          </a>
        )}
      </div>
    </article>
  );
}

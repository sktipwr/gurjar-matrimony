"use client";

import { useState, useMemo, useRef } from "react";
import { Profile, Filters } from "@/types/profile";
import { INCOME_OPTIONS, formatIncome } from "@/lib/getData";
import ProfileCard from "./ProfileCard";

/* ─── types ──────────────────────────────────────────── */
interface DirectoryProps {
  profiles: Profile[];
  locations: string[];
}

const DEFAULT_FILTERS: Filters = {
  search: "",
  gender: "All",
  income: "",
  location: "",
  minAge: "",
  maxAge: "",
};

/* ─── small components ───────────────────────────────── */
function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-all active:scale-95 whitespace-nowrap"
      style={
        active
          ? { background: "var(--c-red)", color: "#fff", border: "1.5px solid var(--c-red)" }
          : { background: "var(--c-surface)", color: "var(--c-text)", border: "1.5px solid var(--c-border)" }
      }
    >
      {children}
    </button>
  );
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5"
       style={{ color: "var(--c-red)" }}>
      {children}
    </p>
  );
}

/* ─── main ───────────────────────────────────────────── */
export default function Directory({ profiles, locations }: DirectoryProps) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Filters>(k: K, v: Filters[K]) =>
    setFilters((p) => ({ ...p, [k]: v }));

  /* ── filtered list ─────────────────────────────────── */
  const filtered = useMemo(() => {
    let r = profiles;
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      r = r.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.profession.toLowerCase().includes(q) ||
          p.currentLocation.toLowerCase().includes(q) ||
          p.hometown.toLowerCase().includes(q) ||
          p.qualification.toLowerCase().includes(q)
      );
    }
    if (filters.gender !== "All") r = r.filter((p) => p.gender === filters.gender);
    if (filters.income)           r = r.filter((p) => p.income === filters.income);
    if (filters.location)         r = r.filter((p) => p.currentLocation.toLowerCase() === filters.location.toLowerCase());
    if (filters.minAge)           r = r.filter((p) => p.age !== null && p.age >= +filters.minAge);
    if (filters.maxAge)           r = r.filter((p) => p.age !== null && p.age <= +filters.maxAge);
    return r;
  }, [profiles, filters]);

  const activeCount = [
    filters.gender !== "All",
    !!filters.income,
    !!filters.location,
    !!(filters.minAge || filters.maxAge),
  ].filter(Boolean).length;

  const clearAll = () => {
    setFilters(DEFAULT_FILTERS);
    setSheetOpen(false);
  };

  /* ── active chip labels ──────────────────────────────  */
  const activeChips = [
    filters.gender !== "All" && {
      label: filters.gender === "Female" ? "Brides" : "Grooms",
      clear: () => set("gender", "All"),
    },
    filters.location && {
      label: `📍 ${filters.location}`,
      clear: () => set("location", ""),
    },
    filters.income && {
      label: `💰 ${formatIncome(filters.income) ?? filters.income}`,
      clear: () => set("income", ""),
    },
    (filters.minAge || filters.maxAge) && {
      label: `Age ${filters.minAge || "any"}–${filters.maxAge || "any"}`,
      clear: () => { set("minAge", ""); set("maxAge", ""); },
    },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <div>
      {/*
        ── Sticky filter bar ──────────────────────────────
        Mobile:  sticks at top-0 (header has scrolled away)
        sm+:     sticks at top-14 (sits below the sticky header, ~56px)
        Full-bleed background achieved with negative margins that
        cancel the parent's px-3/px-4 padding.
      */}
      <div
        className="sticky top-0 sm:top-14 z-30 -mx-3 sm:-mx-4 px-3 sm:px-4 pt-3 pb-2"
        style={{
          background: "var(--c-bg)",
          boxShadow: "0 3px 10px rgba(0,0,0,.07)",
        }}
      >
        {/* Search bar */}
        <div
          className="rounded-2xl flex items-center gap-2 px-3.5 py-3 mb-2.5"
          style={{ background: "var(--c-surface)", border: "1.5px solid var(--c-border)" }}
        >
          <svg className="w-4 h-4 shrink-0" style={{ color: "var(--c-red)" }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={searchRef}
            type="search"
            placeholder="Search by name, profession, city…"
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-gray-400"
            style={{ color: "var(--c-text)" }}
          />
          {filters.search && (
            <button onClick={() => set("search", "")} className="text-gray-400 hover:text-gray-600 shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          )}
        </div>

        {/* Chip row */}
        <div className="flex gap-2 overflow-x-auto chips-row pb-0.5">
        <Chip active={filters.gender === "All"} onClick={() => set("gender", "All")}>All</Chip>
        <Chip active={filters.gender === "Male"} onClick={() => set("gender", filters.gender === "Male" ? "All" : "Male")}>
          👦 Grooms
        </Chip>
        <Chip active={filters.gender === "Female"} onClick={() => set("gender", filters.gender === "Female" ? "All" : "Female")}>
          👧 Brides
        </Chip>

        {/* active filter chips */}
        {activeChips.filter(c => !["Grooms","Brides"].includes(c.label)).map((chip) => (
          <button
            key={chip.label}
            onClick={chip.clear}
            className="flex-shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold active:scale-95 whitespace-nowrap"
            style={{ background: "var(--c-red-light)", color: "var(--c-red)", border: "1.5px solid var(--c-red)" }}
          >
            {chip.label}
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        ))}

        {/* more filters button */}
        <button
          onClick={() => setSheetOpen(true)}
          className="flex-shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold active:scale-95 whitespace-nowrap ml-auto"
          style={
            activeCount > 0
              ? { background: "var(--c-gold-light)", color: "var(--c-gold)", border: `1.5px solid var(--c-gold)` }
              : { background: "var(--c-surface)", color: "var(--c-muted)", border: "1.5px solid var(--c-border)" }
          }
        >
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39A.998.998 0 0019 4H5a1 1 0 00-.75 1.61z"/>
          </svg>
          Filters{activeCount > 0 && ` (${activeCount})`}
        </button>
        </div> {/* end chip row */}
      </div> {/* end sticky wrapper */}

      {/* ── Result count ───────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px]" style={{ color: "var(--c-muted)" }}>
          Showing{" "}
          <strong style={{ color: "var(--c-text)" }}>{filtered.length}</strong>
          {" "}of{" "}
          <strong style={{ color: "var(--c-text)" }}>{profiles.length}</strong>
          {" "}profiles
        </p>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-[12px] font-semibold underline underline-offset-2"
            style={{ color: "var(--c-red)" }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* ── Profile grid ───────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5">
          {filtered.map((p) => (
            <ProfileCard key={p.id} profile={p} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="text-5xl mb-3">🔍</p>
          <p className="font-semibold" style={{ color: "var(--c-text)" }}>No profiles found</p>
          <p className="text-[13px] mt-1" style={{ color: "var(--c-muted)" }}>Try adjusting your search or filters</p>
          <button onClick={clearAll} className="mt-4 text-[13px] font-semibold underline" style={{ color: "var(--c-red)" }}>
            Reset everything
          </button>
        </div>
      )}

      {/* ── Filter sheet overlay ────────────────────────── */}
      {sheetOpen && (
        <>
          {/* backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setSheetOpen(false)}
          />

          {/* drawer */}
          <div
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl max-h-[85dvh] overflow-y-auto"
            style={{ background: "var(--c-surface)" }}
          >
            {/* handle */}
            <div className="sticky top-0 pt-3 pb-2 flex flex-col items-center gap-2"
                 style={{ background: "var(--c-surface)", borderBottom: "1px solid var(--c-border)" }}>
              <div className="w-10 h-1 rounded-full bg-gray-300" />
              <div className="w-full flex items-center justify-between px-5 pb-1">
                <p className="font-bold text-[16px]" style={{ color: "var(--c-text)" }}>Filter Profiles</p>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full"
                  style={{ background: "var(--c-border)" }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-5 py-4 flex flex-col gap-5 pb-8">
              {/* Gender */}
              <div>
                <FilterLabel>Looking for</FilterLabel>
                <div className="flex gap-2">
                  {(["All", "Male", "Female"] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => set("gender", g)}
                      className="flex-1 rounded-xl py-2.5 text-[13px] font-semibold transition-all"
                      style={
                        filters.gender === g
                          ? { background: "var(--c-red)", color: "#fff" }
                          : { background: "var(--c-red-light)", color: "var(--c-red)" }
                      }
                    >
                      {g === "All" ? "Everyone" : g === "Male" ? "Grooms" : "Brides"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age range */}
              <div>
                <FilterLabel>Age range</FilterLabel>
                <div className="flex items-center gap-3">
                  <input
                    type="number" placeholder="Min" min={18} max={70}
                    value={filters.minAge}
                    onChange={(e) => set("minAge", e.target.value)}
                    className="flex-1 rounded-xl px-3 py-2.5 text-[14px] outline-none"
                    style={{ border: "1.5px solid var(--c-border)", color: "var(--c-text)" }}
                  />
                  <span style={{ color: "var(--c-muted)" }} className="text-[13px]">to</span>
                  <input
                    type="number" placeholder="Max" min={18} max={70}
                    value={filters.maxAge}
                    onChange={(e) => set("maxAge", e.target.value)}
                    className="flex-1 rounded-xl px-3 py-2.5 text-[14px] outline-none"
                    style={{ border: "1.5px solid var(--c-border)", color: "var(--c-text)" }}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <FilterLabel>Current city</FilterLabel>
                <select
                  value={filters.location}
                  onChange={(e) => set("location", e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-[14px] outline-none appearance-none"
                  style={{ border: "1.5px solid var(--c-border)", color: "var(--c-text)", background: "var(--c-surface)" }}
                >
                  <option value="">Any city</option>
                  {locations.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              {/* Income */}
              <div>
                <FilterLabel>Annual income</FilterLabel>
                <div className="flex flex-wrap gap-2">
                  {INCOME_OPTIONS.map((inc) => (
                    <button
                      key={inc}
                      onClick={() => set("income", filters.income === inc ? "" : inc)}
                      className="rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all"
                      style={
                        filters.income === inc
                          ? { background: "var(--c-red)", color: "#fff" }
                          : { background: "var(--c-red-light)", color: "var(--c-red)" }
                      }
                    >
                      {formatIncome(inc) ?? inc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply / Clear */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={clearAll}
                  className="flex-1 rounded-xl py-3 text-[14px] font-semibold"
                  style={{ background: "var(--c-red-light)", color: "var(--c-red)" }}
                >
                  Clear all
                </button>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="flex-[2] rounded-xl py-3 text-[14px] font-bold"
                  style={{ background: "var(--c-red)", color: "#fff" }}
                >
                  Show {filtered.length} profiles
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import { fetchProfiles, getUniqueLocations } from "@/lib/getData";
import { CONTACT_NUMBER, FORM_URL } from "@/lib/config";
import Directory from "@/components/Directory";
import Footer from "@/components/Footer";
import SubmitFab from "@/components/SubmitFab";

export const revalidate = 3600;

export default async function HomePage() {
  let profiles: Awaited<ReturnType<typeof fetchProfiles>> = [];
  let error: string | null = null;

  try {
    profiles = await fetchProfiles();
  } catch (e) {
    error = (e as Error).message;
  }

  const locations = getUniqueLocations(profiles);
  const maleCount  = profiles.filter((p) => p.gender === "Male").length;
  const femaleCount = profiles.filter((p) => p.gender === "Female").length;

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "var(--font-sans)" }}>

      {/* ── Top bar ─────────────────────────────────── */}
      {/* sticky on sm+; scrolls away on mobile */}
      <header style={{ background: "var(--c-red)" }} className="sm:sticky sm:top-0 sm:z-40 shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">

          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-2xl leading-none">🪷</span>
            <div>
              <p className="text-white font-bold text-[17px] leading-tight tracking-tight">
                Gurjar Matrimony
              </p>
              <p className="text-red-200 text-[10px] leading-tight tracking-wide uppercase">
                Community Directory
              </p>
            </div>
          </div>

          {/* Right side: stats + submit button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Stats pills — hidden on xs */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-center bg-white/15 rounded-lg px-3 py-1.5">
                <p className="text-white font-bold text-lg leading-none">{profiles.length}</p>
                <p className="text-red-200 text-[10px] leading-none mt-0.5">Profiles</p>
              </div>
              <div className="text-center bg-white/15 rounded-lg px-3 py-1.5">
                <p className="text-white font-bold text-lg leading-none">{maleCount}</p>
                <p className="text-red-200 text-[10px] leading-none mt-0.5">Grooms</p>
              </div>
              <div className="text-center bg-white/15 rounded-lg px-3 py-1.5">
                <p className="text-white font-bold text-lg leading-none">{femaleCount}</p>
                <p className="text-red-200 text-[10px] leading-none mt-0.5">Brides</p>
              </div>
            </div>

            {/* Submit profile button — desktop only (FAB handles mobile) */}
            <a
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold transition-opacity hover:opacity-90 shrink-0"
              style={{ background: "#fff", color: "var(--c-red)" }}
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
              Submit Profile
            </a>
          </div>
        </div>
      </header>

      {/* ── Notice banner ───────────────────────────── */}
      <div style={{ background: "var(--c-gold-light)", borderBottom: "1px solid #F0D9A0" }}>
        <p className="max-w-5xl mx-auto px-4 py-2 text-center text-[12px]"
           style={{ color: "var(--c-gold)" }}>
          For queries or to remove an entry, call{" "}
          <a href={`tel:${CONTACT_NUMBER}`} className="font-semibold underline underline-offset-2">
            {CONTACT_NUMBER}
          </a>
        </p>
      </div>

      {/* ── Main content ────────────────────────────── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6">
        {error ? (
          <div className="rounded-2xl p-6 text-center text-sm"
               style={{ background: "#FEE2E2", color: "var(--c-red)" }}>
            <p className="font-semibold">Could not load profiles</p>
            <p className="mt-1 opacity-75">{error}</p>
          </div>
        ) : (
          <Directory profiles={profiles} locations={locations} />
        )}
      </main>

      {/* ── Footer ──────────────────────────────────── */}
      <Footer />

      {/* ── Mobile FAB ──────────────────────────────── */}
      <SubmitFab />
    </div>
  );
}

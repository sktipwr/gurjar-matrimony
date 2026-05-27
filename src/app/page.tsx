import { fetchProfiles, getUniqueLocations } from "@/lib/getData";
import Directory from "@/components/Directory";

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
  const maleCount = profiles.filter((p) => p.gender === "Male").length;
  const femaleCount = profiles.filter((p) => p.gender === "Female").length;

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "var(--font-sans)" }}>

      {/* ── Top bar ── */}
      {/* sticky only on sm+ — on mobile it scrolls away */}
      <header style={{ background: "var(--c-red)" }} className="sm:sticky sm:top-0 sm:z-40 shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
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

          {/* Stats pills */}
          <div className="flex items-center gap-2">
            <div className="text-center bg-white/15 rounded-lg px-3 py-1.5 hidden sm:block">
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
        </div>
      </header>

      {/* ── Notice banner ── */}
      <div style={{ background: "var(--c-gold-light)", borderBottom: "1px solid #F0D9A0" }}>
        <p className="max-w-5xl mx-auto px-4 py-2 text-center text-[12px]"
           style={{ color: "var(--c-gold)" }}>
          For queries or to remove an entry, call{" "}
          <a href="tel:9811017754" className="font-semibold underline underline-offset-2">
            9811017754
          </a>
        </p>
      </div>

      {/* ── Main content ── */}
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

      {/* ── Footer ── */}
      <footer className="py-5 text-center text-[11px]" style={{ color: "var(--c-muted)", borderTop: "1px solid var(--c-border)" }}>
        Gurjar Matrimony · Community directory · Not a commercial service
      </footer>
    </div>
  );
}

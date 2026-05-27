import { CONTACT_NUMBER, FORM_URL } from "@/lib/config";

export default function Footer() {
  return (
    <footer
      className="mt-10"
      style={{ borderTop: "1px solid var(--c-border)", background: "var(--c-surface)" }}
    >
      {/* ── Submit CTA band ─────────────────────────── */}
      <div
        className="text-center px-4 py-8"
        style={{
          background: "linear-gradient(135deg, #7F0000 0%, #B71C1C 100%)",
        }}
      >
        <p className="text-white/80 text-[13px] uppercase tracking-widest font-semibold mb-1">
          Looking to be listed?
        </p>
        <h2 className="text-white text-[22px] font-bold mb-2">
          Add Your Profile to the Directory
        </h2>
        <p className="text-white/70 text-[13px] mb-5 max-w-sm mx-auto">
          Fill in a short form and your profile will appear here within the hour — completely free.
        </p>
        <a
          href={FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-[14px] transition-opacity hover:opacity-90 active:opacity-75"
          style={{ background: "#fff", color: "var(--c-red)" }}
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
          </svg>
          Submit Your Profile
        </a>
      </div>

      {/* ── Usage info grid ─────────────────────────── */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-5 py-8 max-w-3xl mx-auto"
      >
        <div className="text-center sm:text-left">
          <p className="font-bold text-[13px] mb-2 flex items-center justify-center sm:justify-start gap-1.5"
             style={{ color: "var(--c-red)" }}>
            <span>📋</span> How It Works
          </p>
          <ul className="text-[12px] space-y-1" style={{ color: "var(--c-muted)" }}>
            <li>• Submit via the Google Form above</li>
            <li>• Profile appears within 1 hour</li>
            <li>• Searchable & filterable instantly</li>
            <li>• Free — no registration needed</li>
          </ul>
        </div>

        <div className="text-center sm:text-left">
          <p className="font-bold text-[13px] mb-2 flex items-center justify-center sm:justify-start gap-1.5"
             style={{ color: "var(--c-red)" }}>
            <span>🔒</span> Privacy & Data
          </p>
          <ul className="text-[12px] space-y-1" style={{ color: "var(--c-muted)" }}>
            <li>• All data is user-submitted</li>
            <li>• Contact info shown only on request</li>
            <li>• Request removal anytime</li>
            <li>• No passwords or accounts stored</li>
          </ul>
        </div>

        <div className="text-center sm:text-left">
          <p className="font-bold text-[13px] mb-2 flex items-center justify-center sm:justify-start gap-1.5"
             style={{ color: "var(--c-red)" }}>
            <span>📞</span> Need Help?
          </p>
          <ul className="text-[12px] space-y-1.5" style={{ color: "var(--c-muted)" }}>
            <li>To add, edit or remove a listing:</li>
            <li>
              <a
                href={`tel:${CONTACT_NUMBER}`}
                className="font-bold underline underline-offset-2"
                style={{ color: "var(--c-red)" }}
              >
                {CONTACT_NUMBER}
              </a>
            </li>
            <li className="pt-1">Community-run · Not commercial</li>
          </ul>
        </div>
      </div>

      {/* ── Softles credit bar ──────────────────────── */}
      <div
        className="px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]"
        style={{
          borderTop: "1px solid var(--c-border)",
          color: "var(--c-muted)",
        }}
      >
        <p>
          Gurjar Matrimony · Community directory · Not a commercial matrimony service
        </p>
        <p className="flex items-center gap-1 shrink-0">
          Developed by{" "}
          <a
            href="https://softles.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:underline underline-offset-2 flex items-center gap-1 ml-1"
            style={{ color: "var(--c-red)" }}
          >
            {/* Softles wordmark */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            Softles
          </a>
          <span className="mx-1 opacity-40">·</span>
          <a
            href="https://softles.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline underline-offset-2 opacity-60 hover:opacity-100"
          >
            softles.in
          </a>
        </p>
      </div>
    </footer>
  );
}

"use client";

import { FORM_URL } from "@/lib/config";

/**
 * Floating Action Button — "Submit Profile"
 * Visible on mobile, anchored bottom-right.
 * Hidden on sm+ (the footer CTA handles it on desktop).
 */
export default function SubmitFab() {
  return (
    <a
      href={FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="sm:hidden fixed bottom-5 right-4 z-40 flex items-center gap-2 rounded-full px-4 py-3 shadow-lg text-[13px] font-bold active:opacity-80 transition-opacity"
      style={{
        background: "var(--c-red)",
        color: "#fff",
        boxShadow: "0 4px 20px rgba(183,28,28,.40)",
      }}
    >
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
      </svg>
      Submit Profile
    </a>
  );
}

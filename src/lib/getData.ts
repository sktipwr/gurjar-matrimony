import { Profile } from "@/types/profile";
import { SHEET_ID } from "./config";

const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

function parseAge(raw: string): number | null {
  if (!raw) return null;
  const match = raw.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

function normalizeGender(raw: string): "Male" | "Female" | "Other" {
  const lower = raw.toLowerCase().trim();
  if (lower === "male" || lower === "m") return "Male";
  if (lower === "female" || lower === "f") return "Female";
  return "Other";
}

function extractDriveUrl(raw: string): string | null {
  if (!raw) return null;
  const idMatch = raw.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) {
    return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w300`;
  }
  return null;
}

function parseCSV(text: string): string[][] {
  const results: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"' && inQuotes && next === '"') {
      current += '"';
      i++;
    } else if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      row.push(current.trim());
      current = "";
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && next === '\n') i++;
      row.push(current.trim());
      results.push(row);
      row = [];
      current = "";
    } else {
      current += ch;
    }
  }

  if (current || row.length > 0) {
    row.push(current.trim());
    results.push(row);
  }

  return results;
}

export async function fetchProfiles(): Promise<Profile[]> {
  const res = await fetch(CSV_URL, {
    next: { revalidate: 3600 }, // re-fetch every hour
    redirect: "follow",
  });

  if (!res.ok) throw new Error(`Failed to fetch sheet: ${res.status}`);
  const text = await res.text();

  const rows = parseCSV(text);

  // Row 0 = note, Row 1 = headers, Rows 2+ = data
  const dataRows = rows.slice(2).filter((r) => r.length > 3 && r[3]?.trim());

  return dataRows.map((row, idx) => {
    const get = (i: number) => row[i]?.trim() ?? "";

    return {
      id: idx + 1,
      timestamp: get(0),
      submittedBy: get(1),
      relation: get(2),
      name: get(3),
      gender: normalizeGender(get(4)),
      age: parseAge(get(5)),
      ageRaw: get(5),
      height: get(6),
      currentLocation: get(7),
      hometown: get(8),
      contact: get(9),
      gotra: get(10),
      qualification: get(11),
      profession: get(12),
      income: get(13),
      aboutPerson: get(14),
      aboutFamily: get(15),
      photoUrl: extractDriveUrl(get(16)),
      bioDataUrl: extractDriveUrl(get(17)),
      lookingFor: get(18),
    };
  });
}

export function getUniqueLocations(profiles: Profile[]): string[] {
  const locs = new Set<string>();
  profiles.forEach((p) => {
    if (p.currentLocation && p.currentLocation.length < 40) {
      locs.add(p.currentLocation);
    }
  });
  return Array.from(locs).sort();
}

export const INCOME_OPTIONS = [
  "No Income",
  "0 - 5,00,000",
  "5,00,000 - 10,00,000",
  "10,00,000 - 15,00,000",
  "15,00,000 - 20,00,000",
  "20,00,000 - 25,00,000",
  "25,00,000 - 30,00,000",
  "> 30,00,000",
];

/**
 * Convert raw height value to a readable ft/in string.
 * Handles decimals like 5.1 → 5'1", 5.11 → 5'11", already-formatted strings, and cm.
 */
export function formatHeight(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const h = raw.trim();
  // Already has ft/inch markers or cm — return as-is
  if (/['"ftFT]|feet|inch|cms?/.test(h)) return h;
  // Decimal format: 5.8, 5.11, 6.0
  const dec = h.match(/^(\d+)\.(\d+)$/);
  if (dec) return `${dec[1]}'${dec[2]}"`;
  // Plain integer that looks like feet (4–7)
  const n = parseInt(h, 10);
  if (!isNaN(n) && n >= 4 && n <= 7) return `${n}'0"`;
  // Anything else (e.g. "170 cm") — return as-is
  return h;
}

/**
 * Format a Google Sheets timestamp into "Jan 2024" style.
 * Sheets exports timestamps as "M/D/YYYY H:MM:SS" or ISO.
 */
export function formatSubmittedDate(ts: string | null | undefined): string | null {
  if (!ts?.trim()) return null;
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  } catch { return null; }
}

/** Convert raw income string like "10,00,000 - 15,00,000" → "₹10L – 15L /yr" */
export function formatIncome(raw: string | null | undefined): string | null {
  if (!raw?.trim() || raw === "No Income") return raw?.trim() || null;
  // replace X,00,000 → XL  and  X,00,00,000 → XCr
  const fmt = raw
    .replace(/(\d+),00,00,000/g, "$1Cr")
    .replace(/(\d+),00,000/g, "$1L");
  return `₹${fmt} /yr`;
}

// ── Time helpers ───────────────────────────────────────────────────────────────

const pad = (n: number) => String(n).padStart(2, "0");

export const addHalfHour = (time: string): string => {
  try {
    const [t, mer] = time.split(" ");
    const [h, m] = t.split(":").map(Number);
    const base = (mer === "PM" && h !== 12 ? h + 12 : mer === "AM" && h === 12 ? 0 : h) * 60 + m + 30;
    const nh = Math.floor(base / 60) % 24;
    const nm = base % 60;
    return `${pad(nh % 12 || 12)}:${pad(nm)} ${nh < 12 ? "AM" : "PM"}`;
  } catch {
    return time;
  }
};

export const getInitials = (name: string): string =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

// ── Vital status color ─────────────────────────────────────────────────────────

export type VitalStatus = string | null;

export const vitalColor = {
  bp: (v: string): VitalStatus => {
    const x = parseInt(v);
    return x >= 140 ? "#dc2626" : x >= 130 ? "#d97706" : "#16a34a";
  },
  hr: (v: string): VitalStatus => {
    const x = parseInt(v);
    return x > 100 ? "#dc2626" : x < 60 ? "#d97706" : "#16a34a";
  },
  spo2: (v: string): VitalStatus => {
    const x = parseInt(v);
    return x < 94 ? "#dc2626" : x < 96 ? "#d97706" : "#16a34a";
  },
  temp: (v: string): VitalStatus => {
    const x = parseFloat(v);
    return x >= 100.4 ? "#dc2626" : x < 97 ? "#d97706" : "#16a34a";
  },
  rr: (v: string): VitalStatus => {
    const x = parseInt(v);
    return x > 20 ? "#dc2626" : x < 12 ? "#d97706" : "#16a34a";
  },
  bmi: (v: string): VitalStatus => {
    const x = parseFloat(v);
    if (!x) return null;
    return x >= 30 ? "#dc2626" : x >= 25 || x < 18.5 ? "#d97706" : "#16a34a";
  },
};
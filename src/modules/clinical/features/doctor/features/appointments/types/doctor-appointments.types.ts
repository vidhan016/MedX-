// ── Patient / Queue ────────────────────────────────────────────────────────────

export interface PatientFlag {
  label: string;
  color: string;
  bg: string;
}

export interface Allergy {
  allergen: string;
  severity?: string;
}

export interface Vitals {
  bp: string;
  pulse: string;
  spo2: string;
  temp: string;
  rr?: string;
  weight: string;
  height: string;
  bmi?: string;
}

export interface QueuePatient {
  id: string;
  salutation: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone?: string;
  city?: string;
  state?: string;
  token: number;
  isNew: boolean;
  appointmentTime: string;
  visitType: string;
  appointmentType: string;
  vitals: Vitals;
  allergies?: Allergy[];
  flag?: PatientFlag;
  natureBadge?: string | string[];
  emergencyContact?: boolean;
  emergencyPhone?: string;
  diagnoses?: string[];
}

// ── Filters ────────────────────────────────────────────────────────────────────

export type QueueView    = "list" | "grid";
export type PatientTab   = "queue" | "attended";

export interface QueueFilters {
  search: string;
  date: string;
  status: string;
  visitType: string;
  apptType: string;
  sort: string;
}

// ── Stats ──────────────────────────────────────────────────────────────────────

export interface AppointmentStats {
  totalToday: number;
  attended: number;
  waiting: number;
  upcoming: number;
}
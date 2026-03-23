// ── Prescription item ─────────────────────────────────────────────────────────

export interface RxItem {
  drug: string;
  dose?: string;
  freq?: string;
  duration?: string;
  instructions?: string;
}

// ── Patient record ─────────────────────────────────────────────────────────────

export interface PatientFlag {
  label: string;
  color: string;
  bg: string;
}

export interface PatientAllergy {
  allergen: string;
  severity?: string;
}

export interface PatientVitals {
  bp: string;
  pulse: string;
  spo2: string;
  temp: string;
  rr?: string;
  weight: string;
  height: string;
  bmi?: string;
}

export interface HistoryPatient {
  id: string;
  mrn: string;
  salutation: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone?: string;
  city?: string;
  state?: string;
  emergencyContact?: boolean;
  emergencyPhone?: string;
  isNew: boolean;
  visits: number;
  lastVisit?: string;
  attendedAt?: string | null;
  lastDiag?: string;
  diagnosis?: string;
  visitType?: string;
  appointmentType?: string;
  flag?: PatientFlag;
  natureBadges?: string[];
  allergies?: PatientAllergy[];
  lastPrescription?: RxItem[];
  vitals?: PatientVitals;
}

// ── Filters ────────────────────────────────────────────────────────────────────

export interface PatientFilters {
  search: string;
  gender: string;
  blood: string;
  allergy: string;
  sort: string;
}

export type PatientsView = "list" | "grid";
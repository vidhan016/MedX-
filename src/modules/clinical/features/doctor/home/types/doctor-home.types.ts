// ── Stats ──────────────────────────────────────────────────────────────────────

export interface DoctorStats {
  totalToday: number;
  attended: number;
  pending: number;
  totalRevenue: number;
  cancelled: number;
  noShow: number;
}

export interface NextPatient {
  salutation: string;
  name: string;
  age: number;
  gender: string;
  appointmentTime: string;
}

// ── Schedule ───────────────────────────────────────────────────────────────────

export type SlotState = "done" | "active" | "pending";

export interface ScheduleSlot {
  time: string;         // "09:00"
  name: string;
  state: SlotState;
  visitType: string;    // "Follow-Up" | "New Visit" etc.
  appointmentType: string; // "In-Person" | "Tele" etc.
}

// ── Upcoming ───────────────────────────────────────────────────────────────────

export type AppointmentType = "New" | "Follow-Up";

export interface UpcomingAppointment {
  id: string;
  time: string;
  name: string;
  age: number;
  complaint: string;
  type: AppointmentType;
}

// ── Diagnoses ──────────────────────────────────────────────────────────────────

export type DiagFilter = "today" | "week" | "month" | "custom";

export interface DiagnosisItem {
  name: string;
  count: number;
  pct: number;
}

export interface CustomRange {
  from: string;
  to: string;
}

// ── Activity ───────────────────────────────────────────────────────────────────

export type ActivityType = "consult" | "queue" | "new" | "lab" | "info";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  text: string;
  time: string;
}

// ── Charts ─────────────────────────────────────────────────────────────────────

export interface WeeklyFlowPoint {
  day: string;
  val: number;
}

export interface DrugItem {
  name: string;
  count: number;
  pct: number;
}
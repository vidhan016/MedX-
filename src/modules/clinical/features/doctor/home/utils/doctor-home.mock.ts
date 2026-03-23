import type {
  StatsData,
  ActivityData,
} from "../hooks/useDoctorHome";
import type {
  ScheduleSlot,
  UpcomingAppointment,
  DiagnosisItem,
  WeeklyFlowPoint,
  DrugItem,
} from "../types/doctor-home.types";

// ── Stats + next patient ───────────────────────────────────────────────────────

export const MOCK_STATS: StatsData = {
  stats: {
    totalToday:   12,
    attended:     7,
    pending:      5,
    totalRevenue: 18400,
    cancelled:    1,
    noShow:       2,
  },
  nextPatient: {
    salutation: "Mr.",
    name: "Rohit Singh",
    age: 34,
    gender: "Male",
    appointmentTime: "03:00 PM",
  },
};

// ── Today's schedule ──────────────────────────────────────────────────────────

export const MOCK_SCHEDULE: ScheduleSlot[] = [
  { time: "09:00", name: "Priya Sharma",   state: "done",    visitType: "Follow-Up",        appointmentType: "Walk-In"    },
  { time: "09:30", name: "Amit Patel",     state: "done",    visitType: "New Consultation", appointmentType: "Telephonic" },
  { time: "10:00", name: "Sunita Desai",   state: "done",    visitType: "Follow-Up",        appointmentType: "Walk-In"    },
  { time: "10:30", name: "Karan Shah",     state: "active",  visitType: "New Consultation", appointmentType: "Doctor"     },
  { time: "11:00", name: "Meena Gupta",    state: "pending", visitType: "Check-Up",         appointmentType: "E-mail"     },
  { time: "11:30", name: "Rohit Singh",    state: "pending", visitType: "Follow-Up",        appointmentType: "Walk-In"    },
  { time: "12:00", name: "Arvind Joshi",   state: "pending", visitType: "Follow-Up",        appointmentType: "Telephonic" },
];

// ── Upcoming appointments ─────────────────────────────────────────────────────

export const MOCK_UPCOMING: UpcomingAppointment[] = [
  { id: "u1", time: "11:00", name: "Meena Gupta",   age: 29, complaint: "Low mood, fatigue",          type: "New"       },
  { id: "u2", time: "11:30", name: "Rohit Singh",   age: 34, complaint: "Follow-up — anxiety review", type: "Follow-Up" },
  { id: "u3", time: "12:00", name: "Arvind Joshi",  age: 51, complaint: "Sleep disturbance",          type: "Follow-Up" },
  { id: "u4", time: "02:30", name: "Nisha Kapoor",  age: 22, complaint: "First visit — depression",   type: "New"       },
  { id: "u5", time: "03:00", name: "Suresh Verma",  age: 45, complaint: "Medication review",          type: "Follow-Up" },
];

// ── Top diagnoses ─────────────────────────────────────────────────────────────

export const MOCK_DIAGNOSES: DiagnosisItem[] = [
  { name: "Major Depressive Disorder", count: 18, pct: 100 },
  { name: "Generalized Anxiety Disorder", count: 14, pct: 78 },
  { name: "Primary Insomnia",          count: 10, pct: 56 },
  { name: "Bipolar Disorder Type II",  count: 7,  pct: 39 },
  { name: "PTSD",                      count: 5,  pct: 28 },
  { name: "OCD",                       count: 4,  pct: 22 },
];

// ── Recent activity + charts ──────────────────────────────────────────────────

export const MOCK_WEEKLY_FLOW: WeeklyFlowPoint[] = [
  { day: "Mon", val: 8  },
  { day: "Tue", val: 12 },
  { day: "Wed", val: 11 },
  { day: "Thu", val: 14 },
  { day: "Fri", val: 9  },
  { day: "Sat", val: 6  },
  { day: "Sun", val: 3  },
];

export const MOCK_TOP_DRUGS: DrugItem[] = [
  { name: "Sertraline 50mg",    count: 22, pct: 100 },
  { name: "Escitalopram 10mg",  count: 18, pct: 82  },
  { name: "Clonazepam 0.5mg",   count: 15, pct: 68  },
  { name: "Lithium 300mg",      count: 12, pct: 55  },
  { name: "Quetiapine 25mg",    count: 9,  pct: 41  },
];

export const MOCK_ACTIVITY: ActivityData = {
  activity: [
    { id: "a1", type: "consult", text: "Consulted Priya Sharma — MDD follow-up",              time: "09:10 AM" },
    { id: "a2", type: "consult", text: "Consulted Amit Patel — Insomnia review",               time: "09:42 AM" },
    { id: "a3", type: "new",     text: "Sunita Desai registered as new patient",               time: "09:55 AM" },
    { id: "a4", type: "lab",     text: "PHQ-9 score updated for Karan Shah",                   time: "10:18 AM" },
    { id: "a5", type: "queue",   text: "Meena Gupta added to queue",                           time: "10:30 AM" },
    { id: "a6", type: "info",    text: "Session started — Dr. R. Mehta logged in",             time: "08:55 AM" },
  ],
  weeklyFlow: MOCK_WEEKLY_FLOW,
  topDrugs:   MOCK_TOP_DRUGS,
};
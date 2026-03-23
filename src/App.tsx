import { useState } from "react";
import './App.css'

import MainLayout from "./core/layout/MainLayout";
import { type AppTab, type ConsultStep, type PatientBasic } from "./core/layout/Header/Header";
import { type Notification } from "./core/layout/components/NotificationPanel";
import DoctorHomePage from "./modules/clinical/features/doctor/features/home/pages/DoctorHomePage";
import DoctorAppointmentsPage from "./modules/clinical/features/doctor/features/appointments/pages/DoctorAppointmentsPage";
import DoctorPatientsPage from "./modules/clinical/features/doctor/features/patients/pages/DoctorPatientsPage";
import ReportsPage from "./modules/clinical/features/doctor/features/reports/pages/ReportsPage";
import type { HistoryPatient } from "./modules/clinical/features/doctor/features/patients/types/doctor-patients.types";

// ── Consultation steps ─────────────────────────────────────────────────────────

const CONSULT_STEPS: ConsultStep[] = [
  { id: "chief",      label: "Chief Complaints" },
  { id: "assessment", label: "Assessment" },
  { id: "behaviour",  label: "Behaviour & MSE" },
  { id: "diagnosis",  label: "Diagnosis" },
  { id: "rx",         label: "Prescription" },
  { id: "orders",     label: "Clinical Orders" },
  { id: "personal",   label: "Personal Info" },
  { id: "contacts",   label: "Contacts" },
  { id: "family",     label: "Family History" },
  { id: "history",    label: "Medical History" },
  { id: "substance",  label: "Substance Use" },
  { id: "social",     label: "Social History" },
];

// ── Seed notifications ─────────────────────────────────────────────────────────

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "emergency",
    title: "Emergency Appointment Added",
    message: "Rohit Singh — Emergency slot booked for 03:00 PM today.",
    timeAgo: "2 mins ago",
    read: false,
  },
  {
    id: "2",
    type: "success",
    title: "Vitals Recorded",
    message: "Vitals saved for Priya Sharma — BP 110/70, Pulse 68 BPM.",
    timeAgo: "15 mins ago",
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "Appointment Rescheduled",
    message: "Meena Gupta rescheduled to Feb 22, 2026 at 10:00 AM.",
    timeAgo: "1 hour ago",
    read: false,
  },
  {
    id: "4",
    type: "default",
    title: "New Patient Registered",
    message: "Karan Shah registered successfully with ID P007.",
    timeAgo: "3 hours ago",
    read: true,
  },
];

// ── Tab → breadcrumb label map ─────────────────────────────────────────────────

const TAB_LABELS: Partial<Record<AppTab, string>> = {
  home:    "Home",
  queue:   "Appointments",
  history: "Patients",
  revenue: "Reports",
};

// ── App ────────────────────────────────────────────────────────────────────────

export default function App() {
  // ── Navigation state ──
  const [tab, setTab]               = useState<AppTab>("home");
  const [prevTab, setPrevTab]       = useState<AppTab>("home");
  const [breadcrumb, setBreadcrumb] = useState<string[]>(["Home"]);
  const [cStep]                     = useState<number>(0);
  const [consulting, setConsulting] = useState<PatientBasic | null>(null);
  const [profilePat, setProfilePat] = useState<PatientBasic | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS);
  const [bookModal, setBookModal]   = useState<boolean>(false);
  const [regModal, setRegModal]     = useState<boolean>(false);

  // ── Visit history modal — used by VisitHistoryModal when built ──
  const [visitHistPat, setVisitHistPat] = useState<HistoryPatient | null>(null);

  const handleMarkAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSetTab = (next: AppTab) => {
    setPrevTab(tab);
    setTab(next);
    if (TAB_LABELS[next]) setBreadcrumb([TAB_LABELS[next]!]);
  };

  return (
    <MainLayout
      tab={tab}
      setTab={handleSetTab}
      prevTab={prevTab}
      breadcrumb={breadcrumb}
      setBreadcrumb={setBreadcrumb}
      cStep={cStep}
      consultSteps={CONSULT_STEPS}
      consulting={consulting}
      setConsulting={setConsulting}
      profilePat={profilePat}
      setProfilePat={setProfilePat}
      notifications={notifications}
      onMarkAllNotificationsRead={handleMarkAll}
      onOpenBookModal={() => setBookModal(true)}
      onOpenRegModal={() => setRegModal(true)}
    >

      {tab === "home" && (
        <DoctorHomePage
          onNavigateToQueue={() => handleSetTab("queue")}
        />
      )}

      {tab === "queue" && (
        <DoctorAppointmentsPage
          onOpenBookModal={() => setBookModal(true)}
          onConsult={(p) => {
            setConsulting(p);
            handleSetTab("consult");
          }}
          onViewHistory={(p) => {
            setProfilePat(p);
            handleSetTab("profile");
          }}
        />
      )}

      {tab === "history" && (
        <DoctorPatientsPage
          onViewProfile={(p) => {
            setProfilePat(p as PatientBasic);
            handleSetTab("profile");
          }}
          onViewHistory={(p) => setVisitHistPat(p)}
        />
      )}

      {tab === "revenue" && <ReportsPage />}

    </MainLayout>
  );
}
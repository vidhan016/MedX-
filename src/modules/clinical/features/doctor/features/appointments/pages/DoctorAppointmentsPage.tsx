import React, { useState } from "react";
import StatCard from "../../../../../../../shared/ui/display/stat-card/StatCard";
import PatientPanel, { DEFAULT_FILTERS } from "../components/PatientPanel";
import styles from "../styles/doctor-appointments.module.css";
import {
  useQueuePatients,
  useAttendedPatients,
  useAppointmentStats,
} from "../hooks/useDoctorAppointments";
import type { PatientTab, QueueFilters, QueuePatient } from "../types/doctor-appointments.types";

// ── Icons ──────────────────────────────────────────────────────────────────────

const PlusIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="70" height="70" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth={1.5}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ClockIcon = () => (
  <svg width="70" height="70" fill="none" viewBox="0 0 24 24" stroke="#f97316" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const BlueClockIcon = () => (
  <svg width="70" height="70" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const CheckIcon = () => (
  <svg width="70" height="70" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
  </svg>
);

const LiveDot = () => <span className={styles.liveDot} />;

const CheckSmall = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--ins-primary, #1ab394)" strokeWidth={2.5}>
    <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
  </svg>
);

// ── Props ──────────────────────────────────────────────────────────────────────

interface DoctorAppointmentsPageProps {
  onOpenBookModal: () => void;
  onConsult: (p: QueuePatient) => void;
  onViewHistory: (p: QueuePatient) => void;
}

// ── Component ──────────────────────────────────────────────────────────────────

const DoctorAppointmentsPage: React.FC<DoctorAppointmentsPageProps> = ({
  onOpenBookModal,
  onConsult,
  onViewHistory,
}) => {
  const [patientTab, setPatientTab] = useState<PatientTab>("queue");

  const [queueFilters, setQueueFilters]       = useState<QueueFilters>(DEFAULT_FILTERS);
  const [attendedFilters, setAttendedFilters] = useState<QueueFilters>(DEFAULT_FILTERS);

  const { data: stats }                                     = useAppointmentStats();
  const { data: queue = [],    isLoading: queueLoading }    = useQueuePatients(queueFilters);
  const { data: attended = [], isLoading: attendedLoading } = useAttendedPatients(attendedFilters);

  return (
    <div className={styles.page}>

      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.pageTitle}>Appointments</h1>
          <span className={styles.pageSub}>View and manage today's patient appointments</span>
        </div>

        <div className={styles.pageActions}>
          {/* Tab switcher */}
          <div className={styles.tabSwitcher}>
            <button
              className={`${styles.tabBtn} ${patientTab === "queue" ? styles.tabBtnActiveQueue : ""}`}
              onClick={() => setPatientTab("queue")}
            >
              Live Queue
              <span className={`${styles.tabBadge} ${patientTab === "queue" ? styles.tabBadgeQueue : styles.tabBadgeMuted}`}>
                {queue.length}
              </span>
            </button>
            <button
              className={`${styles.tabBtn} ${patientTab === "attended" ? styles.tabBtnActiveAttended : ""}`}
              onClick={() => setPatientTab("attended")}
            >
              Attended
              <span className={`${styles.tabBadge} ${patientTab === "attended" ? styles.tabBadgeAttended : styles.tabBadgeMuted}`}>
                {attended.length}
              </span>
            </button>
          </div>

          {/* New appointment */}
          <button className={styles.newApptBtn} onClick={onOpenBookModal}>
            <PlusIcon />
            New Appointment
          </button>
        </div>
      </div>

      {/* ── Stat cards — using shared StatCard component ── */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Today"
          value={stats?.totalToday ?? (queue.length + attended.length)}
          badges={[
            { label: "Attended", value: attended.length, color: "green" },
            { label: "Waiting",  value: queue.length,    color: "amber" },
          ]}
          icon={<CalendarIcon />}
        />

        <StatCard
          label="Waiting"
          value={queue.length}
          valueColor="amber"
          badges={[
            { label: "In live queue", value: "●", color: "amber" },
          ]}
          icon={<ClockIcon />}
        />

        <StatCard
          label="Upcoming"
          value={stats?.upcoming ?? 3}
          valueColor="blue"
          badges={[
            { label: "Scheduled ahead", value: "↑", color: "blue" },
          ]}
          icon={<BlueClockIcon />}
        />

        <StatCard
          label="Attended"
          value={attended.length}
          valueColor="teal"
          badges={[
            { label: "Completed today", value: "✓", color: "teal" },
          ]}
          icon={<CheckIcon />}
        />
      </div>

      {/* ── Main card ── */}
      <div className={styles.mainCard}>
        {patientTab === "queue" && (
          <PatientPanel
            title={<><LiveDot />Live Queue</>}
            patients={queue}
            isLoading={queueLoading}
            emptyMessage="All caught up!"
            showConsult
            onConsult={onConsult}
            onViewHistory={onViewHistory}
            onPrintRx={(p) => alert(`Print Rx for ${p.name}`)}
            filters={queueFilters}
            onFilterChange={(patch) => setQueueFilters((f) => ({ ...f, ...patch }))}
          />
        )}

        {patientTab === "attended" && (
          <PatientPanel
            title={<><CheckSmall />Attended Today — {attended.length}</>}
            patients={attended}
            isLoading={attendedLoading}
            emptyMessage="No patients attended yet."
            showConsult={false}
            onViewHistory={onViewHistory}
            onPrintRx={(p) => alert(`Print Rx for ${p.name}`)}
            filters={attendedFilters}
            onFilterChange={(patch) => setAttendedFilters((f) => ({ ...f, ...patch }))}
          />
        )}
      </div>

    </div>
  );
};

export default DoctorAppointmentsPage;
import React from "react";
import styles from "../styles/doctor-home.module.css";
import type { UpcomingAppointment } from "../types/doctor-home.types";

// ── Helpers ────────────────────────────────────────────────────────────────────

const addHalfHour = (time: string): string => {
  const [hh, mm] = time.split(":").map(Number);
  const total = hh * 60 + mm + 30;
  const newHH = Math.floor(total / 60) % 24;
  const newMM = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const meridiem = newHH < 12 ? "AM" : "PM";
  const displayH = newHH % 12 === 0 ? 12 : newHH % 12;
  return `${pad(displayH)}:${pad(newMM)} ${meridiem}`;
};

const getInitials = (name: string): string =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

// ── Props ──────────────────────────────────────────────────────────────────────

interface UpcomingAppointmentsProps {
  appointments: UpcomingAppointment[];
  isLoading: boolean;
  onViewAll: () => void;
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

const SkeletonRow = () => (
  <div className={styles.aiRow}>
    <div className={`${styles.skeleton}`} style={{ height: 12, width: 90 }} />
    <div className={`${styles.skeleton}`} style={{ height: 32, width: 32, borderRadius: "50%" }} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
      <div className={`${styles.skeleton}`} style={{ height: 13, width: "60%" }} />
      <div className={`${styles.skeleton}`} style={{ height: 11, width: "80%" }} />
    </div>
  </div>
);

// ── Component ──────────────────────────────────────────────────────────────────

const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({
  appointments,
  isLoading,
  onViewAll,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHd}>
        <div className={styles.cardTitle}>
          <div className={styles.ctBar} />
          Upcoming Appointments
        </div>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={onViewAll}
        >
          Queue →
        </button>
      </div>

      <div className={styles.cardBd} style={{ paddingTop: 8 }}>
        {isLoading
          ? [1, 2, 3].map((i) => <SkeletonRow key={i} />)
          : appointments.map((a) => (
              <div key={a.id} className={styles.aiRow}>
                <div className={styles.aiTime}>
                  {a.time} – {addHalfHour(a.time)}
                </div>
                <div className={styles.aiAv}>{getInitials(a.name)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className={styles.aiName}>{a.name}, {a.age}y</div>
                  <div className={styles.aiSub}>{a.complaint}</div>
                </div>
                <span
                  className={`${styles.aiChip} ${
                    a.type === "New" ? styles.aiChipNew : styles.aiChipFu
                  }`}
                >
                  {a.type}
                </span>
              </div>
            ))}
      </div>
    </div>
  );
};

export default UpcomingAppointments;
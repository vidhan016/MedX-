import React from "react";
import StatCard from "../../../../../../shared/ui/display/StatCard";
import styles from "../styles/doctor-home.module.css";
import type { DoctorStats, NextPatient } from "../types/doctor-home.types";

// ── Icons ──────────────────────────────────────────────────────────────────────

const UsersIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth={1.5} width={70} height={70}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const UserIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth={1.5} width={70} height={70}>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CalXIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="#dc2626" strokeWidth={1.5} width={70} height={70}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);

const RupeeIcon = () => (
  <svg fill="#0ea5a0" stroke="#0ea5a0" strokeWidth={0.8} width={70} height={70} viewBox="0 0 22 22">
    <path d="M12.9494914,6 C13.4853936,6.52514205 13.8531598,7.2212202 13.9645556,8 L17.5,8 C17.7761424,8 18,8.22385763 18,8.5 C18,8.77614237 17.7761424,9 17.5,9 L13.9645556,9 C13.7219407,10.6961471 12.263236,12 10.5,12 L7.70710678,12 L13.8535534,18.1464466 C14.0488155,18.3417088 14.0488155,18.6582912 13.8535534,18.8535534 C13.6582912,19.0488155 13.3417088,19.0488155 13.1464466,18.8535534 L6.14644661,11.8535534 C5.83146418,11.538571 6.05454757,11 6.5,11 L10.5,11 C11.709479,11 12.7183558,10.1411202 12.9499909,9 L6.5,9 C6.22385763,9 6,8.77614237 6,8.5 C6,8.22385763 6.22385763,8 6.5,8 L12.9499909,8 C12.7183558,6.85887984 11.709479,6 10.5,6 L6.5,6 C6.22385763,6 6,5.77614237 6,5.5 C6,5.22385763 6.22385763,5 6.5,5 L10.5,5 L17.5,5 C17.7761424,5 18,5.22385763 18,5.5 C18,5.77614237 17.7761424,6 17.5,6 L12.9494914,6 Z" />
  </svg>
);

// ── Props ──────────────────────────────────────────────────────────────────────

interface StatsCardsProps {
  stats: DoctorStats;
  nextPatient: NextPatient | null;
  isLoading: boolean;
  onAppointmentsClick: () => void;
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className={styles.sc}>
    <div className={styles.skeleton} style={{ height: 14, width: "60%", marginBottom: 12 }} />
    <div className={styles.skeleton} style={{ height: 32, width: "40%", marginBottom: 10 }} />
    <div className={styles.skeleton} style={{ height: 12, width: "80%" }} />
  </div>
);

// ── Component ──────────────────────────────────────────────────────────────────

const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  nextPatient,
  isLoading,
  onAppointmentsClick,
}) => {
  if (isLoading) {
    return (
      <div className={styles.statsGrid}>
        {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className={styles.statsGrid}>

      {/* Today's Appointments */}
      <StatCard
        label="Today's Appointments"
        value={stats.totalToday}
        badges={[
          { label: "Attended", value: stats.attended, color: "green" },
          { label: "Pending",  value: stats.pending,  color: "amber" },
        ]}
        icon={<UsersIcon />}
        onClick={onAppointmentsClick}
      />

      {/* Next Patient */}
      <StatCard
        label="Next Patient"
        value={nextPatient
          ? `${nextPatient.salutation} ${nextPatient.name}`
          : "No patients waiting"
        }
        badges={nextPatient
          ? [{ label: `${nextPatient.age}y · ${nextPatient.gender} · ${nextPatient.appointmentTime}`, value: "" }]
          : []
        }
        icon={<UserIcon />}
        onClick={onAppointmentsClick}
      />

      {/* Today's Revenue */}
      <StatCard
        label="Today's Revenue"
        value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
        valueColor="teal"
        badges={[
          { label: "Today's earnings", value: "↑", color: "teal" },
        ]}
        icon={<RupeeIcon />}
      />

      {/* Cancelled / No-Show */}
      <StatCard
        label="Cancelled / No-Show"
        value={stats.cancelled + stats.noShow}
        valueColor="red"
        badges={[
          { label: "Cancelled", value: stats.cancelled, color: "red"   },
          { label: "No-Show",   value: stats.noShow,    color: "amber" },
        ]}
        icon={<CalXIcon />}
      />

    </div>
  );
};

export default StatsCards;
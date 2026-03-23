import React, { useState } from "react";
import styles from "../styles/doctor-home.module.css";

import StatsCards from "../components/StatsCards";
import ScheduleOverview from "../components/ScheduleOverview";
import UpcomingAppointments from "../components/UpcomingAppointments";
import TopDiagnoses from "../components/TopDiagnoses";
import RecentActivity from "../components/RecentActivity";
// import WeeklyFlow from "../reports/components/WeeklyFlow";
// import TopDrugsChart from "../reports/components/TopDrugsChart";

import {
  useDoctorStats,
  useTodaySchedule,
  useUpcomingAppointments,
  useTopDiagnoses,
  useRecentActivity,
} from "../hooks/useDoctorHome";

import type { DiagFilter, CustomRange } from "../types/doctor-home.types";

// ── Props ──────────────────────────────────────────────────────────────────────

interface DoctorHomePageProps {
  onNavigateToQueue: () => void;
}

// ── Component ──────────────────────────────────────────────────────────────────

const DoctorHomePage: React.FC<DoctorHomePageProps> = ({ onNavigateToQueue }) => {
  // ── Diagnoses filter state ──
  const [diagFilter, setDiagFilter]           = useState<DiagFilter>("today");
  const [customRange, setCustomRange]         = useState<CustomRange>({ from: "", to: "" });
  const [appliedCustomRange, setAppliedCustomRange] = useState<CustomRange | undefined>();

  // ── React Query ──
  const { data: statsData, isLoading: statsLoading }       = useDoctorStats();
  const { data: slots = [], isLoading: scheduleLoading }   = useTodaySchedule();
  const { data: upcoming = [], isLoading: upcomingLoading } = useUpcomingAppointments();
  const { data: diagnoses = [], isLoading: diagLoading }   = useTopDiagnoses(diagFilter, appliedCustomRange);
  const { data: activityData, isLoading: activityLoading } = useRecentActivity();

  const handleApplyCustomRange = () => {
    setAppliedCustomRange({ ...customRange });
  };

  return (
    <div className={styles.page}>

      {/* ── Row 1: Stats ── */}
      <StatsCards
        stats={statsData?.stats ?? {
          totalToday: 0, attended: 0, pending: 0,
          totalRevenue: 0, cancelled: 0, noShow: 0,
        }}
        nextPatient={statsData?.nextPatient ?? null}
        isLoading={statsLoading}
        onAppointmentsClick={onNavigateToQueue}
      />

      {/* ── Row 2: Schedule ── */}
      <ScheduleOverview
        slots={slots}
        isLoading={scheduleLoading}
      />

      {/* ── Row 3: Upcoming + Top Diagnoses ── */}
      <div className={styles.grid2}>
        <UpcomingAppointments
          appointments={upcoming}
          isLoading={upcomingLoading}
          onViewAll={onNavigateToQueue}
        />
        <TopDiagnoses
          diagnoses={diagnoses}
          isLoading={diagLoading}
          filter={diagFilter}
          onFilterChange={setDiagFilter}
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
          onApplyCustomRange={handleApplyCustomRange}
        />
      </div>

      {/* ── Row 4: Recent Activity + Charts ── */}
      <div className={styles.grid2}>
        <RecentActivity
          activity={activityData?.activity ?? []}
          isLoading={activityLoading}
        />
        {/* <div className={styles.gridRight}>
          <div className={styles.card}>
            <div className={styles.cardHd}>
              <div className={styles.cardTitle}>
                <div className={`${styles.ctBar} ${styles.ctBarTeal}`} />
                Weekly Patient Flow
              </div>
            </div>
            <div className={styles.cardBd}>
              {activityData?.weeklyFlow && (
                <WeeklyFlow data={activityData.weeklyFlow} />
              )}
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardHd}>
              <div className={styles.cardTitle}>
                <div className={styles.ctBar} />
                Top Prescribed Drugs
              </div>
            </div>
            <div className={styles.cardBd} style={{ paddingTop: 4 }}>
              {activityData?.topDrugs && (
                <TopDrugsChart data={activityData.topDrugs} />
              )}
            </div>
          </div>
        </div> */}
      </div>

    </div>
  );
};

export default DoctorHomePage;
import React, { useState } from "react";
import QueueFilterBar from "./QueueFilterBar";
import PatientListCard from "./PatientListCard";
import PatientGridCard from "./PatientGridCard";
import Pager from "../../../../../../../shared/ui/navigation/pager/Pager";
import styles from "../styles/doctor-appointments.module.css";
import type { QueuePatient, QueueFilters, QueueView } from "../types/doctor-appointments.types";

// ── Default filters ────────────────────────────────────────────────────────────

export const DEFAULT_FILTERS: QueueFilters = {
  search: "", date: "", status: "", visitType: "", apptType: "", sort: "",
};

// ── Skeleton ───────────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className={styles.pc}>
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <div className={styles.skeleton} style={{ width: 38, height: 38, borderRadius: 8, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div className={styles.skeleton} style={{ height: 13, width: "55%" }} />
        <div className={styles.skeleton} style={{ height: 11, width: "75%" }} />
        <div className={styles.skeleton} style={{ height: 11, width: "60%" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 3, flex: "0 0 430px" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={styles.skeleton} style={{ height: 36, borderRadius: 5 }} />
        ))}
      </div>
    </div>
  </div>
);

// ── Empty state ────────────────────────────────────────────────────────────────

const Empty: React.FC<{ message: string }> = ({ message }) => (
  <div className={styles.empty}>
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "var(--ins-primary, #1ab394)" }}>
      <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
    </svg>
    <p>{message}</p>
  </div>
);

// ── Props ──────────────────────────────────────────────────────────────────────

interface PatientPanelProps {
  title: React.ReactNode;
  patients: QueuePatient[];
  isLoading: boolean;
  emptyMessage?: string;
  showConsult?: boolean;
  onConsult?: (p: QueuePatient) => void;
  onViewHistory?: (p: QueuePatient) => void;
  onPrintRx?: (p: QueuePatient) => void;
  filters: QueueFilters;
  onFilterChange: (patch: Partial<QueueFilters>) => void;
  pageSize?: number;
  itemLabel?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────

const PatientPanel: React.FC<PatientPanelProps> = ({
  title,
  patients,
  isLoading,
  emptyMessage = "No patients found.",
  showConsult = false,
  onConsult,
  onViewHistory,
  onPrintRx,
  filters,
  onFilterChange,
  pageSize: defaultPageSize = 10,
  itemLabel = "Patients",
}) => {
  const [view, setView]         = useState<QueueView>("list");
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const handleFilterChange = (patch: Partial<QueueFilters>) => {
    onFilterChange(patch);
    setPage(1);
  };

  const handleReset = () => {
    onFilterChange(DEFAULT_FILTERS);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(patients.length / pageSize));
  const start      = (page - 1) * pageSize;
  const paginated  = patients.slice(start, start + pageSize);

  return (
    <>
      {/* Section header */}
      <div className={styles.secHd}>
        <div className={styles.secTitle}>{title}</div>
      </div>

      {/* Filter bar */}
      <QueueFilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
        view={view}
        onViewChange={setView}
      />

      {/* Patient list or grid */}
      {isLoading ? (
        <div className={styles.patientList}>
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : patients.length === 0 ? (
        <Empty message={emptyMessage} />
      ) : (
        <div className={view === "grid" ? styles.patientGrid : styles.patientList}>
          {paginated.map((p, i) => {
            const isFirst = start + i === 0;
            const sharedProps = {
              patient: p,
              isFirst,
              showConsult,
              onConsult,
              onViewHistory,
              onPrintRx,
            };
            return view === "grid"
              ? <PatientGridCard key={p.id} {...sharedProps} />
              : <PatientListCard key={p.id} {...sharedProps} />;
          })}
        </div>
      )}

      {/* ── Pager — shared component from core/shared/ui/navigation ── */}
      {!isLoading && patients.length > 0 && (
        <Pager
          page={page}
          totalPages={totalPages}
          goTo={setPage}
          total={patients.length}
          start={start}
          pageSize={pageSize}
          setPageSize={(size) => { setPageSize(size); setPage(1); }}
          itemLabel={itemLabel}
        />
      )}
    </>
  );
};

export default PatientPanel;
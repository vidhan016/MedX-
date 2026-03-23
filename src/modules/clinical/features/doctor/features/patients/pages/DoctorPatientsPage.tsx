import React, { useState } from "react";
import PatientFilterBar from "../components/PatientFilterBar";
import PatientCard from "../components/PatientCard";
import Pager from "../../../../../../../shared/ui/navigation/pager/Pager";
import { usePatients } from "../hooks/useDoctorPatients";
import styles from "../styles/doctor-patients.module.css";
import type { HistoryPatient, PatientFilters, PatientsView } from "../types/doctor-patients.types";

// ── Default filters ────────────────────────────────────────────────────────────

const DEFAULT_FILTERS: PatientFilters = {
  search: "", gender: "", blood: "", allergy: "", sort: "",
};

// ── Skeleton ───────────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className={styles.pc}>
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <div className={styles.skeleton} style={{ width: 38, height: 38, borderRadius: 8, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div className={styles.skeleton} style={{ height: 13, width: "55%" }} />
        <div className={styles.skeleton} style={{ height: 11, width: "70%" }} />
        <div className={styles.skeleton} style={{ height: 11, width: "60%" }} />
      </div>
    </div>
  </div>
);

// ── Empty state ────────────────────────────────────────────────────────────────

const Empty = () => (
  <div className={styles.empty}>
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "var(--ins-border-color, #e7e9eb)" }}>
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
    <div className={styles.emptyTitle}>No patients found</div>
    <div className={styles.emptySub}>Try adjusting your search or filters</div>
  </div>
);

// ── Props ──────────────────────────────────────────────────────────────────────

interface DoctorPatientsPageProps {
  onViewProfile?: (p: HistoryPatient) => void;
  onViewHistory?: (p: HistoryPatient) => void;
}

// ── Component ──────────────────────────────────────────────────────────────────

const DoctorPatientsPage: React.FC<DoctorPatientsPageProps> = ({
  onViewProfile,
  onViewHistory,
}) => {
  const [filters, setFilters] = useState<PatientFilters>(DEFAULT_FILTERS);
  const [view, setView]       = useState<PatientsView>("list");
  const [page, setPage]       = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data: patients = [], isLoading } = usePatients(filters);

  const handleFilterChange = (patch: Partial<PatientFilters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(patients.length / pageSize));
  const start      = (page - 1) * pageSize;
  const paginated  = patients.slice(start, start + pageSize);

  return (
    <div className={styles.page}>

      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Patients</h1>
        <span className={styles.pageSub}>View and manage all registered patients</span>
      </div>

      {/* ── Main card ── */}
      <div className={styles.mainCard}>

        {/* Filter bar */}
        <PatientFilterBar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          view={view}
          onViewChange={setView}
          totalCount={patients.length}
        />

        {/* Patient list or grid */}
        {isLoading ? (
          <div className={styles.patientList}>
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : patients.length === 0 ? (
          <Empty />
        ) : (
          <div className={view === "grid" ? styles.patientGrid : styles.patientList}>
            {paginated.map((p) => (
              <PatientCard
                key={p.id}
                patient={p}
                mode={view}
                onViewProfile={onViewProfile}
                onViewHistory={onViewHistory}
                onPrintRx={(pt) => alert(`Print Rx for ${pt.name}`)}
              />
            ))}
          </div>
        )}

        {/* Pager */}
        {!isLoading && patients.length > 0 && (
          <Pager
            page={page}
            totalPages={totalPages}
            goTo={setPage}
            total={patients.length}
            start={start}
            pageSize={pageSize}
            setPageSize={(s) => { setPageSize(s); setPage(1); }}
            itemLabel="Patients"
          />
        )}
      </div>
    </div>
  );
};

export default DoctorPatientsPage;
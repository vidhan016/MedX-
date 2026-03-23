import React from "react";
import styles from "../styles/doctor-patients.module.css";
import type { PatientFilters, PatientsView } from "../types/doctor-patients.types";

// ── Icons ──────────────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
  </svg>
);

const ResetIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const ListIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const GridIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);

// ── Props ──────────────────────────────────────────────────────────────────────

interface PatientFilterBarProps {
  filters: PatientFilters;
  onChange: (patch: Partial<PatientFilters>) => void;
  onReset: () => void;
  view: PatientsView;
  onViewChange: (v: PatientsView) => void;
  totalCount: number;
}

// ── Component ──────────────────────────────────────────────────────────────────

const PatientFilterBar: React.FC<PatientFilterBarProps> = ({
  filters,
  onChange,
  onReset,
  view,
  onViewChange,
  totalCount,
}) => (
  <div className={styles.filterBar}>
    <div className={styles.filterLeft}>

      {/* Search */}
      <div className={styles.filterControl}>
        <SearchIcon />
        <input
          className={styles.filterInput}
          placeholder="Search by Name, MRN or Diagnosis..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>

      {/* Gender */}
      <div className={styles.filterControl}>
        <select className={styles.filterSelect} value={filters.gender} onChange={(e) => onChange({ gender: e.target.value })}>
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Transgender Male">Transgender Male</option>
          <option value="Transgender Female">Transgender Female</option>
          <option value="Non-Binary">Non-Binary</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>

      {/* Blood group */}
      <div className={styles.filterControl}>
        <select className={styles.filterSelect} value={filters.blood} onChange={(e) => onChange({ blood: e.target.value })}>
          <option value="">All Blood Groups</option>
          {["A+","A-","B+","B-","AB+","AB-","O+","O-","Bombay Blood Group (Oh)","Unknown"].map((bg) => (
            <option key={bg}>{bg}</option>
          ))}
        </select>
      </div>

      {/* Allergy status */}
      <div className={styles.filterControl}>
        <select className={styles.filterSelect} value={filters.allergy} onChange={(e) => onChange({ allergy: e.target.value })}>
          <option value="">All — Allergy Status</option>
          <option value="has">Has Allergies</option>
          <option value="none">No Allergies</option>
        </select>
      </div>

      {/* Sort */}
      <div className={styles.filterControl}>
        <select className={styles.filterSelect} value={filters.sort} onChange={(e) => onChange({ sort: e.target.value })}>
          <option value="">Sort By</option>
          <option value="name-asc">Name (A → Z)</option>
          <option value="name-desc">Name (Z → A)</option>
          <option value="age-asc">Age (Low → High)</option>
          <option value="age-desc">Age (High → Low)</option>
        </select>
      </div>

      {/* Reset */}
      <button className={styles.filterResetBtn} title="Reset filters" onClick={onReset}>
        <ResetIcon />
      </button>
    </div>

    {/* Right: count + view toggle */}
    <div className={styles.filterRight}>
      <span style={{ fontSize: 11.5, color: "var(--ins-secondary-color, #9ba6b7)", whiteSpace: "nowrap" }}>
        {totalCount} patient{totalCount !== 1 ? "s" : ""}
      </span>
      <div className={styles.viewToggle}>
        <button className={`${styles.viewBtn} ${view === "list" ? styles.viewBtnActive : ""}`} onClick={() => onViewChange("list")} title="List view">
          <ListIcon />
        </button>
        <button className={`${styles.viewBtn} ${view === "grid" ? styles.viewBtnActive : ""}`} onClick={() => onViewChange("grid")} title="Grid view">
          <GridIcon />
        </button>
      </div>
    </div>
  </div>
);

export default PatientFilterBar;
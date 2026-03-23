import React from "react";
import styles from "../styles/doctor-appointments.module.css";
import type { QueueFilters, QueueView } from "../types/doctor-appointments.types";

// ── Icons ──────────────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

interface QueueFilterBarProps {
  filters: QueueFilters;
  onChange: (patch: Partial<QueueFilters>) => void;
  onReset: () => void;
  view: QueueView;
  onViewChange: (v: QueueView) => void;
}

// ── Component ──────────────────────────────────────────────────────────────────

const QueueFilterBar: React.FC<QueueFilterBarProps> = ({
  filters,
  onChange,
  onReset,
  view,
  onViewChange,
}) => (
  <div className={styles.filterBar}>
    <div className={styles.filterLeft}>

      {/* Search */}
      <div className={styles.filterControl}>
        <SearchIcon />
        <input
          className={styles.filterInput}
          placeholder="Search patient name..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>

      {/* Date */}
      <div className={styles.filterControl}>
        <input
          type="date"
          className={styles.filterInput}
          style={{ width: 130 }}
          value={filters.date}
          onChange={(e) => onChange({ date: e.target.value })}
        />
      </div>

      {/* Status */}
      <div className={styles.filterControl}>
        <select
          className={styles.filterSelect}
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="confirmed">Confirmed</option>
          <option value="arrival">Arrival Pending</option>
          <option value="in-queue">In Queue</option>
          <option value="in-consultation">In Consultation</option>
          <option value="attended">Attended</option>
          <option value="no-show">No Show</option>
          <option value="cancelled">Cancelled</option>
          <option value="cancelled-clinic">Cancelled by Clinic</option>
          <option value="rescheduled">Rescheduled</option>
        </select>
      </div>

      {/* Visit type */}
      <div className={styles.filterControl}>
        <select
          className={styles.filterSelect}
          value={filters.visitType}
          onChange={(e) => onChange({ visitType: e.target.value })}
        >
          <option value="">All Visit Types</option>
          <option value="follow-up">Follow-Up</option>
          <option value="emergency">Emergency</option>
          <option value="check-up">Check-Up</option>
          <option value="new">New Patient</option>
        </select>
      </div>

      {/* Appt type */}
      <div className={styles.filterControl}>
        <select
          className={styles.filterSelect}
          value={filters.apptType}
          onChange={(e) => onChange({ apptType: e.target.value })}
        >
          <option value="">All Appt. Types</option>
          <option value="telephonic">Telephonic</option>
          <option value="email">E-mail</option>
          <option value="walk-in">Walk-In</option>
          <option value="doctor">Doctor</option>
        </select>
      </div>

      {/* Sort */}
      <div className={styles.filterControl}>
        <select
          className={styles.filterSelect}
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value })}
        >
          <option value="">Sort By</option>
          <option value="name-asc">Name (A → Z)</option>
          <option value="name-desc">Name (Z → A)</option>
          <option value="date-asc">Date (Oldest First)</option>
          <option value="date-desc">Date (Newest First)</option>
          <option value="time-asc">Time (Morning First)</option>
          <option value="time-desc">Time (Evening First)</option>
          <option value="token-asc">Token (Asc)</option>
        </select>
      </div>

      {/* Reset */}
      <button className={styles.filterResetBtn} title="Reset filters" onClick={onReset}>
        <ResetIcon />
      </button>
    </div>

    {/* View toggle */}
    <div className={styles.viewToggle}>
      <button
        className={`${styles.viewBtn} ${view === "list" ? styles.viewBtnActive : ""}`}
        onClick={() => onViewChange("list")}
        title="List view"
      >
        <ListIcon />
      </button>
      <button
        className={`${styles.viewBtn} ${view === "grid" ? styles.viewBtnActive : ""}`}
        onClick={() => onViewChange("grid")}
        title="Grid view"
      >
        <GridIcon />
      </button>
    </div>
  </div>
);

export default QueueFilterBar;
import React, { useState } from "react";
import styles from "../styles/doctor-home.module.css";
import type { DiagFilter, DiagnosisItem, CustomRange } from "../types/doctor-home.types";

// ── Types ──────────────────────────────────────────────────────────────────────

interface TopDiagnosesProps {
  diagnoses: DiagnosisItem[];
  isLoading: boolean;
  filter: DiagFilter;
  onFilterChange: (f: DiagFilter) => void;
  customRange: CustomRange;
  onCustomRangeChange: (r: CustomRange) => void;
  onApplyCustomRange: () => void;
}

// ── Filter labels ──────────────────────────────────────────────────────────────

const FILTER_LABELS: Record<DiagFilter, string> = {
  today:  "Today",
  week:   "This Week",
  month:  "This Month",
  custom: "📅 Custom",
};

// ── Skeleton ───────────────────────────────────────────────────────────────────

const SkeletonRow = () => (
  <div className={styles.dbItem}>
    <div className={styles.dbTop}>
      <div className={`${styles.skeleton}`} style={{ height: 13, width: "60%" }} />
      <div className={`${styles.skeleton}`} style={{ height: 13, width: 24 }} />
    </div>
    <div className={`${styles.skeleton}`} style={{ height: 5, width: "100%", borderRadius: 99 }} />
  </div>
);

// ── Component ──────────────────────────────────────────────────────────────────

const TopDiagnoses: React.FC<TopDiagnosesProps> = ({
  diagnoses,
  isLoading,
  filter,
  onFilterChange,
  customRange,
  onCustomRangeChange,
  onApplyCustomRange,
}) => {
  const [showCustom, setShowCustom] = useState(false);

  const handleFilterClick = (f: DiagFilter) => {
    onFilterChange(f);
    if (f === "custom") {
      setShowCustom((p) => !p);
    } else {
      setShowCustom(false);
    }
  };

  const handleApply = () => {
    if (!customRange.from || !customRange.to) return;
    onApplyCustomRange();
    setShowCustom(false);
  };

  const handleClear = () => {
    onCustomRangeChange({ from: "", to: "" });
    setShowCustom(false);
    onFilterChange("today");
  };

  return (
    <div className={styles.card}>
      <div className={`${styles.cardHd} ${styles.cardHdCol}`}>
        {/* Title row + filter tabs */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div className={styles.cardTitle}>
            <div className={`${styles.ctBar} ${styles.ctBarTeal}`} />
            Top Diagnoses
          </div>
          <div className={styles.diagFilterRow}>
            {(Object.keys(FILTER_LABELS) as DiagFilter[]).map((f) => (
              <button
                key={f}
                className={`${styles.diagFilterBtn} ${filter === f ? styles.diagFilterBtnActive : ""}`}
                onClick={() => handleFilterClick(f)}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {/* Custom date range picker */}
        {showCustom && (
          <div className={styles.customRange}>
            <span className={styles.customRangeLabel}>From</span>
            <input
              type="date"
              className={styles.customRangeInput}
              value={customRange.from}
              onChange={(e) => onCustomRangeChange({ ...customRange, from: e.target.value })}
            />
            <span className={styles.customRangeLabel}>To</span>
            <input
              type="date"
              className={styles.customRangeInput}
              value={customRange.to}
              onChange={(e) => onCustomRangeChange({ ...customRange, to: e.target.value })}
            />
            <button className={styles.customRangeApply} onClick={handleApply}>
              Apply
            </button>
            <button className={styles.customRangeClear} onClick={handleClear}>
              Clear
            </button>
          </div>
        )}
      </div>

      <div className={styles.cardBd}>
        {isLoading
          ? [1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)
          : diagnoses.map((d, i) => (
              <div key={i} className={styles.dbItem}>
                <div className={styles.dbTop}>
                  <span className={styles.dbName}>{d.name}</span>
                  <span className={styles.dbCnt}>{d.count}</span>
                </div>
                <div className={styles.dbTrack}>
                  <div className={styles.dbFill} style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default TopDiagnoses;
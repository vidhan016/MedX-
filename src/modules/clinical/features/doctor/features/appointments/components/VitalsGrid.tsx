import React from "react";
import type { Vitals } from "../types/doctor-appointments.types";
import { vitalColor } from "../utils/appointments.helpers";
import styles from "../styles/doctor-appointments.module.css";

// ── Icons ──────────────────────────────────────────────────────────────────────

const VITAL_ICONS: Record<string, React.ReactNode> = {
  activity: (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  heart: (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  wind: (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
    </svg>
  ),
  thermometer: (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  ),
  waves: (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2v14c-2.5 0-2.5 2-5 2-2.6 0-2.4-2-5-2-2.5 0-2.5 2-5 2-1.3 0-1.9-.5-2.5-1" />
    </svg>
  ),
  sliders: (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  ),
  moveVertical: (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <polyline points="8 18 12 22 16 18" /><line x1="12" y1="2" x2="12" y2="22" />
      <polyline points="8 6 12 2 16 6" />
    </svg>
  ),
  percent: (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  ),
};

// ── Vital rows config ──────────────────────────────────────────────────────────

interface VitalRow {
  icon: keyof typeof VITAL_ICONS;
  label: string;
  value: string;
  unit: string;
  color: string | null;
}

const buildVitals = (v: Vitals): VitalRow[] => [
  { icon: "activity",    label: "BP",   value: v.bp,              unit: "mmHg", color: vitalColor.bp(v.bp) },
  { icon: "heart",       label: "HR",   value: v.pulse,           unit: "bpm",  color: vitalColor.hr(v.pulse) },
  { icon: "wind",        label: "SpO₂", value: v.spo2,            unit: "%",    color: vitalColor.spo2(v.spo2) },
  { icon: "thermometer", label: "Temp", value: v.temp,            unit: "°F",   color: vitalColor.temp(v.temp) },
  { icon: "waves",       label: "RR",   value: v.rr ?? "18",      unit: "/min", color: vitalColor.rr(v.rr ?? "18") },
  { icon: "sliders",     label: "Wt",   value: v.weight,          unit: "kg",   color: null },
  { icon: "moveVertical",label: "Ht",   value: v.height,          unit: "cm",   color: null },
  { icon: "percent",     label: "BMI",  value: v.bmi ?? "—",      unit: "",     color: vitalColor.bmi(v.bmi ?? "") },
];

// ── Props ──────────────────────────────────────────────────────────────────────

interface VitalsGridProps {
  vitals: Vitals;
  compact?: boolean;
}

// ── Component ──────────────────────────────────────────────────────────────────

const VitalsGrid: React.FC<VitalsGridProps> = ({ vitals, compact = false }) => {
  const rows = buildVitals(vitals);

  const gridClass = [
    styles.vitalsGrid,
    compact ? styles.vitalsGridCompact : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={gridClass}>
      {rows.map((vital, i) => {
        const c = vital.color ?? "#64748b";
        const cellStyle = {
          background: vital.color ? `${vital.color}0D` : "#f8fafc",
          border: `1px solid ${vital.color ? vital.color + "33" : "#e2e8f0"}`,
        };

        return (
          <div
            key={i}
            className={`${styles.vitalCell} ${compact ? styles.vitalCellCompact : ""}`}
            style={cellStyle}
          >
            <div className={`${styles.vitalLeft} ${compact ? styles.vitalLeftCompact : ""}`}>
              <span style={{ color: c }}>{VITAL_ICONS[vital.icon]}</span>
              <span className={styles.vitalLabel} style={{ color: c }}>{vital.label}</span>
            </div>
            <div className={`${styles.vitalDivider} ${compact ? styles.vitalDividerCompact : ""}`} />
            <div className={styles.vitalRight}>
              <span className={styles.vitalVal} style={{ color: vital.color ?? "#0f172a" }}>
                {vital.value}
              </span>
              {vital.unit && <span className={styles.vitalUnit}>{vital.unit}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VitalsGrid;
import React from "react";
import styles from "../styles/doctor-patients.module.css";
import type { RxItem } from "../types/doctor-patients.types";

// ── Icon ───────────────────────────────────────────────────────────────────────

const PillIcon = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#7c3aed" strokeWidth={2}>
    <path d="m10.5 20.5-7-7a5 5 0 0 1 7.07-7.07l7 7a5 5 0 0 1-7.07 7.07z" />
    <line x1="8.5" y1="11.5" x2="14.5" y2="5.5" />
  </svg>
);

// ── Helper ─────────────────────────────────────────────────────────────────────

const rxLabel = (rx: RxItem) =>
  [rx.drug, rx.dose, rx.freq, rx.duration].filter(Boolean).join(" · ");

// ── Props ──────────────────────────────────────────────────────────────────────

interface RxOverflowProps {
  items: RxItem[];
  maxVisible?: number;
}

// ── Component ──────────────────────────────────────────────────────────────────

const RxOverflow: React.FC<RxOverflowProps> = ({ items, maxVisible = 1 }) => {
  if (!items.length) return null;

  const visible = items.slice(0, maxVisible);
  const hidden  = items.slice(maxVisible);

  return (
    <div className={styles.badgeRow} style={{ gap: 5 }}>
      <PillIcon />
      {visible.map((rx, i) => (
        <span key={i} className={styles.badgeRx}>{rxLabel(rx)}</span>
      ))}
      {hidden.length > 0 && (
        <div className={styles.overflowWrap}>
          <span className={`${styles.badgeOverflow} ${styles.badgeOverflowRx}`}>
            +{hidden.length}
          </span>
          <div className={styles.overflowTooltip}>
            {hidden.map((rx, i) => (
              <div key={i} className={`${styles.tooltipItem} ${styles.tooltipItemRx}`}>
                <PillIcon />
                {rxLabel(rx)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RxOverflow;
import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/doctor-appointments.module.css";

// ── Icons ──────────────────────────────────────────────────────────────────────

const ZapIcon = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const HistoryIcon = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
    <polyline points="12 7 12 12 15 15" />
  </svg>
);

const FileIcon = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ActionMenuItem {
  icon: "history" | "file";
  label: string;
  action: () => void;
}

interface ActionMenuProps {
  patientId: string;
  items: ActionMenuItem[];
  /** true = menu opens upward (grid cards at bottom) */
  upward?: boolean;
  /** lg = larger trigger button (grid card) */
  size?: "sm" | "lg";
}

const ICON_MAP = { history: <HistoryIcon />, file: <FileIcon /> };

// ── Component ──────────────────────────────────────────────────────────────────

const ActionMenu: React.FC<ActionMenuProps> = ({
  patientId,
  items,
  upward = false,
  size = "sm",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const btnClass = [
    styles.zapBtn,
    size === "lg" ? styles.zapBtnLg : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={styles.actionMenuWrap} ref={ref}>
      <button
        className={btnClass}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        title="More actions"
        aria-label="More actions"
      >
        <ZapIcon />
      </button>

      {open && (
        <div className={`${styles.actionMenu} ${upward ? styles.actionMenuBottom : ""}`}>
          {items.map((item, i) => (
            <div
              key={i}
              className={styles.actionMenuItem}
              onClick={(e) => { e.stopPropagation(); item.action(); setOpen(false); }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && (item.action(), setOpen(false))}
            >
              {ICON_MAP[item.icon]}
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
import React, { useState, useRef, useEffect } from "react";
import styles from "../Header/Header.module.css";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Action {
  label: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface TopbarActionsDropdownProps {
  onBookAppointment: () => void;
  onRegisterPatient: () => void;
}

// ── Icons ──────────────────────────────────────────────────────────────────────

const CalendarIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const AddPatientIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

const ZapIcon = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#6b7280" strokeWidth={2}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

// ── Component ──────────────────────────────────────────────────────────────────

const TopbarActionsDropdown: React.FC<TopbarActionsDropdownProps> = ({
  onBookAppointment,
  onRegisterPatient,
}) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const actions: Action[] = [
    {
      label: "Book Appointment",
      description: "Schedule a new visit",
      icon: <CalendarIcon />,
      onClick: () => {
        setOpen(false);
        onBookAppointment();
      },
    },
    {
      label: "Register Patient",
      description: "Add a new patient record",
      icon: <AddPatientIcon />,
      onClick: () => {
        setOpen(false);
        onRegisterPatient();
      },
    },
  ];

  return (
    <div ref={wrapRef} className={styles.actionsWrap}>
      <button
        className={`${styles.actionsBtn} ${open ? styles.actionsBtnActive : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        title="Quick Actions"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <ZapIcon />
      </button>

      {open && (
        <div className={styles.actionsDropdown} role="menu">
          <div className={styles.actionsHeader}>QUICK ACTIONS</div>
          {actions.map((action) => (
            <button
              key={action.label}
              className={styles.actionItem}
              onClick={action.onClick}
              role="menuitem"
            >
              <span className={styles.actionItemIcon}>{action.icon}</span>
              <div className={styles.actionItemText}>
                <span className={styles.actionItemLabel}>{action.label}</span>
                <span className={styles.actionItemDesc}>{action.description}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopbarActionsDropdown;
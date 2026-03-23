import React, { useRef, useState } from "react";
import Breadcrumb, { type BreadcrumbItem } from "../components/Breadcrumb.tsx";
import DateTimeDisplay from "../components/DateTimeDisplay.tsx";
import TopbarQuickSearch from "../components/TopbarQuickSearch.tsx";
import TopbarActionsDropdown from "../components/TopbarActionsDropdown.tsx";
import NotificationPanel, { type Notification } from "../components/NotificationPanel.tsx";
import styles from "./Header.module.css";

// ── Types ──────────────────────────────────────────────────────────────────────

export type AppTab = "home" | "queue" | "history" | "revenue" | "consult" | "profile";

export interface ConsultStep {
  id: string;
  label: string;
}

export interface PatientBasic {
  id: string;
  name: string;
}

interface HeaderProps {
  /** Current active tab */
  tab: AppTab;
  setTab: (tab: AppTab) => void;
  /** Breadcrumb trail labels */
  breadcrumb: string[];
  setBreadcrumb: (items: string[]) => void;
  /** Active consultation step index */
  cStep: number;
  /** All consultation step definitions */
  consultSteps: ConsultStep[];
  /** Patient currently being consulted */
  consulting: PatientBasic | null;
  setConsulting: (p: PatientBasic | null) => void;
  /** Patient whose profile is being viewed */
  profilePat: PatientBasic | null;
  setProfilePat: (p: PatientBasic | null) => void;
  /** Tab to go back to when closing profile */
  prevTab: AppTab;
  /** Notifications to show in the bell panel */
  notifications: Notification[];
  onMarkAllNotificationsRead: () => void;
  /** Callbacks to open modals */
  onOpenBookModal: () => void;
  onOpenRegModal: () => void;
}

// ── Facilities ─────────────────────────────────────────────────────────────────

const FACILITIES = [
  { value: "apollo", label: "Apollo Hospital" },
  { value: "fortis", label: "Fortis Healthcare" },
  { value: "max", label: "Max Hospital" },
  { value: "aiims", label: "AIIMS Delhi" },
  { value: "medanta", label: "Medanta Hospital" },
];

// ── Logo ───────────────────────────────────────────────────────────────────────

const Logo = () => (
  <div className={styles.logo}>
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#3b82f6" />
      <path d="M16 6v20M6 16h20" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <circle cx="16" cy="16" r="12" stroke="white" strokeWidth="2" fill="none" />
    </svg>
    <div className={styles.logoText}>
      <span className={styles.logoName}>Apollo Hospital</span>
      <span className={styles.logoSub}>Healthcare Management System</span>
    </div>
  </div>
);

// ── User Dropdown ──────────────────────────────────────────────────────────────

const UserChip: React.FC<{ name: string; role: string; initials: string }> = ({
  name,
  role,
  initials,
}) => (
  <div className={styles.userChip}>
    <div className={styles.userNames}>
      <span className={styles.userName}>{name}</span>
      <span className={styles.userRole}>{role}</span>
    </div>
    <div className={styles.userAvatar}>{initials}</div>
  </div>
);

// ── Breadcrumb builder ─────────────────────────────────────────────────────────

function useBreadcrumbItems(
  tab: AppTab,
  breadcrumb: string[],
  consultSteps: ConsultStep[],
  cStep: number,
  profilePat: PatientBasic | null,
  setTab: (t: AppTab) => void,
  setBreadcrumb: (b: string[]) => void,
  setConsulting: (p: PatientBasic | null) => void,
  setProfilePat: (p: PatientBasic | null) => void,
  prevTab: AppTab,
): BreadcrumbItem[] {
  const homeItem: BreadcrumbItem = {
    label: "Home",
    onClick: () => {
      setTab("home");
      setBreadcrumb(["Home"]);
    },
  };

  if (tab === "consult") {
    return [
      homeItem,
      {
        label: "Appointments",
        onClick: () => {
          setTab("queue");
          setConsulting(null);
          setBreadcrumb(["Appointments"]);
        },
      },
      { label: consultSteps[cStep]?.label ?? "" },
    ];
  }

  if (tab === "profile") {
    return [
      homeItem,
      {
        label: "Patients",
        onClick: () => {
          setTab(prevTab || "history");
          setProfilePat(null);
        },
      },
      { label: profilePat?.name ?? "" },
    ];
  }

  if (breadcrumb[0] && breadcrumb[0] !== "Home") {
    return [homeItem, { label: breadcrumb[0] }];
  }

  return [homeItem];
}

// ── Header ─────────────────────────────────────────────────────────────────────

const Header: React.FC<HeaderProps> = ({
  tab,
  setTab,
  breadcrumb,
  setBreadcrumb,
  cStep,
  consultSteps,
  consulting,
  setConsulting,
  profilePat,
  setProfilePat,
  prevTab,
  notifications,
  onMarkAllNotificationsRead,
  onOpenBookModal,
  onOpenRegModal,
}) => {
  const [facility, setFacility] = useState("apollo");

  const breadcrumbItems = useBreadcrumbItems(
    tab,
    breadcrumb,
    consultSteps,
    cStep,
    profilePat,
    setTab,
    setBreadcrumb,
    setConsulting,
    setProfilePat,
    prevTab,
  );

  return (
    <header className={styles.topbar}>
      {/* ── Row 1: Main bar ── */}
      <div className={styles.topbarMain}>
        {/* Left — Logo */}
        <div className={styles.tbLeft}>
          <Logo />
        </div>

        {/* Right — Search + Actions + Facility + Bell + User */}
        <div className={styles.tbRight}>
          <TopbarQuickSearch />

          <TopbarActionsDropdown
            onBookAppointment={onOpenBookModal}
            onRegisterPatient={onOpenRegModal}
          />

          {/* Facility selector */}
          <select
            className={styles.facilitySelect}
            value={facility}
            onChange={(e) => setFacility(e.target.value)}
            aria-label="Select facility"
          >
            {FACILITIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>

          <NotificationPanel
            notifications={notifications}
            onMarkAllRead={onMarkAllNotificationsRead}
          />

          <UserChip name="Dr. R. Mehta" role="Psychiatrist" initials="DR" />
        </div>
      </div>

      {/* ── Row 2: Breadcrumb bar ── */}
      <div className={styles.topbarBreadcrumb}>
        <Breadcrumb items={breadcrumbItems} separator=">" />
        <DateTimeDisplay live />
      </div>
    </header>
  );
};

export default Header;
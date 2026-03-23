import React, { useState } from "react";
import styles from "./Sidebar.module.css";
import { useDoctorProfile, useAppointmentBadge } from "../hooks/useSidebarData";
import type { AppTab } from "../Header/Header";

// ── Types ──────────────────────────────────────────────────────────────────────

interface NavItem {
  id: AppTab;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  badgeClass?: string;
}

interface SidebarProps {
  tab: AppTab;
  setTab: (tab: AppTab) => void;
  setBreadcrumb: (items: string[]) => void;
  setConsulting: (p: null) => void;
  onSignOut?: () => void;
}

// ── Icons ──────────────────────────────────────────────────────────────────────

const HomeIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const ReportsIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// ── Sidebar ────────────────────────────────────────────────────────────────────

const Sidebar: React.FC<SidebarProps> = ({
  tab,
  setTab,
  setBreadcrumb,
  setConsulting,
  onSignOut,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  // ── React Query data ──
  const { data: doctor } = useDoctorProfile();
  const { data: badge }  = useAppointmentBadge();

  const appointmentBadge =
    badge ? badge.queueCount + badge.attendedCount : undefined;

  const navItems: NavItem[] = [
    { id: "home",    label: "Home",         icon: <HomeIcon /> },
    { id: "queue",   label: "Appointments", icon: <CalendarIcon />, badge: appointmentBadge },
    { id: "history", label: "Patients",     icon: <UsersIcon /> },
    { id: "revenue", label: "Reports",      icon: <ReportsIcon /> },
  ];

  // ── Nav item click ──
  const handleNavClick = (item: NavItem) => {
    if (tab === "consult") {
      setConsulting(null);
      setTab("queue");
    } else {
      setTab(item.id);
    }
    setBreadcrumb([item.label]);
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>

      {/* ── Logo section ── */}
      <div className={`${styles.logoRow} ${collapsed ? styles.logoRowCollapsed : ""}`}>
        <div className={styles.logoImgWrap}>
          <img
            src={collapsed ? "/apple-touch-icon.png" : "/logo.png"}
            alt="MedX+"
            className={styles.logoImg}
          />
        </div>

        {/* Collapse toggle */}
        <button
          className={`${styles.collapseBtn} ${collapsed ? styles.collapseBtnFixed : ""}`}
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className={`${styles.nav} ${collapsed ? styles.navCollapsed : ""}`}>
        {navItems.map((item) => {
          const isActive = tab === item.id && tab !== "consult";
          return (
            <button
              key={item.id}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""} ${collapsed ? styles.navItemCollapsed : ""}`}
              onClick={() => handleNavClick(item)}
              title={collapsed ? item.label : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              <span className={styles.navIcon}>{item.icon}</span>

              {!collapsed && (
                <>
                  <span className={styles.navLabel}>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`${styles.navBadge} ${item.badgeClass ? styles[item.badgeClass] : ""}`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div className={styles.footer}>

        {/* Doctor info */}
        <div className={`${styles.doctorRow} ${collapsed ? styles.doctorRowCollapsed : ""}`}
          title={collapsed ? (doctor?.name ?? "Doctor") : undefined}
        >
          <div className={styles.avatar}>
            {doctor?.initials ?? "DR"}
          </div>

          {!collapsed && (
            <>
              <div className={styles.doctorInfo}>
                <span className={styles.doctorName}>{doctor?.name ?? "Dr. R. Mehta"}</span>
                <span className={styles.doctorRole}>{doctor?.role ?? "Psychiatrist"}</span>
              </div>
              {doctor?.isOnline && (
                <span className={styles.onlineDot} aria-label="Online" />
              )}
            </>
          )}
        </div>

        {/* Sign out */}
        <button
          className={`${styles.navItem} ${styles.signOutBtn} ${collapsed ? styles.navItemCollapsed : ""}`}
          onClick={onSignOut ?? (() => alert("Logged out"))}
          title={collapsed ? "Sign Out" : undefined}
          aria-label="Sign out"
        >
          <span className={styles.navIcon}><LogoutIcon /></span>
          {!collapsed && <span className={styles.navLabel}>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
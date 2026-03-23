import React from "react";
import styles from "./MainLayout.module.css";
import Header, { type AppTab, type ConsultStep, type PatientBasic } from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import { type Notification } from "./components/NotificationPanel";

// ── Types ──────────────────────────────────────────────────────────────────────

interface MainLayoutProps {
  children: React.ReactNode;
  // ── Navigation state ──
  tab: AppTab;
  setTab: (tab: AppTab) => void;
  prevTab: AppTab;
  breadcrumb: string[];
  setBreadcrumb: (items: string[]) => void;
  cStep: number;
  consultSteps: ConsultStep[];
  consulting: PatientBasic | null;
  setConsulting: (p: PatientBasic | null) => void;
  profilePat: PatientBasic | null;
  setProfilePat: (p: PatientBasic | null) => void;
  // ── Notifications ──
  notifications: Notification[];
  onMarkAllNotificationsRead: () => void;
  // ── Modal triggers ──
  onOpenBookModal: () => void;
  onOpenRegModal: () => void;
  // ── Sidebar ──
  onSignOut?: () => void;
}

// ── Component ──────────────────────────────────────────────────────────────────

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  tab,
  setTab,
  prevTab,
  breadcrumb,
  setBreadcrumb,
  cStep,
  consultSteps,
  consulting,
  setConsulting,
  profilePat,
  setProfilePat,
  notifications,
  onMarkAllNotificationsRead,
  onOpenBookModal,
  onOpenRegModal,
  onSignOut,
}) => {
  return (
    <div className={styles.shell}>

      {/* ── Left: Sidebar — full height ── */}
      <Sidebar
        tab={tab}
        setTab={setTab}
        setBreadcrumb={setBreadcrumb}
        setConsulting={setConsulting}
        onSignOut={onSignOut}
      />

      {/* ── Right: Header on top + content below ── */}
      <div className={styles.rightPane}>

        <Header
          tab={tab}
          setTab={setTab}
          breadcrumb={breadcrumb}
          setBreadcrumb={setBreadcrumb}
          cStep={cStep}
          consultSteps={consultSteps}
          consulting={consulting}
          setConsulting={setConsulting}
          profilePat={profilePat}
          setProfilePat={setProfilePat}
          prevTab={prevTab}
          notifications={notifications}
          onMarkAllNotificationsRead={onMarkAllNotificationsRead}
          onOpenBookModal={onOpenBookModal}
          onOpenRegModal={onOpenRegModal}
        />

        <main className={styles.content}>
          {children}
        </main>

      </div>
    </div>
  );
};

export default MainLayout;
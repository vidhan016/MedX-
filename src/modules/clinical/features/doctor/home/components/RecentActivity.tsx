import React from "react";
import styles from "../styles/doctor-home.module.css";
import type { ActivityItem, ActivityType } from "../types/doctor-home.types";

// ── Activity config ────────────────────────────────────────────────────────────

interface ActivityMeta {
  label: string;
  by: string;
  color: string;
  bg: string;
}

const ACTIVITY_META: Record<ActivityType, ActivityMeta> = {
  consult: { label: "Attended",       by: "Dr. R. Mehta", color: "var(--ins-primary, #1ab394)",    bg: "var(--ins-primary-bg-subtle, #e8f7f4)" },
  queue:   { label: "Added to Queue", by: "Front Desk",   color: "var(--ins-secondary, #1c84c6)",  bg: "#dbeafe" },
  new:     { label: "Registered",     by: "Front Desk",   color: "var(--ins-success, #0acf97)",    bg: "#dcfce7" },
  lab:     { label: "Lab Updated",    by: "Dr. R. Mehta", color: "var(--ins-warning, #f8ac59)",    bg: "#fef3c7" },
  info:    { label: "Session",        by: "System",       color: "var(--ins-secondary-color, #9ba6b7)", bg: "var(--ins-tertiary-bg, #f6f7fb)" },
};

// ── Helpers ────────────────────────────────────────────────────────────────────

const getInitials = (text: string): string =>
  text
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const parseName = (text: string): string =>
  text
    .split("—")[0]
    .replace(/^Consulted /, "")
    .replace(/ added to queue$/, "")
    .replace(/ registered as new patient$/, "")
    .replace(/ score updated for /, " — ")
    .trim();

// ── Props ──────────────────────────────────────────────────────────────────────

interface RecentActivityProps {
  activity: ActivityItem[];
  isLoading: boolean;
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

const SkeletonRow = () => (
  <div className={styles.actRow}>
    <div className={`${styles.skeleton}`} style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0 }} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
      <div className={`${styles.skeleton}`} style={{ height: 14, width: "55%" }} />
      <div className={`${styles.skeleton}`} style={{ height: 12, width: "70%" }} />
    </div>
    <div className={`${styles.skeleton}`} style={{ height: 13, width: 50 }} />
  </div>
);

// ── Component ──────────────────────────────────────────────────────────────────

const RecentActivity: React.FC<RecentActivityProps> = ({ activity, isLoading }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHd}>
        <div className={styles.cardTitle}>
          <div className={styles.ctBar} />
          Recent Activity
        </div>
      </div>

      <div className={styles.cardBd} style={{ paddingTop: 8 }}>
        {isLoading
          ? [1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)
          : activity.map((a) => {
              const meta = ACTIVITY_META[a.type] ?? ACTIVITY_META.info;
              const initials = getInitials(a.text);
              const name = parseName(a.text);

              return (
                <div key={a.id} className={styles.actRow}>
                  {/* Avatar */}
                  <div
                    className={styles.actAvatar}
                    style={{
                      background: meta.bg,
                      color: meta.color,
                      border: `1.5px solid ${meta.color}22`,
                    }}
                    aria-hidden="true"
                  >
                    {initials}
                  </div>

                  {/* Body */}
                  <div className={styles.actBody}>
                    <div className={styles.actName}>{name}</div>
                    <div className={styles.actMeta}>
                      <span
                        className={styles.actLabel}
                        style={{ background: meta.bg, color: meta.color }}
                      >
                        {meta.label}
                      </span>
                      <span className={styles.actBy}>by {meta.by}</span>
                    </div>
                  </div>

                  {/* Time */}
                  <div className={styles.actTime}>{a.time}</div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default RecentActivity;
import React from "react";
import styles from "../styles/doctor-home.module.css";
import type { ScheduleSlot, SlotState } from "../types/doctor-home.types";

// ── Helpers ────────────────────────────────────────────────────────────────────

const pad = (n: number) => String(n).padStart(2, "0");

const toAmPm = (h: number, m: number) => {
  const meridiem = h < 12 ? "AM" : "PM";
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${pad(displayH)}:${pad(m)} ${meridiem}`;
};

const getTimeRange = (time: string): string => {
  const [hh, mm] = time.split(":").map(Number);
  const totalMins = hh * 60 + mm + 30;
  const endHH = Math.floor(totalMins / 60) % 24;
  const endMM = totalMins % 60;
  return `${toAmPm(hh, mm)} – ${toAmPm(endHH, endMM)}`;
};

// ── State config ───────────────────────────────────────────────────────────────

const STATE_CONFIG: Record<SlotState, { symbol: string; symbolClass: string; slotClass: string }> = {
  done:    { symbol: "✓",   symbolClass: styles.ssStDone,    slotClass: styles.ssSlotDone   },
  active:  { symbol: "●",   symbolClass: styles.ssStActive,  slotClass: styles.ssSlotActive },
  pending: { symbol: "···", symbolClass: styles.ssStPending, slotClass: ""                  },
};

// ── Props ──────────────────────────────────────────────────────────────────────

interface ScheduleOverviewProps {
  slots: ScheduleSlot[];
  isLoading: boolean;
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

const SkeletonRow = () => (
  <div className={styles.ssSlot}>
    <div className={styles.skeleton} style={{ height: 14, width: 110 }} />
    <div className={styles.ssCenter}>
      <div className={styles.skeleton} style={{ height: 14, width: "50%" }} />
      <div className={styles.skeleton} style={{ height: 18, width: "60%" }} />
    </div>
  </div>
);

// ── Component ──────────────────────────────────────────────────────────────────

const ScheduleOverview: React.FC<ScheduleOverviewProps> = ({ slots, isLoading }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHd}>
        <div className={styles.cardTitle}>
          <div className={styles.ctBar} />
          Today's Schedule
        </div>
      </div>
      <div className={styles.cardBd}>
        <div className={styles.ss}>
          {isLoading
            ? [1, 2, 3].map((i) => <SkeletonRow key={i} />)
            : slots.map((s, i) => {
                const cfg = STATE_CONFIG[s.state];
                const slotClass = [styles.ssSlot, cfg.slotClass].filter(Boolean).join(" ");

                return (
                  <div key={i} className={slotClass}>
                    <div className={styles.ssTime}>{getTimeRange(s.time)}</div>

                    <div className={styles.ssCenter}>
                      <div className={styles.ssNameRow}>
                        <span className={styles.ssName}>{s.name}</span>
                        <span className={cfg.symbolClass} aria-label={s.state}>
                          {cfg.symbol}
                        </span>
                      </div>

                      <div className={styles.ssBadges}>
                        <span className={`${styles.badge} ${styles.badgeBlue}`}>
                          {s.visitType}
                        </span>
                        <span className={`${styles.badge} ${styles.badgeGreen}`}>
                          {s.appointmentType}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default ScheduleOverview;
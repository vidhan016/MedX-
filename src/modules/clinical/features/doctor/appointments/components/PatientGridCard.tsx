import React from "react";
import Avatar from "../../../../../../shared/ui/display/Avataar";
import VitalsGrid from "./VitalsGrid";
import ActionMenu, { type ActionMenuItem } from "./ActionMenu";
import { FlagBadge, NatureBadges, AllergyBadges } from "./OverflowBadges";
import { addHalfHour } from "../utils/appointments.helpers";
import styles from "../styles/doctor-appointments.module.css";
import type { QueuePatient } from "../types/doctor-appointments.types";

// ── Icons ──────────────────────────────────────────────────────────────────────

const LocationIcon = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const BloodIcon = () => (
  <svg width="12" height="12" fill="#dc2626" viewBox="0 0 24 24">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);
const ScopeIcon = () => (
  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="2" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
    <path d="m4.93 4.93 1.41 1.41m11.32 11.32 1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);
const CalIcon = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const ClockIcon = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const UpNextIcon = () => (
  <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" />
  </svg>
);
const DxIcon = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
  </svg>
);

// ── Props ──────────────────────────────────────────────────────────────────────

interface PatientGridCardProps {
  patient: QueuePatient;
  isFirst?: boolean;
  showConsult?: boolean;
  onConsult?: (p: QueuePatient) => void;
  onViewHistory?: (p: QueuePatient) => void;
  onPrintRx?: (p: QueuePatient) => void;
}

// ── Component ──────────────────────────────────────────────────────────────────

const PatientGridCard: React.FC<PatientGridCardProps> = ({
  patient: p,
  isFirst = false,
  showConsult = false,
  onConsult,
  onViewHistory,
  onPrintRx,
}) => {
  const cardClass = `${styles.pc} ${isFirst ? styles.pcFirst : ""}`;

  const menuItems: ActionMenuItem[] = [
    { icon: "history", label: "View History", action: () => onViewHistory?.(p) },
    { icon: "file",    label: "Print Rx",     action: () => onPrintRx?.(p) },
  ];

  const natureBadges = Array.isArray(p.natureBadge)
    ? p.natureBadge
    : p.natureBadge
    ? [p.natureBadge]
    : [];

  return (
    <div className={cardClass}>
      <div className={styles.pcGridBody}>

        {/* Row 1 — Avatar + name + badges + action */}
        <div className="flex items-center gap-2">
          <Avatar
            initials={p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            size="sm"
            shape="rounded"
            bg={isFirst ? "var(--ins-secondary, #1c84c6)" : "#eff6ff"}
            color={isFirst ? "#fff" : "#2563eb"}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className={styles.pcNameRow}>
              <span className={styles.pcName}>{p.salutation} {p.name}</span>
              <span className={`${styles.inlineBadge} ${styles.badgeToken}`}>#{p.token}</span>
              <span className={`${styles.inlineBadge} ${p.isNew ? styles.badgeNew : styles.badgeFollowUp}`}>
                {p.isNew ? "NEW" : "FOLLOW-UP"}
              </span>
            </div>
            <div className={styles.pcMeta}>
              <span className={styles.pcMetaItem}><LocationIcon />{p.city ?? "Mumbai"}, {p.state ?? "MH"}</span>
              <span className={styles.dot}>·</span>
              <span className={styles.pcMetaItem}><PhoneIcon />{p.phone ?? "—"}</span>
            </div>
            <div className={styles.pcDemRow}>
              <span>{p.age}y / {p.gender}</span>
              <span className={styles.dot}>·</span>
              <span className={styles.badgeBlood}><BloodIcon />{p.bloodGroup}</span>
              {p.emergencyContact && (
                <>
                  <span className={styles.dot}>·</span>
                  <span style={{ color: "#dc2626", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                    <PhoneIcon />{p.emergencyPhone}
                  </span>
                </>
              )}
            </div>
          </div>
          {/* Zap menu in top-right */}
          <ActionMenu patientId={p.id} items={menuItems} upward size="lg" />
        </div>

        {/* Row 2 — Date + time + up next */}
        <div className={styles.pcMeta} style={{ flexWrap: "nowrap" }}>
          <span className={styles.pcMetaItem}><CalIcon />13 Mar 2026</span>
          <span className={styles.dot}>·</span>
          <span className={styles.pcMetaItem}><ClockIcon />{p.appointmentTime} – {addHalfHour(p.appointmentTime)}</span>
          {isFirst && (
            <span className={`${styles.inlineBadge} ${styles.badgeUpNext}`}>
              <UpNextIcon /> UP NEXT
            </span>
          )}
        </div>

        {/* Row 3 — Diagnoses */}
        {p.diagnoses && p.diagnoses.length > 0 && (
          <div className={styles.pcMeta} style={{ gap: 5 }}>
            <DxIcon />
            {p.diagnoses.map((dx, i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: 600 }}>{dx}</span>
            ))}
          </div>
        )}

        {/* Row 4 — Flag + nature + allergies */}
        {(p.flag || natureBadges.length > 0 || (p.allergies && p.allergies.length > 0)) && (
          <div className={styles.badgeRow} style={{ flexWrap: "wrap" }}>
            {p.flag && <FlagBadge flag={p.flag} />}
            {natureBadges.length > 0 && <NatureBadges badges={natureBadges} />}
            {p.allergies && p.allergies.length > 0 && (
              <AllergyBadges allergies={p.allergies} />
            )}
          </div>
        )}

        {/* Row 5 — Vitals */}
        <VitalsGrid vitals={p.vitals} compact />

        {/* Row 6 — Consult button (queue only) */}
        {showConsult && (
          <div className="flex items-center gap-2 mt-1">
            <button
              className={`${styles.consultBtn} ${styles.consultBtnFull}`}
              onClick={() => onConsult?.(p)}
            >
              <ScopeIcon /> Consult
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientGridCard;
import React from "react";
import Avatar from "../../../../../../../shared/ui/display/avataar/Avataar";
import VitalsGrid from "../../appointments/components/VitalsGrid";
import ActionMenu, { type ActionMenuItem } from "../../appointments/components/ActionMenu";
import RxOverflow from "./RxOverflow";
import styles from "../styles/doctor-patients.module.css";
import type { HistoryPatient } from "../types/doctor-patients.types";

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
const ScopeIcon = () => (
  <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="2" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
  </svg>
);
const DxIcon = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
  </svg>
);
const FlagIcon = ({ color }: { color: string }) => (
  <svg width="10" height="10" fill={color} viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);
const BadgeIcon = () => (
  <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#0277bd" strokeWidth={2}>
    <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);
const SneezeIcon = () => (
  <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#dc2626" strokeWidth={2}>
    <path d="M12 2a5 5 0 0 1 5 5c0 2-1 3-2 4l-3 3-3-3c-1-1-2-2-2-4a5 5 0 0 1 5-5z" />
    <path d="M8 17l-2 4" /><path d="M16 17l2 4" /><path d="M8 21h8" />
  </svg>
);

// ── Props ──────────────────────────────────────────────────────────────────────

interface PatientCardProps {
  patient: HistoryPatient;
  mode: "list" | "grid";
  onViewProfile?: (p: HistoryPatient) => void;
  onViewHistory?: (p: HistoryPatient) => void;
  onPrintRx?: (p: HistoryPatient) => void;
}

// ── Shared info block ──────────────────────────────────────────────────────────

const PatientInfo: React.FC<{ p: HistoryPatient }> = ({ p }) => {
  const natureBadges = p.natureBadges ?? [];
  const visibleNature = natureBadges.slice(0, 1);
  const hiddenNature  = natureBadges.slice(1);

  const visibleAllergy = (p.allergies ?? []).slice(0, 1);
  const hiddenAllergy  = (p.allergies ?? []).slice(1);

  return (
    <div className={styles.pcInfo}>
      {/* Name + visits + new/followup */}
      <div className={styles.pcNameRow}>
        <span className={styles.pcName}>{p.salutation} {p.name}</span>
        <span className={`${styles.inlineBadge} ${styles.badgeVisits}`}>
          {p.visits} Visit{p.visits !== 1 ? "s" : ""}
        </span>
        <span className={`${styles.inlineBadge} ${p.isNew ? styles.badgeNew : styles.badgeFollowUp}`}>
          {p.isNew ? "NEW" : "FOLLOW-UP"}
        </span>
      </div>

      {/* City + phone */}
      <div className={styles.pcMeta}>
        <span className={styles.pcMetaItem}><LocationIcon />{p.city ?? "—"}, {p.state ?? "—"}</span>
        <span className={styles.pcMetaItem}><PhoneIcon />{p.phone ?? "—"}</span>
      </div>

      {/* Age / gender / blood / emergency */}
      <div className={styles.pcDemRow}>
        <span>{p.age}y / {p.gender}</span>
        <span className={styles.dot}>·</span>
        <span className={styles.badgeBlood}><BloodIcon />{p.bloodGroup}</span>
        {p.emergencyContact && (
          <>
            <span className={styles.dot}>·</span>
            <span style={{ color: "#dc2626", fontWeight: 700, display: "flex", alignItems: "center", gap: 2 }}>
              <PhoneIcon />{p.emergencyPhone}
            </span>
          </>
        )}
      </div>

      {/* Flag + nature badges */}
      {(p.flag || visibleNature.length > 0) && (
        <div className={styles.badgeRow} style={{ marginTop: 3 }}>
          {p.flag && (
            <span
              className={styles.badgeFlag}
              style={{ background: p.flag.bg, color: p.flag.color, border: `1px solid ${p.flag.color}33` }}
            >
              <FlagIcon color={p.flag.color} />{p.flag.label}
            </span>
          )}
          {visibleNature.map((b, i) => (
            <span key={i} className={styles.badgeNature}><BadgeIcon />{b}</span>
          ))}
          {hiddenNature.length > 0 && (
            <div className={styles.overflowWrap}>
              <span className={`${styles.badgeOverflow} ${styles.badgeOverflowNature}`}>+{hiddenNature.length}</span>
              <div className={styles.overflowTooltip}>
                {hiddenNature.map((b, i) => (
                  <div key={i} className={`${styles.tooltipItem} ${styles.tooltipItemNature}`}><BadgeIcon />{b}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Shared middle block ────────────────────────────────────────────────────────

const PatientMidBlock: React.FC<{ p: HistoryPatient }> = ({ p }) => {
  const visibleAllergy = (p.allergies ?? []).slice(0, 1);
  const hiddenAllergy  = (p.allergies ?? []).slice(1);

  return (
    <div className={styles.pcMidBlock}>
      {/* Date + attended time + visit/appt type */}
      <div className={styles.pcMeta} style={{ flexWrap: "nowrap" }}>
        {p.lastVisit && <span className={styles.pcMetaItem}><CalIcon />{p.lastVisit}</span>}
        {p.attendedAt && (
          <>
            <span className={styles.dot}>·</span>
            <span className={styles.pcMetaItem}><ClockIcon />{p.attendedAt}</span>
          </>
        )}
      </div>

      {/* Visit + appt type */}
      {(p.visitType || p.appointmentType) && (
        <div className={styles.badgeRow} style={{ marginTop: 2 }}>
          {p.visitType && (
            <span className={`${styles.inlineBadge} ${styles.badgeVisitType}`}>
              <ScopeIcon />
              {p.visitType.charAt(0).toUpperCase() + p.visitType.slice(1)}
            </span>
          )}
          {p.appointmentType && (
            <span className={`${styles.inlineBadge} ${styles.badgeApptType}`}>
              {p.appointmentType.charAt(0).toUpperCase() + p.appointmentType.slice(1)}
            </span>
          )}
        </div>
      )}

      {/* Diagnosis */}
      {(p.lastDiag || p.diagnosis) && (
        <div className={styles.pcMeta} style={{ gap: 5, marginTop: 2 }}>
          <DxIcon />
          <span style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {p.lastDiag ?? p.diagnosis}
          </span>
        </div>
      )}

      {/* Last prescription with overflow */}
      {p.lastPrescription && p.lastPrescription.length > 0 && (
        <div style={{ marginTop: 2 }}>
          <RxOverflow items={p.lastPrescription} maxVisible={1} />
        </div>
      )}

      {/* Allergies */}
      {visibleAllergy.length > 0 && (
        <div className={styles.badgeRow} style={{ marginTop: 2 }}>
          {visibleAllergy.map((al, i) => (
            <span key={i} className={styles.badgeAllergy}>
              <SneezeIcon />
              {typeof al === "string" ? al : al.allergen}
            </span>
          ))}
          {hiddenAllergy.length > 0 && (
            <div className={styles.overflowWrap}>
              <span className={`${styles.badgeOverflow} ${styles.badgeOverflowAllergy}`}>+{hiddenAllergy.length}</span>
              <div className={styles.overflowTooltip}>
                {hiddenAllergy.map((al, i) => (
                  <div key={i} className={`${styles.tooltipItem} ${styles.tooltipItemAllergy}`}>
                    <SneezeIcon />
                    {typeof al === "string" ? al : al.allergen}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────

const PatientCard: React.FC<PatientCardProps> = ({
  patient: p,
  mode,
  onViewProfile,
  onViewHistory,
  onPrintRx,
}) => {
  const menuItems: ActionMenuItem[] = [
    { icon: "history", label: "View Profile", action: () => onViewProfile?.(p) },
    { icon: "history", label: "View History", action: () => onViewHistory?.(p) },
    { icon: "file",    label: "Print Rx",     action: () => onPrintRx?.(p) },
  ];

  const initials = p.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  // ── LIST VIEW ──────────────────────────────────────────────────────────────

  if (mode === "list") {
    return (
      <div className={styles.pc}>
        <div className={styles.pcListRow}>

          {/* Left: avatar + info */}
          <div className={styles.pcLeftBlock}>
            <div className={styles.pcAvatarRow}>
              <Avatar initials={initials} size="sm" shape="rounded" bg="#eff6ff" color="#2563eb" />
              <PatientInfo p={p} />
            </div>
          </div>

          {/* Middle: date/dx/rx/allergies */}
          <PatientMidBlock p={p} />

          {/* Vitals */}
          {p.vitals && <VitalsGrid vitals={p.vitals} />}

          {/* Actions */}
          <div className={styles.pcActions}>
            <ActionMenu patientId={p.id} items={menuItems} />
          </div>
        </div>
      </div>
    );
  }

  // ── GRID VIEW ──────────────────────────────────────────────────────────────

  return (
    <div className={styles.pc}>
      <div className={styles.pcGridBody}>

        {/* Row 1: avatar + info + zap */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <Avatar initials={initials} size="sm" shape="rounded" bg="#eff6ff" color="#2563eb" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <PatientInfo p={p} />
          </div>
          <ActionMenu patientId={p.id} items={menuItems} upward size="lg" />
        </div>

        {/* Row 2: date/dx/rx/allergies */}
        <PatientMidBlock p={p} />

        {/* Row 3: vitals */}
        {p.vitals && <VitalsGrid vitals={p.vitals} compact />}
      </div>
    </div>
  );
};

export default PatientCard;
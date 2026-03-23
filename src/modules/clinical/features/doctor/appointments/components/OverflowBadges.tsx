import React from "react";
import Badge from "../../../../../../shared/ui/display/Badge";
import styles from "../styles/doctor-appointments.module.css";
import type { PatientFlag, Allergy } from "../types/doctor-appointments.types";

// ── Icons ──────────────────────────────────────────────────────────────────────

const FlagIcon = ({ color }: { color: string }) => (
  <svg width="10" height="10" fill={color} viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

const BadgeIcon = () => (
  <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#0277bd" strokeWidth={2}>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

const SneezeIcon = () => (
  <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#dc2626" strokeWidth={2}>
    <path d="M12 2a5 5 0 0 1 5 5c0 2-1 3-2 4l-3 3-3-3c-1-1-2-2-2-4a5 5 0 0 1 5-5z" />
    <path d="M8 17l-2 4" /><path d="M16 17l2 4" /><path d="M8 21h8" />
  </svg>
);

// ── FlagBadge ──────────────────────────────────────────────────────────────────

export const FlagBadge: React.FC<{ flag: PatientFlag }> = ({ flag }) => (
  <Badge
    label={flag.label}
    icon={<FlagIcon color={flag.color} />}
    readonly
    className="badge-flag"
    // Inline style passed via className override — color handled in Badge.css
    // or you can wrap with a span if you need dynamic bg/color per flag
  />
);

// ── NatureBadges ───────────────────────────────────────────────────────────────

interface NatureBadgesProps {
  badges: string | string[];
  maxVisible?: number;
}

export const NatureBadges: React.FC<NatureBadgesProps> = ({
  badges,
  maxVisible = 1,
}) => {
  const all     = Array.isArray(badges) ? badges : [badges];
  const visible = all.slice(0, maxVisible);
  const hidden  = all.slice(maxVisible);

  return (
    <>
      {visible.map((b, i) => (
        <Badge
          key={i}
          label={b}
          icon={<BadgeIcon />}
          readonly
          className="badge-nature"
        />
      ))}

      {hidden.length > 0 && (
        <div className={styles.overflowWrap}>
          <span className={`${styles.badgeOverflow} ${styles.badgeOverflowNature}`}>
            +{hidden.length}
          </span>
          <div className={styles.overflowTooltip}>
            {hidden.map((b, i) => (
              <div key={i} className={`${styles.tooltipItem} ${styles.tooltipItemNature}`}>
                <BadgeIcon />
                {b}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// ── AllergyBadges ──────────────────────────────────────────────────────────────

interface AllergyBadgesProps {
  allergies: Allergy[];
  maxVisible?: number;
}

export const AllergyBadges: React.FC<AllergyBadgesProps> = ({
  allergies,
  maxVisible = 1,
}) => {
  const visible = allergies.slice(0, maxVisible);
  const hidden  = allergies.slice(maxVisible);

  return (
    <>
      {visible.map((al, i) => (
        <Badge
          key={i}
          label={al.allergen}
          icon={<SneezeIcon />}
          readonly
          className="badge-allergy"
        />
      ))}

      {hidden.length > 0 && (
        <div className={styles.overflowWrap}>
          <span className={`${styles.badgeOverflow} ${styles.badgeOverflowAllergy}`}>
            +{hidden.length}
          </span>
          <div className={styles.overflowTooltip}>
            {hidden.map((al, i) => (
              <div key={i} className={`${styles.tooltipItem} ${styles.tooltipItemAllergy}`}>
                <SneezeIcon />
                {al.allergen}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
  import React from "react";

  // ─── Types ────────────────────────────────────────────────────────────────────

  type BadgeColor = "green" | "amber" | "teal" | "blue" | "red";

  interface StatBadge {
    label: string;
    value: number | string;
    color?: BadgeColor;
  }

  interface StatCardProps {
    label: string;                       // top heading e.g. "Today's Appointments"
    value: number | string;              // big number
    valueColor?: BadgeColor;             // optional color for the main value
    badges?: StatBadge[];                // sub-row items (Attended / Pending etc.)
    icon?: React.ReactNode;              // any SVG / icon element
    onClick?: () => void;                // makes card clickable
    className?: string;
  }

  // ─── Color Map ────────────────────────────────────────────────────────────────

  const colorMap: Record<BadgeColor, string> = {
    green: "var(--green)",
    amber: "var(--amber)",
    teal:  "var(--teal)",
    blue:  "var(--blue-mid)",
    red:   "var(--red, #ef4444)",
  };

  // ─── Component ────────────────────────────────────────────────────────────────

  const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    valueColor,
    badges = [],
    icon,
    onClick,
    className = "",
  }) => {
    const isClickable = typeof onClick === "function";

    return (
      <div
        className={`sc ${isClickable ? "click" : ""} ${className}`}
        onClick={onClick}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={isClickable
          ? (e) => e.key === "Enter" && onClick?.()
          : undefined}
      >
        {/* Label */}
        <div className="sc-label">{label}</div>

        {/* Big value */}
        <div
          className="sc-value"
          style={valueColor ? { color: colorMap[valueColor] } : undefined}
        >
          {value}
        </div>

        {/* Badge row */}
        {badges.length > 0 && (
          <div className="sc-sub">
            {badges.map((badge, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="sc-divider" />}
                <div className="sc-sub-item">
                  <span
                    className="sc-num"
                    style={badge.color ? { color: colorMap[badge.color] } : undefined}
                  >
                    {badge.value}
                  </span>
                  <span style={{ color: "var(--muted)" }}>{badge.label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Background icon */}
        {icon && (
          <div className="sc-icon" style={{ opacity: 0.4 }}>
            {icon}
          </div>
        )}
      </div>
    );
  };

  export default StatCard;
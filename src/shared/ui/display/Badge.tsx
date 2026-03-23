import React from "react";
import "./Badge.css";

// ── Types ──────────────────────────────────────────────────────────────────────

interface BadgeProps {
  /** Badge label text */
  label: string;
  /** Icon rendered before the label — pass your IC component output or any ReactNode */
  icon?: React.ReactNode;
  /** If provided, renders a remove (×) button and calls this when clicked */
  onRemove?: () => void;
  /** If true, no remove button is shown even if onRemove is provided — use for readonly display */
  readonly?: boolean;
  /** Href — renders badge as an <a> tag */
  href?: string;
  /** Extra class names */
  className?: string;
  /** Called when the badge itself is clicked (only when not an anchor) */
  onClick?: () => void;
}

// ── Component ──────────────────────────────────────────────────────────────────

const Badge: React.FC<BadgeProps> = ({
  label,
  icon,
  onRemove,
  readonly = false,
  href,
  className = "",
  onClick,
}) => {
  const classes = `badge badge-outline-primary me-1 ${className}`.trim();

  const content = (
    <>
      {icon && <span className="badge-icon">{icon}</span>}
      <span>{label}</span>
      {!readonly && onRemove && (
        <button
          className="badge-remove"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${label}`}
          type="button"
        >
          ×
        </button>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <span
      className={classes}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : undefined}
    >
      {content}
    </span>
  );
};

export default Badge;
export type { BadgeProps };
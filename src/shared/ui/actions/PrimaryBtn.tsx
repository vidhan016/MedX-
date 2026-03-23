import React from "react";
import "./shared/buttons.css";

// ── Types ──────────────────────────────────────────────────────────────────────

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Renders the button with rounded-pill shape */
  pill?: boolean;
  children: React.ReactNode;
}

// ── Component ──────────────────────────────────────────────────────────────────

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  pill = false,
  children,
  className = "",
  ...rest
}) => {
  const classes = [
    "btn",
    "btn-primary",
    pill ? "rounded-pill" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
};

export default PrimaryButton;
export type { PrimaryButtonProps };
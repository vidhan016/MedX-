import React from "react";
import "./BackButton.scss";
// ── Types ──────────────────────────────────────────────────────────────────────

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  size?: "sm" | "md";
}

interface IC_Props {
  n: string;
  s?: number;
  c?: string;
}

// ── Placeholder icon component — replace with your actual IC implementation ──
const IC: React.FC<IC_Props> = ({ n, s = 14, c = "currentColor" }) => (
  <span style={{ fontSize: s, color: c, lineHeight: 1 }} className="inline-flex">
    {n}
  </span>
);

// ── Component ──────────────────────────────────────────────────────────────────

const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label = "Back",
  size = "sm",
}) => {
  const sizeClass =
    size === "sm"
      ? "px-3 py-[6px] text-[12px]"
      : "px-4 py-2 text-[13px]";

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-[6px] ${sizeClass} rounded-[var(--rs)] font-semibold cursor-pointer font-[inherit] bg-white text-[var(--text)] border border-[var(--border)] transition-all duration-150 hover:bg-[#f8fafc] hover:border-[var(--border2)]`}
    >
      <IC n="arrowLeft" s={12} />
      {label}
    </button>
  );
};

export default BackButton;
export type { BackButtonProps };
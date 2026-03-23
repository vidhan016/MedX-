import React from "react";
import "./FormModal.css";

// ── Types ──────────────────────────────────────────────────────────────────────

interface FormModalProps {
  /** Whether the modal is visible */
  open: boolean;
  /** Primary title shown in the header */
  title?: string;
  /** Subtitle / secondary label shown below the title */
  subtitle?: string;
  /** Width of the panel — any valid CSS width value */
  width?: string;
  /** Accent color used for the title text and confirm button background */
  accentColor?: string;
  /** Label for the confirm button. Defaults to "Done" */
  confirmLabel?: string;
  /** Called when backdrop or Cancel is clicked */
  onCancel: () => void;
  /** Called when the confirm button is clicked */
  onConfirm: () => void;
  /** Body content — fields, inputs, etc. */
  children?: React.ReactNode;
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

const FormModal: React.FC<FormModalProps> = ({
  open,
  title,
  subtitle,
  width = "fit-content",
  accentColor = "var(--blue)",
  confirmLabel = "Done",
  onCancel,
  onConfirm,
  children,
}) => {
  if (!open) return null;

  return (
    <div
      className="fm-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="fm-panel" style={{ width }}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-[14px]">
          <div>
            {title && (
              <div
                className="text-[13.5px] font-extrabold"
                style={{ color: accentColor }}
              >
                {title}
              </div>
            )}
            {subtitle && (
              <div className="text-[10.5px] text-[var(--muted)] mt-[2px]">
                {subtitle}
              </div>
            )}
          </div>
          <button
            onClick={onCancel}
            className="bg-transparent border-none cursor-pointer text-[var(--muted)] flex items-center"
          >
            <IC n="x" s={16} />
          </button>
        </div>

        {/* ── Body ── */}
        {children}

        {/* ── Footer ── */}
        <div className="flex justify-end gap-2 mt-[14px]">
          <button className="fm-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="fm-confirm-btn"
            style={{ background: accentColor }}
            onClick={onConfirm}
          >
            <IC n="check" s={13} c="#fff" />
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
};

export default FormModal;
export type { FormModalProps };
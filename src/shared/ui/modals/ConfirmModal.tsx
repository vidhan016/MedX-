import React from "react";
import "./YesNoToggle.css";

// ── Types ──────────────────────────────────────────────────────────────────────

export type YesNoValue = "yes" | "no" | null;

export interface YesNoOption {
  /** Value emitted when this option is selected */
  value: string;
  /** Label displayed on the button */
  label: string;
  /** Active border + background color */
  activeColor: string;
}

export interface YesNoToggleProps {
  /** Question / label text shown in the row */
  question: string;
  /** Icon name passed to your IC component */
  icon?: string;
  /** Currently selected value */
  value: string | null;
  /** Called with the selected value when an option is clicked */
  onChange: (value: string) => void;
  /** Option definitions — defaults to Yes (blue) / No (green) */
  options?: YesNoOption[];
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

// ── Default options ────────────────────────────────────────────────────────────

const DEFAULT_OPTIONS: YesNoOption[] = [
  { value: "yes", label: "Yes", activeColor: "var(--blue)"  },
  { value: "no",  label: "No",  activeColor: "var(--green)" },
];

// ── Component ──────────────────────────────────────────────────────────────────

const YesNoToggle: React.FC<YesNoToggleProps> = ({
  question,
  icon,
  value,
  onChange,
  options = DEFAULT_OPTIONS,
}) => {
  return (
    <div className="ynt-row flex items-center gap-3 px-[14px] py-[10px] mb-3">
      {icon && <IC n={icon} s={15} c="var(--blue)" />}

      <span className="text-[13px] font-semibold text-[var(--text2)] flex-1">
        {question}
      </span>

      <div className="flex gap-[6px]">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className="ynt-btn"
              style={
                active
                  ? {
                      border: `1.5px solid ${opt.activeColor}`,
                      background: opt.activeColor,
                      color: "#fff",
                    }
                  : undefined
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default YesNoToggle;
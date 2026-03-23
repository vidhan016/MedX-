import React from "react";
import "./ModalFormRegistry.css";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface RegistryItem {
  _name: string;
  _category?: string;
  [key: string]: unknown;
}

export interface ModalFormRegistryProps {
  items: RegistryItem[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
  /** Icon name shown in the list header */
  listIcon?: string;
  /** Label shown in the list header */
  listLabel?: string;
  /** Color applied to the header label and default item name */
  listColor?: string;
  /** Background color for the Edit button */
  accentBg?: string;
  /** Text/border color for the Edit button */
  accentColor?: string;
  /** Custom renderer for each item's info section */
  renderItemInfo?: (item: RegistryItem) => React.ReactNode;
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

const ModalFormRegistry: React.FC<ModalFormRegistryProps> = ({
  items,
  onEdit,
  onRemove,
  listIcon = "check",
  listLabel = "Items",
  listColor = "var(--blue)",
  accentBg = "var(--blue-bg)",
  accentColor = "var(--blue)",
  renderItemInfo,
}) => {
  if (items.length === 0) return null;

  return (
    <div className="mt-3 border border-[var(--border)] rounded-[var(--rs)] bg-white overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#f8fafc] border-b border-[var(--border)]">
        <IC n={listIcon} s={13} c={listColor} />
        <span
          className="text-xs font-bold"
          style={{ color: listColor }}
        >
          {listLabel} — {items.length} added
        </span>
      </div>

      {/* ── Rows ── */}
      {items.map((item, i) => (
        <div
          key={i}
          className={`flex items-center justify-between px-3 py-[9px] gap-2 bg-white ${
            i < items.length - 1 ? "border-b border-[var(--border)]" : ""
          }`}
        >
          {/* Info */}
          <div className="flex-1 min-w-0">
            {renderItemInfo ? (
              renderItemInfo(item)
            ) : (
              <span
                className="font-bold text-[12.5px]"
                style={{ color: listColor }}
              >
                {item._name}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-[5px] flex-shrink-0">
            <button
              className="mfr-edit-btn"
              style={{ background: accentBg, color: accentColor }}
              onClick={() => onEdit(i)}
            >
              <IC n="edit" s={12} c={accentColor} /> Edit
            </button>
            <button
              className="mfr-remove-btn"
              onClick={() => onRemove(i)}
            >
              🗑 Remove
            </button>
          </div>
        </div>
      ))}

    </div>
  );
};

export default ModalFormRegistry;
import React from "react";
import "./Tabs.css";

// ── Types ──────────────────────────────────────────────────────────────────────

export type TabVariant = "segment" | "button" | "icon";

export interface TabItem {
  id: string;
  label?: string;
  icon?: string;
  /** badge count — shown as a pill next to the label */
  badge?: number;
  /** active accent color — used for segment & badge; defaults to "var(--blue)" */
  activeColor?: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: TabVariant;
  /** Called alongside onChange — useful for side effects like pagination resets */
  onTabClick?: (id: string) => void;
}

// ── Placeholder icon component — replace with your actual IC implementation ──

interface IC_Props {
  n: string;
  s?: number;
  c?: string;
}

const IC: React.FC<IC_Props> = ({ n, s = 14, c = "currentColor" }) => (
  <span style={{ fontSize: s, color: c, lineHeight: 1 }} className="inline-flex">
    {n}
  </span>
);

// ── Segment variant ────────────────────────────────────────────────────────────

const SegmentTabs: React.FC<TabsProps> = ({ tabs, activeId, onChange, onTabClick }) => (
  <div className="tabs-segment flex flex-row items-center">
    {tabs.map((tab) => {
      const active = activeId === tab.id;
      const accentColor = tab.activeColor ?? "var(--blue)";
      return (
        <div
          key={tab.id}
          onClick={() => {
            onChange(tab.id);
            onTabClick?.(tab.id);
          }}
          className={`tabs-segment-tab flex items-center ${
            active ? "tabs-segment-tab--active" : ""
          }`}
          style={{ color: active ? accentColor : undefined }}
        >
          {tab.icon && (
            <IC n={tab.icon} s={12} c={active ? accentColor : "var(--muted)"} />
          )}
          {tab.label}
          {tab.badge !== undefined && tab.badge > 0 && (
            <span
              className="tabs-badge"
              style={{
                background: active ? accentColor : "var(--muted)",
              }}
            >
              {tab.badge}
            </span>
          )}
        </div>
      );
    })}
  </div>
);

// ── Button variant ─────────────────────────────────────────────────────────────

const ButtonTabs: React.FC<TabsProps> = ({ tabs, activeId, onChange, onTabClick }) => (
  <div className="flex flex-row items-center flex-wrap gap-[2px]">
    {tabs.map((tab) => {
      const active = activeId === tab.id;
      return (
        <button
          key={tab.id}
          onClick={() => {
            onChange(tab.id);
            onTabClick?.(tab.id);
          }}
          className={`tabs-button-tab flex items-center ${
            active ? "tabs-button-tab--active" : ""
          }`}
        >
          {tab.icon && (
            <span
              className={`tabs-button-icon ${active ? "tabs-button-icon--active" : ""}`}
            >
              <IC n={tab.icon} s={11} c={active ? "var(--blue)" : "var(--muted)"} />
            </span>
          )}
          {tab.label}
          {tab.badge !== undefined && tab.badge > 0 && (
            <span
              className="tabs-badge"
              style={{
                background: active ? "var(--blue)" : "var(--muted)",
              }}
            >
              {tab.badge}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

// ── Icon variant ───────────────────────────────────────────────────────────────

const IconTabs: React.FC<TabsProps> = ({ tabs, activeId, onChange, onTabClick }) => (
  <div className="tabs-icon-bar flex flex-row items-center flex-shrink-0">
    {tabs.map((tab) => {
      const active = activeId === tab.id;
      return (
        <button
          key={tab.id}
          title={tab.label}
          onClick={() => {
            onChange(tab.id);
            onTabClick?.(tab.id);
          }}
          className={`tabs-icon-tab ${active ? "tabs-icon-tab--active" : ""}`}
        >
          <IC
            n={tab.icon ?? ""}
            s={14}
            c={active ? "var(--blue)" : "var(--muted)"}
          />
        </button>
      );
    })}
  </div>
);

// ── Root component ─────────────────────────────────────────────────────────────

const Tabs: React.FC<TabsProps> = ({ variant = "button", ...props }) => {
  if (variant === "segment") return <SegmentTabs {...props} />;
  if (variant === "icon") return <IconTabs {...props} />;
  return <ButtonTabs {...props} />;
};

export default Tabs;
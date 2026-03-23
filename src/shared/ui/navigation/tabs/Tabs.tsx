import React from "react";
import "./Tabs.scss";

// ── Types ──────────────────────────────────────────────────────────────────────

export type TabVariant = "segment" | "button" | "icon";

export interface TabItem {
  id: string;
  label?: string;
  /** Pass any ReactNode — your IC component, an SVG, or null */
  icon?: React.ReactNode;
  badge?: number;
  /** Active accent color for segment & badge — defaults to ins-secondary */
  activeColor?: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: TabVariant;
  onTabClick?: (id: string) => void;
}

// ── Segment variant ────────────────────────────────────────────────────────────

const SegmentTabs: React.FC<TabsProps> = ({ tabs, activeId, onChange, onTabClick }) => (
  <div className="tabs-segment">
    {tabs.map((tab) => {
      const active = activeId === tab.id;
      const accentColor = tab.activeColor ?? "var(--ins-secondary, #1c84c6)";
      return (
        <div
          key={tab.id}
          onClick={() => { onChange(tab.id); onTabClick?.(tab.id); }}
          className={`tabs-segment-tab${active ? " tabs-segment-tab--active" : ""}`}
          style={active ? { color: accentColor } : undefined}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onChange(tab.id)}
        >
          {tab.icon}
          {tab.label}
          {tab.badge !== undefined && tab.badge > 0 && (
            <span
              className="tabs-badge"
              style={{ background: active ? accentColor : "var(--ins-secondary-color, #9ba6b7)" }}
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
  <div style={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
    {tabs.map((tab) => {
      const active = activeId === tab.id;
      return (
        <button
          key={tab.id}
          onClick={() => { onChange(tab.id); onTabClick?.(tab.id); }}
          className={`tabs-button-tab${active ? " tabs-button-tab--active" : ""}`}
        >
          {tab.icon && (
            <span className={`tabs-button-icon${active ? " tabs-button-icon--active" : ""}`}>
              {tab.icon}
            </span>
          )}
          {tab.label}
          {tab.badge !== undefined && tab.badge > 0 && (
            <span
              className="tabs-badge"
              style={{ background: active ? "var(--ins-secondary, #1c84c6)" : "var(--ins-secondary-color, #9ba6b7)" }}
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
  <div className="tabs-icon-bar">
    {tabs.map((tab) => {
      const active = activeId === tab.id;
      return (
        <button
          key={tab.id}
          title={tab.label}
          onClick={() => { onChange(tab.id); onTabClick?.(tab.id); }}
          className={`tabs-icon-tab${active ? " tabs-icon-tab--active" : ""}`}
        >
          {tab.icon}
        </button>
      );
    })}
  </div>
);

// ── Root component ─────────────────────────────────────────────────────────────

const Tabs: React.FC<TabsProps> = ({ variant = "button", ...props }) => {
  if (variant === "segment") return <SegmentTabs {...props} />;
  if (variant === "icon")    return <IconTabs    {...props} />;
  return <ButtonTabs {...props} />;
};

export default Tabs;
import React from "react";
import styles from "../styles/reports.module.css";
import type { InsightItem } from "../types/reports.types";

// ── Icon map — matches the icon keys used in mock data ─────────────────────────

const ICONS: Record<string, React.ReactNode> = {
  trendUp: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  pieChart: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  arrowUp: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
    </svg>
  ),
};

// ── Props ──────────────────────────────────────────────────────────────────────

interface InsightCardsProps {
  insights: InsightItem[];
  isLoading: boolean;
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

const SkeletonInsight = () => (
  <div className={styles.insightCard}>
    <div className={styles.skeleton} style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0 }} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
      <div className={styles.skeleton} style={{ height: 13, width: "50%" }} />
      <div className={styles.skeleton} style={{ height: 11, width: "85%" }} />
    </div>
  </div>
);

// ── Component ──────────────────────────────────────────────────────────────────

const InsightCards: React.FC<InsightCardsProps> = ({ insights, isLoading }) => (
  <div>
    {isLoading
      ? [1, 2, 3, 4].map((i) => <SkeletonInsight key={i} />)
      : insights.map((item, i) => (
          <div key={i} className={styles.insightCard}>
            <div
              className={styles.insightIcon}
              style={{ background: item.bg, color: item.color }}
            >
              {ICONS[item.icon] ?? ICONS.info}
            </div>
            <div>
              <div className={styles.insightTitle}>{item.title}</div>
              <div className={styles.insightBody}>{item.body}</div>
            </div>
          </div>
        ))}
  </div>
);

export default InsightCards;
import React from "react";
import styles from "../styles/reports.module.css";
import type { KpiCard } from "../types/reports.types";

// ── Icons ──────────────────────────────────────────────────────────────────────

const ArrowUpIcon = () => (
  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
  </svg>
);

const ArrowDownIcon = () => (
  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
  </svg>
);

// ── Stripe class map ───────────────────────────────────────────────────────────

const STRIPE_CLASS: Record<KpiCard["stripe"], string> = {
  blue:   styles.kpiStripeBlue,
  teal:   styles.kpiStripeTeal,
  amber:  styles.kpiStripeAmber,
  purple: styles.kpiStripePurple,
};

// ── Skeleton ───────────────────────────────────────────────────────────────────

const SkeletonKpi = () => (
  <div className={styles.kpi}>
    <div className={styles.skeleton} style={{ height: 12, width: "65%", marginBottom: 10 }} />
    <div className={styles.skeleton} style={{ height: 28, width: "50%", marginBottom: 10 }} />
    <div className={styles.skeleton} style={{ height: 18, width: "35%", borderRadius: 99 }} />
    <div className={styles.kpiStripe} style={{ background: "var(--ins-border-color, #e7e9eb)" }} />
  </div>
);

// ── Props ──────────────────────────────────────────────────────────────────────

interface RevenueKpiCardsProps {
  kpis: KpiCard[];
  isLoading: boolean;
}

// ── Component ──────────────────────────────────────────────────────────────────

const RevenueKpiCards: React.FC<RevenueKpiCardsProps> = ({ kpis, isLoading }) => (
  <div className={styles.kpiGrid}>
    {isLoading
      ? [1, 2, 3, 4].map((i) => <SkeletonKpi key={i} />)
      : kpis.map((k, i) => (
          <div key={i} className={styles.kpi}>
            <div className={styles.kpiLabel}>{k.label}</div>
            <div className={styles.kpiVal}>{k.value}</div>
            <span className={`${styles.kpiDelta} ${k.deltaUp ? styles.kpiDeltaUp : styles.kpiDeltaDown}`}>
              {k.deltaUp ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {k.delta}
            </span>
            <div className={`${styles.kpiStripe} ${STRIPE_CLASS[k.stripe]}`} />
          </div>
        ))}
  </div>
);

export default RevenueKpiCards;
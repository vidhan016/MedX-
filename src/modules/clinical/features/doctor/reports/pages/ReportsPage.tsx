import React, { useState } from "react";
import styles from "../styles/reports.module.css";

// ── Shared chart components ────────────────────────────────────────────────────
import AreaChart from "../../../../../../shared/ui/charts/AreaChart";
import BarChart from "../../../../../../shared/ui/charts/BarChart";
import BubbleChart from "../../../../../../shared/ui/charts/BubbleChart";
import ColumnChart from "../../../../../../shared/ui/charts/ColumnChart";
import HeatMapChart from "../../../../../../shared/ui/charts/HeatMapChart";

// ── Feature components ─────────────────────────────────────────────────────────
import RevenueKpiCards from "../components/RevenueKpiCards";
import InsightCards from "../components/InsightCards";

// ── Hook + types ───────────────────────────────────────────────────────────────
import { useReportsData } from "../hooks/useReports";
import type { ReportPeriod } from "../types/reports.types";

// ── Export icon ────────────────────────────────────────────────────────────────

const FileIcon = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

// ── Period labels ──────────────────────────────────────────────────────────────

const PERIODS: ReportPeriod[] = ["weekly", "monthly", "quarterly", "yearly"];

// ── Skeleton chart card ────────────────────────────────────────────────────────

const SkeletonCard = ({ h = 160 }: { h?: number }) => (
  <div className={styles.card}>
    <div className={styles.cardHd}>
      <div className={styles.skeleton} style={{ height: 14, width: 140 }} />
    </div>
    <div className={styles.cardBd}>
      <div className={styles.skeleton} style={{ height: h }} />
    </div>
  </div>
);

// ── Component ──────────────────────────────────────────────────────────────────

const ReportsPage: React.FC = () => {
  const [period, setPeriod] = useState<ReportPeriod>("monthly");

  const { data, isLoading } = useReportsData(period);

  // ── Adapt mock data to shared chart prop shapes ──
  const areaData = data?.monthlyRev.map((d) => ({ mo: d.mo, v0: d.rev, v1: d.patients })) ?? [];
  const vtData   = data?.visitTypeRev.map((d) => ({ name: d.name, value: d.value, pct: d.pct })) ?? [];
  const colData  = data?.monthlyRev.map((d) => ({
    label: d.mo,
    value: d.rev,
    tooltip: { Patients: d.patients },
  })) ?? [];
  const heatData = data?.heatmap ?? [];
  const drugsData = data?.topDrugs.map((d) => ({ name: d.name, value: d.value, pct: d.pct })) ?? [];

  return (
    <div className={styles.page}>

      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.pageTitle}>Reports</h1>
          <span className={styles.pageSub}>Financial analytics</span>
        </div>

        <div className={styles.pageActions}>
          {/* Period tabs */}
          <div className={styles.periodTabs}>
            {PERIODS.map((p) => (
              <button
                key={p}
                className={`${styles.periodTab} ${period === p ? styles.periodTabActive : ""}`}
                onClick={() => setPeriod(p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          {/* Export */}
          <button className={styles.exportBtn}>
            <FileIcon /> Export
          </button>
        </div>
      </div>

      {/* ── KPI cards ── */}
      <RevenueKpiCards kpis={data?.kpis ?? []} isLoading={isLoading} />

      {/* ── Row 2: Revenue vs Patients + By Visit Type ── */}
      <div className={styles.grid2}>

        <div className={styles.card}>
          <div className={styles.cardHd}>
            <div className={styles.cardTitle}>
              <div className={styles.ctBar} />
              Revenue vs Patients
            </div>
          </div>
          <div className={styles.cardBd}>
            {isLoading
              ? <div className={styles.skeleton} style={{ height: 160 }} />
              : <AreaChart
                  data={areaData}
                  series={[
                    { label: "Revenue (₹)",  color: "#2563eb", showDots: true  },
                    { label: "Patients",      color: "#0ea5a0", dashed: true    },
                  ]}
                />
            }
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHd}>
            <div className={styles.cardTitle}>
              <div className={`${styles.ctBar} ${styles.ctBarTeal}`} />
              By Visit Type
            </div>
          </div>
          <div className={styles.cardBd}>
            {isLoading
              ? <div className={styles.skeleton} style={{ height: 160 }} />
              : <BarChart data={vtData} variant="simple" />
            }
          </div>
        </div>
      </div>

      {/* ── Row 3: Diagnosis Map + Patient Heatmap ── */}
      <div className={styles.grid2}>

        <div className={styles.card}>
          <div className={styles.cardHd}>
            <div className={styles.cardTitle}>
              <div className={`${styles.ctBar} ${styles.ctBarTeal}`} />
              Diagnosis Map
            </div>
          </div>
          <div className={`${styles.cardBd} ${styles.cardBdPt8}`}>
            {isLoading
              ? <div className={styles.skeleton} style={{ height: 220 }} />
              : <BubbleChart
                  data={data?.bubbleData ?? []}
                  xLabel="Prevalence (cases)"
                  yLabel="Severity Score"
                />
            }
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHd}>
            <div className={styles.cardTitle}>
              <div className={styles.ctBar} />
              Patient Heatmap
            </div>
          </div>
          <div className={styles.cardBd}>
            {isLoading
              ? <div className={styles.skeleton} style={{ height: 160 }} />
              : <HeatMapChart
                  data={heatData}
                  series={[
                    { label: "Revenue",  color: "#2563eb", showDots: true },
                    { label: "Patients", color: "#0ea5a0", dashed: true   },
                  ]}
                />
            }
          </div>
        </div>
      </div>

      {/* ── Row 4: Monthly Breakdown + AI Insights ── */}
      <div className={styles.grid2}>

        <div className={styles.card}>
          <div className={styles.cardHd}>
            <div className={styles.cardTitle}>
              <div className={styles.ctBar} />
              Monthly Breakdown
            </div>
          </div>
          <div className={`${styles.cardBd} ${styles.cardBdPt8}`}>
            {isLoading
              ? <div className={styles.skeleton} style={{ height: 160 }} />
              : <ColumnChart
                  data={colData}
                  variant="full"
                  yLabel="Revenue (₹)"
                  xLabel="Month"
                  formatY={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`}
                />
            }
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHd}>
            <div className={styles.cardTitle}>
              <div className={`${styles.ctBar} ${styles.ctBarTeal}`} />
              AI Insights
            </div>
          </div>
          <div className={`${styles.cardBd} ${styles.cardBdPt12}`}>
            <InsightCards insights={data?.insights ?? []} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {/* ── Row 5: Top Prescribed Drugs ── */}
      <div className={styles.card}>
        <div className={styles.cardHd}>
          <div className={styles.cardTitle}>
            <div className={`${styles.ctBar} ${styles.ctBarTeal}`} />
            Top Prescribed Drugs
          </div>
        </div>
        <div className={styles.cardBd}>
          {isLoading
            ? <div className={styles.skeleton} style={{ height: 200 }} />
            : <BarChart data={drugsData} variant="ranked" tooltipSuffix="prescribed" />
          }
        </div>
      </div>

    </div>
  );
};

export default ReportsPage;
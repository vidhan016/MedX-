// ── KPI ───────────────────────────────────────────────────────────────────────

export interface KpiCard {
  label: string;
  value: string;
  delta: string;
  deltaUp: boolean;
  stripe: "blue" | "teal" | "amber" | "purple";
}

// ── Period ────────────────────────────────────────────────────────────────────

export type ReportPeriod = "weekly" | "monthly" | "quarterly" | "yearly";

// ── Insight ───────────────────────────────────────────────────────────────────

export interface InsightItem {
  icon: string;
  color: string;
  bg: string;
  title: string;
  body: string;
}

// ── Revenue data ──────────────────────────────────────────────────────────────

export interface MonthlyRevPoint {
  mo: string;
  rev: number;
  patients: number;
}

export interface VisitTypeRevPoint {
  name: string;
  value: number;
  pct?: number;
}

export interface BubblePoint {
  x: number;
  y: number;
  r: number;
  color: string;
  label: string;
  tooltip?: Record<string, string | number>;
}

export interface HeatMapPoint {
  mo: string;
  [key: `v${number}`]: number;
}

export interface ReportsData {
  kpis: KpiCard[];
  monthlyRev: MonthlyRevPoint[];
  visitTypeRev: VisitTypeRevPoint[];
  bubbleData: BubblePoint[];
  heatmap: HeatMapPoint[];
  topDrugs: { name: string; value: number; pct: number }[];
  insights: InsightItem[];
}
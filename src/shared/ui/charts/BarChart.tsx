import React, { useState } from "react";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import "./BarChart.css";

// ── Types ──────────────────────────────────────────────────────────────────────

export type BarChartVariant = "simple" | "ranked";

export interface BarChartDataPoint {
  /** Row label */
  name: string;
  /** Numeric value — used to compute bar width relative to max */
  value: number;
  /** Optional pre-computed percentage (0–100). When omitted, computed from max */
  pct?: number;
  /** Optional value label override shown on the right */
  valueLabel?: string;
}

export interface BarChartProps {
  data?: BarChartDataPoint[];
  variant?: BarChartVariant;
  /** Tooltip suffix — e.g. "prescribed", "cases" */
  tooltipSuffix?: string;
  /** React Query: cache key */
  queryKey?: QueryKey;
  /** React Query: async fetcher returning BarChartDataPoint[] */
  queryFn?: () => Promise<BarChartDataPoint[]>;
}

// ── Simple variant (TOP_DIAGNOSES style) ──────────────────────────────────────

const SimpleBar: React.FC<{ data: BarChartDataPoint[] }> = ({ data }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      {data.map((d, i) => {
        const pct = d.pct ?? (d.value / max) * 100;
        return (
          <div
            key={i}
            className={`${i < data.length - 1 ? "mb-2" : ""}`}
          >
            <div className="flex justify-between mb-1 text-[12.5px]">
              <span className="text-[var(--text2)] font-medium">{d.name}</span>
              <span className="font-bold text-[var(--text)]">
                {d.valueLabel ?? d.value}
              </span>
            </div>
            <div className="bc-track">
              <div className="bc-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Ranked variant (TopDrugsChart style) ──────────────────────────────────────

const RankedBar: React.FC<{ data: BarChartDataPoint[]; tooltipSuffix: string }> = ({
  data,
  tooltipSuffix,
}) => {
  const [hov, setHov] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="py-1">
      {data.map((d, i) => {
        const pct = d.pct ?? (d.value / max) * 100;
        return (
          <div
            key={i}
            className={`bc-row relative flex items-center gap-[10px] py-[7px] px-1 cursor-default ${
              i < data.length - 1 ? "border-b border-[var(--border)]" : ""
            }`}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
          >
            {/* Rank badge */}
            <div className="bc-rank">{i + 1}</div>

            {/* Name + bar */}
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[var(--text)] mb-[3px] whitespace-nowrap overflow-hidden text-ellipsis">
                {d.name}
              </div>
              <div className="bc-track">
                <div className="bc-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>

            {/* Value */}
            <div className="text-xs font-bold text-[var(--teal)] flex-shrink-0 min-w-[36px] text-right">
              {d.valueLabel ?? d.value}
            </div>

            {/* Tooltip */}
            {hov === i && (
              <div className="bc-tooltip">
                {d.name}: {d.valueLabel ?? d.value} {tooltipSuffix}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Root component ─────────────────────────────────────────────────────────────

const BarChart: React.FC<BarChartProps> = ({
  data = [],
  variant = "simple",
  tooltipSuffix = "",
  queryKey,
  queryFn,
}) => {
  // ── React Query ──
  const { data: fetchedData, isLoading, isError } = useQuery<BarChartDataPoint[]>({
    queryKey: queryKey ?? ["bar-chart"],
    queryFn: queryFn!,
    enabled: !!queryFn,
    initialData: data,
  });

  const sourceData = fetchedData ?? data;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-4 text-xs text-[var(--muted)]">
        <span className="animate-spin inline-block w-3 h-3 border border-current border-t-transparent rounded-full" />
        Loading…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-3 py-2 text-xs text-red-500 border border-red-200 rounded-[var(--rs)] bg-red-50">
        Failed to load data.
      </div>
    );
  }

  if (sourceData.length === 0) {
    return (
      <div className="px-3 py-4 text-xs text-[var(--muted)] text-center">
        No data available.
      </div>
    );
  }

  if (variant === "ranked") {
    return <RankedBar data={sourceData} tooltipSuffix={tooltipSuffix} />;
  }

  return <SimpleBar data={sourceData} />;
};

export default BarChart;
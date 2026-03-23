import React, { useState } from "react";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import "./BarChart.scss";

// ── Types ──────────────────────────────────────────────────────────────────────

export type BarChartVariant = "simple" | "ranked";

export interface BarChartDataPoint {
  name: string;
  value: number;
  pct?: number;
  valueLabel?: string;
}

export interface BarChartProps {
  data?: BarChartDataPoint[];
  variant?: BarChartVariant;
  tooltipSuffix?: string;
  queryKey?: QueryKey;
  queryFn?: () => Promise<BarChartDataPoint[]>;
}

// ── Simple variant ─────────────────────────────────────────────────────────────

const SimpleBar: React.FC<{ data: BarChartDataPoint[] }> = ({ data }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      {data.map((d, i) => {
        const pct = d.pct ?? (d.value / max) * 100;
        return (
          <div key={i} style={{ marginBottom: i < data.length - 1 ? 8 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12.5 }}>
              <span style={{ color: "var(--ins-secondary-color, #9ba6b7)", fontWeight: 500 }}>{d.name}</span>
              <span style={{ color: "var(--ins-body-color, #4c4c5c)", fontWeight: 700 }}>{d.valueLabel ?? d.value}</span>
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

// ── Ranked variant ─────────────────────────────────────────────────────────────

const RankedBar: React.FC<{ data: BarChartDataPoint[]; tooltipSuffix: string }> = ({
  data,
  tooltipSuffix,
}) => {
  const [hov, setHov] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div style={{ paddingTop: 4, paddingBottom: 4 }}>
      {data.map((d, i) => {
        const pct = d.pct ?? (d.value / max) * 100;
        return (
          <div
            key={i}
            className="bc-row"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "7px 4px",
              cursor: "default",
              borderBottom: i < data.length - 1 ? "1px solid var(--ins-border-color, #e7e9eb)" : "none",
            }}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
          >
            {/* Rank badge */}
            <div className="bc-rank">{i + 1}</div>

            {/* Name + bar */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--ins-body-color, #4c4c5c)",
                marginBottom: 3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {d.name}
              </div>
              <div className="bc-track">
                <div className="bc-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>

            {/* Value */}
            <div style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--ins-primary, #1ab394)",
              flexShrink: 0,
              minWidth: 36,
              textAlign: "right",
            }}>
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
  const { data: fetchedData, isLoading, isError } = useQuery<BarChartDataPoint[]>({
    queryKey: queryKey ?? ["bar-chart"],
    queryFn: queryFn!,
    enabled: !!queryFn,
    initialData: data,
  });

  const sourceData = fetchedData ?? data;

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 12px", fontSize: 12, color: "var(--ins-secondary-color, #9ba6b7)" }}>
        Loading…
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: "8px 12px", fontSize: 12, color: "#ef4444", border: "1px solid #fecaca", borderRadius: 6, background: "#fef2f2" }}>
        Failed to load data.
      </div>
    );
  }

  if (sourceData.length === 0) {
    return (
      <div style={{ padding: "16px 12px", fontSize: 12, color: "var(--ins-secondary-color, #9ba6b7)", textAlign: "center" }}>
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
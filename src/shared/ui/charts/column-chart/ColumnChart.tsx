import React, { useState } from "react";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import "./ColumnChart.scss";

// ── Types ──────────────────────────────────────────────────────────────────────

export type ColumnChartPeriod  = "weekly" | "quarterly" | "yearly";
export type ColumnChartVariant = "full" | "mini";

export interface ColumnChartDataPoint {
  label: string;
  value: number;
  tooltip?: Record<string, string | number>;
}

export interface ColumnChartProps {
  data?: ColumnChartDataPoint[];
  variant?: ColumnChartVariant;
  period?: ColumnChartPeriod;
  width?: number;
  height?: number;
  yLabel?: string;
  xLabel?: string;
  formatY?: (v: number) => string;
  queryKey?: QueryKey;
  queryFn?: () => Promise<ColumnChartDataPoint[]>;
}

// ── Period filter ──────────────────────────────────────────────────────────────

const applyPeriod = (
  data: ColumnChartDataPoint[],
  period?: ColumnChartPeriod
): ColumnChartDataPoint[] => {
  if (period === "weekly")    return data.slice(-4);
  if (period === "quarterly") return data.filter((_, i) => [2, 5, 8, 11].includes(i));
  return data;
};

// ── Mini variant ───────────────────────────────────────────────────────────────

const MiniChart: React.FC<{ data: ColumnChartDataPoint[] }> = ({ data }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="cc-mini-wrap">
      {data.map((d, i) => (
        <div className="cc-mini-col" key={i}>
          <div className="cc-mini-num">{d.value}</div>
          <div className="cc-mini-bars">
            <div className="cc-mini-bar" style={{ height: `${(d.value / max) * 100}%` }} />
          </div>
          <div className="cc-mini-lbl">{d.label}</div>
        </div>
      ))}
    </div>
  );
};

// ── Full variant ───────────────────────────────────────────────────────────────

interface FullChartProps {
  data: ColumnChartDataPoint[];
  width: number;
  height: number;
  yLabel: string;
  xLabel: string;
  formatY: (v: number) => string;
}

const FullChart: React.FC<FullChartProps> = ({ data, width: W, height: H, yLabel, xLabel, formatY }) => {
  const [hov, setHov] = useState<number | null>(null);

  const PL = 52, PR = 12, PT = 12, PB = 36;
  const gW = W - PL - PR;
  const gH = H - PT - PB;
  const mR = Math.max(...data.map((d) => d.value), 1);
  const bw = Math.min(28, gW / data.length - 8);
  const yTicks = 4;

  const bx = (i: number) => PL + (i / data.length) * gW + gW / data.length / 2 - bw / 2;
  const by = (v: number) => PT + gH - (v / mR) * gH;

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", overflow: "visible" }}>
        <defs>
          <linearGradient id="cc-gbg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>
        </defs>

        {/* Y grid + labels */}
        {Array.from({ length: yTicks + 1 }, (_, i) => {
          const v = Math.round((mR / yTicks) * i);
          const y = PT + gH - (v / mR) * gH;
          return (
            <g key={i}>
              <line x1={PL} x2={W - PR} y1={y} y2={y} stroke="#e5e9f0" strokeWidth="1" />
              <text x={PL - 5} y={y + 4} textAnchor="end" fontSize="9" fill="#9ca3af" fontFamily="Inter">
                {formatY(v)}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line x1={PL} x2={PL}     y1={PT}      y2={PT + gH} stroke="#d1d5db" strokeWidth="1.5" />
        <line x1={PL} x2={W - PR} y1={PT + gH} y2={PT + gH} stroke="#d1d5db" strokeWidth="1.5" />

        {/* Axis labels */}
        <text x={12} y={PT + gH / 2} textAnchor="middle" fontSize="10" fill="#6b7280" fontFamily="Inter" fontWeight="600" transform={`rotate(-90, 12, ${PT + gH / 2})`}>{yLabel}</text>
        <text x={PL + gW / 2} y={H - 1} textAnchor="middle" fontSize="10" fill="#6b7280" fontFamily="Inter" fontWeight="600">{xLabel}</text>

        {/* Bars */}
        {data.map((d, i) => {
          const x   = bx(i);
          const y   = by(d.value);
          const h   = PT + gH - y;
          const isH = hov === i;
          return (
            <g key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} style={{ cursor: "pointer" }}>
              <rect x={x} y={y} width={bw} height={h} rx="3" fill={isH ? "#1d4ed8" : "url(#cc-gbg)"} opacity={isH ? 1 : 0.85} />
              <text x={x + bw / 2} y={H - 20} textAnchor="middle" fontSize="9.5" fill={isH ? "#2563eb" : "#9ca3af"} fontFamily="Inter" fontWeight={isH ? "700" : "400"}>
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hov !== null && (
        <div
          className="cc-tooltip"
          style={{
            left: `${((bx(hov) + bw / 2) / W) * 100}%`,
            top:  `${(by(data[hov].value) / H) * 100}%`,
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 3 }}>{data[hov].label}</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>
            {formatY(data[hov].value).replace(/^/, "Value: ")}
          </div>
          {data[hov].tooltip &&
            Object.entries(data[hov].tooltip!).map(([k, v]) => (
              <div key={k} style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>
                {k}: <b style={{ color: "#5eead4" }}>{typeof v === "number" ? v.toLocaleString() : v}</b>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

// ── Root component ─────────────────────────────────────────────────────────────

const ColumnChart: React.FC<ColumnChartProps> = ({
  data = [],
  variant = "full",
  period,
  width = 500,
  height = 160,
  yLabel = "Value",
  xLabel = "",
  formatY = (v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)),
  queryKey,
  queryFn,
}) => {
  const { data: fetchedData, isLoading, isError } = useQuery<ColumnChartDataPoint[]>({
    queryKey: queryKey ?? ["column-chart"],
    queryFn: queryFn!,
    enabled: !!queryFn,
    initialData: data,
  });

  const sourceData   = fetchedData ?? data;
  const displayData  = applyPeriod(sourceData, period);

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 12px", fontSize: 12, color: "var(--ins-secondary-color, #9ba6b7)" }}>
        Loading chart…
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: "8px 12px", fontSize: 12, color: "#ef4444", border: "1px solid #fecaca", borderRadius: 6, background: "#fef2f2" }}>
        Failed to load chart data.
      </div>
    );
  }

  if (displayData.length === 0) {
    return (
      <div style={{ padding: "16px 12px", fontSize: 12, color: "var(--ins-secondary-color, #9ba6b7)", textAlign: "center" }}>
        No data available.
      </div>
    );
  }

  if (variant === "mini") return <MiniChart data={displayData} />;

  return <FullChart data={displayData} width={width} height={height} yLabel={yLabel} xLabel={xLabel} formatY={formatY} />;
};

export default ColumnChart;
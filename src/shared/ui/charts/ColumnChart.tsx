import React, { useState } from "react";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import "./ColumnChart.css";

// ── Types ──────────────────────────────────────────────────────────────────────

export type ColumnChartPeriod = "weekly" | "quarterly" | "yearly";
export type ColumnChartVariant = "full" | "mini";

export interface ColumnChartDataPoint {
  /** X-axis label (e.g. month name, day name) */
  label: string;
  /** Primary bar value */
  value: number;
  /** Extra tooltip rows: key = display name, value = displayed value */
  tooltip?: Record<string, string | number>;
}

export interface ColumnChartProps {
  data?: ColumnChartDataPoint[];
  variant?: ColumnChartVariant;
  period?: ColumnChartPeriod;
  /** SVG canvas width — full variant only */
  width?: number;
  /** SVG canvas height — full variant only */
  height?: number;
  /** Y-axis label — full variant only */
  yLabel?: string;
  /** X-axis label — full variant only */
  xLabel?: string;
  /** Y-axis tick formatter */
  formatY?: (v: number) => string;
  /** React Query: cache key */
  queryKey?: QueryKey;
  /** React Query: async fetcher returning ColumnChartDataPoint[] */
  queryFn?: () => Promise<ColumnChartDataPoint[]>;
}

// ── Period filter ──────────────────────────────────────────────────────────────

const applyPeriod = (
  data: ColumnChartDataPoint[],
  period?: ColumnChartPeriod
): ColumnChartDataPoint[] => {
  if (period === "weekly") return data.slice(-4);
  if (period === "quarterly") return data.filter((_, i) => [2, 5, 8, 11].includes(i));
  return data;
};

// ── Mini variant (WeeklyFlow style) ───────────────────────────────────────────

const MiniChart: React.FC<{ data: ColumnChartDataPoint[] }> = ({ data }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="cc-mini-wrap">
      {data.map((d, i) => (
        <div className="cc-mini-col" key={i}>
          <div className="cc-mini-num">{d.value}</div>
          <div className="cc-mini-bars">
            <div
              className="cc-mini-bar"
              style={{ height: `${(d.value / max) * 100}%` }}
            />
          </div>
          <div className="cc-mini-lbl">{d.label}</div>
        </div>
      ))}
    </div>
  );
};

// ── Full variant (GBar style) ──────────────────────────────────────────────────

interface FullChartProps {
  data: ColumnChartDataPoint[];
  width: number;
  height: number;
  yLabel: string;
  xLabel: string;
  formatY: (v: number) => string;
}

const FullChart: React.FC<FullChartProps> = ({
  data,
  width: W,
  height: H,
  yLabel,
  xLabel,
  formatY,
}) => {
  const [hov, setHov] = useState<number | null>(null);

  const PL = 52, PR = 12, PT = 12, PB = 36;
  const gW = W - PL - PR;
  const gH = H - PT - PB;
  const mR = Math.max(...data.map((d) => d.value), 1);
  const bw = Math.min(28, gW / data.length - 8);
  const yTicks = 4;

  const bx = (i: number): number =>
    PL + (i / data.length) * gW + gW / data.length / 2 - bw / 2;

  const by = (v: number): number =>
    PT + gH - (v / mR) * gH;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
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
              <text
                x={PL - 5}
                y={y + 4}
                textAnchor="end"
                fontSize="9"
                fill="#9ca3af"
                fontFamily="Inter"
              >
                {formatY(v)}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line x1={PL} x2={PL}     y1={PT}      y2={PT + gH} stroke="#d1d5db" strokeWidth="1.5" />
        <line x1={PL} x2={W - PR} y1={PT + gH} y2={PT + gH} stroke="#d1d5db" strokeWidth="1.5" />

        {/* Axis labels */}
        <text
          x={12}
          y={PT + gH / 2}
          textAnchor="middle"
          fontSize="10"
          fill="#6b7280"
          fontFamily="Inter"
          fontWeight="600"
          transform={`rotate(-90, 12, ${PT + gH / 2})`}
        >
          {yLabel}
        </text>
        <text
          x={PL + gW / 2}
          y={H - 1}
          textAnchor="middle"
          fontSize="10"
          fill="#6b7280"
          fontFamily="Inter"
          fontWeight="600"
        >
          {xLabel}
        </text>

        {/* Bars */}
        {data.map((d, i) => {
          const x = bx(i);
          const y = by(d.value);
          const h = PT + gH - y;
          const isHov = hov === i;
          return (
            <g
              key={i}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              className="cursor-pointer"
            >
              <rect
                x={x}
                y={y}
                width={bw}
                height={h}
                rx="3"
                fill={isHov ? "#1d4ed8" : "url(#cc-gbg)"}
                opacity={isHov ? 1 : 0.85}
              />
              <text
                x={x + bw / 2}
                y={H - 20}
                textAnchor="middle"
                fontSize="9.5"
                fill={isHov ? "#2563eb" : "#9ca3af"}
                fontFamily="Inter"
                fontWeight={isHov ? "700" : "400"}
              >
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
            top: `${(by(data[hov].value) / H) * 100}%`,
          }}
        >
          <div className="font-extrabold mb-[3px]">{data[hov].label}</div>
          <div className="text-white/70 text-[10px]">
            {formatY(data[hov].value).replace(/^/, "Value: ")}
          </div>
          {data[hov].tooltip &&
            Object.entries(data[hov].tooltip!).map(([k, v]) => (
              <div key={k} className="text-white/70 text-[10px]">
                {k}:{" "}
                <b className="text-[#5eead4]">
                  {typeof v === "number" ? v.toLocaleString() : v}
                </b>
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
  // ── React Query ──
  const { data: fetchedData, isLoading, isError } = useQuery<ColumnChartDataPoint[]>({
    queryKey: queryKey ?? ["column-chart"],
    queryFn: queryFn!,
    enabled: !!queryFn,
    initialData: data,
  });

  const sourceData = fetchedData ?? data;
  const displayData = applyPeriod(sourceData, period);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-4 text-xs text-[var(--muted)]">
        <span className="animate-spin inline-block w-3 h-3 border border-current border-t-transparent rounded-full" />
        Loading chart…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-3 py-2 text-xs text-red-500 border border-red-200 rounded-[var(--rs)] bg-red-50">
        Failed to load chart data.
      </div>
    );
  }

  if (displayData.length === 0) {
    return (
      <div className="px-3 py-4 text-xs text-[var(--muted)] text-center">
        No data available.
      </div>
    );
  }

  if (variant === "mini") return <MiniChart data={displayData} />;

  return (
    <FullChart
      data={displayData}
      width={width}
      height={height}
      yLabel={yLabel}
      xLabel={xLabel}
      formatY={formatY}
    />
  );
};

export default ColumnChart;
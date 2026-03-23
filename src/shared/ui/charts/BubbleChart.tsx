import React, { useState } from "react";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import "./BubbleChart.css";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface BubbleChartDataPoint {
  /** X-axis value */
  x: number;
  /** Y-axis value */
  y: number;
  /** Bubble radius in SVG units */
  r: number;
  /** Fill color */
  color: string;
  /** Label shown inside the bubble (only when r > 12) and in tooltip header */
  label: string;
  /** Extra tooltip rows: key = display name, value = displayed value */
  tooltip?: Record<string, string | number>;
}

export interface BubbleChartProps {
  data?: BubbleChartDataPoint[];
  /** SVG canvas width */
  width?: number;
  /** SVG canvas height */
  height?: number;
  /** X-axis max value */
  maxX?: number;
  /** Y-axis max value */
  maxY?: number;
  /** X-axis tick values */
  xTicks?: number[];
  /** Y-axis tick values */
  yTicks?: number[];
  /** X-axis label */
  xLabel?: string;
  /** Y-axis label */
  yLabel?: string;
  /** React Query: cache key */
  queryKey?: QueryKey;
  /** React Query: async fetcher returning BubbleChartDataPoint[] */
  queryFn?: () => Promise<BubbleChartDataPoint[]>;
}

// ── Defaults ───────────────────────────────────────────────────────────────────

const DEFAULT_X_TICKS = [0, 50, 100, 150, 200];
const DEFAULT_Y_TICKS = [0, 30, 60, 90, 130];

// ── Component ──────────────────────────────────────────────────────────────────

const BubbleChart: React.FC<BubbleChartProps> = ({
  data = [],
  width: W = 480,
  height: H = 220,
  maxX = 200,
  maxY = 130,
  xTicks = DEFAULT_X_TICKS,
  yTicks = DEFAULT_Y_TICKS,
  xLabel = "Prevalence (cases)",
  yLabel = "Severity Score",
  queryKey,
  queryFn,
}) => {
  const [hov, setHov] = useState<number | null>(null);

  // ── React Query ──
  const { data: fetchedData, isLoading, isError } = useQuery<BubbleChartDataPoint[]>({
    queryKey: queryKey ?? ["bubble-chart"],
    queryFn: queryFn!,
    enabled: !!queryFn,
    initialData: data,
  });

  const sourceData = fetchedData ?? data;

  // ── Layout constants ──
  const PL = 50, PR = 20, PT = 20, PB = 40;
  const gW = W - PL - PR;
  const gH = H - PT - PB;

  const bx = (d: BubbleChartDataPoint): number => PL + (d.x / maxX) * gW;
  const by = (d: BubbleChartDataPoint): number => PT + gH - (d.y / maxY) * gH;

  // ── Loading / Error ──
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

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full overflow-visible"
      >
        {/* ── Y grid + labels ── */}
        {yTicks.map((v, i) => {
          const y = PT + gH - (v / maxY) * gH;
          return (
            <g key={i}>
              <line
                x1={PL} x2={W - PR} y1={y} y2={y}
                stroke="#e5e9f0" strokeWidth="1" strokeDasharray="3 3"
              />
              <text
                x={PL - 5} y={y + 4}
                textAnchor="end" fontSize="9" fill="#9ca3af" fontFamily="Inter"
              >
                {v}
              </text>
            </g>
          );
        })}

        {/* ── X grid + labels ── */}
        {xTicks.map((v, i) => {
          const x = PL + (v / maxX) * gW;
          return (
            <g key={i}>
              <line
                x1={x} x2={x} y1={PT} y2={PT + gH}
                stroke="#e5e9f0" strokeWidth="1" strokeDasharray="3 3"
              />
              <text
                x={x} y={PT + gH + 14}
                textAnchor="middle" fontSize="9" fill="#9ca3af" fontFamily="Inter"
              >
                {v}
              </text>
            </g>
          );
        })}

        {/* ── Axis labels ── */}
        <text
          x={PL + gW / 2} y={H - 2}
          textAnchor="middle" fontSize="10" fill="#6b7280"
          fontFamily="Inter" fontWeight="600"
        >
          {xLabel}
        </text>
        <text
          x={10} y={PT + gH / 2}
          textAnchor="middle" fontSize="10" fill="#6b7280"
          fontFamily="Inter" fontWeight="600"
          transform={`rotate(-90, 10, ${PT + gH / 2})`}
        >
          {yLabel}
        </text>

        {/* ── Axes ── */}
        <line x1={PL} x2={PL}     y1={PT}      y2={PT + gH} stroke="#d1d5db" strokeWidth="1.5" />
        <line x1={PL} x2={W - PR} y1={PT + gH} y2={PT + gH} stroke="#d1d5db" strokeWidth="1.5" />

        {/* ── Bubbles ── */}
        {sourceData.map((d, i) => (
          <g
            key={i}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            className="cursor-pointer"
          >
            <circle
              cx={bx(d)}
              cy={by(d)}
              r={d.r}
              fill={d.color}
              fillOpacity={hov === i ? 0.9 : 0.65}
              stroke={d.color}
              strokeWidth={hov === i ? 2.5 : 0.5}
            />
            {d.r > 12 && (
              <text
                x={bx(d)}
                y={by(d) + 3.5}
                textAnchor="middle"
                fontSize="8"
                fill="#fff"
                fontWeight="700"
                fontFamily="Inter"
                pointerEvents="none"
              >
                {d.label}
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* ── Tooltip ── */}
      {hov !== null && (
        <div
          className="bbc-tooltip"
          style={{
            left: `${(bx(sourceData[hov]) / W) * 100}%`,
            top: `${(by(sourceData[hov]) / H) * 100}%`,
          }}
        >
          <div className="font-extrabold mb-[3px]" style={{ color: sourceData[hov].color }}>
            {sourceData[hov].label}
          </div>
          <div className="text-white/70 text-[10px]">
            {xLabel.split(" ")[0]}:{" "}
            <b className="text-white">{sourceData[hov].x}</b>
          </div>
          <div className="text-white/70 text-[10px]">
            {yLabel.split(" ")[0]}:{" "}
            <b className="text-white">{sourceData[hov].y}</b>
          </div>
          {sourceData[hov].tooltip &&
            Object.entries(sourceData[hov].tooltip!).map(([k, v]) => (
              <div key={k} className="text-white/70 text-[10px]">
                {k}: <b className="text-white">{v}</b>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default BubbleChart;
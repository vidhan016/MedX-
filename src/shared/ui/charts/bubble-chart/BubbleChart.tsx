import React, { useState } from "react";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import "./BubbleChart.scss";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface BubbleChartDataPoint {
  x: number;
  y: number;
  r: number;
  color: string;
  label: string;
  tooltip?: Record<string, string | number>;
}

export interface BubbleChartProps {
  data?: BubbleChartDataPoint[];
  width?: number;
  height?: number;
  maxX?: number;
  maxY?: number;
  xTicks?: number[];
  yTicks?: number[];
  xLabel?: string;
  yLabel?: string;
  queryKey?: QueryKey;
  queryFn?: () => Promise<BubbleChartDataPoint[]>;
}

// ── Defaults ───────────────────────────────────────────────────────────────────

const DEFAULT_X_TICKS = [0, 50, 100, 150, 200];
const DEFAULT_Y_TICKS = [0, 30, 60, 90, 130];

// ── State styles ───────────────────────────────────────────────────────────────

const stateStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "16px 12px",
  fontSize: 12,
  color: "var(--ins-secondary-color, #9ba6b7)",
};

const errorStyle: React.CSSProperties = {
  padding: "8px 12px",
  fontSize: 12,
  color: "#ef4444",
  border: "1px solid #fecaca",
  borderRadius: 6,
  background: "#fef2f2",
};

const emptyStyle: React.CSSProperties = {
  padding: "16px 12px",
  fontSize: 12,
  color: "var(--ins-secondary-color, #9ba6b7)",
  textAlign: "center",
};

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

  const { data: fetchedData, isLoading, isError } = useQuery<BubbleChartDataPoint[]>({
    queryKey: queryKey ?? ["bubble-chart"],
    queryFn: queryFn!,
    enabled: !!queryFn,
    initialData: data,
  });

  const sourceData = fetchedData ?? data;

  const PL = 50, PR = 20, PT = 20, PB = 40;
  const gW = W - PL - PR;
  const gH = H - PT - PB;

  const bx = (d: BubbleChartDataPoint) => PL + (d.x / maxX) * gW;
  const by = (d: BubbleChartDataPoint) => PT + gH - (d.y / maxY) * gH;

  if (isLoading) return <div style={stateStyle}>Loading…</div>;
  if (isError)   return <div style={errorStyle}>Failed to load data.</div>;
  if (sourceData.length === 0) return <div style={emptyStyle}>No data available.</div>;

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", overflow: "visible" }}>

        {/* Y grid + labels */}
        {yTicks.map((v, i) => {
          const y = PT + gH - (v / maxY) * gH;
          return (
            <g key={i}>
              <line x1={PL} x2={W - PR} y1={y} y2={y} stroke="#e5e9f0" strokeWidth="1" strokeDasharray="3 3" />
              <text x={PL - 5} y={y + 4} textAnchor="end" fontSize="9" fill="#9ca3af" fontFamily="Inter">{v}</text>
            </g>
          );
        })}

        {/* X grid + labels */}
        {xTicks.map((v, i) => {
          const x = PL + (v / maxX) * gW;
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={PT} y2={PT + gH} stroke="#e5e9f0" strokeWidth="1" strokeDasharray="3 3" />
              <text x={x} y={PT + gH + 14} textAnchor="middle" fontSize="9" fill="#9ca3af" fontFamily="Inter">{v}</text>
            </g>
          );
        })}

        {/* Axis labels */}
        <text x={PL + gW / 2} y={H - 2} textAnchor="middle" fontSize="10" fill="#6b7280" fontFamily="Inter" fontWeight="600">{xLabel}</text>
        <text x={10} y={PT + gH / 2} textAnchor="middle" fontSize="10" fill="#6b7280" fontFamily="Inter" fontWeight="600" transform={`rotate(-90, 10, ${PT + gH / 2})`}>{yLabel}</text>

        {/* Axes */}
        <line x1={PL} x2={PL}     y1={PT}      y2={PT + gH} stroke="#d1d5db" strokeWidth="1.5" />
        <line x1={PL} x2={W - PR} y1={PT + gH} y2={PT + gH} stroke="#d1d5db" strokeWidth="1.5" />

        {/* Bubbles */}
        {sourceData.map((d, i) => (
          <g key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} style={{ cursor: "pointer" }}>
            <circle
              cx={bx(d)} cy={by(d)} r={d.r}
              fill={d.color} fillOpacity={hov === i ? 0.9 : 0.65}
              stroke={d.color} strokeWidth={hov === i ? 2.5 : 0.5}
            />
            {d.r > 12 && (
              <text x={bx(d)} y={by(d) + 3.5} textAnchor="middle" fontSize="8" fill="#fff" fontWeight="700" fontFamily="Inter" pointerEvents="none">
                {d.label}
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {hov !== null && (
        <div
          className="bbc-tooltip"
          style={{
            left: `${(bx(sourceData[hov]) / W) * 100}%`,
            top:  `${(by(sourceData[hov]) / H) * 100}%`,
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 3, color: sourceData[hov].color }}>
            {sourceData[hov].label}
          </div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>
            {xLabel.split(" ")[0]}: <b style={{ color: "#fff" }}>{sourceData[hov].x}</b>
          </div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>
            {yLabel.split(" ")[0]}: <b style={{ color: "#fff" }}>{sourceData[hov].y}</b>
          </div>
          {sourceData[hov].tooltip &&
            Object.entries(sourceData[hov].tooltip!).map(([k, v]) => (
              <div key={k} style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>
                {k}: <b style={{ color: "#fff" }}>{v}</b>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default BubbleChart;
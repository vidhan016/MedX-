import React, { useState } from "react";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import "./DoughnutChart.scss";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface DoughnutChartSegment {
  label: string;
  value: number;
  color: string;
}

export interface DoughnutChartProps {
  data?: DoughnutChartSegment[];
  centerLabel?: string;
  size?: number;
  thickness?: number;
  queryKey?: QueryKey;
  queryFn?: () => Promise<DoughnutChartSegment[]>;
}

// ── SVG Doughnut ───────────────────────────────────────────────────────────────

interface SVGDoughnutProps {
  data: DoughnutChartSegment[];
  size: number;
  thickness: number;
  centerLabel: string;
  hovIdx: number | null;
  setHovIdx: (i: number | null) => void;
}

const SVGDoughnut: React.FC<SVGDoughnutProps> = ({
  data, size, thickness, centerLabel, hovIdx, setHovIdx,
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const r  = size / 2 - 4;
  const inner = r * (1 - thickness);
  const total = data.reduce((s, d) => s + d.value, 0);

  let cursor = -Math.PI / 2;
  const gap  = total > 0 ? 0.02 : 0;

  const segments = data.map((d) => {
    const pct        = total > 0 ? d.value / total : 0;
    const sweep      = pct * 2 * Math.PI - gap;
    const startAngle = cursor + gap / 2;
    const endAngle   = startAngle + sweep;
    cursor += pct * 2 * Math.PI;

    const x1o = cx + r     * Math.cos(startAngle);
    const y1o = cy + r     * Math.sin(startAngle);
    const x2o = cx + r     * Math.cos(endAngle);
    const y2o = cy + r     * Math.sin(endAngle);
    const x1i = cx + inner * Math.cos(endAngle);
    const y1i = cy + inner * Math.sin(endAngle);
    const x2i = cx + inner * Math.cos(startAngle);
    const y2i = cy + inner * Math.sin(startAngle);
    const large = sweep > Math.PI ? 1 : 0;

    const path = sweep <= 0 ? "" :
      `M ${x1o} ${y1o} A ${r} ${r} 0 ${large} 1 ${x2o} ${y2o} L ${x1i} ${y1i} A ${inner} ${inner} 0 ${large} 0 ${x2i} ${y2i} Z`;

    return { ...d, path };
  });

  const displayTotal = hovIdx !== null ? data[hovIdx].value : total;
  const displayLabel = hovIdx !== null ? data[hovIdx].label : centerLabel;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      {total === 0 && (
        <circle cx={cx} cy={cy} r={(r + inner) / 2} fill="none" stroke="#e5e7eb" strokeWidth={r - inner} />
      )}

      {segments.map((seg, i) =>
        seg.path ? (
          <path
            key={i}
            d={seg.path}
            fill={seg.color}
            className="dc-segment"
            opacity={hovIdx !== null && hovIdx !== i ? 0.4 : 1}
            onMouseEnter={() => setHovIdx(i)}
            onMouseLeave={() => setHovIdx(null)}
          />
        ) : null
      )}

      <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle"
        fontSize={hovIdx !== null ? "18" : "22"} fontWeight="900"
        fill="var(--ins-body-color, #4c4c5c)" fontFamily="inherit">
        {displayTotal}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" dominantBaseline="middle"
        fontSize="9" fontWeight="700"
        fill="var(--ins-secondary-color, #9ba6b7)" fontFamily="inherit"
        style={{ textTransform: "uppercase", letterSpacing: 1 }}>
        {displayLabel}
      </text>
    </svg>
  );
};

// ── Component ──────────────────────────────────────────────────────────────────

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data = [],
  centerLabel = "Total",
  size = 160,
  thickness = 0.42,
  queryKey,
  queryFn,
}) => {
  const [hovIdx, setHovIdx] = useState<number | null>(null);

  const { data: fetchedData, isLoading, isError } = useQuery<DoughnutChartSegment[]>({
    queryKey: queryKey ?? ["doughnut-chart"],
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

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>

      {/* Doughnut SVG */}
      <div style={{ position: "relative", flexShrink: 0, width: size, height: size }}>
        <SVGDoughnut
          data={sourceData}
          size={size}
          thickness={thickness}
          centerLabel={centerLabel}
          hovIdx={hovIdx}
          setHovIdx={setHovIdx}
        />
      </div>

      {/* Legend */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
        {sourceData.map((seg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "opacity 0.15s",
              opacity: hovIdx !== null && hovIdx !== i ? 0.4 : 1,
            }}
            onMouseEnter={() => setHovIdx(i)}
            onMouseLeave={() => setHovIdx(null)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div className="dc-legend-dot" style={{ background: seg.color }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ins-secondary-color, #9ba6b7)" }}>
                {seg.label}
              </span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 800, color: "var(--ins-body-color, #4c4c5c)" }}>
              {seg.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoughnutChart;
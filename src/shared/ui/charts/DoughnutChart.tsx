import React, { useState } from "react";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import "./DoughnutChart.css";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface DoughnutChartSegment {
  label: string;
  value: number;
  color: string;
}

export interface DoughnutChartProps {
  data?: DoughnutChartSegment[];
  /** Label shown below the total count in the center */
  centerLabel?: string;
  /** Canvas/SVG size in px */
  size?: number;
  /** Thickness of the doughnut ring as a fraction of radius (0–1) */
  thickness?: number;
  /** React Query: cache key */
  queryKey?: QueryKey;
  /** React Query: async fetcher returning DoughnutChartSegment[] */
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
  data,
  size,
  thickness,
  centerLabel,
  hovIdx,
  setHovIdx,
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  const inner = r * (1 - thickness);
  const total = data.reduce((s, d) => s + d.value, 0);

  // Build arc path segments
  let cursor = -Math.PI / 2; // start at 12 o'clock
  const gap = total > 0 ? 0.02 : 0; // small gap between segments in radians

  const segments = data.map((d) => {
    const pct = total > 0 ? d.value / total : 0;
    const sweep = pct * 2 * Math.PI - gap;
    const startAngle = cursor + gap / 2;
    const endAngle = startAngle + sweep;
    cursor += pct * 2 * Math.PI;

    const x1o = cx + r * Math.cos(startAngle);
    const y1o = cy + r * Math.sin(startAngle);
    const x2o = cx + r * Math.cos(endAngle);
    const y2o = cy + r * Math.sin(endAngle);
    const x1i = cx + inner * Math.cos(endAngle);
    const y1i = cy + inner * Math.sin(endAngle);
    const x2i = cx + inner * Math.cos(startAngle);
    const y2i = cy + inner * Math.sin(startAngle);
    const large = sweep > Math.PI ? 1 : 0;

    const path =
      sweep <= 0
        ? ""
        : `M ${x1o} ${y1o}
           A ${r} ${r} 0 ${large} 1 ${x2o} ${y2o}
           L ${x1i} ${y1i}
           A ${inner} ${inner} 0 ${large} 0 ${x2i} ${y2i}
           Z`;

    return { ...d, path };
  });

  const displayTotal = hovIdx !== null ? data[hovIdx].value : total;
  const displayLabel = hovIdx !== null ? data[hovIdx].label : centerLabel;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="flex-shrink-0"
    >
      {/* Empty state ring */}
      {total === 0 && (
        <circle
          cx={cx}
          cy={cy}
          r={(r + inner) / 2}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={r - inner}
        />
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

      {/* Center text */}
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={hovIdx !== null ? "18" : "22"}
        fontWeight="900"
        fill="var(--text)"
        fontFamily="inherit"
      >
        {displayTotal}
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="9"
        fontWeight="700"
        fill="var(--text-3)"
        fontFamily="inherit"
        style={{ textTransform: "uppercase", letterSpacing: 1 }}
      >
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

  // ── React Query ──
  const { data: fetchedData, isLoading, isError } = useQuery<DoughnutChartSegment[]>({
    queryKey: queryKey ?? ["doughnut-chart"],
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

  return (
    <div className="flex items-center gap-5">
      {/* ── Doughnut SVG ── */}
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <SVGDoughnut
          data={sourceData}
          size={size}
          thickness={thickness}
          centerLabel={centerLabel}
          hovIdx={hovIdx}
          setHovIdx={setHovIdx}
        />
      </div>

      {/* ── Legend ── */}
      <div className="flex-1 flex flex-col gap-[7px]">
        {sourceData.map((seg, i) => (
          <div
            key={i}
            className={`flex items-center justify-between transition-opacity duration-150 ${
              hovIdx !== null && hovIdx !== i ? "opacity-40" : "opacity-100"
            }`}
            onMouseEnter={() => setHovIdx(i)}
            onMouseLeave={() => setHovIdx(null)}
          >
            <div className="flex items-center gap-[6px]">
              <div
                className="dc-legend-dot"
                style={{ background: seg.color }}
              />
              <span className="text-[13px] font-semibold text-[var(--text-2)]">
                {seg.label}
              </span>
            </div>
            <span className="text-[14px] font-extrabold text-[var(--text)]">
              {seg.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoughnutChart;
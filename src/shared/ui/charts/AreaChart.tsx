import React from "react";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import "./AreaChart.css";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface AreaChartSeries {
  /** Series label shown in legend */
  label: string;
  /** Hex color for line, dots, and gradient fill */
  color: string;
  /** If true, line is rendered dashed */
  dashed?: boolean;
  /** If true, dot markers are rendered on each data point */
  showDots?: boolean;
}

export interface AreaChartDataPoint {
  /** X-axis tick label (e.g. month abbreviation) */
  mo: string;
  /** Values keyed by series index — v0, v1, v2 … */
  [key: `v${number}`]: number;
}

export interface AreaChartProps {
  data?: AreaChartDataPoint[];
  series?: AreaChartSeries[];
  /** SVG canvas width */
  width?: number;
  /** SVG canvas height */
  height?: number;
  /** React Query: cache key */
  queryKey?: QueryKey;
  /** React Query: async fetcher returning AreaChartDataPoint[] */
  queryFn?: () => Promise<AreaChartDataPoint[]>;
}

// ── Defaults ───────────────────────────────────────────────────────────────────

const DEFAULT_SERIES: AreaChartSeries[] = [
  { label: "Revenue",  color: "#2563eb", showDots: true },
  { label: "Patients", color: "#0ea5a0", dashed: true   },
];

// ── Path helpers ───────────────────────────────────────────────────────────────

const smooth = (pts: [number, number][]): string =>
  pts
    .map(([x, y], i) => {
      if (i === 0) return `M${x},${y}`;
      const [px, py] = pts[i - 1];
      const cx = (px + x) / 2;
      return `C${cx},${py} ${cx},${y} ${x},${y}`;
    })
    .join(" ");

const areaPath = (pts: [number, number][], bot: number): string =>
  `${smooth(pts)} L${pts[pts.length - 1][0]},${bot} L${pts[0][0]},${bot} Z`;

// ── Component ──────────────────────────────────────────────────────────────────

const AreaChart: React.FC<AreaChartProps> = ({
  data = [],
  series = DEFAULT_SERIES,
  width: W = 500,
  height: H = 140,
  queryKey,
  queryFn,
}) => {
  // ── React Query ──
  const { data: fetchedData, isLoading, isError } = useQuery<AreaChartDataPoint[]>({
    queryKey: queryKey ?? ["area-chart"],
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

  // ── Layout ──
  const PL = 30, PR = 10, PT = 10, PB = 20;
  const gW = W - PL - PR;
  const gH = H - PT - PB;
  const bot = PT + gH;
  const n = sourceData.length;

  const xs: number[] = sourceData.map((_, i) =>
    PL + i * (gW / Math.max(n - 1, 1))
  );

  // Build per-series points (each series has its own max for independent scaling)
  const seriesPoints: [number, number][][] = series.map((_, si) => {
    const key = `v${si}` as `v${number}`;
    const vals = sourceData.map((d) => (d[key] as number) ?? 0);
    const max = Math.max(...vals, 1);
    return sourceData.map((d, i) => [
      xs[i],
      PT + gH - (((d[key] as number) ?? 0) / max) * gH,
    ]);
  });

  const gradientIds = series.map((_, i) => `ac-ag-${i}`);

  return (
    <div>
      {/* ── Legend ── */}
      <div className="ac-legend">
        {series.map((s, i) => (
          <div key={i} className="ac-leg-item">
            <div className="ac-swatch" style={{ background: s.color }} />
            {s.label}
          </div>
        ))}
      </div>

      {/* ── SVG ── */}
      <svg className="ac-svg" viewBox={`0 0 ${W} ${H}`}>
        <defs>
          {series.map((s, i) => (
            <linearGradient key={i} id={gradientIds[i]} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={s.color} stopOpacity="0.22" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0.02" />
            </linearGradient>
          ))}
        </defs>

        {/* ── Grid lines ── */}
        {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
          <line
            key={i}
            x1={PL} x2={W - PR}
            y1={PT + gH * (1 - f)} y2={PT + gH * (1 - f)}
            stroke="#e5e9f0" strokeWidth="1"
          />
        ))}

        {/* ── Area fills ── */}
        {seriesPoints.map((pts, i) => (
          <path key={i} d={areaPath(pts, bot)} fill={`url(#${gradientIds[i]})`} />
        ))}

        {/* ── Lines ── */}
        {seriesPoints.map((pts, i) => (
          <path
            key={i}
            d={smooth(pts)}
            fill="none"
            stroke={series[i].color}
            strokeWidth="2.5"
            strokeDasharray={series[i].dashed ? "5 3" : undefined}
          />
        ))}

        {/* ── Dots ── */}
        {seriesPoints.map((pts, i) =>
          series[i].showDots
            ? pts.map(([x, y], j) => (
                <circle
                  key={j}
                  cx={x} cy={y} r="3.5"
                  fill="#fff"
                  stroke={series[i].color}
                  strokeWidth="2"
                />
              ))
            : null
        )}

        {/* ── X-axis labels ── */}
        {sourceData.map((d, i) => (
          <text
            key={i}
            x={xs[i]}
            y={H - 3}
            textAnchor="middle"
            fontSize="10"
            fill="#9ca3af"
            fontFamily="Inter"
          >
            {d.mo}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default AreaChart;
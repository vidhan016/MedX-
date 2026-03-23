import React from "react";
import ReactApexChart from "react-apexcharts";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import type { ApexOptions } from "apexcharts";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface AreaChartSeries {
  /** Series label shown in legend */
  label: string;
  /** Hex color for line, area fill */
  color: string;
  /** Data values — one per x-axis tick */
  data?: number[];
}

export interface AreaChartDataPoint {
  /** X-axis tick label */
  mo: string;
  /** Values keyed by series index — v0, v1, v2 … */
  [key: `v${number}`]: number;
}

export interface AreaChartProps {
  data?: AreaChartDataPoint[];
  series?: AreaChartSeries[];
  height?: number;
  /** React Query: cache key */
  queryKey?: QueryKey;
  /** React Query: async fetcher returning AreaChartDataPoint[] */
  queryFn?: () => Promise<AreaChartDataPoint[]>;
}

// ── Defaults ───────────────────────────────────────────────────────────────────

const DEFAULT_SERIES: AreaChartSeries[] = [
  { label: "Revenue (₹)", color: "var(--ins-secondary, #1c84c6)" },
  { label: "Patients",    color: "var(--ins-primary, #1ab394)"   },
];

// ── Build ApexOptions ──────────────────────────────────────────────────────────

const buildOptions = (
  categories: string[],
  colors: string[],
): ApexOptions => ({
  chart: {
    type: "area",
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: "var(--ins-font-sans-serif, 'Open Sans', sans-serif)",
    background: "transparent",
  },
  dataLabels: { enabled: false },
  stroke: {
    width: 3,
    curve: "smooth",
  },
  colors,
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.2,
      stops: [15, 120, 100],
    },
  },
  legend: {
    offsetY: 5,
    labels: {
      colors: "var(--ins-secondary-color, #9ba6b7)",
    },
    markers: {
      offsetX: -4,
    },
  },
  xaxis: {
    categories,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: {
        fontSize: "12px",
        colors: "var(--ins-secondary-color, #9ba6b7)",
        fontFamily: "var(--ins-font-sans-serif, 'Open Sans', sans-serif)",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        fontSize: "11px",
        colors: "var(--ins-secondary-color, #9ba6b7)",
        fontFamily: "var(--ins-font-sans-serif, 'Open Sans', sans-serif)",
      },
      formatter: (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(Math.round(v)),
    },
  },
  grid: {
    borderColor: "var(--ins-border-color, #e7e9eb)",
    strokeDashArray: 3,
    row: {
      colors: ["transparent", "transparent"],
      opacity: 0.2,
    },
    padding: { bottom: 5 },
  },
  tooltip: {
    shared: true,
    theme: "light",
    style: {
      fontSize: "12px",
      fontFamily: "var(--ins-font-sans-serif, 'Open Sans', sans-serif)",
    },
  },
  markers: {
    size: 0,
    hover: { sizeOffset: 4 },
  },
});

// ── Component ──────────────────────────────────────────────────────────────────

const AreaChart: React.FC<AreaChartProps> = ({
  data = [],
  series = DEFAULT_SERIES,
  height = 200,
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
      <div className="flex items-center gap-2 px-3 py-6 text-xs text-[var(--muted)]">
        <span className="animate-spin inline-block w-3 h-3 border border-current border-t-transparent rounded-full" />
        Loading chart…
      </div>
    );
  }

  if (isError || sourceData.length === 0) {
    return (
      <div className="px-3 py-6 text-xs text-[var(--muted)] text-center">
        {isError ? "Failed to load chart data." : "No data available."}
      </div>
    );
  }

  // ── Convert flat data array → ApexCharts series ──
  const categories = sourceData.map((d) => d.mo);
  const colors     = series.map((s) => s.color);

  const apexSeries = series.map((s, si) => ({
    name: s.label,
    data: s.data ?? sourceData.map((d) => (d[`v${si}` as `v${number}`] as number) ?? 0),
  }));

  return (
    <ReactApexChart
      type="area"
      height={height}
      options={buildOptions(categories, colors)}
      series={apexSeries}
    />
  );
};

export default AreaChart;

// ── Re-export for backward compatibility ───────────────────────────────────────
export type { AreaChartDataPoint as AreaChartPoint };
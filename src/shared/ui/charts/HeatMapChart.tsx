import React, { useState } from "react";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import "./HeatMapChart.css";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface HeatMapDataPoint {
  /** Numeric value driving cell color intensity */
  val: number;
}

export interface HeatMapChartProps {
  data?: HeatMapDataPoint[];
  /** React Query: cache key */
  queryKey?: QueryKey;
  /** React Query: async fetcher returning HeatMapDataPoint[] */
  queryFn?: () => Promise<HeatMapDataPoint[]>;
}

// ── Color helpers ──────────────────────────────────────────────────────────────

const LEGEND_COLORS = ["#f1f4f8", "#bfdbfe", "#60a5fa", "#2563eb", "#1d4ed8"];

const getCellColor = (val: number, max: number): string => {
  const t = max > 0 ? val / max : 0;
  if (t < 0.15) return LEGEND_COLORS[0];
  if (t < 0.35) return LEGEND_COLORS[1];
  if (t < 0.60) return LEGEND_COLORS[2];
  if (t < 0.80) return LEGEND_COLORS[3];
  return LEGEND_COLORS[4];
};

const getTextColor = (val: number, max: number): string =>
  max > 0 && val / max < 0.35 ? "#374151" : "#fff";

// ── Day labels ─────────────────────────────────────────────────────────────────

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ── Component ──────────────────────────────────────────────────────────────────

const HeatMapChart: React.FC<HeatMapChartProps> = ({
  data = [],
  queryKey,
  queryFn,
}) => {
  const [hov, setHov] = useState<number | null>(null);

  // ── React Query ──
  const { data: fetchedData, isLoading, isError } = useQuery<HeatMapDataPoint[]>({
    queryKey: queryKey ?? ["heatmap-chart"],
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

  const max  = Math.max(...sourceData.map((d) => d.val), 1);
  const wks  = Math.ceil(sourceData.length / 7);
  const cols = `repeat(${wks}, 1fr)`;

  return (
    <div>
      <div className="hmWrap">

        {/* Day labels */}
        <div className="hmDayLabels">
          {DAY_LABELS.map((d) => (
            <div key={d} className="hmDayLabel">{d}</div>
          ))}
        </div>

        <div className="hmBody">
          {/* Week labels */}
          <div className="hmWeekLabels" style={{ gridTemplateColumns: cols }}>
            {Array.from({ length: wks }, (_, wi) => (
              <div key={wi} className="hmWeekLabel">W{wi + 1}</div>
            ))}
          </div>

          {/* Cell grid */}
          <div className="hmGrid" style={{ gridTemplateColumns: cols }}>
            {Array.from({ length: wks }, (_, wi) => (
              <div key={wi} className="hmCol">
                {Array.from({ length: 7 }, (_, di) => {
                  const idx = wi * 7 + di;
                  if (idx >= sourceData.length) {
                    return <div key={di} className="hmEmpty" />;
                  }
                  const d = sourceData[idx];
                  return (
                    <div
                      key={di}
                      className="hmCell"
                      style={{ background: getCellColor(d.val, max) }}
                      onMouseEnter={() => setHov(idx)}
                      onMouseLeave={() => setHov(null)}
                    >
                      <span
                        className="hmNum"
                        style={{ color: getTextColor(d.val, max) }}
                      >
                        {d.val > 0 ? d.val : ""}
                      </span>

                      {hov === idx && d.val > 0 && (
                        <div className="hmTooltip">
                          <div className="hmTooltipDay">
                            {DAY_LABELS[di]}, W{wi + 1}
                          </div>
                          <div>{d.val} patients</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="hmLegend">
            <span className="hmLegendLabel">Less</span>
            {LEGEND_COLORS.map((c, i) => (
              <div key={i} className="hmLegendSwatch" style={{ background: c }} />
            ))}
            <span className="hmLegendLabel">More</span>
          </div>
        </div>
      </div>
    </div>
  );  
};

export default HeatMapChart;

// ── Re-export old type alias so existing imports don't break ───────────────────
export type { HeatMapDataPoint as HeatMapChartDataPoint };
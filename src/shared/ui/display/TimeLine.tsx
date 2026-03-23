import React from "react";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import "./TimeLine.css";

// ── Types ──────────────────────────────────────────────────────────────────────

export type TimelineVariant = "default" | "icon-based" | "icon-bordered" | "users";

export interface TimelineDataItem {
  /** Unique key */
  id: string | number;
  /** Dot color — any valid CSS color */
  dotColor?: string;
  /** Dot background (icon-based / icon-bordered variants) */
  dotBg?: string;
  /** Icon rendered inside the dot (icon-based / icon-bordered variants) */
  dotIcon?: React.ReactNode;
  /** Time label rendered in the .timeline-time column */
  time?: React.ReactNode;
  /** Main content area */
  content: React.ReactNode;
}

export interface TimelineProps {
  items?: TimelineDataItem[];
  variant?: TimelineVariant;
  /** Extra class names on the wrapper */
  className?: string;
  /** React Query: cache key */
  queryKey?: QueryKey;
  /** React Query: async fetcher returning TimelineDataItem[] */
  queryFn?: () => Promise<TimelineDataItem[]>;
}

// ── Component ──────────────────────────────────────────────────────────────────

const Timeline: React.FC<TimelineProps> = ({
  items = [],
  variant = "default",
  className = "",
  queryKey,
  queryFn,
}) => {
  // ── React Query ──
  const { data: fetchedItems, isLoading, isError } = useQuery<TimelineDataItem[]>({
    queryKey: queryKey ?? ["timeline"],
    queryFn: queryFn!,
    enabled: !!queryFn,
    initialData: items,
  });

  const sourceItems = fetchedItems ?? items;

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
      <div className="px-3 py-2 text-xs text-red-500 border border-red-200 rounded bg-red-50">
        Failed to load timeline.
      </div>
    );
  }

  if (sourceItems.length === 0) {
    return (
      <div className="px-3 py-4 text-xs text-[var(--muted)] text-center">
        No timeline entries.
      </div>
    );
  }

  // Variant wrapper class
  const variantClass =
    variant === "icon-based"     ? "timeline-icon-based"
    : variant === "icon-bordered" ? "timeline-icon-bordered"
    : variant === "users"         ? "timeline-users"
    : "";

  return (
    <div className={`${variantClass} ${className}`.trim()}>
      {sourceItems.map((item, i) => {
        const isLast = i === sourceItems.length - 1;

        return (
          <div
            key={item.id}
            className={`timeline-item flex gap-[10px] ${isLast ? "" : "mb-0"}`}
          >
            {/* ── Dot column ── */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className="timeline-dot"
                style={{
                  background: item.dotBg ?? item.dotColor ?? "var(--bs-primary)",
                }}
              >
                {item.dotIcon}
              </div>
            </div>

            {/* ── Time + Content columns ── */}
            <div className="flex flex-1 gap-3 min-w-0">
              {/* Time */}
              {item.time && (
                <div className="timeline-time text-xs text-[var(--muted)] shrink-0">
                  {item.time}
                </div>
              )}

              {/* Content */}
              <div className="timeline-content flex-1 min-w-0 pb-4">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
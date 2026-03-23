import React from "react";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import "./Pager.scss";

// ── Types ──────────────────────────────────────────────────────────────────────

interface PagerProps {
  page: number;
  totalPages: number;
  goTo: (page: number) => void;
  total: number;
  start: number;
  pageSize: number;
  setPageSize?: (size: number) => void;
  itemLabel?: string;
  pageSizeOptions?: number[];
  queryKey?: QueryKey;
  queryFn?: () => Promise<number[]>;
}

// ── SVG Icons ──────────────────────────────────────────────────────────────────

const ChevLeft: React.FC<{ color?: string }> = ({ color = "currentColor" }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevRight: React.FC<{ color?: string }> = ({ color = "currentColor" }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ── Page number generation ─────────────────────────────────────────────────────

const getPageNums = (page: number, totalPages: number): (number | "...")[] => {
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages: (number | "...")[] = [];

  if (page <= 4) {
    pages.push(1, 2, 3, 4, 5, "...", totalPages);
  } else if (page >= totalPages - 3) {
    pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
  }

  return pages;
};

// ── Default page size options ──────────────────────────────────────────────────

const DEFAULT_PAGE_SIZE_OPTIONS = [4, 6, 8, 10];

// ── Component ──────────────────────────────────────────────────────────────────

const Pager: React.FC<PagerProps> = ({
  page,
  totalPages,
  goTo,
  total,
  start,
  pageSize,
  setPageSize,
  itemLabel = "Items",
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  queryKey,
  queryFn,
}) => {
  const { data: fetchedSizeOptions } = useQuery<number[]>({
    queryKey: queryKey ?? ["pager-size-options"],
    queryFn: queryFn!,
    enabled: !!queryFn,
    initialData: pageSizeOptions,
  });

  const sizeOptions = fetchedSizeOptions ?? pageSizeOptions;

  if (total === 0) return null;

  const end     = Math.min(start + pageSize, total);
  const pages   = getPageNums(page, totalPages);
  const isFirst = page === 1;
  const isLast  = page === totalPages;

  const mutedColor = "var(--ins-secondary-color, #9ba6b7)";
  const textColor  = "var(--ins-body-color, #4c4c5c)";

  return (
    <div className="pager-wrap">

      {/* ── Left: count label ── */}
      <div className="pager-count">
        Showing{" "}
        <b className="pager-count-bold">{start + 1}–{end}</b>{" "}
        of <b className="pager-count-bold">{total} {itemLabel}</b>
      </div>

      {/* ── Right: page size + controls ── */}
      <div className="pager-right">

        {/* Page size selector */}
        {setPageSize && (
          <select
            value={pageSize}
            onChange={(e) => setPageSize(parseInt(e.target.value))}
            className="pager-select"
          >
            {sizeOptions.map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
        )}

        {/* Controls row */}
        <div className="pager-controls">

          {/* First */}
          <button
            onClick={() => goTo(1)}
            disabled={isFirst}
            title="First page"
            className={`pager-btn pager-btn-symbol${isFirst ? " pager-btn--disabled" : ""}`}
          >
            «
          </button>

          {/* Prev */}
          <button
            onClick={() => goTo(page - 1)}
            disabled={isFirst}
            title="Previous page"
            className={`pager-btn${isFirst ? " pager-btn--disabled" : ""}`}
          >
            <ChevLeft color={isFirst ? mutedColor : textColor} />
          </button>

          {/* Page numbers */}
          {pages.map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="pager-ellipsis">…</span>
            ) : (
              <button
                key={p}
                onClick={() => goTo(p as number)}
                className={`pager-btn${page === p ? " pager-btn--active" : ""}`}
              >
                {p}
              </button>
            )
          )}

          {/* Next */}
          <button
            onClick={() => goTo(page + 1)}
            disabled={isLast}
            title="Next page"
            className={`pager-btn${isLast ? " pager-btn--disabled" : ""}`}
          >
            <ChevRight color={isLast ? mutedColor : textColor} />
          </button>

          {/* Last */}
          <button
            onClick={() => goTo(totalPages)}
            disabled={isLast}
            title="Last page"
            className={`pager-btn pager-btn-symbol${isLast ? " pager-btn--disabled" : ""}`}
          >
            »
          </button>

        </div>
      </div>
    </div>
  );
};

export default Pager;
export type { PagerProps };
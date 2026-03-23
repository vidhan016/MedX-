import React from "react";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import "./Pager.css";

// ── Types ──────────────────────────────────────────────────────────────────────

interface PagerProps {
  page: number;
  totalPages: number;
  goTo: (page: number) => void;
  total: number;
  start: number;
  pageSize: number;
  setPageSize?: (size: number) => void;
  /** Label shown after the count — e.g. "Patients", "Records" */
  itemLabel?: string;
  /** Default page size options */
  pageSizeOptions?: number[];
  /** React Query: cache key for fetching custom page size options */
  queryKey?: QueryKey;
  /** React Query: async fetcher returning number[] of page size options */
  queryFn?: () => Promise<number[]>;
}

interface IC_Props {
  n: string;
  s?: number;
  c?: string;
}

// ── Placeholder icon component — replace with your actual IC implementation ──
const IC: React.FC<IC_Props> = ({ n, s = 14, c = "currentColor" }) => (
  <span style={{ fontSize: s, color: c, lineHeight: 1 }} className="inline-flex">
    {n}
  </span>
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
  // ── React Query (optional — for fetching custom page size options) ──
  const { data: fetchedSizeOptions } = useQuery<number[]>({
    queryKey: queryKey ?? ["pager-size-options"],
    queryFn: queryFn!,
    enabled: !!queryFn,
    initialData: pageSizeOptions,
  });

  const sizeOptions = fetchedSizeOptions ?? pageSizeOptions;

  if (total === 0) return null;

  const end = Math.min(start + pageSize, total);
  const pages = getPageNums(page, totalPages);
  const isFirst = page === 1;
  const isLast = page === totalPages;

  return (
    <div className="flex items-center justify-between flex-wrap gap-2 pt-3 mt-2 border-t border-[var(--border)] px-1">

      {/* ── Left: count label ── */}
      <div className="text-[11.5px] text-[var(--muted)]">
        Showing{" "}
        <b className="text-[var(--text)]">{start + 1}–{end}</b>{" "}
        of <b className="text-[var(--text)]">{total} {itemLabel}</b>
      </div>

      {/* ── Right: page size + controls ── */}
      <div className="flex items-center gap-[6px] ml-auto">

        {/* Page size selector */}
        {setPageSize && (
          <select
            value={pageSize}
            onChange={(e) => setPageSize(parseInt(e.target.value))}
            className="pager-select"
          >
            {sizeOptions.map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        )}

        {/* Controls row */}
        <div className="flex items-center gap-[3px]">

          {/* First */}
          <button
            onClick={() => goTo(1)}
            disabled={isFirst}
            title="First page"
            className={`pager-btn font-bold ${isFirst ? "pager-btn--disabled" : ""}`}
          >
            «
          </button>

          {/* Prev */}
          <button
            onClick={() => goTo(page - 1)}
            disabled={isFirst}
            title="Previous page"
            className={`pager-btn ${isFirst ? "pager-btn--disabled" : ""}`}
          >
            <IC n="chevLeft" s={12} c={isFirst ? "var(--muted)" : "var(--text)"} />
          </button>

          {/* Page numbers */}
          {pages.map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="text-xs text-[var(--muted)] px-[3px]"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => goTo(p as number)}
                className={`pager-btn ${page === p ? "pager-btn--active" : ""}`}
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
            className={`pager-btn ${isLast ? "pager-btn--disabled" : ""}`}
          >
            <IC n="chevRight" s={12} c={isLast ? "var(--muted)" : "var(--text)"} />
          </button>

          {/* Last */}
          <button
            onClick={() => goTo(totalPages)}
            disabled={isLast}
            title="Last page"
            className={`pager-btn font-bold ${isLast ? "pager-btn--disabled" : ""}`}
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
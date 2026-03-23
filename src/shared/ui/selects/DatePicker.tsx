import React, { useState, useRef, useEffect } from "react";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import "./OnsetCalendar.css";

// ── Types ──────────────────────────────────────────────────────────────────────

type CalendarMode = "day" | "month" | "year";

interface QuickOption {
  label: string;
  d: number;
}

interface OnsetCalendarProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  /** React Query: cache key for fetching custom quick options */
  queryKey?: QueryKey;
  /** React Query: async fetcher returning QuickOption[] */
  queryFn?: () => Promise<QuickOption[]>;
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

// ── Constants ──────────────────────────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const DEFAULT_QUICK_OPTIONS: QuickOption[] = [
  { label: "Today", d: 0 },
  { label: "Tomorrow", d: 1 },
  { label: "After 2 days", d: 2 },
  { label: "After 1 week", d: 7 },
  { label: "After 2 weeks", d: 14 },
  { label: "After 3 weeks", d: 21 },
  { label: "After 1 month", d: 30 },
];

// ── Component ──────────────────────────────────────────────────────────────────

const OnsetCalendar: React.FC<OnsetCalendarProps> = ({
  value,
  onChange,
  onClose,
  queryKey,
  queryFn,
}) => {
  const today = new Date();
  const initDate = value ? new Date(value) : today;

  const [viewYear, setViewYear] = useState<number>(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initDate.getMonth());
  const [mode, setMode] = useState<CalendarMode>("day");
  const [quickSearch, setQuickSearch] = useState<string>("");

  const ref = useRef<HTMLDivElement>(null);

  // ── React Query (optional — for custom quick options) ──
  const { data: fetchedQuickOptions } = useQuery<QuickOption[]>({
    queryKey: queryKey ?? ["onset-calendar-quick-options"],
    queryFn: queryFn!,
    enabled: !!queryFn,
    initialData: DEFAULT_QUICK_OPTIONS,
  });

  const quickOptions = fetchedQuickOptions ?? DEFAULT_QUICK_OPTIONS;

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // ── Derived ──
  const selectedDate: Date | null = value ? new Date(value) : null;

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const yearStart = Math.floor(viewYear / 12) * 12;
  const years = Array.from({ length: 12 }, (_, i) => yearStart + i);

  const filteredQuick: QuickOption[] = quickOptions.filter((o) =>
    o.label.toLowerCase().includes(quickSearch.toLowerCase())
  );

  // ── Helpers ──
  const fmt = (date: Date): string =>
    date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const applyOffset = (days: number): void => {
    const target = new Date();
    target.setDate(target.getDate() + days);
    onChange(fmt(target));
    onClose();
  };

  const isSelected = (d: number | null): boolean => {
    if (!selectedDate || !d) return false;
    return (
      selectedDate.getFullYear() === viewYear &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getDate() === d
    );
  };

  const isToday = (d: number | null): boolean =>
    !!d &&
    today.getDate() === d &&
    today.getMonth() === viewMonth &&
    today.getFullYear() === viewYear;

  const handlePrev = (): void => {
    if (mode === "day") {
      if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
      else setViewMonth((m) => m - 1);
    } else if (mode === "month") {
      setViewYear((y) => y - 1);
    } else {
      setViewYear(yearStart - 12);
    }
  };

  const handleNext = (): void => {
    if (mode === "day") {
      if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
      else setViewMonth((m) => m + 1);
    } else if (mode === "month") {
      setViewYear((y) => y + 1);
    } else {
      setViewYear(yearStart + 12);
    }
  };

  const cycleMode = (): void =>
    setMode(mode === "day" ? "month" : mode === "month" ? "year" : "day");

  const headerLabel: string =
    mode === "day"
      ? `${MONTHS[viewMonth]} ${viewYear}`
      : mode === "month"
      ? `${viewYear}`
      : `${yearStart} – ${yearStart + 11}`;

  return (
    <div ref={ref} className="oc-panel absolute flex bg-white">
      {/* ── LEFT: Quick select ── */}
      <div className="oc-sidebar flex flex-col bg-[#f8fafc]">
        {/* Search */}
        <div className="px-[10px] pt-[10px] pb-[5px]">
          <div className="flex items-center bg-white border border-[var(--border)] rounded-[6px] px-[6px] py-[2px]">
            <IC n="search" s={10} c="var(--muted)" />
            <input
              autoFocus
              placeholder="Quick find..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="border-none outline-none text-[11px] w-full px-1 py-1 bg-transparent font-[inherit] text-[var(--text)]"
            />
          </div>
        </div>

        {/* Options list */}
        <div className="flex-1 overflow-y-auto p-1">
          {filteredQuick.map((opt) => (
            <div
              key={opt.label}
              onClick={() => applyOffset(opt.d)}
              className="oc-quick-opt px-[10px] py-[6px] text-[11.5px] rounded-[6px] cursor-pointer font-semibold text-[var(--text2)]"
            >
              {opt.label}
            </div>
          ))}
          {filteredQuick.length === 0 && (
            <div className="p-[10px] text-[10px] text-[var(--muted)] text-center">
              No matches
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: Calendar ── */}
      <div className="p-3 w-[230px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-[10px]">
          <div onClick={handlePrev} className="cursor-pointer p-1">
            <IC n="chevLeft" s={12} c="var(--muted)" />
          </div>
          <div
            onClick={cycleMode}
            className="text-xs font-bold cursor-pointer text-[var(--text1)]"
          >
            {headerLabel}
          </div>
          <div onClick={handleNext} className="cursor-pointer p-1">
            <IC n="chevRight" s={12} c="var(--muted)" />
          </div>
        </div>

        {/* ── Day view ── */}
        {mode === "day" && (
          <>
            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-[9px] font-extrabold text-[var(--muted)]"
                >
                  {d}
                </div>
              ))}
            </div>
            {/* Day cells */}
            <div className="grid grid-cols-7 gap-[2px]">
              {cells.map((d, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (d) {
                      onChange(fmt(new Date(viewYear, viewMonth, d)));
                      onClose();
                    }
                  }}
                  className={`oc-day text-center text-[11px] py-[5px] rounded-[6px] ${
                    isSelected(d)
                      ? "oc-day--selected"
                      : d === null
                      ? "oc-day--empty"
                      : isToday(d)
                      ? "oc-day--today"
                      : "oc-day--default"
                  }`}
                >
                  {d ?? ""}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Month view ── */}
        {mode === "month" && (
          <div className="grid grid-cols-3 gap-1">
            {MONTHS.map((m, i) => (
              <div
                key={m}
                onClick={() => { setViewMonth(i); setMode("day"); }}
                className={`oc-cell text-center text-[11px] py-2 rounded-[6px] cursor-pointer ${
                  viewMonth === i ? "oc-cell--active" : "oc-cell--inactive"
                }`}
              >
                {m}
              </div>
            ))}
          </div>
        )}

        {/* ── Year view ── */}
        {mode === "year" && (
          <div className="grid grid-cols-3 gap-1">
            {years.map((y) => (
              <div
                key={y}
                onClick={() => { setViewYear(y); setMode("month"); }}
                className={`oc-cell text-center text-[11px] py-2 rounded-[6px] cursor-pointer ${
                  viewYear === y ? "oc-cell--active" : "oc-cell--inactive"
                }`}
              >
                {y}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnsetCalendar;
export type { OnsetCalendarProps, QuickOption };
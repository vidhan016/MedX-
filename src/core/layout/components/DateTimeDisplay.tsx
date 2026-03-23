import React, { useState, useEffect } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface DateTimeDisplayProps {
  /** Auto-updates every second when true — defaults to false (static snapshot) */
  live?: boolean;
  /** Date format options passed to toLocaleDateString */
  dateOptions?: Intl.DateTimeFormatOptions;
  /** Time format options passed to toLocaleTimeString */
  timeOptions?: Intl.DateTimeFormatOptions;
  /** Locale — defaults to "en-US" */
  locale?: string;
  /** Extra class names on the wrapper */
  className?: string;
}

// ── Defaults ───────────────────────────────────────────────────────────────────

const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
};

const DEFAULT_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
};

// ── Component ──────────────────────────────────────────────────────────────────

const DateTimeDisplay: React.FC<DateTimeDisplayProps> = ({
  live = false,
  dateOptions = DEFAULT_DATE_OPTIONS,
  timeOptions = DEFAULT_TIME_OPTIONS,
  locale = "en-US",
  className = "",
}) => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [live]);

  return (
    <div
      className={`flex items-center gap-[6px] text-[11.5px] font-medium text-[#94a3b8] whitespace-nowrap ml-auto ${className}`.trim()}
    >
      <span>{now.toLocaleDateString(locale, dateOptions)}</span>
      <span className="text-[#cbd5e1]">·</span>
      <span>{now.toLocaleTimeString(locale, timeOptions)}</span>
    </div>
  );
};

export default DateTimeDisplay;
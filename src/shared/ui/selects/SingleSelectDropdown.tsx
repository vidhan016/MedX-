import React, { useState, useRef, useEffect } from "react";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import "./SingleSelectDropdown.css";

// ── Types ──────────────────────────────────────────────────────────────────────

interface SingleSelectDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  placeholder?: string;
  allowCustom?: boolean;
  /** React Query: cache key */
  queryKey?: QueryKey;
  /** React Query: async fetcher returning string[] */
  queryFn?: () => Promise<string[]>;
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

// ── Component ──────────────────────────────────────────────────────────────────

const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({
  value,
  onChange,
  options = [],
  placeholder = "Select…",
  allowCustom = true,
  queryKey,
  queryFn,
}) => {
  // ── React Query ──
  const { data: fetchedOptions, isLoading, isError } = useQuery<string[]>({
    queryKey: queryKey ?? ["single-select-dropdown"],
    queryFn: queryFn!,
    enabled: !!queryFn,
    initialData: options,
  });

  const sourceOptions = fetchedOptions ?? options;

  // ── Local state ──
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const wrapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  // ── Derived ──
  const filtered: string[] = sourceOptions.filter(
    (o) => o.toLowerCase().includes(search.toLowerCase()) && o !== value
  );

  const showAddCustom: boolean =
    allowCustom &&
    !!search.trim() &&
    !sourceOptions.includes(search.trim()) &&
    search.trim() !== value;

  // ── Handlers ──
  const select = (v: string): void => {
    onChange(v);
    setOpen(false);
    setSearch("");
  };

  const addCustom = (): void => {
    const v = search.trim();
    if (v) {
      onChange(v);
      setOpen(false);
      setSearch("");
    }
  };

  // ── Loading / Error ──
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-xs text-[var(--muted)] border border-[var(--border)] rounded-[var(--rs)]">
        <span className="animate-spin inline-block w-3 h-3 border border-current border-t-transparent rounded-full" />
        Loading options…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-3 py-2 text-xs text-red-500 border border-red-200 rounded-[var(--rs)] bg-red-50">
        Failed to load options.
      </div>
    );
  }

  return (
    <div className="relative" ref={wrapRef}>
      {/* ── Trigger button ── */}
      <button
        type="button"
        className={`ssd-trigger w-full flex items-center justify-between gap-2 px-[10px] py-[7px] bg-white rounded-[var(--rs)] cursor-pointer border-none font-[inherit] ${
          open ? "ssd-trigger--open" : ""
        }`}
        onClick={() => setOpen((o) => !o)}
      >
        <span
          className={`flex-1 text-left text-[12.5px] truncate ${
            !value ? "text-[var(--muted)]" : "text-[var(--text)]"
          }`}
        >
          {value || placeholder}
        </span>
        {value && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="flex items-center mr-1 opacity-60 cursor-pointer"
          >
            <IC n="x" s={11} c="var(--muted)" />
          </span>
        )}
        <IC n="chevDown" s={13} c="var(--muted)" />
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div className="ssd-dropdown absolute bg-white border border-[var(--border)] rounded-[var(--rs)] overflow-hidden flex flex-col">
          {/* Search row */}
          <div className="ssd-search-wrap flex items-center gap-2 px-[10px] py-[7px]">
            <IC n="search" s={12} c="var(--muted)" />
            <input
              ref={searchRef}
              placeholder="Search or type custom…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (filtered.length === 1) select(filtered[0]);
                  else if (showAddCustom) addCustom();
                }
                if (e.key === "Escape") setOpen(false);
              }}
              className="flex-1 border-none outline-none text-[12px] font-[inherit] text-[var(--text)] bg-transparent"
            />
            {search && (
              <button
                className="flex items-center p-[1px] bg-transparent border-none cursor-pointer text-[var(--muted)]"
                onClick={() => setSearch("")}
              >
                <IC n="x" s={11} />
              </button>
            )}
            {showAddCustom && (
              <button
                className="inline-flex items-center gap-[3px] px-[9px] py-[2px] rounded-full text-[10.5px] font-bold bg-[var(--blue)] text-white border-none cursor-pointer whitespace-nowrap flex-shrink-0 font-[inherit]"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addCustom();
                }}
              >
                <IC n="plus" s={10} c="#fff" /> Add
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {/* Currently selected — show at top with remove */}
            {value && value.toLowerCase().includes(search.toLowerCase()) && (
              <div
                className="ssd-item--selected flex items-center gap-[10px] px-3 py-[8px] cursor-pointer border-b border-[var(--border)] bg-[#f0fdf4] hover:bg-[#dcfce7] transition-colors duration-100"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange("");
                  setOpen(false);
                }}
              >
                <div className="ssd-item-check">
                  <IC n="check" s={9} c="#fff" />
                </div>
                <span className="text-[12.5px] font-semibold text-[#15803d] flex-1">
                  {value}
                </span>
                <span className="text-[10px] text-[var(--red)] font-semibold">
                  Remove
                </span>
              </div>
            )}

            {/* Unselected items */}
            {filtered.map((item) => (
              <div
                key={item}
                className="flex items-center gap-[10px] px-3 py-[8px] cursor-pointer border-b border-[var(--border)] hover:bg-[var(--blue-bg)] transition-colors duration-100 text-[var(--text2)]"
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(item);
                }}
              >
                <div className="ssd-item-check" />
                <span className="text-[12.5px]">{item}</span>
              </div>
            ))}

            {/* Empty states */}
            {!filtered.length && !search && !value && (
              <div className="px-3 py-[14px] text-xs text-[var(--muted)] text-center">
                Type to search or select below
              </div>
            )}
            {!filtered.length && search && !showAddCustom && (
              <div className="px-3 py-[14px] text-xs text-[var(--muted)] text-center">
                No results for "{search}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleSelectDropdown;
export type { SingleSelectDropdownProps };
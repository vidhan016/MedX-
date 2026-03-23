import React, { useState, useRef, useEffect } from "react";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import "./MultiSelectDropdown.css";

// ── Types ──────────────────────────────────────────────────────────────────────

type PillColor = "blue" | "purple" | "green" | "teal" | "red";

interface OptionGroup {
  category: string | null;
  items: string[];
}

interface MultiSelectDropdownProps {
  label?: string;
  /** Flat string[] or grouped OptionGroup[] — used as static data or initialData for React Query */
  options?: string[] | OptionGroup[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  pillColor?: PillColor;
  allowCustom?: boolean;
  showPills?: boolean;
  /** React Query: cache key */
  queryKey?: QueryKey;
  /** React Query: async fetcher returning flat or grouped options */
  queryFn?: () => Promise<string[] | OptionGroup[]>;
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

// ── Pill color map ─────────────────────────────────────────────────────────────

const PILL_VARS: Record<PillColor, React.CSSProperties> = {
  blue: {
    "--msd-pill-bg": "rgba(37,99,235,0.1)",
    "--msd-pill-color": "var(--blue)",
    "--msd-pill-border": "1px solid rgba(37,99,235,0.25)",
  } as React.CSSProperties,
  purple: {
    "--msd-pill-bg": "rgba(139,92,246,0.1)",
    "--msd-pill-color": "var(--purple)",
    "--msd-pill-border": "1px solid rgba(139,92,246,0.25)",
  } as React.CSSProperties,
  green: {
    "--msd-pill-bg": "rgba(34,197,94,0.1)",
    "--msd-pill-color": "var(--green)",
    "--msd-pill-border": "1px solid rgba(34,197,94,0.25)",
  } as React.CSSProperties,
  teal: {
    "--msd-pill-bg": "rgba(14,165,160,0.1)",
    "--msd-pill-color": "var(--teal)",
    "--msd-pill-border": "1px solid rgba(14,165,160,0.25)",
  } as React.CSSProperties,
  red: {
    "--msd-pill-bg": "rgba(239,68,68,0.1)",
    "--msd-pill-color": "var(--red)",
    "--msd-pill-border": "1px solid rgba(239,68,68,0.25)",
  } as React.CSSProperties,
};

// ── Normalise raw options into OptionGroup[] ───────────────────────────────────

const normalise = (raw: string[] | OptionGroup[]): OptionGroup[] => {
  if (!raw || raw.length === 0) return [{ category: null, items: [] }];
  if (typeof raw[0] === "string") {
    return [{ category: null, items: raw as string[] }];
  }
  return raw as OptionGroup[];  
};

// ── Component ──────────────────────────────────────────────────────────────────

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  options = [],
  selected,
  onChange,
  placeholder = "Select…",
  pillColor = "blue",
  allowCustom = true,
  showPills = true,
  queryKey,
  queryFn,
}) => {
  // ── React Query ──
  const { data: fetchedOptions, isLoading, isError } = useQuery<string[] | OptionGroup[]>({
    queryKey: queryKey ?? ["multi-select-dropdown"],
    queryFn: queryFn!,
    enabled: !!queryFn,
    initialData: options,
  });

  const sourceOptions = fetchedOptions ?? options;

  // ── Local state ──
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [topAddOpen, setTopAddOpen] = useState<boolean>(false);
  const [topAddInput, setTopAddInput] = useState<string>("");
  const [localOptions, setLocalOptions] = useState<OptionGroup[]>(() =>
    normalise(sourceOptions)
  );

  // Sync localOptions when fetched/static data changes
  useEffect(() => {
    setLocalOptions(normalise(sourceOptions));
  }, [sourceOptions]);

  const wrapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setTopAddOpen(false);
        setTopAddInput("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  // ── Derived ──
  const filtered: OptionGroup[] = localOptions
    .map((g) => ({
      ...g,
      items: g.items.filter(
        (item: string) =>
          item.toLowerCase().includes(search.toLowerCase()) &&
          !selected.includes(item)
      ),
    }))
    .filter((g) => g.items.length > 0);

  const allFiltered: string[] = filtered.flatMap((g) => g.items);
  const allItems: string[] = localOptions.flatMap((g) => g.items);

  const showAddCustom: boolean =
    allowCustom &&
    !!search.trim() &&
    !allItems.includes(search.trim()) &&
    !selected.includes(search.trim());

  // ── Handlers ──
  const addItem = (item: string): void => {
    onChange([...selected.filter((x: string) => x !== item), item]);
    setSearch("");
  };

  const removeItem = (item: string): void =>
    onChange(selected.filter((x: string) => x !== item));

  const addCustom = (): void => {
    const v = search.trim();
    if (!v || selected.includes(v)) return;
    setLocalOptions((prev) => {
      const copy = prev.map((g) => ({ ...g, items: [...g.items] }));
      if (!copy[0].items.includes(v)) copy[0].items.push(v);
      return copy;
    });
    onChange([...selected, v]);
    setSearch("");
  };

  const handleTopAdd = (): void => {
    const val = topAddInput.trim();
    if (!val) return;
    setLocalOptions((prev) => {
      const copy = prev.map((g) => ({ ...g, items: [...g.items] }));
      if (!copy[0].items.includes(val)) copy[0].items.push(val);
      return copy;
    });
    if (!selected.includes(val)) onChange([...selected, val]);
    setTopAddOpen(false);
    setTopAddInput("");
    setOpen(true);
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
    <div className="relative" ref={wrapRef} style={PILL_VARS[pillColor]}>
      {label && (
        <label className="block mb-1 text-[11.5px] font-semibold text-[var(--text2)]">
          {label}
        </label>
      )}

      {/* ── Trigger row ── */}
      <div
        className={`msd-trigger flex items-center flex-wrap gap-1 px-[10px] py-[5px] bg-white rounded-[var(--rs)] ${
          open ? "msd-trigger--open" : ""
        }`}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            searchRef.current?.focus();
            setOpen(true);
          }
        }}
      >
        {/* ── Inline pills ── */}
        {showPills &&
          selected.map((item: string) => (
            <span
              key={item}
              className="msd-pill inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-[2px] rounded-full flex-shrink-0"
            >
              {item}
              <span
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeItem(item);
                }}
                className="flex items-center opacity-70 cursor-pointer"
              >
                <IC n="x" s={10} c="currentColor" />
              </span>
            </span>
          ))}

        {/* ── Search input ── */}
        <input
          ref={searchRef}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (allFiltered.length === 1) addItem(allFiltered[0]);
              else if (showAddCustom) addCustom();
            }
            if (e.key === "Escape") {
              setOpen(false);
              setSearch("");
            }
            if (e.key === "Backspace" && !search && selected.length > 0) {
              removeItem(selected[selected.length - 1]);
            }
          }}
          placeholder={selected.length === 0 && !search ? placeholder : ""}
          className="flex-1 min-w-[80px] border-none outline-none text-[12.5px] font-[inherit] text-[var(--text)] bg-transparent py-[2px]"
        />

        {/* Clear all */}
        {selected.length > 0 && (
          <span
            onMouseDown={(e) => {
              e.preventDefault();
              onChange([]);
              setSearch("");
            }}
            className="flex items-center opacity-50 cursor-pointer px-[2px]"
          >
            <IC n="x" s={11} c="var(--muted)" />
          </span>
        )}

        {/* Add button */}
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const next = !topAddOpen;
            setTopAddOpen(next);
            setTopAddInput("");
            if (next) setOpen(false);
          }}
          className="inline-flex items-center gap-1 px-[10px] py-[3px] rounded-[var(--rs)] text-[11.5px] font-bold bg-[var(--blue)] text-white border-none cursor-pointer font-[inherit] flex-shrink-0 transition-colors duration-150"
        >
          <IC n="plus" s={11} c="#fff" /> Add
        </button>

        {/* Chevron */}
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            setOpen((o) => !o);
            setTopAddOpen(false);
            setTopAddInput("");
          }}
          className="flex items-center cursor-pointer pl-[2px]"
        >
          <IC n={open ? "chevUp" : "chevDown"} s={13} c="var(--muted)" />
        </div>
      </div>

      {/* ── Top add panel ── */}
      {topAddOpen && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="msd-top-add-panel flex items-center gap-[6px] px-[10px] py-[6px] bg-[#fafafa] rounded-[var(--rs)] mt-1"
        >
          <IC n="plus" s={11} c="var(--muted)" />
          <input
            autoFocus
            placeholder="New option…"
            value={topAddInput}
            onChange={(e) => setTopAddInput(e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTopAdd();
              if (e.key === "Escape") {
                setTopAddOpen(false);
                setTopAddInput("");
              }
            }}
            className="flex-1 border-none outline-none text-[11.5px] font-[inherit] text-[var(--text)] bg-transparent"
          />
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleTopAdd();
            }}
            className={`flex items-center p-[2px] bg-transparent border-none ${
              topAddInput.trim() ? "cursor-pointer opacity-100" : "cursor-not-allowed opacity-30"
            }`}
            title="Add option"
          >
            <IC n="check" s={13} c="var(--green)" />
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setTopAddOpen(false);
              setTopAddInput("");
            }}
            className="flex items-center p-[2px] bg-transparent border-none cursor-pointer"
            title="Close"
          >
            <IC n="x" s={10} c="var(--muted)" />
          </button>
        </div>
      )}

      {/* ── Dropdown ── */}
      {open && (
        <div className="msd-dropdown absolute bg-white border border-[var(--border)] rounded-[var(--rs)] overflow-hidden flex flex-col">
          <div className="overflow-y-auto flex-1">
            {/* Unselected items */}
            {filtered.map((g, gi) => (
              <div key={gi}>
                {g.category && (
                  <div className="px-3 py-[5px] text-[10px] font-extrabold uppercase tracking-[0.5px] text-[var(--muted)] bg-[#f8fafc] border-b border-[var(--border)] sticky top-0">
                    {g.category}
                  </div>
                )}
                {g.items.map((item: string) => (
                  <div
                    key={item}
                    className="flex items-center gap-[10px] px-3 py-[8px] cursor-pointer border-b border-[var(--border)] hover:bg-[var(--blue-bg)] transition-colors duration-100 text-[var(--text2)]"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addItem(item);
                    }}
                  >
                    <div className="msd-item-check" />
                    <span className="text-[12.5px]">{item}</span>
                  </div>
                ))}
              </div>
            ))}

            {/* Already selected items (shown filtered) */}
            {selected
              .filter((s: string) => s.toLowerCase().includes(search.toLowerCase()))
              .map((item: string) => (
                <div
                  key={item}
                  className="msd-item--selected flex items-center gap-[10px] px-3 py-[8px] cursor-pointer border-b border-[var(--border)] bg-[#f0fdf4] hover:bg-[#dcfce7] transition-colors duration-100"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    removeItem(item);
                  }}
                >
                  <div className="msd-item-check">
                    <IC n="check" s={9} c="#fff" />
                  </div>
                  <span className="text-[12.5px] font-semibold text-[#15803d] flex-1">
                    {item}
                  </span>
                  <span className="text-[10px] text-[var(--red)] font-semibold">
                    Remove
                  </span>
                </div>
              ))}

            {/* Add custom option */}
            {showAddCustom && (
              <div
                className="flex items-center gap-2 px-3 py-[8px] cursor-pointer border-b border-[var(--border)] text-[var(--blue)] bg-[var(--blue-bg)] hover:opacity-80 transition-opacity"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addCustom();
                }}
              >
                <IC n="plus" s={11} c="var(--blue)" />
                <span className="text-[12px] font-semibold">
                  Add "{search.trim()}"
                </span>
              </div>
            )}

            {/* Empty states */}
            {!allFiltered.length && !search && (
              <div className="px-3 py-[14px] text-xs text-[var(--muted)] text-center">
                All items selected or type to search
              </div>
            )}
            {!allFiltered.length && search && !showAddCustom && (
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

export default MultiSelectDropdown;
export type { MultiSelectDropdownProps, OptionGroup, PillColor };
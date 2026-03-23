import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import "./CategoricalDropdown.css";

// ── Types ──────────────────────────────────────────────────────────────────────

interface CategoricalDropdownProps {
  label?: string;
  /** Static categories — used directly when queryFn is not provided, or as initialData for React Query */
  categories?: Record<string, string[]>;
  selected: string[];
  onChange: (selected: string[]) => void;
  accentColor?: string;
  accentBg?: string;
  /** React Query: unique key for caching */
  queryKey?: unknown[];
  /** React Query: async function that returns categories */
  queryFn?: () => Promise<Record<string, string[]>>;
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

const CategoricalDropdown: React.FC<CategoricalDropdownProps> = ({
  label,
  categories = {},
  selected,
  onChange,
  accentColor = "var(--blue)",
  accentBg = "var(--blue-bg)",
  queryKey,
  queryFn,
}) => {
  // ── React Query ──
  const { data: fetchedCategories, isLoading, isError } = useQuery<Record<string, string[]>>({
    queryKey: queryKey ?? ["categorical-dropdown"],
    queryFn: queryFn!,
    enabled: !!queryFn,
    initialData: categories,
  });

  const sourceCategories = fetchedCategories ?? categories;

  // ── Local state ──
  const [topAddOpen, setTopAddOpen] = useState<boolean>(false);
  const [topAddInput, setTopAddInput] = useState<string>("");
  const [catAddOpen, setCatAddOpen] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
  const [catSearch, setCatSearch] = useState<Record<string, string>>({});
  const [localCategories, setLocalCategories] = useState<Record<string, string[]>>({});
  const [addDropdownOpen, setAddDropdownOpen] = useState<boolean>(false);
  const [newCatInput, setNewCatInput] = useState<string>("");
  const [newItemInput, setNewItemInput] = useState<string>("");

  // Sync localCategories when fetched/static data changes
  useEffect(() => {
    setLocalCategories(
      Object.fromEntries(Object.entries(sourceCategories).map(([k, v]) => [k, [...v]]))
    );
  }, [sourceCategories]);

  const addDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const skipOpenRef = useRef<boolean>(false);

  // ── Handlers ──
  const handleAddCategory = (): void => {
    const cat = newCatInput.trim();
    if (!cat) return;
    if (!localCategories[cat]) {
      setLocalCategories((prev) => ({ ...prev, [cat]: [] }));
    }
    setNewCatInput("");
  };

  const handleAddItem = (cat: string): void => {
    const item = newItemInput.trim();
    if (!item) return;
    if (localCategories[cat]?.includes(item)) return;
    setLocalCategories((prev) => ({ ...prev, [cat]: [...(prev[cat] || []), item] }));
    setNewItemInput("");
  };

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (addDropdownRef.current && !addDropdownRef.current.contains(e.target as Node)) {
        setAddDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const toggleCat = (cat: string): void =>
    setExpandedCats((p) => ({ ...p, [cat]: !p[cat] }));

  const isCatExpanded = (cat: string): boolean =>
    search.trim() ? true : !!expandedCats[cat];

  const isAdded = (name: string): boolean => selected.includes(name);

  const getGroupedResults = (): { cat: string; items: string[] }[] => {
    const s = search.trim().toLowerCase();
    return Object.entries(localCategories).reduce<{ cat: string; items: string[] }[]>(
      (acc, [cat, items]) => {
        const matched = s
          ? items.filter(
              (i) => i.toLowerCase().includes(s) || cat.toLowerCase().includes(s)
            )
          : items;
        if (matched.length > 0 || !s) acc.push({ cat, items: matched });
        return acc;
      },
      []
    );
  };

  const selectItem = (name: string): void => {
    if (isAdded(name)) return;
    onChange([...selected, name]);
  };

  const removeItem = (name: string): void => {
    onChange(selected.filter((s) => s !== name));
  };

  const handleAddNew = (): void => {
    const term = search.trim();
    if (!term) return;
    for (const [, items] of Object.entries(localCategories)) {
      const match = items.find((i) => i.toLowerCase() === term.toLowerCase());
      if (match) {
        selectItem(match);
        setSearch("");
        return;
      }
    }
    if (!Object.keys(localCategories).some((c) => c.toLowerCase() === term.toLowerCase())) {
      setLocalCategories((prev) => ({ ...prev, [term]: [] }));
    }
    setSearch("");
  };

  const groupedResults = getGroupedResults();

  // ── Loading / Error states ──
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-xs text-[var(--muted)] border border-[var(--border)] rounded-[var(--rs)]">
        <span className="animate-spin inline-block w-3 h-3 border border-current border-t-transparent rounded-full" />
        Loading categories…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-3 py-2 text-xs text-red-500 border border-red-200 rounded-[var(--rs)] bg-red-50">
        Failed to load categories.
      </div>
    );
  }

  return (
    <div
      style={{ "--cd-accent": accentColor, "--cd-accent-bg": accentBg } as React.CSSProperties}
    >
      {/* ── COMBINED SEARCH + DROPDOWN ── */}
      <div className="relative" ref={dropdownRef}>
        {label && (
          <label className="block mb-[5px] text-[9px] font-medium text-[var(--muted)] tracking-[0.5px]">
            {label}
          </label>
        )}

        {/* Input row */}
        <div
          className={`cd-input-row flex items-center gap-2 px-[10px] py-[6px] bg-white rounded-[var(--rs)] ${
            open ? "cd-input-row--open" : ""
          }`}
        >
          <IC n="search" s={13} c="var(--muted)" />
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            onFocus={() => {
              if (skipOpenRef.current) return;
              setOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddNew();
              if (e.key === "Escape") {
                setOpen(false);
                setSearch("");
              }
            }}
            placeholder="Search or browse by category…"
            className="flex-1 border-none outline-none text-[12.5px] font-[inherit] text-[var(--text)] bg-transparent"
          />
          {search && (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                setSearch("");
              }}
              className="flex items-center p-[2px] bg-transparent border-none cursor-pointer"
            >
              <IC n="x" s={11} c="var(--muted)" />
            </button>
          )}
          <div className="flex items-center gap-[6px] flex-shrink-0">
            {/* Add category button */}
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const next = !topAddOpen;
                setTopAddOpen(next);
                setTopAddInput("");
                setCatAddOpen({});
                setCatSearch({});
                if (next) setOpen(false);
              }}
              className="inline-flex items-center gap-1 px-[10px] py-[3px] rounded-[var(--rs)] text-[11.5px] font-bold bg-[var(--blue)] text-white border-none cursor-pointer font-[inherit] flex-shrink-0"
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
              className="flex items-center cursor-pointer"
            >
              <IC n={open ? "chevUp" : "chevDown"} s={13} c="var(--muted)" />
            </div>
          </div>
        </div>

        {/* Top-level add category panel */}
        {topAddOpen && (
          <div className="cd-top-add-panel flex items-center gap-[6px] px-[10px] py-[6px] bg-[#fafafa] rounded-[var(--rs)] mt-1">
            <IC n="plus" s={11} c="var(--muted)" />
            <input
              autoFocus
              placeholder="New category name…"
              value={topAddInput}
              onChange={(e) => setTopAddInput(e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = topAddInput.trim();
                  if (!val) return;
                  const exists = Object.keys(localCategories).some(
                    (c) => c.toLowerCase() === val.toLowerCase()
                  );
                  if (!exists) setLocalCategories({ [val]: [], ...localCategories });
                  setTopAddOpen(false);
                  setTopAddInput("");
                  setExpandedCats((prev) => ({ ...prev, [val]: true }));
                  setTimeout(() => setOpen(true), 0);
                }
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
                const val = topAddInput.trim();
                if (!val) return;
                const exists = Object.keys(localCategories).some(
                  (c) => c.toLowerCase() === val.toLowerCase()
                );
                if (!exists) setLocalCategories({ [val]: [], ...localCategories });
                setTopAddOpen(false);
                setTopAddInput("");
                setExpandedCats((prev) => ({ ...prev, [val]: true }));
                setTimeout(() => setOpen(true), 0);
              }}
              className={`flex items-center p-[2px] bg-transparent border-none ${
                topAddInput.trim() ? "cursor-pointer opacity-100" : "cursor-not-allowed opacity-30"
              }`}
              title="Add category"
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

        {/* addDropdownOpen panel (unused trigger kept for parity — panel opens via topAddOpen) */}
        {addDropdownOpen && (
          <div
            ref={addDropdownRef}
            className="cd-add-dropdown absolute bg-white border border-[var(--border)] rounded-[var(--rs)] overflow-hidden flex flex-col"
          >
            {/* Top input: add new category */}
            <div className="flex items-center gap-[6px] px-[10px] py-2 bg-[#f8fafc] border-b border-[var(--border)]">
              <input
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddCategory();
                }}
                placeholder="Add new category…"
                className="flex-1 border border-[var(--border)] outline-none rounded-[var(--rxs)] px-2 py-[6px] text-xs font-[inherit] text-[var(--text)] bg-white"
              />
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleAddCategory();
                }}
                className="inline-flex items-center gap-1 px-[10px] py-[5px] rounded-[var(--rxs)] text-[11px] font-bold bg-[var(--blue)] text-white border-none cursor-pointer font-[inherit]"
              >
                <IC n="plus" s={10} c="#fff" /> Add
              </button>
            </div>

            {/* Category list */}
            <div className="overflow-y-auto flex-1">
              {Object.entries(localCategories).map(([cat, items]) => {
                const isOpen = newCatInput === cat;
                return (
                  <div key={cat} className="border-b border-[var(--border)]">
                    <div
                      className={`flex items-center justify-between px-[10px] py-2 cursor-pointer ${
                        isOpen ? "cd-add-cat-row--open" : "bg-white"
                      }`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setNewCatInput((prev) => (prev === cat ? "" : cat));
                        setNewItemInput("");
                      }}
                    >
                      <span className="text-xs font-bold text-[var(--text)]">{cat}</span>
                      <IC n={isOpen ? "chevDown" : "chevRight"} s={11} c="var(--muted)" />
                    </div>

                    {isOpen && (
                      <div className="border-t border-[var(--border)] bg-[#fafafa]">
                        <div className="flex items-center gap-[6px] px-[10px] py-2 border-b border-[var(--border)] bg-[#f8fafc]">
                          <input
                            value={newItemInput}
                            onChange={(e) => setNewItemInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleAddItem(cat);
                            }}
                            placeholder={`Add new item to ${cat}…`}
                            className="flex-1 border border-[var(--border)] outline-none rounded-[var(--rxs)] px-2 py-[6px] text-[11.5px] font-[inherit] text-[var(--text)] bg-white"
                          />
                          <button
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleAddItem(cat);
                            }}
                            className="inline-flex items-center gap-1 px-[10px] py-[5px] rounded-[var(--rxs)] text-[11px] font-bold bg-[var(--blue)] text-white border-none cursor-pointer font-[inherit]"
                          >
                            <IC n="plus" s={10} c="#fff" /> Add
                          </button>
                        </div>

                        {(items || []).map((comp) => {
                          const added = isAdded(comp);
                          return (
                            <div
                              key={comp}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                if (!added) {
                                  selectItem(comp);
                                  setAddDropdownOpen(false);
                                  setNewCatInput("");
                                  setNewItemInput("");
                                }
                              }}
                              className={`flex items-center justify-between px-3 py-[7px] border-b border-[var(--border)] text-xs gap-2 ${
                                added
                                  ? "bg-[#f0fdf4] text-[#15803d] cursor-default"
                                  : "bg-white text-[var(--text2)] cursor-pointer"
                              }`}
                            >
                              <span
                                className={`${
                                  added ? "font-semibold" : "font-normal"
                                } whitespace-nowrap overflow-hidden text-ellipsis`}
                              >
                                {comp}
                              </span>
                              {added ? (
                                <span className="text-[10px] font-bold text-[#15803d] flex-shrink-0">
                                  ✓ Added
                                </span>
                              ) : (
                                <span className="text-[10px] text-[var(--muted)] flex-shrink-0">
                                  + Select
                                </span>
                              )}
                            </div>
                          );
                        })}

                        {(!items || items.length === 0) && (
                          <div className="px-3 py-[10px] text-[11.5px] text-[var(--muted)] text-center">
                            No items yet — add one above
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Main dropdown panel ── */}
        {open && (
          <div className="cd-dropdown-panel absolute bg-white border border-[var(--border)] rounded-[var(--rs)] flex flex-col">
            <div className="overflow-y-auto flex-1">
              {groupedResults.length === 0 && (
                <div className="px-[14px] py-[18px] text-xs text-[var(--muted)] text-center">
                  No results — press <strong>Add</strong> to create "{search}"
                </div>
              )}

              {groupedResults.map(({ cat, items }) => {
                const selectedCount = items.filter((c) => isAdded(c)).length;
                const catQ = (catSearch[cat] || "").toLowerCase();
                const filteredItems = catQ
                  ? items.filter((i) => i.toLowerCase().includes(catQ))
                  : items;

                return (
                  <div key={cat} className="border-b border-[var(--border)]">
                    {/* Category header */}
                    <div
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setCatAddOpen((prev) => ({ ...prev, [cat]: false }));
                        setCatSearch((p) => ({ ...p, [cat]: "" }));
                        toggleCat(cat);
                      }}
                      className={`cd-cat-header flex items-center justify-between px-3 py-[7px] text-[11px] font-extrabold uppercase tracking-[0.55px] cursor-pointer ${
                        isCatExpanded(cat) ? "cd-cat-header-border" : ""
                      }`}
                    >
                      <span>{cat}</span>
                      <div className="flex items-center gap-[6px]">
                        {selectedCount > 0 && (
                          <span className="cd-count-badge w-[18px] h-[18px] rounded-full text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                            {selectedCount}
                          </span>
                        )}
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isCatExpanded(cat)) toggleCat(cat);
                            setCatAddOpen((prev) => ({ ...prev, [cat]: true }));
                            setCatSearch((p) => ({ ...p, [cat]: "" }));
                          }}
                          className="cd-cat-add-btn inline-flex items-center gap-[3px] px-[7px] py-[2px] rounded-[var(--rxs)] text-[10px] font-bold border-none cursor-pointer font-[inherit] flex-shrink-0"
                        >
                          <IC n="plus" s={9} c="#fff" /> Add
                        </button>
                        <span className="cd-chevron">
                          <IC
                            n={isCatExpanded(cat) ? "chevDown" : "chevRight"}
                            s={11}
                            c="var(--cd-accent)"
                          />
                        </span>
                      </div>
                    </div>

                    {/* catAddOpen inline row */}
                    {catAddOpen[cat] && (
                      <div className="flex items-center gap-[6px] px-[10px] py-[6px] border-b border-[var(--border)] bg-[#fafafa]">
                        <IC n="plus" s={11} c="var(--muted)" />
                        <input
                          autoFocus
                          placeholder={`Add new item in ${cat}…`}
                          value={catSearch[cat] || ""}
                          onChange={(e) =>
                            setCatSearch((p) => ({ ...p, [cat]: e.target.value }))
                          }
                          onMouseDown={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const val = (catSearch[cat] || "").trim();
                              if (!val) return;
                              const exists = (localCategories[cat] || []).some(
                                (i) => i.toLowerCase() === val.toLowerCase()
                              );
                              if (!exists) {
                                setLocalCategories((prev) => ({
                                  ...prev,
                                  [cat]: [...(prev[cat] || []), val],
                                }));
                              }
                              selectItem(val);
                              setCatSearch((p) => ({ ...p, [cat]: "" }));
                              setCatAddOpen((prev) => ({ ...prev, [cat]: false }));
                            }
                            if (e.key === "Escape") {
                              setCatAddOpen((prev) => ({ ...prev, [cat]: false }));
                              setCatSearch((p) => ({ ...p, [cat]: "" }));
                            }
                          }}
                          className="flex-1 border-none outline-none text-[11.5px] font-[inherit] text-[var(--text)] bg-transparent"
                        />
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const val = (catSearch[cat] || "").trim();
                            if (!val) return;
                            const exists = (localCategories[cat] || []).some(
                              (i) => i.toLowerCase() === val.toLowerCase()
                            );
                            if (!exists) {
                              setLocalCategories((prev) => ({
                                ...prev,
                                [cat]: [...(prev[cat] || []), val],
                              }));
                            }
                            selectItem(val);
                            setCatSearch((p) => ({ ...p, [cat]: "" }));
                            setCatAddOpen((prev) => ({ ...prev, [cat]: false }));
                          }}
                          className={`flex items-center p-[2px] bg-transparent border-none ${
                            catSearch[cat]?.trim()
                              ? "cursor-pointer opacity-100"
                              : "cursor-not-allowed opacity-30"
                          }`}
                          title="Add & select"
                        >
                          <IC n="check" s={13} c="var(--green)" />
                        </button>
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCatSearch((p) => ({ ...p, [cat]: "" }));
                            setCatAddOpen((prev) => ({ ...prev, [cat]: false }));
                          }}
                          className="flex items-center p-[2px] bg-transparent border-none cursor-pointer"
                          title="Close"
                        >
                          <IC n="x" s={10} c="var(--muted)" />
                        </button>
                      </div>
                    )}

                    {/* Expanded item list */}
                    {isCatExpanded(cat) && (
                      <div>
                        {filteredItems.length === 0 && (
                          <div className="px-[14px] py-[10px] text-[11.5px] text-[var(--muted)] text-center">
                            No match — press <strong>Add</strong> to add "{catSearch[cat]}"
                          </div>
                        )}

                        {filteredItems.map((item, ci) => {
                          const added = isAdded(item);
                          const isLast = ci === filteredItems.length - 1;
                          return (
                            <div
                              key={item}
                              className={`cd-item-row flex items-stretch border-b border-[var(--border)] ${
                                added ? "cd-item-row--added bg-[#f0fdf4]" : "bg-white"
                              }`}
                            >
                              {/* Tree connector */}
                              <div className="cd-tree-col">
                                <div
                                  className={`cd-tree-vline ${
                                    isLast ? "cd-tree-vline--last" : "cd-tree-vline--full"
                                  }`}
                                />
                                <div className="cd-tree-hline" />
                                <div
                                  className={`cd-tree-dot ${
                                    added ? "cd-tree-dot--added" : "cd-tree-dot--default"
                                  }`}
                                />
                              </div>

                              {/* Item row */}
                              <div
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  if (!added) selectItem(item);
                                }}
                                className={`flex-1 flex items-center justify-between py-[7px] pr-[14px] pl-1 gap-2 text-[12.5px] ${
                                  added
                                    ? "cursor-default text-[#15803d]"
                                    : "cursor-pointer text-[var(--text2)]"
                                }`}
                              >
                                <span
                                  className={`${
                                    added ? "font-semibold" : "font-normal"
                                  } text-[12.5px] whitespace-nowrap overflow-hidden text-ellipsis`}
                                >
                                  {item}
                                </span>

                                {added ? (
                                  <div className="flex items-center gap-[6px] flex-shrink-0">
                                    <span className="text-[10px] font-bold text-[#15803d]">
                                      ✓ Added
                                    </span>
                                    <span
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        removeItem(item);
                                      }}
                                      className="cd-remove-dot flex items-center justify-center w-[14px] h-[14px] rounded-full text-[9px] font-black cursor-pointer leading-none flex-shrink-0"
                                    >
                                      ✕
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-[var(--muted)] flex-shrink-0">
                                    + Select
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoricalDropdown;
export type { CategoricalDropdownProps };
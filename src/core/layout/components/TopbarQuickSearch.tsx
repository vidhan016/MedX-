import React, { useState, useRef, useEffect } from "react";
import styles from "../Header/Header.module.css";

// ── Types ──────────────────────────────────────────────────────────────────────

interface SearchResult {
  id: string;
  name: string;
  age: number;
  gender: string;
  mrn: string;
}

interface TopbarQuickSearchProps {
  /** Called when a result row is clicked */
  onSelectPatient?: (patient: SearchResult) => void;
  /** Async search function — receives query string, returns results */
  onSearch?: (query: string) => Promise<SearchResult[]>;
}

// ── Component ──────────────────────────────────────────────────────────────────

const TopbarQuickSearch: React.FC<TopbarQuickSearchProps> = ({
  onSelectPatient,
  onSearch,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || !onSearch) {
      setResults([]);
      setOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await onSearch(query);
        setResults(data);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleSelect = (patient: SearchResult) => {
    onSelectPatient?.(patient);
    setQuery("");
    setOpen(false);
    setResults([]);
  };

  return (
    <div ref={wrapRef} className={styles.searchWrap}>
      <div className={styles.searchBox}>
        {/* Search icon */}
        <svg
          width="15"
          height="15"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#9ca3af"
          strokeWidth={2}
          className={styles.searchIcon}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          className={styles.searchInput}
          placeholder="Search records, patients…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          autoComplete="off"
        />
        {loading && <span className={styles.searchSpinner} />}
      </div>

      {open && results.length > 0 && (
        <ul className={styles.searchDropdown} role="listbox">
          {results.map((patient) => (
            <li
              key={patient.id}
              role="option"
              className={styles.searchResult}
              onClick={() => handleSelect(patient)}
            >
              <div className={styles.searchResultAvatar}>
                {patient.name.charAt(0)}
              </div>
              <div className={styles.searchResultInfo}>
                <span className={styles.searchResultName}>{patient.name}</span>
                <span className={styles.searchResultMeta}>
                  {patient.age}y · {patient.gender} · {patient.mrn}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim() && results.length === 0 && !loading && (
        <div className={styles.searchEmpty}>No patients found</div>
      )}
    </div>
  );
};

export default TopbarQuickSearch;
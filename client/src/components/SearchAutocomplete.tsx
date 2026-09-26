import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ClockIcon, Loader2Icon, SearchIcon, XIcon } from "lucide-react";
import api from "../config/api";
import type { ProductSuggestion } from "../types";

const RECENT_KEY = "Instacart_recent_searches";
const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "₹";

const readRecent = (): string[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string").slice(0, 5) : [];
  } catch {
    return [];
  }
};

const writeRecent = (list: string[]) => {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    /* storage can be blocked (private mode) - recent searches are optional */
  }
};

type Row =
  | { kind: "product"; product: ProductSuggestion }
  | { kind: "recent"; text: string }
  | { kind: "search"; text: string };

/**
 * Search box with live suggestions (search-as-you-type), typo tolerance (done by the
 * server), keyboard navigation and recent searches.
 */
export default function SearchAutocomplete() {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestId = useRef(0);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [recent, setRecent] = useState<string[]>(readRecent);
  const [active, setActive] = useState(-1);

  const trimmed = query.trim();

  // Fetch suggestions 200ms after the user stops typing; ignore answers that arrive late.
  useEffect(() => {
    if (!trimmed) return;
    const id = ++requestId.current;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/suggestions?q=${encodeURIComponent(trimmed)}`);
        if (id === requestId.current) setSuggestions(data.suggestions || []);
      } catch {
        if (id === requestId.current) setSuggestions([]);
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [trimmed]);

  // Only show suggestions that belong to what is currently typed
  const visibleSuggestions = trimmed ? suggestions : [];
  const showSpinner = loading && trimmed.length > 0;

  // Close when clicking anywhere else
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const rows: Row[] = trimmed
    ? [
        ...visibleSuggestions.map((product): Row => ({ kind: "product", product })),
        { kind: "search", text: trimmed },
      ]
    : recent.map((text): Row => ({ kind: "recent", text }));

  const remember = (text: string) => {
    const next = [text, ...recent.filter((r) => r.toLowerCase() !== text.toLowerCase())].slice(0, 5);
    setRecent(next);
    writeRecent(next);
  };

  const close = () => {
    setOpen(false);
    setActive(-1);
    inputRef.current?.blur();
  };

  const runSearch = (text: string) => {
    const value = text.trim();
    if (!value) return;
    remember(value);
    navigate(`/search?q=${encodeURIComponent(value)}`);
    setQuery("");
    close();
  };

  const choose = (row: Row) => {
    if (row.kind === "product") {
      navigate(`/products/${row.product.id}`);
      setQuery("");
      close();
    } else {
      runSearch(row.text);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (active >= 0 && rows[active]) choose(rows[active]);
    else runSearch(query);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (rows.length ? (i + 1) % rows.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (rows.length ? (i <= 0 ? rows.length - 1 : i - 1) : -1));
    } else if (e.key === "Escape") {
      close();
    }
  };

  const clearRecent = () => {
    setRecent([]);
    writeRecent([]);
  };

  const showDropdown = open && (rows.length > 0 || showSpinner);

  return (
    <form onSubmit={onSubmit} className="hidden sm:flex flex-1 max-w-lg" role="search">
      <div ref={wrapperRef} className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
          autoComplete="off"
          placeholder="Search for groceries..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full pl-10 pr-9 py-2.5 rounded-full bg-zinc-100 border border-transparent focus:border-green-500 focus:bg-white outline-none transition-all"
        />

        {showSpinner ? (
          <Loader2Icon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 animate-spin" />
        ) : (
          query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
            >
              <XIcon className="size-4" />
            </button>
          )
        )}

        {showDropdown && (
          <div
            id="search-suggestions"
            role="listbox"
            className="absolute left-0 right-0 top-full mt-2 z-50 bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden"
          >
            {!trimmed && recent.length > 0 && (
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                  Recent searches
                </span>
                <button
                  type="button"
                  onClick={clearRecent}
                  className="text-xs text-zinc-400 hover:text-red-500"
                >
                  Clear
                </button>
              </div>
            )}

            {rows.map((row, i) => {
              const isActive = i === active;
              const base = `w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                isActive ? "bg-green-50" : "hover:bg-zinc-50"
              }`;

              if (row.kind === "product") {
                const p = row.product;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(row)}
                    className={base}
                  >
                    <img
                      src={p.image}
                      alt=""
                      className="size-10 rounded-lg object-cover border border-zinc-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-800 truncate">{p.name}</p>
                      <p className="text-xs text-zinc-500 capitalize">{p.category.replace(/-/g, " ")}</p>
                    </div>
                    <span className="text-sm font-semibold text-zinc-900 shrink-0">
                      {currency}
                      {p.price}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={`${row.kind}-${row.text}`}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(row)}
                  className={`${base} ${row.kind === "search" ? "border-t border-zinc-100" : ""}`}
                >
                  {row.kind === "recent" ? (
                    <ClockIcon className="size-4 text-zinc-400 shrink-0" />
                  ) : (
                    <SearchIcon className="size-4 text-green-600 shrink-0" />
                  )}
                  <span className="text-sm text-zinc-700 truncate">
                    {row.kind === "search" ? (
                      <>
                        See all results for <strong>"{row.text}"</strong>
                      </>
                    ) : (
                      row.text
                    )}
                  </span>
                </button>
              );
            })}

            {trimmed && !showSpinner && visibleSuggestions.length === 0 && (
              <p className="px-4 pt-3 pb-1 text-xs text-zinc-400">No quick matches. Try the full search below.</p>
            )}
          </div>
        )}
      </div>
    </form>
  );
}

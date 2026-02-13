"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";

import { useSearchRegion } from "@/features/search-region/model";

export default function RegionSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const { input, setInput, results: suggestions } = useSearchRegion();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = (id: number) => () => {
    router.push(`/${id}`);
    setShowSuggestions(false);
    setInput("");
  };

  useEffect(() => {
    const outsideRefClickHandler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", outsideRefClickHandler);
    return () => document.removeEventListener("click", outsideRefClickHandler);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [pathname]);

  return (
    <div ref={searchRef} className="flex-1 max-w-md mx-1 sm:mx-8 relative">
      <div className="relative">
        <label htmlFor="region-search" className="sr-only">
          주소 검색
        </label>
        <input
          ref={inputRef}
          id="region-search"
          type="search"
          placeholder="주소 검색"
          value={input}
          onFocus={() => input.trim() && setShowSuggestions(true)}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          autoComplete="off"
          autoFocus
          role="combobox"
          className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 border-none rounded-full py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 transition-all text-sm outline-none shadow-sm"
          aria-expanded={showSuggestions && suggestions.length > 0}
          aria-autocomplete="list"
          aria-controls={
            showSuggestions && input && suggestions.length > 0
              ? "region-suggestions"
              : undefined
          }
        />
        <Search
          className="absolute left-3.5 top-3 w-4 h-4 text-gray-500 dark:text-gray-400"
          aria-hidden
        />
      </div>

      {showSuggestions && input && suggestions.length > 0 && (
        <div
          id="region-suggestions"
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-150 origin-top"
        >
          <ul
            className="max-h-[320px] overflow-y-auto no-scrollbar py-2"
            role="listbox"
          >
            {suggestions.map((city) => (
              <li key={city.id} role="option" aria-selected={false}>
                <button
                  type="button"
                  onClick={handleClick(city.id)}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                >
                  <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-gray-700 transition-colors hidden sm:inline">
                    <MapPin
                      className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400"
                      aria-hidden
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {city.name}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

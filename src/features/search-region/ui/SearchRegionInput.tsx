'use client';

import { useRouter } from "next/navigation";
import { useSearchRegion } from "../model/useSearchRegion";
import { useEffect, useRef, useState } from "react";
import { MapPin, Search } from "lucide-react";

export default function RegionSearch() {
  const router = useRouter();
  const { input, setInput, results: suggestions } = useSearchRegion(250);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleClick = (id: number) => () => {
    router.push(`/${id}`);
    setShowSuggestions(false);
    setInput('');
  };

  useEffect(() => {
    const outsideRefClickHandler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', outsideRefClickHandler);
    return () => document.removeEventListener('click', outsideRefClickHandler);
  }, []);

  return (
    <div ref={searchRef} className="flex-1 max-w-md mx-1 sm:mx-8 relative">
      <div className="relative">
        <input
          type="text"
          placeholder="주소 검색"
          value={input}
          onFocus={() => input.trim() && setShowSuggestions(true)}
          onChange={(e) => {
            setInput(e.target.value); 
            setShowSuggestions(true);
          }}
          className="w-full bg-gray-100 border-none rounded-full py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 transition-all text-sm outline-none shadow-sm"
        />
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
      </div>

      {showSuggestions && input && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-150 origin-top">
          <ul className="max-h-[320px] overflow-y-auto no-scrollbar py-2">
            {suggestions.map((city) => (
              <li key={city.id}>
                <button
                  onClick={handleClick(city.id)}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors group"
                >
                  <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors hidden sm:inline">
                    <MapPin className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">{city.name}</span>
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

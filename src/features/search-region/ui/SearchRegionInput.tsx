'use client';

import { useRouter } from "next/navigation";
import { useSearchRegion } from "../model/useSearchRegion";

export default function RegionSearch() {
  const router = useRouter();
  const { input, setInput, results, isLoading } = useSearchRegion();

  const handleClick = (id: number) => () => {
    router.push(`/${id}`);
  };

  return (
    <div className="w-full relative">
      <input
        type="text"
        value={input}
        placeholder="Enter a city"
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="w-full max-h-40 overflow-y-auto absolute top-full left-0">
        {isLoading && <p>검색 중...</p>}
        <ul>
          {results.map((city) => (
            <li
              key={city.id}
              className="cursor-pointer"
              onClick={handleClick(city.id)}
            >
              {city.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

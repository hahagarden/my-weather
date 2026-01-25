import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRegionsByQuery } from "@/entities/region/api/http";
import { regionKeys } from "@/entities/region/model/queryKeys";

export function useSearchRegion(debounceMs = 150) {
  const [input, setInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // 디바운스 처리
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedQuery(input);
    }, debounceMs);

    return () => clearTimeout(id);
  }, [input, debounceMs]);

  const { data: results = [], isLoading } = useQuery({
    queryKey: regionKeys.search(debouncedQuery),
    queryFn: () => getRegionsByQuery(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  return {
    input,
    setInput,
    results,
    isLoading,
  };
}

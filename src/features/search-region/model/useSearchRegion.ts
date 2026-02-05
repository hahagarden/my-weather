import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { regionSearchQuery } from "@/entities/region/model";

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
    ...regionSearchQuery(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    placeholderData: (prev) => prev,
  });

  return {
    input,
    setInput,
    results,
    isLoading,
  };
}

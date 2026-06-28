import { useState, useEffect, useTransition } from "react";
import { searchProductsByKeyword } from "@/actions/search";
import type { ProductNode } from "@/lib/graphql";

interface UseProductSearchResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: ProductNode[];
  isPending: boolean;
}

export function useProductSearch(): UseProductSearchResult {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProductNode[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(() => {
      let resolve: () => void;
      const p = new Promise<void>((r) => { resolve = r; });
      
      startTransition(() => {
        searchProductsByKeyword(searchQuery).then((results) => {
          if (!cancelled) {
            setSearchResults(results);
          }
          resolve();
        });
        return p;
      });
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isPending,
  };
}

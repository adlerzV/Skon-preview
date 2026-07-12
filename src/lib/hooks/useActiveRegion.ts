"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";

export const KNOWN_REGIONS = ["eu", "us", "tr"];
const DEFAULT_REGION = "eu";

export function useActiveRegion() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return useMemo(() => {
    if (!isMounted || !pathname) {
      return { region: DEFAULT_REGION, pathnameWithoutRegion: pathname ?? "" };
    }

    const segments = pathname.split("/").filter(Boolean);
    const hasRegion = KNOWN_REGIONS.includes(segments[0]?.toLowerCase());

    let region = DEFAULT_REGION;
    if (hasRegion) {
      region = segments[0];
    } else if (typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|;\s*)store_region=([^;]+)/);
      if (match && KNOWN_REGIONS.includes(match[1].toLowerCase())) {
        region = match[1];
      }
    }

    return {
      region,
      pathnameWithoutRegion: hasRegion ? `/${segments.slice(1).join("/")}` : pathname,
    };
  }, [isMounted, pathname]);
}

export function buildRegionHref(region: string, link: string): string {
  const clean = link.startsWith("/") ? link : `/${link}`;
  return `/${region}${clean}`;
}
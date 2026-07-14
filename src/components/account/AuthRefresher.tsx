"use client";

import { useEffect, useRef } from "react";
import { getClientCookie } from "@/lib/cookies";
import { LOGGED_IN_COOKIE } from "@/lib/auth/constants";

const REFRESH_INTERVAL_MS = 4 * 60 * 60 * 1000;

async function refreshToken() {
  try {
    await fetch("/api/auth/refresh", { method: "POST" });
  } catch {
  }
}

export default function AuthRefresher() {
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    const isLoggedIn = () => getClientCookie(LOGGED_IN_COOKIE) === "1";

    const safeRefresh = async () => {
      if (!isLoggedIn() || isRefreshingRef.current) return;
      isRefreshingRef.current = true;
      await refreshToken();
      isRefreshingRef.current = false;
    };

    safeRefresh();

    const interval = setInterval(safeRefresh, REFRESH_INTERVAL_MS);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") safeRefresh();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return null;
}
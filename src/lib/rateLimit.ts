// src/lib/rateLimit.ts
interface RateLimitEntry { count: number; resetAt: number; }

const store = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Rate limiter در حافظه — برای دیپلوی تک‌نمونه‌ای (VPS/PM2) کافیه.
 * روی سرورلس (Vercel و مشابه) چون هر ریکوئست ممکنه instance متفاوت باشه،
 * این محدودیت واقعی اعمال نمی‌شه — آینده برای پروداکشن سرورلس از Upstash Redis استفاده کن.
 */
export function checkRateLimit(key: string, { max, windowMs }: { max: number; windowMs: number }): boolean {
  const now = Date.now();
  cleanup(now);
  const entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}
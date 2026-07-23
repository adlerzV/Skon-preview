import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

interface RateLimitEntry { count: number; resetAt: number; }

const memoryStore = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupMemory(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, entry] of memoryStore) {
    if (now > entry.resetAt) memoryStore.delete(key);
  }
}

function checkMemoryRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  cleanupMemory(now);
  const entry = memoryStore.get(key);
  if (!entry || now > entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

const hasUpstash = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = hasUpstash
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

const limiterCache = new Map<string, Ratelimit>();

function getLimiter(max: number, windowMs: number): Ratelimit {
  const cacheKey = `${max}:${windowMs}`;
  const cached = limiterCache.get(cacheKey);
  if (cached) return cached;

  const limiter = new Ratelimit({
    redis: redis!,
    limiter: Ratelimit.slidingWindow(max, `${Math.max(1, Math.round(windowMs / 1000))} s`),
    analytics: false,
    prefix: "btl_ratelimit",
  });

  limiterCache.set(cacheKey, limiter);
  return limiter;
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function checkRateLimit(key: string, { max, windowMs }: { max: number; windowMs: number }): Promise<boolean> {
  if (!redis) {
    return checkMemoryRateLimit(key, max, windowMs);
  }

  try {
    const { success } = await getLimiter(max, windowMs).limit(key);
    return success;
  } catch (error) {
    console.error("Upstash rate limit error, failing open to memory:", error);
    return checkMemoryRateLimit(key, max, windowMs);
  }
}
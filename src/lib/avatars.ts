import "server-only";
import { promises as fs } from "fs";
import path from "path";

const AVATARS_DIR = path.join(process.cwd(), "public", "avatars");
const ALLOWED_EXT = [".webp", ".png", ".jpg", ".jpeg"];
const CACHE_TTL_MS = 5 * 60 * 1000; 

let cachedAvatars: string[] | null = null;
let cachedAt = 0;

async function readAvatarsFromDisk(): Promise<string[]> {
  try {
    const files = await fs.readdir(AVATARS_DIR);
    return files
      .filter((f) => ALLOWED_EXT.includes(path.extname(f).toLowerCase()))
      .sort()
      .map((f) => `/avatars/${f}`);
  } catch {
    return [];
  }
}

export async function listAvatars(): Promise<string[]> {
  const now = Date.now();
  if (cachedAvatars && now - cachedAt < CACHE_TTL_MS) {
    return cachedAvatars;
  }
  const avatars = await readAvatarsFromDisk();
  cachedAvatars = avatars;
  cachedAt = now;
  return avatars;
}

export async function getDefaultAvatarUrl(): Promise<string | null> {
  const avatars = await listAvatars();
  return avatars[0] ?? null;
}

function hashToIndex(seed: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % length;
}

export async function getAvatarForSeed(seed?: string | number | null): Promise<string | null> {
  const avatars = await listAvatars();
  if (avatars.length === 0) return null;
  if (!seed) return avatars[0];
  return avatars[hashToIndex(String(seed), avatars.length)];
}

export async function resolveAvatarUrl(
  avatarUrl?: string | null,
  seed?: string | number | null
): Promise<string | null> {
  if (avatarUrl) return avatarUrl;
  return getAvatarForSeed(seed);
}

export async function resolveAvatarForAuthor(
  name?: string | null,
  avatarUrl?: string | null
): Promise<string | null> {
  if (avatarUrl) return avatarUrl;
  return getAvatarForSeed(name);
}
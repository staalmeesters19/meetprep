const DAILY_LIMIT = parseInt(process.env.RATE_LIMIT_PER_DAY || "3");

// Simple in-memory rate limiter (for MVP — upgrade to Vercel KV later)
const store = new Map<string, { count: number; date: string }>();

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
} {
  const today = new Date().toISOString().split("T")[0];
  const key = `${ip}:${today}`;
  const entry = store.get(key);

  if (!entry || entry.date !== today) {
    store.set(key, { count: 1, date: today });
    return { allowed: true, remaining: DAILY_LIMIT - 1 };
  }

  if (entry.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  store.set(key, entry);
  return { allowed: true, remaining: DAILY_LIMIT - entry.count };
}

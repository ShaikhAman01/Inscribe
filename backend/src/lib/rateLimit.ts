import type { Context, MiddlewareHandler } from "hono";

// Per-isolate and best effort: it stops scripted bursts, not a distributed attacker.
const buckets = new Map<string, { count: number; resetAt: number }>();

const clientIp = (c: Context) => c.req.header("cf-connecting-ip") ?? "local";

export const rateLimit =
  (name: string, limit: number, key: (c: Context) => string = clientIp, windowMs = 60_000): MiddlewareHandler =>
  async (c, next) => {
    const now = Date.now();
    if (buckets.size > 10_000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    }
    const id = `${name}:${key(c)}`;
    const bucket = buckets.get(id);
    if (!bucket || bucket.resetAt <= now) {
      buckets.set(id, { count: 1, resetAt: now + windowMs });
    } else if (++bucket.count > limit) {
      c.header("Retry-After", String(Math.ceil((bucket.resetAt - now) / 1000)));
      return c.json({ error: "Too many requests, please slow down" }, 429);
    }
    await next();
  };

export const byUser = (c: Context) => (c.get("userId") as string | undefined) ?? clientIp(c);

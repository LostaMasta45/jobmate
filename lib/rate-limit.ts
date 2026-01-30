import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if Upstash is configured
const isUpstashConfigured =
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN;

// Create Redis client only if configured
const redis = isUpstashConfigured
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
    : null;

// Rate limiters for different use cases
export const aiRateLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute for AI
        analytics: true,
        prefix: "ratelimit:ai",
    })
    : null;

export const apiRateLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 requests per minute for general API
        analytics: true,
        prefix: "ratelimit:api",
    })
    : null;

export const authRateLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 login attempts per minute
        analytics: true,
        prefix: "ratelimit:auth",
    })
    : null;

/**
 * Check rate limit for a given identifier
 * Returns { success: true } if allowed, { success: false, reset: Date } if blocked
 */
export async function checkRateLimit(
    limiter: Ratelimit | null,
    identifier: string
): Promise<{ success: boolean; reset?: number; remaining?: number }> {
    // If Upstash not configured, allow all requests (development mode)
    if (!limiter) {
        return { success: true };
    }

    const result = await limiter.limit(identifier);

    return {
        success: result.success,
        reset: result.reset,
        remaining: result.remaining,
    };
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    const realIP = request.headers.get("x-real-ip");

    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    return "127.0.0.1";
}

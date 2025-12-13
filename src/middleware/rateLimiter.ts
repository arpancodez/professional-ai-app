/**
 * API Rate Limiting Middleware
 * Implements token bucket algorithm for API request throttling
 */

import { Request, Response, NextFunction } from 'express';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // in milliseconds
  message?: string;
}

interface UserRateLimit {
  tokens: number;
  resetTime: number;
}

const userLimits = new Map<string, UserRateLimit>();

/**
 * Rate limiter middleware factory
 */
export const createRateLimiter = (config: RateLimitConfig) => {
  const { maxRequests, windowMs, message = 'Too many requests' } = config;

  return (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id || req.ip;
    const now = Date.now();

    // Initialize or get user rate limit
    let userLimit = userLimits.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
      userLimit = {
        tokens: maxRequests,
        resetTime: now + windowMs,
      };
      userLimits.set(userId, userLimit);
    }

    // Check if request is allowed
    if (userLimit.tokens > 0) {
      userLimit.tokens--;
      next();
    } else {
      const resetIn = Math.ceil((userLimit.resetTime - now) / 1000);
      res.status(429).json({
        error: message,
        retryAfter: resetIn,
      });
    }
  };
};

/**
 * Preset rate limiters
 */
export const rateLimiters = {
  // Strict limit for auth endpoints
  auth: createRateLimiter({
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many authentication attempts',
  }),

  // Standard limit for API endpoints
  api: createRateLimiter({
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'API rate limit exceeded',
  }),

  // Generous limit for premium endpoints
  premium: createRateLimiter({
    maxRequests: 1000,
    windowMs: 15 * 60 * 1000, // 15 minutes
  }),
};

/**
 * Clean up expired rate limit entries
 */
setInterval(() => {
  const now = Date.now();
  for (const [userId, limit] of userLimits.entries()) {
    if (now > limit.resetTime) {
      userLimits.delete(userId);
    }
  }
}, 60 * 1000); // Clean up every minute

export default createRateLimiter;

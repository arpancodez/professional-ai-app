const rateLimit = require('express-rate-limit');

// Configure rate limiting to prevent API abuse
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs, // Time window in milliseconds
    max, // Maximum number of requests per window
    message: {
      error: 'Too many requests from this IP',
      retryAfter: 'Please try again later'
    },
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests, please slow down',
        retryAfter: res.getHeader('Retry-After')
      });
    }
  });
};

// Strict rate limiter for chat endpoint
const chatRateLimiter = createRateLimiter(60 * 1000, 20); // 20 requests per minute

// Lenient rate limiter for health checks
const healthRateLimiter = createRateLimiter(60 * 1000, 100); // 100 requests per minute

module.exports = {
  chatRateLimiter,
  healthRateLimiter,
  createRateLimiter
};

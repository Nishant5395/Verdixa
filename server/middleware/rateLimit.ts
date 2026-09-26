import rateLimit from "express-rate-limit";

const common = {
  standardHeaders: "draft-8" as const,
  legacyHeaders: false,
};

// General protection for the whole API (per IP).
export const apiLimiter = rateLimit({
  ...common,
  windowMs: 60 * 1000,
  limit: 300,
  message: { message: "Too many requests. Please slow down and try again shortly." },
});

// Login / register: only FAILED attempts count, so normal users are never blocked.
export const authLimiter = rateLimit({
  ...common,
  windowMs: 15 * 60 * 1000,
  limit: 20,
  skipSuccessfulRequests: true,
  message: { message: "Too many failed attempts. Please try again in 15 minutes." },
});

// Delivery OTP entry: stops a rider from guessing the 6-digit code.
export const otpLimiter = rateLimit({
  ...common,
  windowMs: 15 * 60 * 1000,
  limit: 15,
  skipSuccessfulRequests: true,
  message: { message: "Too many incorrect OTP attempts. Please wait 15 minutes." },
});

// Chat support: each message costs real API tokens, so this is tighter than the
// general API limiter. Counts every call (not just failed ones) since cost is
// incurred either way.
export const chatLimiter = rateLimit({
  ...common,
  windowMs: 10 * 60 * 1000,
  limit: 30,
  message: { message: "You've sent a lot of messages - please wait a few minutes and try again." },
});

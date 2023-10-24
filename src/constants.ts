const EXPRESS_RATE_LIMITER_OPTS = {
  windowMs: 1000,
  limit: 10,
  standardHeaders: true,
  skipFailedRequests: true,
};

export {
  EXPRESS_RATE_LIMITER_OPTS,
};

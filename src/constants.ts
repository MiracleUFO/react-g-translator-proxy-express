const TOO_MANY_REQUESTS = 'Too Many Requests';

const EXPRESS_RATE_LIMITER_OPTS = {
  windowMs: 1 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  skipFailedRequests: false,
};

export {
  TOO_MANY_REQUESTS,
  EXPRESS_RATE_LIMITER_OPTS,
};

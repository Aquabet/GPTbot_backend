const failedLoginAttempts = {}; // { ip: { count: number, lastAttempt: Date } }

const loginLimiter = (req, res, next) => {
  const ip = req.ip;

  // Initialize failed login attempts tracking
  if (!failedLoginAttempts[ip]) {
    failedLoginAttempts[ip] = { count: 0, lastAttempt: null };
  }

  const { count, lastAttempt } = failedLoginAttempts[ip];
  const now = new Date();

  // Check if the user has exceeded the maximum number of login attempts
  if (count >= 5 && now - lastAttempt < 15 * 60 * 1000) { // 15 minutes
    return res.status(429).json({
      error: 'Too many login attempts. Please try again after 15 minutes.',
    });
  }

  // Pass the failed login tracker to the request object
  req.failedLoginTracker = {
    increment: () => {
      failedLoginAttempts[ip].count += 1;
      failedLoginAttempts[ip].lastAttempt = new Date();
    },
    reset: () => {
      failedLoginAttempts[ip] = { count: 0, lastAttempt: null };
    },
  };

  next();
};

module.exports = {
  loginLimiter,
};

// backend/src/config/jwtConfig.ts

// It's crucial to keep your JWT secret key secure and not hardcoded in production.
// Use environment variables for this.
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-super-secret-key-for-dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d'; // e.g., 1h, 7d, 30d

if (process.env.NODE_ENV === 'production' && JWT_SECRET === 'your-default-super-secret-key-for-dev') {
  console.warn(
    'WARNING: JWT_SECRET is using the default insecure value in a production-like environment. ' +
    'Please set a strong, unique JWT_SECRET environment variable.'
  );
}

export default {
  secret: JWT_SECRET,
  expiresIn: JWT_EXPIRES_IN,
};

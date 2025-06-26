// backend/src/utils/jwtUtils.ts
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig';
import { User } from '../models/User'; // Assuming User model for payload typing

export interface AuthTokenPayload {
  userId: string;
  email: string;
  // You can add other non-sensitive user details if needed
}

/**
 * Generates a JSON Web Token (JWT).
 * @param user The user object (or relevant parts) to include in the token payload.
 * @returns The generated JWT string.
 */
export const generateToken = (user: Pick<User, 'id' | 'email'>): string => {
  const payload: AuthTokenPayload = {
    userId: user.id,
    email: user.email,
  };

  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

/**
 * Verifies a JSON Web Token (JWT).
 * @param token The JWT string to verify.
 * @returns The decoded payload if the token is valid, otherwise throws an error.
 */
export const verifyToken = (token: string): AuthTokenPayload => {
  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as AuthTokenPayload;
    return decoded;
  } catch (error) {
    console.error('JWT Verification Error:', error);
    // Re-throw or handle specific errors like TokenExpiredError, JsonWebTokenError
    throw error;
  }
};

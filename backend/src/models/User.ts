// backend/src/models/User.ts
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  passwordHash: string; // Store hashed password only
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
}

// In a real application, these methods might be part of a User class or a service.
// For now, they are utility functions related to the User model.

/**
 * Hashes a plain text password.
 * @param password The plain text password.
 * @returns A promise that resolves to the hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compares a plain text password with a hashed password.
 * @param plainPassword The plain text password to check.
 * @param hashedPassword The hashed password from the database.
 * @returns A promise that resolves to true if passwords match, false otherwise.
 */
export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

// Example of how you might create a mock user (for conceptual use, not for database interaction yet)
// This would typically be handled by a UserService that interacts with a database.
export const createMockUser = async (data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash'>> & { password?: string }): Promise<User> => {
  const now = new Date();
  const passwordHash = data.password ? await hashPassword(data.password) : await hashPassword('defaultPassword123');

  if (!data.email) {
    throw new Error('Email is required to create a mock user.');
  }

  return {
    id: `user-${Math.random().toString(36).substring(2, 15)}`, // Simple mock ID
    email: data.email,
    passwordHash,
    firstName: data.firstName,
    lastName: data.lastName,
    createdAt: now,
    updatedAt: now,
  };
};

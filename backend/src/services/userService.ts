// backend/src/services/userService.ts
import User, { IUser, hashPasswordUtility } from '../models/User'; // Import Mongoose User model and IUser interface

// DTO for creating a user, expecting plain text password
export interface CreateUserDTO {
  email: string;
  password?: string; // Password from client, will be hashed
  firstName?: string;
  lastName?: string;
}

/**
 * Creates a new user in the database.
 * Hashes the password before saving.
 * @param userData Data for the new user, including plain text password.
 * @returns The newly created user object (Mongoose document).
 */
export const createUser = async (userData: CreateUserDTO): Promise<IUser> => {
  console.log(`[UserService Mongoose] Attempting to create user with email: ${userData.email}`);
  if (!userData.password || !userData.email) {
    throw new Error('Email and password are required to create a user.');
  }

  // Check if user already exists (controller should ideally do this first, but good to double check)
  const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
  if (existingUser) {
    // Note: This error might be better handled by the controller to return a specific HTTP status.
    throw new Error('User with this email already exists.');
  }

  const passwordHash = await hashPasswordUtility(userData.password);

  const newUser = new User({
    email: userData.email,
    passwordHash, // Store the hashed password
    firstName: userData.firstName,
    lastName: userData.lastName,
  });

  await newUser.save();
  console.log(`[UserService Mongoose] User created with ID: ${newUser._id}, Email: ${newUser.email}`);
  return newUser;
};

/**
 * Finds a user by their email address from the database.
 * @param email The email address to search for.
 * @returns The user Mongoose document if found, otherwise null.
 */
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  console.log(`[UserService Mongoose] Searching for user by email: ${email}`);
  // Mongoose queries are case-sensitive by default for findOne unless schema specifies otherwise or regex is used.
  // For email, it's common to store and query in lowercase.
  const user = await User.findOne({ email: email.toLowerCase() }).exec();
  if (user) {
    console.log(`[UserService Mongoose] User found with email ${email}: ID ${user._id}`);
  } else {
    console.log(`[UserService Mongoose] User with email ${email} not found.`);
  }
  return user;
};

/**
 * Finds a user by their ID from the database.
 * @param userId The ID of the user to find.
 * @returns The user Mongoose document if found, otherwise null.
 */
export const findUserById = async (userId: string): Promise<IUser | null> => {
  console.log(`[UserService Mongoose] Searching for user by ID: ${userId}`);
  // Validate if userId is a valid ObjectId before querying if necessary, though Mongoose handles some cases.
  if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.warn(`[UserService Mongoose] Invalid ObjectId format for userId: ${userId}`);
      return null;
  }
  const user = await User.findById(userId).exec();
  if (user) {
    console.log(`[UserService Mongoose] User found with ID ${userId}: Email ${user.email}`);
  } else {
    console.log(`[UserService Mongoose] User with ID ${userId} not found.`);
  }
  return user;
};


// Helper for clearing users during tests (if using a test database)
export const _clearUsersForTesting = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'test') {
    console.log('[UserService Mongoose Test] Clearing all users from database.');
    await User.deleteMany({});
  } else {
    console.warn('[UserService Mongoose Test] _clearUsersForTesting should only be called in test environments.');
  }
};
// Import mongoose for ObjectId validation
import mongoose from 'mongoose';

// backend/src/services/userService.ts
import { User, hashPassword, createMockUser as _createMockUser } from '../models/User'; // Using _createMockUser to avoid name clash if needed

// This is a placeholder service. In a real application, this service would
// interact with a database (e.g., using an ORM like Prisma, TypeORM, or Mongoose).

// Mock database (in-memory array for now for Users)
let mockUsersDB: User[] = [];

// Seed with a couple of mock users for testing (optional)
const seedMockUsers = async () => {
  if (mockUsersDB.length === 0 && process.env.NODE_ENV !== 'production') { // Avoid seeding in prod
    console.log('[UserService] Seeding mock users...');
    try {
      const user1 = await _createMockUser({ email: 'test@example.com', password: 'password123', firstName: 'Test', lastName: 'User' });
      const user2 = await _createMockUser({ email: 'johndoe@example.com', password: 'securePassword', firstName: 'John' });
      mockUsersDB.push(user1, user2);
      console.log(`[UserService] Mock users seeded: ${mockUsersDB.map(u => u.email).join(', ')}`);
    } catch (error) {
      console.error('[UserService] Error seeding mock users:', error);
    }
  }
};
// Call seeding when service is loaded (for dev/test purposes)
seedMockUsers();


interface CreateUserDTO {
  email: string;
  password?: string; // Password is required for actual creation, but might be omitted if pre-hashed
  firstName?: string;
  lastName?: string;
  // rawPassword is used if password field is expected to be already hashed by caller
  // This DTO is flexible to allow for different scenarios, but typically password would be plain text here.
}

/**
 * Creates a new user.
 * Hashes the password before "saving".
 * @param userData Data for the new user, including plain text password.
 * @returns The newly created user object (without plain password).
 */
export const createUser = async (userData: CreateUserDTO): Promise<User> => {
  console.log(`[UserService] Attempting to create user with email: ${userData.email}`);
  if (!userData.password && !userData.email) { // Basic check
    throw new Error('Email and password are required to create a user.');
  }

  const hashedPassword = await hashPassword(userData.password || 'temppass'); // Ensure password is not undefined

  const newUser: User = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, // More unique mock ID
    email: userData.email,
    passwordHash: hashedPassword,
    firstName: userData.firstName,
    lastName: userData.lastName,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Check if user already exists (simple check for mock DB)
  if (mockUsersDB.some(u => u.email === newUser.email)) {
    // This check should ideally be in the controller before calling create,
    // but included here for service-level robustness with mock DB.
    console.warn(`[UserService] Attempt to create user with existing email: ${newUser.email}. This should be caught earlier.`);
    throw new Error('User with this email already exists.'); // Or handle as per application logic
  }

  mockUsersDB.push(newUser);
  console.log(`[UserService] User created with ID: ${newUser.id}, Email: ${newUser.email}`);

  // Return a copy of the user object without the passwordHash for security if needed by some callers,
  // but generally, service might return the full object. Controller decides what to send to client.
  // For now, returning the full User object as defined.
  return newUser;
};

/**
 * Finds a user by their email address.
 * @param email The email address to search for.
 * @returns The user object if found, otherwise null.
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  console.log(`[UserService] Searching for user by email: ${email}`);
  const user = mockUsersDB.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    console.log(`[UserService] User found with email ${email}:`, user.id);
    return { ...user }; // Return a copy
  }
  console.log(`[UserService] User with email ${email} not found.`);
  return null;
};

/**
 * Finds a user by their ID.
 * @param userId The ID of the user to find.
 * @returns The user object if found, otherwise null.
 */
export const findUserById = async (userId: string): Promise<User | null> => {
  console.log(`[UserService] Searching for user by ID: ${userId}`);
  const user = mockUsersDB.find(u => u.id === userId);
  if (user) {
    console.log(`[UserService] User found with ID ${userId}:`, user.email);
    return { ...user }; // Return a copy
  }
  console.log(`[UserService] User with ID ${userId} not found.`);
  return null;
};

// Function to clear mock users (useful for testing)
export const _clearMockUsers = async (): Promise<void> => {
  if (process.env.NODE_ENV !== 'test') {
    console.warn("[UserService] _clearMockUsers should only be called in test environments.");
    // return; // Uncomment to restrict usage
  }
  console.log("[UserService] Clearing all mock users from in-memory DB.");
  mockUsersDB = [];
};

// Function to get all mock users (useful for debugging/testing)
export const _getAllMockUsers = async (): Promise<User[]> => {
   if (process.env.NODE_ENV !== 'test') {
    console.warn("[UserService] _getAllMockUsers should ideally be used in test/dev environments.");
  }
  return [...mockUsersDB];
}

// backend/src/services/userService.ts
import User, { IUser, hashPasswordUtility } from '../models/User'; // Import Mongoose User model and IUser interface
import Item from '../models/Item'; // Import Item model
import Reminder from '../models/Reminder'; // Import Reminder model
import ServiceHistory from '../models/ServiceHistory'; // Import ServiceHistory model
import PushToken from '../models/PushToken'; // Import PushToken model
import Message from '../models/Message'; // Import Message model

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

/**
 * Deletes a user and all associated data (items, reminders, service history, push tokens, messages).
 * @param userId The ID of the user to delete.
 * @returns True if deletion was successful, false otherwise.
 */
export const deleteUser = async (userId: string): Promise<boolean> => {
  console.log(`[UserService Mongoose] Attempting to delete user with ID: ${userId}`);
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.warn(`[UserService Mongoose] Invalid ObjectId format for userId: ${userId} in deleteUser.`);
    return false;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Delete associated Items
    const deletedItemsResult = await Item.deleteMany({ userId: new mongoose.Types.ObjectId(userId) }, { session });
    console.log(`[UserService Mongoose] Deleted ${deletedItemsResult.deletedCount} items for user ${userId}.`);

    // 2. Delete associated Reminders
    const deletedRemindersResult = await Reminder.deleteMany({ userId: new mongoose.Types.ObjectId(userId) }, { session });
    console.log(`[UserService Mongoose] Deleted ${deletedRemindersResult.deletedCount} reminders for user ${userId}.`);

    // 3. Delete associated Service History entries (assuming they are linked to items, which are linked to users)
    // This is a bit tricky. If ServiceHistory entries are only linked to Items, deleting Items will cascade.
    // If ServiceHistory entries can exist independently or are directly linked to a user, they need to be deleted here.
    // For now, assuming ServiceHistory is linked to Item, so deleting items handles this.
    // If not, you'd need to fetch item IDs first, then delete service history for those items.
    // Example: const itemIds = await Item.find({ userId: new mongoose.Types.ObjectId(userId) }, '_id', { session });
    // await ServiceHistory.deleteMany({ itemId: { $in: itemIds.map(item => item._id) } }, { session });

    // 4. Delete associated Push Tokens
    const deletedPushTokensResult = await PushToken.deleteMany({ userId: new mongoose.Types.ObjectId(userId) }, { session });
    console.log(`[UserService Mongoose] Deleted ${deletedPushTokensResult.deletedCount} push tokens for user ${userId}.`);

    // 5. Delete associated Messages (where user is sender or receiver)
    const deletedMessagesResult = await Message.deleteMany({
      $or: [
        { senderId: new mongoose.Types.ObjectId(userId) },
        { receiverId: new mongoose.Types.ObjectId(userId) }
      ]
    }, { session });
    console.log(`[UserService Mongoose] Deleted ${deletedMessagesResult.deletedCount} messages for user ${userId}.`);

    // 6. Delete the User itself
    const userDeleteResult = await User.deleteOne({ _id: new mongoose.Types.ObjectId(userId) }, { session });

    if (userDeleteResult.deletedCount && userDeleteResult.deletedCount > 0) {
      await session.commitTransaction();
      console.log(`[UserService Mongoose] User ${userId} and all associated data deleted successfully.`);
      return true;
    } else {
      await session.abortTransaction();
      console.log(`[UserService Mongoose] User ${userId} not found or deletion failed.`);
      return false;
    }
  } catch (error) {
    await session.abortTransaction();
    console.error(`[UserService Mongoose] Error during user deletion transaction for ${userId}:`, error);
    throw error; // Re-throw the error for the caller to handle
  } finally {
    session.endSession();
  }
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

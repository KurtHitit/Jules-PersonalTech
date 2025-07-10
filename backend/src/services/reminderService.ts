// backend/src/services/reminderService.ts
import Reminder, { IReminder } from '../models/Reminder';
import mongoose from 'mongoose';
import { sendPushNotification } from './pushNotificationService';

// DTO for creating a reminder
export interface CreateReminderDTO {
  title: string;
  notes?: string;
  dueDate: Date;
  isRecurring?: boolean;
  recurrencePattern?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  itemId?: string; // Optional: ID of the item this reminder is associated with
}

// DTO for updating a reminder
export type UpdateReminderDTO = Partial<CreateReminderDTO>;

/**
 * Creates a new reminder for a specific user.
 * @param reminderData Data for the new reminder.
 * @param userId The ID of the user creating the reminder.
 * @returns The newly created reminder document.
 */
export const createReminder = async (reminderData: CreateReminderDTO, userId: string): Promise<IReminder> => {
  console.log(`[ReminderService] Creating reminder for user ${userId}: ${reminderData.title}`);

  const newReminder = new Reminder({
    ...reminderData,
    userId: new mongoose.Types.ObjectId(userId),
    // Ensure dueDate is a Date object
    dueDate: new Date(reminderData.dueDate),
    // Set isRecurring based on whether recurrencePattern is provided
    isRecurring: !!reminderData.recurrencePattern && reminderData.recurrencePattern !== 'none',
  });

  await newReminder.save();
  console.log(`[ReminderService] Reminder created with ID: ${newReminder._id}`);

  // Send a push notification
  await sendPushNotification(userId, {
    title: 'New Reminder Created',
    body: `Your reminder "${newReminder.title}" is set for ${newReminder.dueDate.toLocaleDateString()}`,
  });

  return newReminder;
};

/**
 * Retrieves all reminders for a specific user.
 * @param userId The ID of the user whose reminders are to be retrieved.
 * @returns A list of reminder documents.
 */
export const getRemindersByUserId = async (userId: string): Promise<IReminder[]> => {
  console.log(`[ReminderService] Fetching reminders for user ID: ${userId}`);
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.warn(`[ReminderService] Invalid ObjectId for userId: ${userId} in getRemindersByUserId`);
    return [];
  }
  const reminders = await Reminder.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ dueDate: 1 }).exec();
  console.log(`[ReminderService] Found ${reminders.length} reminders for user ${userId}.`);
  return reminders;
};

/**
 * Retrieves a single reminder by its ID, ensuring it belongs to the specified user.
 * @param reminderId The ID of the reminder to retrieve.
 * @param userId The ID of the user requesting the reminder (for ownership check).
 * @returns The reminder document if found and owned by the user, otherwise null.
 */
export const getReminderById = async (reminderId: string, userId: string): Promise<IReminder | null> => {
  console.log(`[ReminderService] Fetching reminder ID: ${reminderId} for user ID: ${userId}`);
  if (!mongoose.Types.ObjectId.isValid(reminderId) || !mongoose.Types.ObjectId.isValid(userId)) {
    console.warn(`[ReminderService] Invalid ObjectId format for reminderId or userId.`);
    return null;
  }

  const reminder = await Reminder.findOne({
    _id: new mongoose.Types.ObjectId(reminderId),
    userId: new mongoose.Types.ObjectId(userId)
  }).exec();

  if (reminder) {
    console.log(`[ReminderService] Reminder found: ${reminder.title}`);
  } else {
    console.log(`[ReminderService] Reminder with ID ${reminderId} not found for user ${userId}.`);
  }
  return reminder;
};

/**
 * Updates an existing reminder.
 * @param reminderId The ID of the reminder to update.
 * @param updates Partial data containing the updates.
 * @param userId The ID of the user attempting the update (for ownership check).
 * @returns The updated reminder document, or null if not found or not owned.
 */
export const updateReminder = async (
  reminderId: string,
  updates: UpdateReminderDTO,
  userId: string
): Promise<IReminder | null> => {
  console.log(`[ReminderService] Updating reminder ID: ${reminderId} for user ${userId}`);
  if (!mongoose.Types.ObjectId.isValid(reminderId) || !mongoose.Types.ObjectId.isValid(userId)) {
    console.warn(`[ReminderService] Invalid ObjectId format for reminderId or userId in updateReminder.`);
    return null;
  }

  // Handle isRecurring and recurrencePattern consistency
  if (updates.recurrencePattern) {
    updates.isRecurring = updates.recurrencePattern !== 'none';
  } else if (updates.isRecurring === false) {
    updates.recurrencePattern = 'none';
  }

  const updatedReminder = await Reminder.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(reminderId), userId: new mongoose.Types.ObjectId(userId) },
    { $set: updates },
    { new: true, runValidators: true }
  ).exec();

  if (updatedReminder) {
    console.log(`[ReminderService] Reminder ID ${reminderId} updated successfully.`);
  } else {
    console.log(`[ReminderService] Reminder ID ${reminderId} not found for user ${userId} or update failed.`);
  }
  return updatedReminder;
};

/**
 * Deletes a reminder by its ID.
 * @param reminderId The ID of the reminder to delete.
 * @param userId The ID of the user attempting deletion (for ownership check).
 * @returns True if deletion was successful, false otherwise.
 */
export const deleteReminder = async (reminderId: string, userId: string): Promise<boolean> => {
  console.log(`[ReminderService] Deleting reminder ID: ${reminderId} for user ${userId}`);
  if (!mongoose.Types.ObjectId.isValid(reminderId) || !mongoose.Types.ObjectId.isValid(userId)) {
    console.warn(`[ReminderService] Invalid ObjectId format for reminderId or userId in deleteReminder.`);
    return false;
  }

  const result = await Reminder.deleteOne({
    _id: new mongoose.Types.ObjectId(reminderId),
    userId: new mongoose.Types.ObjectId(userId)
  }).exec();

  if (result.deletedCount && result.deletedCount > 0) {
    console.log(`[ReminderService] Reminder ID ${reminderId} deleted successfully for user ${userId}.`);
    return true;
  }
  console.log(`[ReminderService] Reminder ID ${reminderId} not found for user ${userId} or deletion failed.`);
  return false;
};

// Helper for clearing reminders during tests (if using a test database)
export const _clearRemindersForTesting = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'test') {
    console.log('[ReminderService Test] Clearing all reminders from database.');
    await Reminder.deleteMany({});
  } else {
    console.warn('[ReminderService Test] _clearRemindersForTesting should only be called in test environments.');
  }
};

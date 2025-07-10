// mobile/src/services/reminderService.ts
import apiClient from "./apiClient";
import { IReminder } from "../../../backend/src/models/Reminder"; // Import backend Reminder interface

export type Reminder = IReminder; // Re-export for mobile app usage

// DTO for creating a reminder (matches backend CreateReminderDTO)
export interface CreateReminderData {
  title: string;
  notes?: string;
  dueDate: string; // Send as ISO string
  isRecurring?: boolean;
  recurrencePattern?: "none" | "daily" | "weekly" | "monthly" | "yearly";
  itemId?: string; // Optional: ID of the item this reminder is associated with
}

// DTO for updating a reminder (matches backend UpdateReminderDTO)
export type UpdateReminderData = Partial<CreateReminderData>;

/**
 * Fetches all reminders for the authenticated user.
 * @returns A promise that resolves to an array of Reminder objects.
 */
export const fetchReminders = async (): Promise<Reminder[]> => {
  console.log("[ReminderService API] Fetching reminders...");
  try {
    const response = await apiClient.get<{ reminders: Reminder[] }>(
      "/reminders"
    );
    console.log("[ReminderService API] Reminders fetched successfully.");
    return response.data.reminders || [];
  } catch (error: any) {
    console.error(
      "[ReminderService API] Failed to fetch reminders:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch reminders."
    );
  }
};

/**
 * Creates a new reminder.
 * @param reminderData The data for the new reminder.
 * @returns A promise that resolves to the created Reminder object.
 */
export const createReminder = async (
  reminderData: CreateReminderData
): Promise<Reminder> => {
  console.log("[ReminderService API] Creating reminder:", reminderData.title);
  try {
    const response = await apiClient.post<{ reminder: Reminder }>(
      "/reminders",
      reminderData
    );
    console.log(
      "[ReminderService API] Reminder created successfully:",
      response.data.reminder.title
    );
    return response.data.reminder;
  } catch (error: any) {
    console.error(
      "[ReminderService API] Failed to create reminder:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create reminder."
    );
  }
};

/**
 * Fetches a single reminder by its ID.
 * @param reminderId The ID of the reminder to fetch.
 * @returns A promise that resolves to the Reminder object, or null if not found.
 */
export const getReminderById = async (
  reminderId: string
): Promise<Reminder | null> => {
  console.log(`[ReminderService API] Fetching reminder by ID: ${reminderId}`);
  try {
    const response = await apiClient.get<{ reminder: Reminder }>(
      `/reminders/${reminderId}`
    );
    console.log(
      "[ReminderService API] Reminder fetched successfully:",
      response.data.reminder.title
    );
    return response.data.reminder;
  } catch (error: any) {
    console.error(
      `[ReminderService API] Failed to fetch reminder ${reminderId}:`,
      error.response?.data?.message || error.message
    );
    if (error.response?.status === 404) {
      return null;
    }
    throw new Error(
      error.response?.data?.message || `Failed to fetch reminder ${reminderId}.`
    );
  }
};

/**
 * Updates an existing reminder.
 * @param reminderId The ID of the reminder to update.
 * @param updates The partial data to update the reminder with.
 * @returns A promise that resolves to the updated Reminder object.
 */
export const updateReminder = async (
  reminderId: string,
  updates: UpdateReminderData
): Promise<Reminder> => {
  console.log(
    `[ReminderService API] Updating reminder ${reminderId}:`,
    updates.title
  );
  try {
    const response = await apiClient.put<{ reminder: Reminder }>(
      `/reminders/${reminderId}`,
      updates
    );
    console.log(
      `[ReminderService API] Reminder ${reminderId} updated successfully.`
    );
    return response.data.reminder;
  } catch (error: any) {
    console.error(
      `[ReminderService API] Failed to update reminder ${reminderId}:`,
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        `Failed to update reminder ${reminderId}.`
    );
  }
};

/**
 * Deletes a reminder.
 * @param reminderId The ID of the reminder to delete.
 * @returns A promise that resolves when the reminder is successfully deleted.
 */
export const deleteReminder = async (reminderId: string): Promise<void> => {
  console.log(`[ReminderService API] Deleting reminder ${reminderId}`);
  try {
    await apiClient.delete(`/reminders/${reminderId}`);
    console.log(
      `[ReminderService API] Reminder ${reminderId} deleted successfully.`
    );
  } catch (error: any) {
    console.error(
      `[ReminderService API] Failed to delete reminder ${reminderId}:`,
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        `Failed to delete reminder ${reminderId}.`
    );
  }
};

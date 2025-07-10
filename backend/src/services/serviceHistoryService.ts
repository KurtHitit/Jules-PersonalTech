// backend/src/services/serviceHistoryService.ts
import ServiceHistory, { IServiceHistory } from '../models/ServiceHistory';
import { IItemDocument } from '../models/Item';
import mongoose from 'mongoose';

// DTO for creating a service history entry
export interface CreateServiceHistoryDTO {
  itemId: string;
  serviceType: string;
  dateOfService: Date;
  providerDetails?: string;
  cost?: number;
  notes?: string;
  documents?: IItemDocument[];
}

// DTO for updating a service history entry
export type UpdateServiceHistoryDTO = Partial<CreateServiceHistoryDTO>;

import { checkAndAwardBadges } from './badgeService';

/**
 * Creates a new service history entry for a specific item.
 * @param serviceHistoryData Data for the new service history entry.
 * @returns The newly created service history document.
 */
export const createServiceHistory = async (serviceHistoryData: CreateServiceHistoryDTO): Promise<IServiceHistory> => {
  console.log(`[ServiceHistoryService] Creating service history for item ${serviceHistoryData.itemId}: ${serviceHistoryData.serviceType}`);

  const newEntry = new ServiceHistory({
    ...serviceHistoryData,
    itemId: new mongoose.Types.ObjectId(serviceHistoryData.itemId),
  });

  await newEntry.save();
  console.log(`[ServiceHistoryService] Service history entry created with ID: ${newEntry._id}`);

  // Check for badges
  const item = await mongoose.model('Item').findById(serviceHistoryData.itemId);
  if (item) {
    await checkAndAwardBadges(item.userId.toString(), 'add_first_service_history');
  }

  return newEntry;
};

/**
 * Retrieves all service history entries for a specific item.
 * @param itemId The ID of the item whose service history is to be retrieved.
 * @returns A list of service history documents.
 */
export const getServiceHistoryByItemId = async (itemId: string): Promise<IServiceHistory[]> => {
  console.log(`[ServiceHistoryService] Fetching service history for item ID: ${itemId}`);
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    console.warn(`[ServiceHistoryService] Invalid ObjectId for itemId: ${itemId} in getServiceHistoryByItemId`);
    return [];
  }
  const history = await ServiceHistory.find({ itemId: new mongoose.Types.ObjectId(itemId) }).sort({ dateOfService: -1 }).exec();
  console.log(`[ServiceHistoryService] Found ${history.length} entries for item ${itemId}.`);
  return history;
};

/**
 * Retrieves a single service history entry by its ID, ensuring it belongs to the specified item.
 * @param entryId The ID of the service history entry to retrieve.
 * @param itemId The ID of the item this entry should belong to (for ownership check).
 * @returns The service history document if found and owned by the item, otherwise null.
 */
export const getServiceHistoryEntryById = async (entryId: string, itemId: string): Promise<IServiceHistory | null> => {
  console.log(`[ServiceHistoryService] Fetching entry ID: ${entryId} for item ID: ${itemId}`);
  if (!mongoose.Types.ObjectId.isValid(entryId) || !mongoose.Types.ObjectId.isValid(itemId)) {
    console.warn(`[ServiceHistoryService] Invalid ObjectId format for entryId or itemId.`);
    return null;
  }

  const entry = await ServiceHistory.findOne({
    _id: new mongoose.Types.ObjectId(entryId),
    itemId: new mongoose.Types.ObjectId(itemId)
  }).exec();

  if (entry) {
    console.log(`[ServiceHistoryService] Service history entry found: ${entry.serviceType}`);
  } else {
    console.log(`[ServiceHistoryService] Service history entry with ID ${entryId} not found for item ${itemId}.`);
  }
  return entry;
};

/**
 * Updates an existing service history entry.
 * @param entryId The ID of the service history entry to update.
 * @param updates Partial data containing the updates.
 * @param itemId The ID of the item this entry should belong to (for ownership check).
 * @returns The updated service history document, or null if not found or not owned.
 */
export const updateServiceHistory = async (
  entryId: string,
  updates: UpdateServiceHistoryDTO,
  itemId: string
): Promise<IServiceHistory | null> => {
  console.log(`[ServiceHistoryService] Updating entry ID: ${entryId} for item ${itemId}`);
  if (!mongoose.Types.ObjectId.isValid(entryId) || !mongoose.Types.ObjectId.isValid(itemId)) {
    console.warn(`[ServiceHistoryService] Invalid ObjectId format for entryId or itemId in updateServiceHistory.`);
    return null;
  }

  const updatedEntry = await ServiceHistory.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(entryId), itemId: new mongoose.Types.ObjectId(itemId) },
    { $set: updates },
    { new: true, runValidators: true }
  ).exec();

  if (updatedEntry) {
    console.log(`[ServiceHistoryService] Entry ID ${entryId} updated successfully.`);
  } else {
    console.log(`[ServiceHistoryService] Entry ID ${entryId} not found for item ${itemId} or update failed.`);
  }
  return updatedEntry;
};

/**
 * Deletes a service history entry by its ID.
 * @param entryId The ID of the service history entry to delete.
 * @param itemId The ID of the item this entry should belong to (for ownership check).
 * @returns True if deletion was successful, false otherwise.
 */
export const deleteServiceHistory = async (entryId: string, itemId: string): Promise<boolean> => {
  console.log(`[ServiceHistoryService] Deleting entry ID: ${entryId} for item ${itemId}`);
  if (!mongoose.Types.ObjectId.isValid(entryId) || !mongoose.Types.ObjectId.isValid(itemId)) {
    console.warn(`[ServiceHistoryService] Invalid ObjectId format for entryId or itemId in deleteServiceHistory.`);
    return false;
  }

  const result = await ServiceHistory.deleteOne({
    _id: new mongoose.Types.ObjectId(entryId),
    itemId: new mongoose.Types.ObjectId(itemId)
  }).exec();

  if (result.deletedCount && result.deletedCount > 0) {
    console.log(`[ServiceHistoryService] Entry ID ${entryId} deleted successfully for item ${itemId}.`);
    return true;
  }
  console.log(`[ServiceHistoryService] Entry ID ${entryId} not found for item ${itemId} or deletion failed.`);
  return false;
};

// Helper for clearing service history during tests (if using a test database)
export const _clearServiceHistoryForTesting = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'test') {
    console.log('[ServiceHistoryService Test] Clearing all service history from database.');
    await ServiceHistory.deleteMany({});
  } else {
    console.warn('[ServiceHistoryService Test] _clearServiceHistoryForTesting should only be called in test environments.');
  }
};

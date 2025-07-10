// mobile/src/services/serviceHistoryService.ts
import apiClient from "./apiClient";
import {
  IServiceHistory,
  IItemDocument,
} from "../../../backend/src/models/ServiceHistory"; // Assuming IItemDocument is exported from ServiceHistory model or Item model

export type ServiceHistoryEntry = IServiceHistory;
export type ServiceDocument = IItemDocument; // Re-export for mobile app usage

// DTO for creating a service history entry
export interface CreateServiceHistoryData {
  itemId: string;
  serviceType: string;
  dateOfService: string; // Send as ISO string
  providerDetails?: string;
  cost?: number;
  notes?: string;
  documents?: ServiceDocument[];
}

// DTO for updating a service history entry
export type UpdateServiceHistoryData = Partial<CreateServiceHistoryData>;

/**
 * Fetches all service history entries for a specific item.
 * @param itemId The ID of the item to fetch history for.
 * @returns A promise that resolves to an array of ServiceHistoryEntry objects.
 */
export const fetchServiceHistory = async (
  itemId: string
): Promise<ServiceHistoryEntry[]> => {
  console.log(
    `[ServiceHistoryService API] Fetching service history for item ${itemId}...`
  );
  try {
    const response = await apiClient.get<{
      serviceHistory: ServiceHistoryEntry[];
    }>(`/items/${itemId}/history`);
    console.log(
      "[ServiceHistoryService API] Service history fetched successfully."
    );
    return response.data.serviceHistory || [];
  } catch (error: any) {
    console.error(
      "[ServiceHistoryService API] Failed to fetch service history:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch service history."
    );
  }
};

/**
 * Creates a new service history entry.
 * @param data The data for the new service history entry.
 * @returns A promise that resolves to the created ServiceHistoryEntry object.
 */
export const createServiceHistoryEntry = async (
  data: CreateServiceHistoryData
): Promise<ServiceHistoryEntry> => {
  console.log(
    `[ServiceHistoryService API] Creating service history entry for item ${data.itemId}: ${data.serviceType}`
  );
  try {
    const response = await apiClient.post<{
      serviceHistory: ServiceHistoryEntry;
    }>(`/items/${data.itemId}/history`, data);
    console.log(
      "[ServiceHistoryService API] Service history entry created successfully:",
      response.data.serviceHistory.serviceType
    );
    return response.data.serviceHistory;
  } catch (error: any) {
    console.error(
      "[ServiceHistoryService API] Failed to create service history entry:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create service history entry."
    );
  }
};

/**
 * Fetches a single service history entry by its ID.
 * @param itemId The ID of the item the entry belongs to.
 * @param entryId The ID of the service history entry to fetch.
 * @returns A promise that resolves to the ServiceHistoryEntry object, or null if not found.
 */
export const getServiceHistoryEntryById = async (
  itemId: string,
  entryId: string
): Promise<ServiceHistoryEntry | null> => {
  console.log(
    `[ServiceHistoryService API] Fetching service history entry by ID: ${entryId} for item ${itemId}`
  );
  try {
    const response = await apiClient.get<{
      serviceHistory: ServiceHistoryEntry;
    }>(`/items/${itemId}/history/${entryId}`);
    console.log(
      "[ServiceHistoryService API] Service history entry fetched successfully:",
      response.data.serviceHistory.serviceType
    );
    return response.data.serviceHistory;
  } catch (error: any) {
    console.error(
      `[ServiceHistoryService API] Failed to fetch service history entry ${entryId}:`,
      error.response?.data?.message || error.message
    );
    if (error.response?.status === 404) {
      return null;
    }
    throw new Error(
      error.response?.data?.message ||
        `Failed to fetch service history entry ${entryId}.`
    );
  }
};

/**
 * Updates an existing service history entry.
 * @param itemId The ID of the item the entry belongs to.
 * @param entryId The ID of the service history entry to update.
 * @param updates The partial data to update the entry with.
 * @returns A promise that resolves to the updated ServiceHistoryEntry object.
 */
export const updateServiceHistoryEntry = async (
  itemId: string,
  entryId: string,
  updates: UpdateServiceHistoryData
): Promise<ServiceHistoryEntry> => {
  console.log(
    `[ServiceHistoryService API] Updating service history entry ${entryId} for item ${itemId}:`,
    updates.serviceType
  );
  try {
    const response = await apiClient.put<{
      serviceHistory: ServiceHistoryEntry;
    }>(`/items/${itemId}/history/${entryId}`, updates);
    console.log(
      `[ServiceHistoryService API] Service history entry ${entryId} updated successfully.`
    );
    return response.data.serviceHistory;
  } catch (error: any) {
    console.error(
      `[ServiceHistoryService API] Failed to update service history entry ${entryId}:`,
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        `Failed to update service history entry ${entryId}.`
    );
  }
};

/**
 * Deletes a service history entry.
 * @param itemId The ID of the item the entry belongs to.
 * @param entryId The ID of the service history entry to delete.
 * @returns A promise that resolves when the entry is successfully deleted.
 */
export const deleteServiceHistoryEntry = async (
  itemId: string,
  entryId: string
): Promise<void> => {
  console.log(
    `[ServiceHistoryService API] Deleting service history entry ${entryId} for item ${itemId}`
  );
  try {
    await apiClient.delete(`/items/${itemId}/history/${entryId}`);
    console.log(
      `[ServiceHistoryService API] Service history entry ${entryId} deleted successfully.`
    );
  } catch (error: any) {
    console.error(
      `[ServiceHistoryService API] Failed to delete service history entry ${entryId}:`,
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        `Failed to delete service history entry ${entryId}.`
    );
  }
};

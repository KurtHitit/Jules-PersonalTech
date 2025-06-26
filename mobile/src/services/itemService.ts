// mobile/src/services/itemService.ts

// Using the backend Item model/interface for consistency if possible.
// Adjust path if backend models are not directly accessible or if a separate mobile model is preferred.
import { Item as BackendItem, ItemPhoto, ItemDocument } from '../../../backend/src/models/Item'; // Adjust path as needed
// For now, we'll use this direct import. If it causes issues (e.g., with React Native bundler or importing server-side code),
// we should define a separate, identical Item interface here.

// Re-exporting or re-defining Item type for local use to avoid complex relative paths in screens/components.
export type Item = BackendItem;
export type { ItemPhoto, ItemDocument };


import apiClient from './apiClient'; // Import the configured Axios instance

// Type for the data structure when creating an item (payload for POST /items)
// This should match the backend's expectation, excluding server-generated fields.
export type NewItemData = Omit<Item, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
// If photos and documents are optional or handled differently during creation:
// export type NewItemData = Omit<Item, 'id'|'userId'|'createdAt'|'updatedAt'|'photos'|'documents'> & {
//   photos?: ItemPhoto[];
//   documents?: ItemDocument[];
// };


/**
 * Fetches a list of items from the backend.
 * Requires authentication (token is added by apiClient interceptor).
 */
export const fetchItems = async (): Promise<Item[]> => {
  console.log('[ItemService API] Fetching items...');
  try {
    const response = await apiClient.get<{ items: Item[] }>('/items'); // Assuming backend returns { items: [...] }
    // If backend returns just the array: const response = await apiClient.get<Item[]>('/items');
    console.log('[ItemService API] Items fetched successfully.');
    return response.data.items || response.data; // Adjust based on backend response structure
  } catch (error: any) {
    console.error('[ItemService API] Failed to fetch items:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch items.');
  }
};

/**
 * Adds a new item via the backend API.
 * Requires authentication.
 * @param itemData Data for the new item.
 */
export const addItem = async (itemData: NewItemData): Promise<Item> => {
  console.log('[ItemService API] Adding item:', itemData.name);
  try {
    const response = await apiClient.post<{ item: Item }>('/items', itemData); // Assuming backend returns { item: ... }
    // If backend returns just the created item: const response = await apiClient.post<Item>('/items', itemData);
    console.log('[ItemService API] Item added successfully:', response.data.item?.name || response.data.name);
    return response.data.item || response.data; // Adjust based on backend response structure
  } catch (error: any) {
    console.error('[ItemService API] Failed to add item:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to add item.');
  }
};

/**
 * Fetches a single item by its ID from the backend.
 * Requires authentication.
 */
export const getItemById = async (itemId: string): Promise<Item | null> => {
  console.log(`[ItemService API] Fetching item by ID: ${itemId}`);
  try {
    const response = await apiClient.get<{ item: Item }>(`/items/${itemId}`); // Assuming backend returns { item: ... }
    // If backend returns just the item: const response = await apiClient.get<Item>(`/items/${itemId}`);
    console.log('[ItemService API] Single item fetched successfully:', response.data.item?.name || response.data.name);
    return response.data.item || response.data; // Adjust
  } catch (error: any) {
    console.error(`[ItemService API] Failed to fetch item ${itemId}:`, error.response?.data?.message || error.message);
    if (error.response?.status === 404) {
      return null; // Item not found
    }
    throw new Error(error.response?.data?.message || `Failed to fetch item ${itemId}.`);
  }
};

/**
 * Updates an existing item via the backend API.
 * Requires authentication.
 * @param itemId The ID of the item to update.
 * @param updates Partial data containing the updates for the item.
 */
export const updateItem = async (itemId: string, updates: Partial<NewItemData>): Promise<Item> => {
  console.log(`[ItemService API] Updating item ${itemId} with:`, updates);
  try {
    const response = await apiClient.put<{ item: Item }>(`/items/${itemId}`, updates);
    console.log(`[ItemService API] Item ${itemId} updated successfully.`);
    return response.data.item || response.data; // Adjust
  } catch (error: any) {
    console.error(`[ItemService API] Failed to update item ${itemId}:`, error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || `Failed to update item ${itemId}.`);
  }
};

/**
 * Deletes an item by its ID via the backend API.
 * Requires authentication.
 * @param itemId The ID of the item to delete.
 */
export const deleteItem = async (itemId: string): Promise<void> => {
  console.log(`[ItemService API] Deleting item ${itemId}`);
  try {
    await apiClient.delete(`/items/${itemId}`);
    console.log(`[ItemService API] Item ${itemId} deleted successfully.`);
  } catch (error: any) {
    console.error(`[ItemService API] Failed to delete item ${itemId}:`, error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || `Failed to delete item ${itemId}.`);
  }
};

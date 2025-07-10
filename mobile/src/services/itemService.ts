// mobile/src/services/itemService.ts

import { Asset } from "react-native-image-picker";
import { DocumentPickerResponse } from "react-native-document-picker";
import {
  Item as BackendItem,
  ItemPhoto,
  ItemDocument,
} from "../../../backend/src/models/Item";
import apiClient from "./apiClient";
import { DiagnosticQuery, DiagnosticFeedback } from "../../../backend/src/services/diagnosticService";

export type Item = BackendItem;
export type { ItemPhoto, ItemDocument };

/**
 * Calls the backend diagnostic API to get suggestions for a given item category and problem.
 * @param query The diagnostic query containing itemCategory and problemDescription.
 * @returns A promise that resolves to an array of string suggestions.
 */
export const getDiagnosticSuggestions = async (
  query: DiagnosticQuery
): Promise<string[]> => {
  console.log("[ItemService API] Getting diagnostic suggestions for:", query);
  try {
    const response = await apiClient.post<{ suggestions: string[] }>(
      "/diagnostics",
      query
    );
    console.log(
      "[ItemService API] Diagnostic suggestions retrieved successfully."
    );
    return response.data.suggestions || [];
  } catch (error: any) {
    console.error(
      "[ItemService API] Failed to get diagnostic suggestions:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to get diagnostic suggestions."
    );
  }
};

/**
 * Submits diagnostic feedback to the backend.
 * @param feedback The feedback object containing query, suggestions, and user input.
 */
export const submitDiagnosticFeedback = async (feedback: DiagnosticFeedback): Promise<void> => {
  console.log("[ItemService API] Submitting diagnostic feedback:", feedback);
  try {
    await apiClient.post("/diagnostics/feedback", feedback);
    console.log("[ItemService API] Diagnostic feedback submitted successfully.");
  } catch (error: any) {
    console.error(
      "[ItemService API] Failed to submit diagnostic feedback:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to submit diagnostic feedback."
    );
  }
};

export type NewItemData = Omit<
  Item,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

/**
 * Uploads a file to the backend.
 * @param file The file to upload (from image picker or document picker).
 * @param onProgress Callback to report upload progress (0-100).
 */
export const uploadFile = async (
  file: Asset | DocumentPickerResponse,
  onProgress: (progress: number) => void
): Promise<{ file: string }> => {
  console.log("[ItemService API] Uploading file:", file.fileName || file.name);
  const formData = new FormData();

  formData.append("file", {
    uri: file.uri,
    type: file.type,
    name: file.fileName || file.name,
  } as any);

  try {
    const response = await apiClient.post<{ file: string }>(
      "/uploads",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      }
    );
    console.log(
      "[ItemService API] File uploaded successfully:",
      response.data.file
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "[ItemService API] File upload failed:",
      error.response?.data?.message || error.message
    );
    throw new Error(error.response?.data?.message || "File upload failed.");
  }
};

/**
 * Fetches a list of items from the backend.
 * Requires authentication (token is added by apiClient interceptor).
 */
export const fetchItems = async (searchQuery?: string): Promise<Item[]> => {
  console.log("[ItemService API] Fetching items with query:", searchQuery);
  try {
    const response = await apiClient.get<{ items: Item[] }>("/items", {
      params: { query: searchQuery },
    });
    console.log("[ItemService API] Items fetched successfully.");
    return response.data.items || response.data;
  } catch (error: any) {
    console.error(
      "[ItemService API] Failed to fetch items:",
      error.response?.data?.message || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch items.");
  }
};

/**
 * Adds a new item via the backend API.
 * Requires authentication.
 * @param itemData Data for the new item.
 */
export const addItem = async (itemData: NewItemData): Promise<Item> => {
  console.log("[ItemService API] Adding item:", itemData.name);
  try {
    const response = await apiClient.post<{ item: Item }>("/items", itemData);
    console.log(
      "[ItemService API] Item added successfully:",
      response.data.item?.name || response.data.name
    );
    return response.data.item || response.data;
  } catch (error: any) {
    console.error(
      "[ItemService API] Failed to add item:",
      error.response?.data?.message || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to add item.");
  }
};

/**
 * Fetches a single item by its ID from the backend.
 * Requires authentication.
 */
export const getItemById = async (itemId: string): Promise<Item | null> => {
  console.log(`[ItemService API] Fetching item by ID: ${itemId}`);
  try {
    const response = await apiClient.get<{ item: Item }>(`/items/${itemId}`);
    console.log(
      "[ItemService API] Single item fetched successfully:",
      response.data.item?.name || response.data.name
    );
    return response.data.item || response.data;
  } catch (error: any) {
    console.error(
      `[ItemService API] Failed to fetch item ${itemId}:`,
      error.response?.data?.message || error.message
    );
    if (error.response?.status === 404) {
      return null;
    }
    throw new Error(
      error.response?.data?.message || `Failed to fetch item ${itemId}.`
    );
  }
};

/**
 * Updates an existing item via the backend API.
 * Requires authentication.
 * @param itemId The ID of the item to update.
 * @param updates Partial data containing the updates for the item.
 */
export const updateItem = async (
  itemId: string,
  updates: Partial<NewItemData>
): Promise<Item> => {
  console.log(`[ItemService API] Updating item ${itemId} with:`, updates);
  try {
    const response = await apiClient.put<{ item: Item }>(
      `/items/${itemId}`,
      updates
    );
    console.log(`[ItemService API] Item ${itemId} updated successfully.`);
    return response.data.item || response.data;
  } catch (error: any) {
    console.error(
      `[ItemService API] Failed to update item ${itemId}:`,
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || `Failed to update item ${itemId}.`
    );
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
    console.error(
      `[ItemService API] Failed to delete item ${itemId}:`,
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || `Failed to delete item ${itemId}.`
    );
  }
};

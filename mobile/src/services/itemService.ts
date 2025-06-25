// mobile/src/services/itemService.ts

// Using the backend Item model/interface for consistency if possible.
// Adjust path if backend models are not directly accessible or if a separate mobile model is preferred.
import { Item as BackendItem, ItemPhoto, ItemDocument } from '../../../backend/src/models/Item'; // Adjust path as needed
// For now, we'll use this direct import. If it causes issues (e.g., with React Native bundler or importing server-side code),
// we should define a separate, identical Item interface here.

// Re-exporting or re-defining Item type for local use to avoid complex relative paths in screens/components.
export type Item = BackendItem;
export type { ItemPhoto, ItemDocument };


// For now, this service will return mock data.
// Later, it will be updated to make API calls to the backend.

const mockMobileItemsDB: Item[] = [
  {
    id: 'mobile-item-1',
    userId: 'user-123',
    name: 'Smartphone X',
    category: 'Electronics',
    brand: 'MobileBrand',
    model: 'X2024',
    serialNumber: 'MB0123456789',
    purchaseDate: new Date('2023-05-10'),
    purchasePrice: 799,
    currency: 'USD',
    retailer: 'Tech Store Online',
    notes: 'Primary mobile device. Good camera.',
    photos: [{ url: 'http://example.com/smartphone.jpg', caption: 'Front view' }],
    documents: [
      { url: 'http://example.com/receipt_phone.pdf', filename: 'phone_receipt.pdf', type: 'receipt' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mobile-item-2',
    userId: 'user-123',
    name: 'Wireless Earbuds Pro',
    category: 'Electronics',
    brand: 'AudioGood',
    model: 'BudsPro V2',
    serialNumber: 'AGBPV2-987654',
    purchaseDate: new Date('2023-08-22'),
    purchasePrice: 199,
    currency: 'USD',
    retailer: 'Amazon',
    notes: 'Used for calls and music.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * Fetches a list of items.
 * Currently returns mock data.
 */
export const fetchItems = async (): Promise<Item[]> => {
  console.log('[Mobile Service] Fetching items...');
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  console.log('[Mobile Service] Mock items fetched:', mockMobileItemsDB);
  return [...mockMobileItemsDB]; // Return a copy to prevent direct mutation
};

/**
 * Adds a new item.
 * Currently simulates adding to a mock list.
 * @param itemData Data for the new item (excluding id, userId, createdAt, updatedAt which backend would handle)
 */
export const addItem = async (
  itemData: Omit<Item, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'photos' | 'documents'> & { photos?: ItemPhoto[], documents?: ItemDocument[] }
): Promise<Item> => {
  console.log('[Mobile Service] Adding item:', itemData);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const newItem: Item = {
    id: `mobile-item-${Date.now()}`, // Simple unique ID for mock
    userId: 'user-123', // Mock user ID
    ...itemData,
    photos: itemData.photos || [],
    documents: itemData.documents || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockMobileItemsDB.push(newItem);
  console.log('[Mobile Service] Item added (mock):', newItem);
  return newItem;
};

/**
 * Fetches a single item by its ID.
 * Currently returns mock data.
 */
export const getItemById = async (itemId: string): Promise<Item | null> => {
  console.log(`[Mobile Service] Fetching item by ID: ${itemId}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  const item = mockMobileItemsDB.find(i => i.id === itemId);
  if (item) {
    console.log('[Mobile Service] Item found:', item);
    return { ...item }; // Return a copy
  }
  console.log(`[Mobile Service] Item with ID ${itemId} not found.`);
  return null;
};

// Add other service functions as needed (updateItem, deleteItem)
// For example:
/*
export const updateItem = async (itemId: string, updates: Partial<Item>): Promise<Item | null> => {
  console.log(`[Mobile Service] Updating item ${itemId} with`, updates);
  await new Promise(resolve => setTimeout(resolve, 1000));
  const itemIndex = mockMobileItemsDB.findIndex(i => i.id === itemId);
  if (itemIndex > -1) {
    mockMobileItemsDB[itemIndex] = { ...mockMobileItemsDB[itemIndex], ...updates, updatedAt: new Date() };
    console.log('[Mobile Service] Item updated (mock):', mockMobileItemsDB[itemIndex]);
    return { ...mockMobileItemsDB[itemIndex] };
  }
  return null;
};

export const deleteItem = async (itemId: string): Promise<boolean> => {
  console.log(`[Mobile Service] Deleting item ${itemId}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  const initialLength = mockMobileItemsDB.length;
  mockMobileItemsDB = mockMobileItemsDB.filter(i => i.id !== itemId);
  return mockMobileItemsDB.length < initialLength;
};
*/

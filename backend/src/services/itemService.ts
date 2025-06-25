// backend/src/services/itemService.ts
import { Item, createMockItem, ItemPhoto, ItemDocument } from '../models/Item';

// This is a placeholder service. In a real application, this service would
// interact with a database (e.g., using an ORM like Prisma, TypeORM, or Mongoose).

// Mock database (in-memory array for now)
let mockItemsDB: Item[] = [
  createMockItem({
    id: 'item-1',
    userId: 'user-123',
    name: 'MacBook Pro 16"',
    category: 'Electronics',
    brand: 'Apple',
    model: 'M1 Max',
    serialNumber: 'C02F1234ABCD',
    purchaseDate: new Date('2022-01-15'),
    purchasePrice: 2499,
    currency: 'USD',
    retailer: 'Apple Store',
    notes: 'Used for development work.',
    photos: [{ url: 'http://example.com/macbook.jpg', caption: 'Laptop on desk' }],
    documents: [
      { url: 'http://example.com/receipt.pdf', filename: 'macbook_receipt.pdf', type: 'receipt' },
      { url: 'http://example.com/warranty.pdf', filename: 'macbook_applecare.pdf', type: 'warranty' },
    ],
  }),
  createMockItem({
    id: 'item-2',
    userId: 'user-123',
    name: 'Sony WH-1000XM4 Headphones',
    category: 'Electronics',
    brand: 'Sony',
    model: 'WH-1000XM4',
    serialNumber: 'S01-1234567-A',
    purchaseDate: new Date('2021-11-20'),
    purchasePrice: 348,
    currency: 'USD',
    retailer: 'Amazon',
    notes: 'Noise-cancelling headphones, great for travel.',
  }),
  createMockItem({
    id: 'item-3',
    userId: 'user-456', // Different user
    name: 'Old Toaster',
    category: 'Appliance',
    brand: 'GenericBrand',
    model: 'T-100',
  }),
];

/**
 * Creates a new item.
 * In a real app, this would save to a database and associate with the actual user.
 * @param itemData Partial data for the new item.
 * @param userId The ID of the user creating the item.
 * @returns The newly created item.
 */
export const createItem = async (
  itemData: Partial<Omit<Item, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>,
  userId: string
): Promise<Item> => {
  console.log(`[Service] Attempting to create item for user ${userId} with data:`, itemData);
  const newItem = createMockItem({
    ...itemData,
    userId, // Ensure the correct userId is set
  });
  mockItemsDB.push(newItem);
  console.log(`[Service] Item created with ID: ${newItem.id}`);
  return newItem;
};

/**
 * Retrieves all items for a specific user.
 * @param userId The ID of the user whose items are to be retrieved.
 * @returns A list of items belonging to the user.
 */
export const getItemsByUserId = async (userId: string): Promise<Item[]> => {
  console.log(`[Service] Fetching items for user ID: ${userId}`);
  const userItems = mockItemsDB.filter(item => item.userId === userId);
  console.log(`[Service] Found ${userItems.length} items for user ${userId}.`);
  return userItems;
};

/**
 * Retrieves a single item by its ID, ensuring it belongs to the specified user.
 * @param itemId The ID of the item to retrieve.
 * @param userId The ID of the user requesting the item (for ownership check).
 * @returns The item if found and owned by the user, otherwise null.
 */
export const getItemById = async (itemId: string, userId: string): Promise<Item | null> => {
  console.log(`[Service] Fetching item with ID: ${itemId} for user ID: ${userId}`);
  const item = mockItemsDB.find(i => i.id === itemId && i.userId === userId);
  if (item) {
    console.log(`[Service] Item found:`, item);
    return item;
  }
  console.log(`[Service] Item with ID ${itemId} not found for user ${userId}.`);
  return null;
};

/**
 * Updates an existing item.
 * @param itemId The ID of the item to update.
 * @param updates Partial data containing the updates.
 * @param userId The ID of the user attempting the update (for ownership check).
 * @returns The updated item, or null if not found or not owned by the user.
 */
export const updateItem = async (
  itemId: string,
  updates: Partial<Omit<Item, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>,
  userId: string
): Promise<Item | null> => {
  console.log(`[Service] Attempting to update item ID: ${itemId} for user ${userId} with updates:`, updates);
  const itemIndex = mockItemsDB.findIndex(i => i.id === itemId && i.userId === userId);

  if (itemIndex === -1) {
    console.log(`[Service] Item ID ${itemId} not found for user ${userId} or user does not own it. Update failed.`);
    return null;
  }

  const originalItem = mockItemsDB[itemIndex];
  const updatedItem: Item = {
    ...originalItem,
    ...updates,
    updatedAt: new Date(), // Ensure updatedAt is updated
  };
  mockItemsDB[itemIndex] = updatedItem;
  console.log(`[Service] Item ID ${itemId} updated successfully:`, updatedItem);
  return updatedItem;
};

/**
 * Deletes an item by its ID.
 * @param itemId The ID of the item to delete.
 * @param userId The ID of the user attempting deletion (for ownership check).
 * @returns True if deletion was successful, false otherwise.
 */
export const deleteItem = async (itemId: string, userId: string): Promise<boolean> => {
  console.log(`[Service] Attempting to delete item ID: ${itemId} for user ${userId}`);
  const initialLength = mockItemsDB.length;
  mockItemsDB = mockItemsDB.filter(i => !(i.id === itemId && i.userId === userId));

  if (mockItemsDB.length < initialLength) {
    console.log(`[Service] Item ID ${itemId} deleted successfully for user ${userId}.`);
    return true;
  }
  console.log(`[Service] Item ID ${itemId} not found for user ${userId} or user does not own it. Deletion failed.`);
  return false;
};

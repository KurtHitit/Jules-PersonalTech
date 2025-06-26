// backend/src/services/itemService.ts
import Item, { IItem, IItemPhoto, IItemDocument } from '../models/Item'; // Import Mongoose Item model and IItem interface
import mongoose from 'mongoose'; // For ObjectId validation if needed

// DTO for creating an item. All fields from IItem except auto-generated ones.
// Ensure this aligns with what the client sends and what the Item schema expects.
export type CreateItemDTO = Omit<IItem, '_id' | 'createdAt' | 'updatedAt' | 'userId'> & {
  // Explicitly define optional fields if they are part of the DTO but not strictly required by schema initially
  // For example, if photos/documents can be added later or are optional:
  photos?: IItemPhoto[];
  documents?: IItemDocument[];
};

// DTO for updating an item. All fields are optional.
export type UpdateItemDTO = Partial<CreateItemDTO>;


/**
 * Creates a new item in the database for a specific user.
 * @param itemData Data for the new item.
 * @param userId The ID of the user creating the item.
 * @returns The newly created item Mongoose document.
 */
export const createItem = async (itemData: CreateItemDTO, userId: string): Promise<IItem> => {
  console.log(`[ItemService Mongoose] Creating item for user ${userId}: ${itemData.name}`);

  const newItem = new Item({
    ...itemData,
    userId: new mongoose.Types.ObjectId(userId), // Ensure userId is a valid ObjectId
  });

  await newItem.save();
  console.log(`[ItemService Mongoose] Item created with ID: ${newItem._id}`);
  return newItem;
};

/**
 * Retrieves all items for a specific user from the database.
 * @param userId The ID of the user whose items are to be retrieved.
 * @returns A list of item Mongoose documents belonging to the user.
 */
export const getItemsByUserId = async (userId: string): Promise<IItem[]> => {
  console.log(`[ItemService Mongoose] Fetching items for user ID: ${userId}`);
  if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.warn(`[ItemService Mongoose] Invalid ObjectId for userId: ${userId} in getItemsByUserId`);
      return []; // Or throw an error
  }
  const items = await Item.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec(); // Sort by newest first
  console.log(`[ItemService Mongoose] Found ${items.length} items for user ${userId}.`);
  return items;
};

/**
 * Retrieves a single item by its ID, ensuring it belongs to the specified user.
 * @param itemId The ID of the item to retrieve.
 * @param userId The ID of the user requesting the item (for ownership check).
 * @returns The item Mongoose document if found and owned by the user, otherwise null.
 */
export const getItemById = async (itemId: string, userId: string): Promise<IItem | null> => {
  console.log(`[ItemService Mongoose] Fetching item ID: ${itemId} for user ID: ${userId}`);
  if (!mongoose.Types.ObjectId.isValid(itemId) || !mongoose.Types.ObjectId.isValid(userId)) {
    console.warn(`[ItemService Mongoose] Invalid ObjectId format for itemId or userId.`);
    return null;
  }

  const item = await Item.findOne({
    _id: new mongoose.Types.ObjectId(itemId),
    userId: new mongoose.Types.ObjectId(userId)
  }).exec();

  if (item) {
    console.log(`[ItemService Mongoose] Item found: ${item.name}`);
  } else {
    console.log(`[ItemService Mongoose] Item with ID ${itemId} not found for user ${userId}.`);
  }
  return item;
};

/**
 * Updates an existing item in the database.
 * @param itemId The ID of the item to update.
 * @param updates Partial data containing the updates.
 * @param userId The ID of the user attempting the update (for ownership check).
 * @returns The updated item Mongoose document, or null if not found or not owned.
 */
export const updateItem = async (
  itemId: string,
  updates: UpdateItemDTO,
  userId: string
): Promise<IItem | null> => {
  console.log(`[ItemService Mongoose] Updating item ID: ${itemId} for user ${userId}`);
  if (!mongoose.Types.ObjectId.isValid(itemId) || !mongoose.Types.ObjectId.isValid(userId)) {
    console.warn(`[ItemService Mongoose] Invalid ObjectId format for itemId or userId in updateItem.`);
    return null;
  }

  // Find and update the item, ensuring it belongs to the user.
  // { new: true } option returns the modified document rather than the original.
  const updatedItem = await Item.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(itemId), userId: new mongoose.Types.ObjectId(userId) },
    { $set: updates }, // Use $set to apply updates
    { new: true, runValidators: true } // runValidators ensures schema validations are checked on update
  ).exec();

  if (updatedItem) {
    console.log(`[ItemService Mongoose] Item ID ${itemId} updated successfully.`);
  } else {
    console.log(`[ItemService Mongoose] Item ID ${itemId} not found for user ${userId} or update failed.`);
  }
  return updatedItem;
};

/**
 * Deletes an item by its ID from the database.
 * @param itemId The ID of the item to delete.
 * @param userId The ID of the user attempting deletion (for ownership check).
 * @returns True if deletion was successful (item found and deleted), false otherwise.
 */
export const deleteItem = async (itemId: string, userId: string): Promise<boolean> => {
  console.log(`[ItemService Mongoose] Deleting item ID: ${itemId} for user ${userId}`);
   if (!mongoose.Types.ObjectId.isValid(itemId) || !mongoose.Types.ObjectId.isValid(userId)) {
    console.warn(`[ItemService Mongoose] Invalid ObjectId format for itemId or userId in deleteItem.`);
    return false;
  }

  const result = await Item.deleteOne({
    _id: new mongoose.Types.ObjectId(itemId),
    userId: new mongoose.Types.ObjectId(userId)
  }).exec();

  if (result.deletedCount && result.deletedCount > 0) {
    console.log(`[ItemService Mongoose] Item ID ${itemId} deleted successfully for user ${userId}.`);
    return true;
  }
  console.log(`[ItemService Mongoose] Item ID ${itemId} not found for user ${userId} or deletion failed.`);
  return false;
};

// Helper for clearing items during tests (if using a test database)
export const _clearItemsForTesting = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'test') {
    console.log('[ItemService Mongoose Test] Clearing all items from database.');
    await Item.deleteMany({});
  } else {
    console.warn('[ItemService Mongoose Test] _clearItemsForTesting should only be called in test environments.');
  }
};

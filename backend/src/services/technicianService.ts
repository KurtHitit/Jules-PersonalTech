// backend/src/services/technicianService.ts
import Technician, { ITechnician } from '../models/Technician';
import mongoose from 'mongoose';

// DTO for creating a technician
export interface CreateTechnicianDTO {
  name: string;
  businessName?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  servicesOffered: string[];
  specialties?: string[];
  bio?: string;
  website?: string;
  profilePictureUrl?: string;
}

// DTO for updating a technician
export type UpdateTechnicianDTO = Partial<CreateTechnicianDTO>;

/**
 * Creates a new technician in the database.
 * @param technicianData Data for the new technician.
 * @returns The newly created technician document.
 */
export const createTechnician = async (technicianData: CreateTechnicianDTO): Promise<ITechnician> => {
  console.log(`[TechnicianService] Creating technician: ${technicianData.name}`);

  const newTechnician = new Technician({
    ...technicianData,
  });

  await newTechnician.save();
  console.log(`[TechnicianService] Technician created with ID: ${newTechnician._id}`);
  return newTechnician;
};

/**
 * Retrieves all technicians from the database.
 * @returns A list of technician documents.
 */
export const getAllTechnicians = async (): Promise<ITechnician[]> => {
  console.log('[TechnicianService] Fetching all technicians...');
  const technicians = await Technician.find({}).sort({ name: 1 }).exec();
  console.log(`[TechnicianService] Found ${technicians.length} technicians.`);
  return technicians;
};

/**
 * Retrieves a single technician by ID.
 * @param technicianId The ID of the technician to retrieve.
 * @returns The technician document if found, otherwise null.
 */
export const getTechnicianById = async (technicianId: string): Promise<ITechnician | null> => {
  console.log(`[TechnicianService] Fetching technician ID: ${technicianId}`);
  if (!mongoose.Types.ObjectId.isValid(technicianId)) {
    console.warn(`[TechnicianService] Invalid ObjectId for technicianId: ${technicianId}`);
    return null;
  }

  const technician = await Technician.findById(technicianId).exec();

  if (technician) {
    console.log(`[TechnicianService] Technician found: ${technician.name}`);
  } else {
    console.log(`[TechnicianService] Technician with ID ${technicianId} not found.`);
  }
  return technician;
};

/**
 * Updates an existing technician.
 * @param technicianId The ID of the technician to update.
 * @param updates Partial data containing the updates.
 * @returns The updated technician document, or null if not found.
 */
export const updateTechnician = async (
  technicianId: string,
  updates: UpdateTechnicianDTO
): Promise<ITechnician | null> => {
  console.log(`[TechnicianService] Updating technician ID: ${technicianId}`);
  if (!mongoose.Types.ObjectId.isValid(technicianId)) {
    console.warn(`[TechnicianService] Invalid ObjectId for technicianId in updateTechnician.`);
    return null;
  }

  const updatedTechnician = await Technician.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(technicianId) },
    { $set: updates },
    { new: true, runValidators: true }
  ).exec();

  if (updatedTechnician) {
    console.log(`[TechnicianService] Technician ID ${technicianId} updated successfully.`);
  } else {
    console.log(`[TechnicianService] Technician ID ${technicianId} not found or update failed.`);
  }
  return updatedTechnician;
};

/**
 * Deletes a technician by its ID.
 * @param technicianId The ID of the technician to delete.
 * @returns True if deletion was successful, false otherwise.
 */
export const deleteTechnician = async (technicianId: string): Promise<boolean> => {
  console.log(`[TechnicianService] Deleting technician ID: ${technicianId}`);
  if (!mongoose.Types.ObjectId.isValid(technicianId)) {
    console.warn(`[TechnicianService] Invalid ObjectId for technicianId in deleteTechnician.`);
    return false;
  }

  const result = await Technician.deleteOne({ _id: new mongoose.Types.ObjectId(technicianId) }).exec();

  if (result.deletedCount && result.deletedCount > 0) {
    console.log(`[TechnicianService] Technician ID ${technicianId} deleted successfully.`);
    return true;
  }
  console.log(`[TechnicianService] Technician ID ${technicianId} not found or deletion failed.`);
  return false;
};

// Helper for clearing technicians during tests (if using a test database)
export const _clearTechniciansForTesting = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'test') {
    console.log('[TechnicianService Test] Clearing all technicians from database.');
    await Technician.deleteMany({});
  } else {
    console.warn('[TechnicianService Test] _clearTechniciansForTesting should only be called in test environments.');
  }
};

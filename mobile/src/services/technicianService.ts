// mobile/src/services/technicianService.ts
import apiClient from "./apiClient";
import { ITechnician } from "../../../backend/src/models/Technician";

export type Technician = ITechnician;

// DTO for creating a technician (for admin use, if needed from mobile)
export interface CreateTechnicianData {
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
export type UpdateTechnicianData = Partial<CreateTechnicianData>;

/**
 * Fetches all technicians.
 * @returns A promise that resolves to an array of Technician objects.
 */
export const fetchTechnicians = async (): Promise<Technician[]> => {
  console.log("[TechnicianService API] Fetching technicians...");
  try {
    const response = await apiClient.get<{ technicians: Technician[] }>(
      "/technicians"
    );
    console.log("[TechnicianService API] Technicians fetched successfully.");
    return response.data.technicians || [];
  } catch (error: any) {
    console.error(
      "[TechnicianService API] Failed to fetch technicians:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch technicians."
    );
  }
};

/**
 * Fetches a single technician by ID.
 * @param technicianId The ID of the technician to fetch.
 * @returns A promise that resolves to the Technician object, or null if not found.
 */
export const getTechnicianById = async (
  technicianId: string
): Promise<Technician | null> => {
  console.log(
    `[TechnicianService API] Fetching technician by ID: ${technicianId}`
  );
  try {
    const response = await apiClient.get<{ technician: Technician }>(
      `/technicians/${technicianId}`
    );
    console.log(
      "[TechnicianService API] Technician fetched successfully:",
      response.data.technician.name
    );
    return response.data.technician;
  } catch (error: any) {
    console.error(
      `[TechnicianService API] Failed to fetch technician ${technicianId}:`,
      error.response?.data?.message || error.message
    );
    if (error.response?.status === 404) {
      return null;
    }
    throw new Error(
      error.response?.data?.message ||
        `Failed to fetch technician ${technicianId}.`
    );
  }
};

// Admin/Internal use only from mobile (if applicable)
export const createTechnician = async (
  data: CreateTechnicianData
): Promise<Technician> => {
  console.log(`[TechnicianService API] Creating technician: ${data.name}`);
  try {
    const response = await apiClient.post<{ technician: Technician }>(
      "/technicians",
      data
    );
    console.log(
      "[TechnicianService API] Technician created successfully:",
      response.data.technician.name
    );
    return response.data.technician;
  } catch (error: any) {
    console.error(
      "[TechnicianService API] Failed to create technician:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create technician."
    );
  }
};

export const updateTechnician = async (
  technicianId: string,
  updates: UpdateTechnicianData
): Promise<Technician> => {
  console.log(
    `[TechnicianService API] Updating technician ${technicianId}:`,
    updates.name
  );
  try {
    const response = await apiClient.put<{ technician: Technician }>(
      `/technicians/${technicianId}`,
      updates
    );
    console.log(
      `[TechnicianService API] Technician ${technicianId} updated successfully.`
    );
    return response.data.technician;
  } catch (error: any) {
    console.error(
      `[TechnicianService API] Failed to update technician ${technicianId}:`,
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        `Failed to update technician ${technicianId}.`
    );
  }
};

export const deleteTechnician = async (technicianId: string): Promise<void> => {
  console.log(`[TechnicianService API] Deleting technician ${technicianId}`);
  try {
    await apiClient.delete(`/technicians/${technicianId}`);
    console.log(
      `[TechnicianService API] Technician ${technicianId} deleted successfully.`
    );
  } catch (error: any) {
    console.error(
      `[TechnicianService API] Failed to delete technician ${technicianId}:`,
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        `Failed to delete technician ${technicianId}.`
    );
  }
};

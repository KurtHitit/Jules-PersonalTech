// mobile/src/services/listingService.ts
import apiClient from './apiClient';
import { IListing } from '../../../backend/src/models/Listing';

export type Listing = IListing;

export interface CreateListingData {
  item: string;
  description?: string;
  price: number;
  currency: string;
  condition: 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair' | 'For Parts';
  photos?: { url: string; caption?: string }[];
}

export const createListing = async (data: CreateListingData): Promise<Listing> => {
  const response = await apiClient.post('/listings', data);
  return response.data;
};

export const getListings = async (): Promise<Listing[]> => {
  const response = await apiClient.get('/listings');
  return response.data;
};

export const getListingById = async (id: string): Promise<Listing> => {
  const response = await apiClient.get(`/listings/${id}`);
  return response.data;
};

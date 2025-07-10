// backend/src/services/listingService.ts
import Listing, { IListing } from '../models/Listing';
import mongoose from 'mongoose';
import { IUser } from '../models/User';

export interface CreateListingDTO {
  item: string;
  description?: string;
  price: number;
  currency: string;
  condition: 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair' | 'For Parts';
  photos?: { url: string; caption?: string; isPrimary?: boolean }[];
}

export interface UpdateListingDTO extends Partial<CreateListingDTO> {
  status?: 'active' | 'sold' | 'pending' | 'cancelled';
}

export const createListing = async (sellerId: string, listingData: CreateListingDTO): Promise<IListing> => {
  const newListing = new Listing({
    seller: new mongoose.Types.ObjectId(sellerId),
    ...listingData,
  });
  await newListing.save();
  return newListing;
};

export const getListingById = async (listingId: string): Promise<IListing | null> => {
  return Listing.findById(listingId).populate<{ seller: IUser }>('seller', 'firstName lastName email');
};

export const getAllListings = async (status?: IListing['status']): Promise<IListing[]> => {
  const query: any = {};
  if (status) {
    query.status = status;
  }
  return Listing.find(query).populate('seller', 'firstName lastName').sort({ createdAt: -1 });
};

export const updateListing = async (listingId: string, updates: UpdateListingDTO): Promise<IListing | null> => {
  return Listing.findByIdAndUpdate(listingId, { $set: updates }, { new: true, runValidators: true });
};

export const deleteListing = async (listingId: string): Promise<boolean> => {
  const result = await Listing.deleteOne({ _id: listingId });
  return result.deletedCount === 1;
};

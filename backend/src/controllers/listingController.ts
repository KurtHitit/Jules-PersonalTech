// backend/src/controllers/listingController.ts
import { Request, Response } from 'express';
import * as listingService from '../services/listingService';

export const createListing = async (req: Request, res: Response): Promise<void> => {
  const sellerId = req.user!.id;
  const { item, description, price, currency, condition, photos } = req.body;

  try {
    const newListing = await listingService.createListing(sellerId, { item, description, price, currency, condition, photos });
    res.status(201).json(newListing);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error creating listing', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error creating listing', error: 'Unknown error' });
    }
  }
};

export const getListingById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const listing = await listingService.getListingById(id);
    if (listing) {
      res.status(200).json(listing);
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error getting listing', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error getting listing', error: 'Unknown error' });
    }
  }
};

export const getAllListings = async (req: Request, res: Response): Promise<void> => {
  const { status } = req.query;
  try {
    const listings = await listingService.getAllListings(status as any);
    res.status(200).json(listings);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error getting all listings', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error getting all listings', error: 'Unknown error' });
    }
  }
};

export const updateListing = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedListing = await listingService.updateListing(id, updates);
    if (updatedListing) {
      res.status(200).json(updatedListing);
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error updating listing', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error updating listing', error: 'Unknown error' });
    }
  }
};

export const deleteListing = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const success = await listingService.deleteListing(id);
    if (success) {
      res.status(200).json({ message: 'Listing deleted successfully' });
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error deleting listing', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error deleting listing', error: 'Unknown error' });
    }
  }
};

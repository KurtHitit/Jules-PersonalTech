// backend/src/controllers/technicianController.ts
import { Request, Response } from 'express';
import * as technicianService from '../services/technicianService';

// @desc    Create a new technician
// @route   POST /api/technicians
// @access  Private (admin/internal use)
export const createTechnician = async (req: Request, res: Response): Promise<void> => {
  try {
    const technicianData = req.body; // Expects name, contactEmail, servicesOffered, etc.

    const newTechnician = await technicianService.createTechnician(technicianData);

    res.status(201).json({
      message: 'Technician created successfully',
      technician: newTechnician,
    });
  } catch (error) {
    console.error('Error creating technician:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error creating technician', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error creating technician', error: 'Unknown error' });
    }
  }
};

// @desc    Get all technicians
// @route   GET /api/technicians
// @access  Public (or Private if only logged-in users can view)
export const getAllTechnicians = async (req: Request, res: Response): Promise<void> => {
  try {
    const technicians = await technicianService.getAllTechnicians();

    res.status(200).json({
      message: 'Technicians fetched successfully',
      technicians: technicians,
    });
  } catch (error) {
    console.error('Error fetching technicians:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error fetching technicians', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error fetching technicians', error: 'Unknown error' });
    }
  }
};

// @desc    Get a single technician by ID
// @route   GET /api/technicians/:id
// @access  Public (or Private)
export const getTechnicianById = async (req: Request, res: Response): Promise<void> => {
  try {
    const technicianId = req.params.id;
    const technician = await technicianService.getTechnicianById(technicianId);

    if (technician) {
      res.status(200).json({ message: 'Technician fetched successfully', technician: technician });
    } else {
      res.status(404).json({ message: 'Technician not found' });
    }
  } catch (error) {
    console.error(`Error fetching technician ${req.params.id}:`, error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error fetching technician', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error fetching technician', error: 'Unknown error' });
    }
  }
};

// @desc    Update a technician
// @route   PUT /api/technicians/:id
// @access  Private (admin/internal use)
export const updateTechnician = async (req: Request, res: Response): Promise<void> => {
  try {
    const technicianId = req.params.id;
    const updates = req.body;

    const updatedTechnician = await technicianService.updateTechnician(technicianId, updates);

    if (updatedTechnician) {
      res.status(200).json({ message: 'Technician updated successfully', technician: updatedTechnician });
    } else {
      res.status(404).json({ message: 'Technician not found or update failed' });
    }
  } catch (error) {
    console.error(`Error updating technician ${req.params.id}:`, error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error updating technician', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error updating technician', error: 'Unknown error' });
    }
  }
};

// @desc    Delete a technician
// @route   DELETE /api/technicians/:id
// @access  Private (admin/internal use)
export const deleteTechnician = async (req: Request, res: Response): Promise<void> => {
  try {
    const technicianId = req.params.id;
    const success = await technicianService.deleteTechnician(technicianId);

    if (success) {
      res.status(200).json({ message: 'Technician deleted successfully' });
    } else {
      res.status(404).json({ message: 'Technician not found or deletion failed' });
    }
  } catch (error) {
    console.error(`Error deleting technician ${req.params.id}:`, error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error deleting technician', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error deleting technician', error: 'Unknown error' });
    }
  }
};

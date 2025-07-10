// backend/src/controllers/disputeController.ts
import { Request, Response } from 'express';
import * as disputeService from '../services/disputeService';

export const createDispute = async (req: Request, res: Response): Promise<void> => {
  const initiatorId = req.user!.id;
  const { orderId, reason, description } = req.body;

  try {
    const newDispute = await disputeService.createDispute(initiatorId, { orderId, reason, description });
    res.status(201).json(newDispute);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error creating dispute', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error creating dispute', error: 'Unknown error' });
    }
  }
};

export const getUserDisputes = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  try {
    const disputes = await disputeService.getUserDisputes(userId);
    res.status(200).json(disputes);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error getting user disputes', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error getting user disputes', error: 'Unknown error' });
    }
  }
};

export const getAllDisputes = async (req: Request, res: Response): Promise<void> => {
  const { status } = req.query;
  try {
    const disputes = await disputeService.getAllDisputes(status as any);
    res.status(200).json(disputes);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error getting all disputes', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error getting all disputes', error: 'Unknown error' });
    }
  }
};

export const updateDispute = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedDispute = await disputeService.updateDispute(id, updates);
    if (updatedDispute) {
      res.status(200).json(updatedDispute);
    } else {
      res.status(404).json({ message: 'Dispute not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error updating dispute', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error updating dispute', error: 'Unknown error' });
    }
  }
};

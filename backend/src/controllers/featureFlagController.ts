// backend/src/controllers/featureFlagController.ts
import { Request, Response } from 'express';
import * as featureFlagService from '../services/featureFlagService';

export const getFeatureFlag = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.params;
  try {
    const isEnabled = await featureFlagService.getFeatureFlag(name);
    res.status(200).json({ name, isEnabled });
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error getting feature flag', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error getting feature flag', error: 'Unknown error' });
    }
  }
};

export const setFeatureFlag = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.params;
  const { isEnabled, description } = req.body;

  if (typeof isEnabled !== 'boolean') {
    res.status(400).json({ message: 'isEnabled must be a boolean.' });
    return;
  }

  try {
    const updatedFlag = await featureFlagService.setFeatureFlag(name, isEnabled, description);
    res.status(200).json({ message: 'Feature flag updated successfully', flag: updatedFlag });
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error setting feature flag', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error setting feature flag', error: 'Unknown error' });
    }
  }
};

export const getAllFeatureFlags = async (req: Request, res: Response): Promise<void> => {
  try {
    const flags = await featureFlagService.getAllFeatureFlags();
    res.status(200).json(flags);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error getting all feature flags', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error getting all feature flags', error: 'Unknown error' });
    }
  }
};

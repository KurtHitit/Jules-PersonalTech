// backend/src/controllers/referralController.ts
import { Request, Response } from 'express';
import * as referralService from '../services/referralService';

export const getMyReferralCode = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  try {
    const code = await referralService.assignReferralCode(userId);
    res.status(200).json({ referralCode: code });
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error getting referral code', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error getting referral code', error: 'Unknown error' });
    }
  }
};

export const validateReferralCode = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.query;
  if (!code || typeof code !== 'string') {
    res.status(400).json({ message: 'Referral code is required' });
    return;
  }
  try {
    const userId = await referralService.validateReferralCode(code);
    if (userId) {
      res.status(200).json({ isValid: true, userId });
    } else {
      res.status(200).json({ isValid: false });
    }
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error validating referral code', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error validating referral code', error: 'Unknown error' });
    }
  }
};

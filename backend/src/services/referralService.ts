// backend/src/services/referralService.ts
import User from '../models/User';
import crypto from 'crypto';

export const generateReferralCode = (): string => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

export const assignReferralCode = async (userId: string): Promise<string> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  if (!user.referralCode) {
    user.referralCode = generateReferralCode();
    await user.save();
  }
  return user.referralCode;
};

export const validateReferralCode = async (code: string): Promise<string | null> => {
  const user = await User.findOne({ referralCode: code });
  return user ? (user._id as any).toString() : null;
};

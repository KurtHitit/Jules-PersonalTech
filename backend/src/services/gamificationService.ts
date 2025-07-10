// backend/src/services/gamificationService.ts
import Gamification, { IGamification } from '../models/Gamification';
import Item from '../models/Item';
import ServiceHistory from '../models/ServiceHistory';
import Review from '../models/Review';

export const getGamificationData = async (userId: string): Promise<IGamification | null> => {
  let gamificationData = await Gamification.findOne({ user: userId });

  if (!gamificationData) {
    gamificationData = await Gamification.create({ user: userId });
  }

  return gamificationData;
};

export const calculateGoodOwnerScore = async (userId: string): Promise<number> => {
  const itemCount = await Item.countDocuments({ userId });
  const serviceHistoryCount = await ServiceHistory.countDocuments({ userId });
  const reviewCount = await Review.countDocuments({ user: userId });

  // This is a simple scoring algorithm. It can be made more complex.
  const score = (itemCount * 10) + (serviceHistoryCount * 20) + (reviewCount * 5);

  const gamification = await Gamification.findOneAndUpdate(
    { user: userId },
    { goodOwnerScore: score },
    { new: true, upsert: true }
  );

  return gamification.goodOwnerScore;
};

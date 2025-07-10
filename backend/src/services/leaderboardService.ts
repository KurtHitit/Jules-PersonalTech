// backend/src/services/leaderboardService.ts
import User from '../models/User';
import Gamification from '../models/Gamification';
import { IUser } from '../models/User';

export const getLeaderboard = async (): Promise<any[]> => {
  const leaderboard = await Gamification.find()
    .sort({ xp: -1 })
    .limit(100)
    .populate('user', 'firstName lastName');

  return leaderboard.map(entry => ({
    _id: (entry.user as IUser)._id,
    firstName: (entry.user as IUser).firstName,
    lastName: (entry.user as IUser).lastName,
    xp: entry.xp,
    level: entry.level,
  }));
};

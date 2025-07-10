// backend/src/services/badgeService.ts
import Badge, { IBadge } from '../models/Badge';
import UserBadge, { IUserBadge } from '../models/UserBadge';
import Item from '../models/Item';
import ServiceHistory from '../models/ServiceHistory';
import Review from '../models/Review';

// Define badge criteria
const badgeTriggers = {
  ADD_FIRST_ITEM: 'add_first_item',
  ADD_FIVE_ITEMS: 'add_five_items',
  ADD_FIRST_SERVICE_HISTORY: 'add_first_service_history',
  ADD_FIRST_REVIEW: 'add_first_review',
};

/**
 * Checks and awards badges to a user based on their actions.
 * @param userId The ID of the user to check for.
 * @param trigger The action that triggered the badge check.
 */
export const checkAndAwardBadges = async (userId: string, trigger: string): Promise<void> => {
  const userBadges = await UserBadge.find({ user: userId }).populate('badge');
  const earnedBadgeNames = userBadges.map(ub => (ub.badge as IBadge).name);

  switch (trigger) {
    case badgeTriggers.ADD_FIRST_ITEM:
      if (!earnedBadgeNames.includes('First Item Added')) {
        const itemCount = await Item.countDocuments({ userId });
        if (itemCount >= 1) {
          await awardBadge(userId, 'First Item Added');
        }
      }
      break;
    case badgeTriggers.ADD_FIVE_ITEMS:
      if (!earnedBadgeNames.includes('Item Collector')) {
        const itemCount = await Item.countDocuments({ userId });
        if (itemCount >= 5) {
          await awardBadge(userId, 'Item Collector');
        }
      }
      break;
    case badgeTriggers.ADD_FIRST_SERVICE_HISTORY:
      if (!earnedBadgeNames.includes('Maintenance Pro')) {
        const serviceHistoryCount = await ServiceHistory.countDocuments({ userId });
        if (serviceHistoryCount >= 1) {
          await awardBadge(userId, 'Maintenance Pro');
        }
      }
      break;
    case badgeTriggers.ADD_FIRST_REVIEW:
      if (!earnedBadgeNames.includes('Reviewer')) {
        const reviewCount = await Review.countDocuments({ user: userId });
        if (reviewCount >= 1) {
          await awardBadge(userId, 'Reviewer');
        }
      }
      break;
  }
};



import { getClient } from '../config/websocket';

/**
 * Awards a badge to a user.
 * @param userId The ID of the user to award the badge to.
 * @param badgeName The name of the badge to award.
 */
export const awardBadge = async (userId: string, badgeName: string): Promise<IUserBadge | null> => {
  const badge = await Badge.findOne({ name: badgeName });
  if (badge) {
    const existingUserBadge = await UserBadge.findOne({ user: userId, badge: badge._id });
    if (!existingUserBadge) {
      const userBadge = new UserBadge({ user: userId, badge: badge._id });
      await userBadge.save();

      const client = getClient(userId);
      if (client) {
        client.send(JSON.stringify({ type: 'badge_earned', data: { badgeName } }));
      }

      return userBadge;
    }
  }
  return null;
};

/**
 * Gets all badges for a user.
 * @param userId The ID of the user.
 * @returns A list of the user's earned badges.
 */
export const getUserBadges = async (userId: string): Promise<IUserBadge[]> => {
  return UserBadge.find({ user: userId }).populate('badge');
};

/**
 * Gets all available badges.
 * @returns A list of all badges.
 */
export const getAllBadges = async (): Promise<IBadge[]> => {
  return Badge.find({});
};

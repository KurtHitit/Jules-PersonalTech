// backend/src/models/UserBadge.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';
import { IBadge } from './Badge';

export interface IUserBadge extends Document {
  user: IUser['_id'];
  badge: IBadge['_id'];
  earnedAt: Date;
}

const userBadgeSchema: Schema<IUserBadge> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    badge: { type: Schema.Types.ObjectId, required: true, ref: 'Badge' },
    earnedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    unique: ['user', 'badge'], // A user can only earn a badge once
  }
);

userBadgeSchema.index({ user: 1, earnedAt: -1 });

const UserBadge: Model<IUserBadge> = mongoose.model<IUserBadge>('UserBadge', userBadgeSchema);

export default UserBadge;

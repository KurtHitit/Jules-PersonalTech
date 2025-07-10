// backend/src/models/Gamification.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export interface IGamification extends Document {
  user: IUser['_id'];
  xp: number;
  level: number;
  goodOwnerScore: number;
}

const gamificationSchema: Schema<IGamification> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User', unique: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    goodOwnerScore: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Gamification: Model<IGamification> = mongoose.model<IGamification>('Gamification', gamificationSchema);

export default Gamification;

// backend/src/models/Badge.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBadge extends Document {
  name: string;
  description: string;
  icon: string; // URL to the badge icon
  criteria: string; // A human-readable description of how to earn the badge
}

const badgeSchema: Schema<IBadge> = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, required: true },
    criteria: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Badge: Model<IBadge> = mongoose.model<IBadge>('Badge', badgeSchema);

export default Badge;

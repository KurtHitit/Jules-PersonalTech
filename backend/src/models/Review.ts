// backend/src/models/Review.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';
import { ITechnician } from './Technician';

export interface IReview extends Document {
  technician: ITechnician['_id'];
  user: IUser['_id'];
  rating: number; // 1 to 5 stars
  comment?: string;
}

const reviewSchema: Schema<IReview> = new Schema(
  {
    technician: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Technician',
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ technician: 1, user: 1 }, { unique: true }); // A user can only review a technician once

const Review: Model<IReview> = mongoose.model<IReview>('Review', reviewSchema);

export default Review;

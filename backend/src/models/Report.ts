// backend/src/models/Report.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export interface IReport extends Document {
  reporter: IUser['_id'];
  reportedEntityType: 'ForumThread' | 'ForumPost' | 'User' | 'Review'; // Type of entity being reported
  reportedEntityId: mongoose.Types.ObjectId; // ID of the reported entity
  reason: string; // Reason for the report
  status: 'pending' | 'reviewed' | 'resolved';
  notes?: string; // Internal notes for moderation
}

const reportSchema: Schema<IReport> = new Schema(
  {
    reporter: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    reportedEntityType: {
      type: String,
      required: true,
      enum: ['ForumThread', 'ForumPost', 'User', 'Review'],
    },
    reportedEntityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'reviewed', 'resolved'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ reportedEntityType: 1, reportedEntityId: 1 });
reportSchema.index({ reporter: 1, reportedEntityId: 1 }, { unique: true }); // Prevent duplicate reports from same user

const Report: Model<IReport> = mongoose.model<IReport>('Report', reportSchema);

export default Report;

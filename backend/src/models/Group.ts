// backend/src/models/Group.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export interface IGroup extends Document {
  name: string;
  description?: string;
  creator: IUser['_id'];
  members: IUser['_id'][];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const groupSchema: Schema<IGroup> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for efficient queries
groupSchema.index({ name: 'text', description: 'text' });
groupSchema.index({ creator: 1 });

const Group: Model<IGroup> = mongoose.model<IGroup>('Group', groupSchema);

export default Group;

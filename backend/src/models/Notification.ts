// backend/src/models/Notification.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export interface INotification extends Document {
  userId: IUser['_id'];
  type: 'mention' | 'reply' | 'group_invite' | 'system';
  message: string;
  read: boolean;
  link?: string; // Optional link to the related content (e.g., forum thread)
  relatedEntityId?: mongoose.Types.ObjectId; // ID of the related entity (e.g., ForumThread ID)
}

const notificationSchema: Schema<INotification> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    type: {
      type: String,
      required: true,
      enum: ['mention', 'reply', 'group_invite', 'system'],
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
    relatedEntityId: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ userId: 1, read: 1 });

const Notification: Model<INotification> = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;

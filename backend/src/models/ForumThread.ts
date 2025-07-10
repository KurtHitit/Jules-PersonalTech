// backend/src/models/ForumThread.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';
import { IGroup } from './Group';

export interface IForumThread extends Document {
  title: string;
  content: string;
  author: IUser['_id'];
  group?: IGroup['_id'];
  tags?: string[];
  upvotes: number;
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  lastReplyAt: Date;
}

const forumThreadSchema: Schema<IForumThread> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
    tags: [{ type: String, trim: true }],
    upvotes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    lastReplyAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

forumThreadSchema.index({ title: 'text', content: 'text', tags: 'text' });

const ForumThread: Model<IForumThread> = mongoose.model<IForumThread>('ForumThread', forumThreadSchema);

export default ForumThread;

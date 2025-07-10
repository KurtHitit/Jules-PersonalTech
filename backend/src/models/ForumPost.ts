// backend/src/models/ForumPost.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';
import { IForumThread } from './ForumThread';

export interface IForumPost extends Document {
  thread: IForumThread['_id'];
  author: IUser['_id'];
  content: string;
  isAnswer: boolean;
  mentions?: IUser['_id'][];
  images?: string[]; // Array of image URLs
  upvotes: number;
  isAcceptedAnswer: boolean;
}

const forumPostSchema: Schema<IForumPost> = new Schema(
  {
    thread: { type: Schema.Types.ObjectId, required: true, ref: 'ForumThread' },
    author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    content: { type: String, required: true },
    isAnswer: { type: Boolean, default: false },
    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    upvotes: {
      type: Number,
      default: 0,
    },
    isAcceptedAnswer: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ForumPost: Model<IForumPost> = mongoose.model<IForumPost>('ForumPost', forumPostSchema);

export default ForumPost;

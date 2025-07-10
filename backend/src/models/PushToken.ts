// backend/src/models/PushToken.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export interface IPushToken extends Document {
  userId: IUser['_id'];
  token: string;
  createdAt: Date;
}

const pushTokenSchema: Schema<IPushToken> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

pushTokenSchema.index({ userId: 1 });

const PushToken: Model<IPushToken> = mongoose.model<IPushToken>('PushToken', pushTokenSchema);

export default PushToken;

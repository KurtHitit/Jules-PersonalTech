// backend/src/models/Message.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';
import { ITechnician } from './Technician';

export interface IMessage extends Document {
  senderId: IUser['_id'] | ITechnician['_id'];
  receiverId: IUser['_id'] | ITechnician['_id'];
  message: string;
  isRead: boolean;
  createdAt: Date;
  senderModel: string; // Add senderModel to interface
  receiverModel: string; // Add receiverModel to interface
}

const messageSchema: Schema<IMessage> = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'senderModel',
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'receiverModel',
    },
    senderModel: {
      type: String,
      required: true,
      enum: ['User', 'Technician'],
    },
    receiverModel: {
      type: String,
      required: true,
      enum: ['User', 'Technician'],
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Message: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);

export default Message;

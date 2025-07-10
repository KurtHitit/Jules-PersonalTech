// backend/src/models/Dispute.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IOrder } from './Order';
import { IUser } from './User';

export interface IDispute extends Document {
  order: IOrder['_id'];
  initiator: IUser['_id']; // User who initiated the dispute
  reason: string;
  description?: string;
  status: 'open' | 'under_review' | 'resolved_buyer' | 'resolved_seller' | 'closed';
  resolutionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const disputeSchema: Schema<IDispute> = new Schema(
  {
    order: { type: Schema.Types.ObjectId, required: true, ref: 'Order', unique: true }, // One dispute per order
    initiator: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    reason: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ['open', 'under_review', 'resolved_buyer', 'resolved_seller', 'closed'],
      default: 'open',
    },
    resolutionNotes: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

const Dispute: Model<IDispute> = mongoose.model<IDispute>('Dispute', disputeSchema);

export default Dispute;

// backend/src/models/Order.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';
import { IListing } from './Listing';

export interface IOrder extends Document {
  listing: IListing['_id'];
  buyer: IUser['_id'];
  seller: IUser['_id'];
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  paymentIntentId?: string; // Stripe Payment Intent ID
  clientSecret?: string; // Stripe Client Secret for frontend confirmation
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema: Schema<IOrder> = new Schema(
  {
    listing: { type: Schema.Types.ObjectId, required: true, ref: 'Listing' },
    buyer: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    seller: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, trim: true, uppercase: true, maxlength: 3 },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled', 'refunded'],
      default: 'pending',
    },
    paymentIntentId: { type: String },
    clientSecret: { type: String },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ seller: 1, createdAt: -1 });

const Order: Model<IOrder> = mongoose.model<IOrder>('Order', orderSchema);

export default Order;

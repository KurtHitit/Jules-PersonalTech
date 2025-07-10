// backend/src/models/Listing.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';
import { IItemPhoto } from './Item';

export interface IListing extends Document {
  seller: IUser['_id'];
  item: string; // Name or description of the item being sold
  description?: string;
  price: number;
  currency: string;
  condition: 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair' | 'For Parts';
  photos?: IItemPhoto[];
  status: 'active' | 'sold' | 'pending' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export type PopulatedListing = IListing & { seller: IUser };

const listingSchema: Schema<IListing> = new Schema(
  {
    seller: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    item: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, trim: true, uppercase: true, maxlength: 3 },
    condition: {
      type: String,
      required: true,
      enum: ['New', 'Used - Like New', 'Used - Good', 'Used - Fair', 'For Parts'],
    },
    photos: [
      {
        url: { type: String, required: true },
        caption: { type: String },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'sold', 'pending', 'cancelled'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

listingSchema.index({ item: 'text', description: 'text' });
listingSchema.index({ seller: 1, status: 1 });

const Listing: Model<IListing> = mongoose.model<IListing>('Listing', listingSchema);

export default Listing;

// backend/src/models/Item.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User'; // To reference the User type

// Interface for embedded Photo subdocument
export interface IItemPhoto {
  url: string; // URL or path to the photo
  caption?: string;
  isPrimary?: boolean; // Optional: to mark a primary photo
}

const itemPhotoSchema: Schema<IItemPhoto> = new Schema({
  url: { type: String, required: true },
  caption: { type: String },
  isPrimary: { type: Boolean, default: false },
}, { _id: false }); // _id: false if you don't need separate IDs for photos within the item

// Interface for embedded Document subdocument
export interface IItemDocument {
  url: string; // URL or path to the document
  filename: string;
  type: 'receipt' | 'warranty' | 'manual' | 'other'; // Document type
  uploadedAt?: Date;
}

export const itemDocumentSchema: Schema<IItemDocument> = new Schema({
  url: { type: String, required: true },
  filename: { type: String, required: true },
  type: {
    type: String,
    enum: ['receipt', 'warranty', 'manual', 'other'],
    required: true,
  },
  uploadedAt: { type: Date, default: Date.now },
}, { _id: false });


// Interface for Item document (extends Mongoose Document)
export interface IItem extends Document {
  userId: IUser['_id']; // Reference to the User who owns the item
  name: string;
  category?: string;
  brand?: string;
  itemModel?: string;
  serialNumber?: string;
  purchaseDate?: Date;
  purchasePrice?: number;
  currency?: string; // e.g., USD, EUR
  retailer?: string;
  notes?: string;
  warrantyExpirationDate?: Date;
  photos?: IItemPhoto[]; // Array of photo subdocuments
  documents?: IItemDocument[]; // Array of document subdocuments
  createdAt: Date; // Provided by timestamps
  updatedAt: Date; // Provided by timestamps
}

const itemSchema: Schema<IItem> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Creates a reference to the User model
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    category: { type: String, trim: true },
    brand: { type: String, trim: true },
    itemModel: { type: String, trim: true },
    serialNumber: { type: String, trim: true },
    purchaseDate: { type: Date },
    purchasePrice: { type: Number, min: 0 },
    currency: { type: String, trim: true, uppercase: true, maxlength: 3 },
    retailer: { type: String, trim: true },
    notes: { type: String, trim: true },
    warrantyExpirationDate: { type: Date },
    photos: [itemPhotoSchema], // Embed the photo schema as an array
    documents: [itemDocumentSchema], // Embed the document schema as an array
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
    // toJSON: { virtuals: true }, // If you add virtual 'id'
    // toObject: { virtuals: true },
  }
);

// Optional: Indexing common query fields can improve performance
itemSchema.index({ userId: 1 });
itemSchema.index({ name: 'text', category: 'text', brand: 'text' }); // For text searches

// itemSchema.virtual('id').get(function() {
//   return this._id.toHexString();
// });

const Item: Model<IItem> = mongoose.model<IItem>('Item', itemSchema);

export default Item;

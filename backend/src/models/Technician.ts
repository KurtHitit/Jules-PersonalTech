// backend/src/models/Technician.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for Technician document
export interface ITechnician extends Document {
  name: string;
  businessName?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  servicesOffered: string[]; // e.g., ['Plumbing', 'Electrical', 'HVAC']
  specialties?: string[]; // e.g., ['Boiler Repair', 'Smart Home Installation']
  rating?: number; // Average rating from reviews
  reviewCount?: number;
  bio?: string;
  website?: string;
  profilePictureUrl?: string;
  createdAt: Date; // Provided by timestamps
  updatedAt: Date; // Provided by timestamps
}

const technicianSchema: Schema<ITechnician> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Technician name is required'],
      trim: true,
    },
    businessName: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      country: { type: String, trim: true, default: 'USA' },
    },
    servicesOffered: {
      type: [String],
      required: [true, 'At least one service offered is required'],
    },
    specialties: {
      type: [String],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    bio: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    profilePictureUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Indexing for efficient queries

technicianSchema.index({ 'address.zipCode': 1 });
technicianSchema.index({ servicesOffered: 1 });
technicianSchema.index({ name: 'text', businessName: 'text', bio: 'text' }); // For text searches

const Technician: Model<ITechnician> = mongoose.model<ITechnician>('Technician', technicianSchema);

export default Technician;

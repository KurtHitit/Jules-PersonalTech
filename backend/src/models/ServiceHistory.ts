// backend/src/models/ServiceHistory.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IItem } from './Item'; // To reference the Item type
import { IItemDocument, itemDocumentSchema } from './Item'; // To reuse the document subdocument interface

// Interface for ServiceHistory document
export interface IServiceHistory extends Document {
  itemId: IItem['_id']; // Reference to the Item this service history belongs to
  serviceType: string; // e.g., 'Repair', 'Maintenance', 'Inspection'
  dateOfService: Date;
  providerDetails?: string; // e.g., 'John Doe Repair', 'Acme Services'
  cost?: number;
  notes?: string;
  documents?: IItemDocument[]; // Reusing the document subdocument for invoices, reports, etc.
  createdAt: Date; // Provided by timestamps
  updatedAt: Date; // Provided by timestamps
}

const serviceHistorySchema: Schema<IServiceHistory> = new Schema(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Item',
    },
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
      trim: true,
    },
    dateOfService: {
      type: Date,
      required: [true, 'Date of service is required'],
    },
    providerDetails: {
      type: String,
      trim: true,
    },
    cost: {
      type: Number,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
    documents: [itemDocumentSchema], // Reusing the schema directly
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Indexing for efficient queries
serviceHistorySchema.index({ itemId: 1, dateOfService: -1 });

const ServiceHistory: Model<IServiceHistory> = mongoose.model<IServiceHistory>('ServiceHistory', serviceHistorySchema);

export default ServiceHistory;

// backend/src/models/Reminder.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User'; // To reference the User type
import { IItem } from './Item'; // To reference the Item type

// Enum for recurrence patterns
enum RecurrencePattern {
  None = 'none',
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Yearly = 'yearly',
}

// Interface for Reminder document
export interface IReminder extends Document {
  userId: IUser['_id']; // Reference to the User who owns the reminder
  itemId?: IItem['_id']; // Optional: Reference to an Item related to the reminder
  title: string;
  notes?: string;
  dueDate: Date;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern; // e.g., 'daily', 'weekly', 'monthly', 'yearly'
  createdAt: Date; // Provided by timestamps
  updatedAt: Date; // Provided by timestamps
}

const reminderSchema: Schema<IReminder> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    itemId: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: false, // Optional field
    },
    title: {
      type: String,
      required: [true, 'Reminder title is required'],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrencePattern: {
      type: String,
      enum: Object.values(RecurrencePattern),
      required: function() { return this.isRecurring; }, // Required if isRecurring is true
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Indexing for efficient queries
reminderSchema.index({ userId: 1, dueDate: 1 });
reminderSchema.index({ itemId: 1, dueDate: 1 });

const Reminder: Model<IReminder> = mongoose.model<IReminder>('Reminder', reminderSchema);

export default Reminder;

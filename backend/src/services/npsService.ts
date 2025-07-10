// backend/src/services/npsService.ts
import mongoose from 'mongoose';

// Define a simple schema for NPS feedback
interface INPSFeedback extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  score: number;
  feedback?: string;
  createdAt: Date;
}

const NPSFeedbackSchema: mongoose.Schema<INPSFeedback> = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    score: { type: Number, required: true, min: 0, max: 10 },
    feedback: { type: String, trim: true },
  },
  { timestamps: true }
);

const NPSFeedback: mongoose.Model<INPSFeedback> = mongoose.model<INPSFeedback>('NPSFeedback', NPSFeedbackSchema);

export const submitNPS = async (userId: string, score: number, feedback?: string): Promise<INPSFeedback> => {
  const newFeedback = new NPSFeedback({
    userId: new mongoose.Types.ObjectId(userId),
    score,
    feedback,
  });
  await newFeedback.save();
  return newFeedback;
};

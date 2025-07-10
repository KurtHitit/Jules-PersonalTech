// backend/src/services/featureFlagService.ts
import mongoose from 'mongoose';

interface IFeatureFlag extends mongoose.Document {
  name: string;
  isEnabled: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeatureFlagSchema: mongoose.Schema<IFeatureFlag> = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    isEnabled: { type: Boolean, required: true, default: false },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

const FeatureFlag: mongoose.Model<IFeatureFlag> = mongoose.model<IFeatureFlag>('FeatureFlag', FeatureFlagSchema);

export const getFeatureFlag = async (name: string): Promise<boolean> => {
  const flag = await FeatureFlag.findOne({ name });
  return flag ? flag.isEnabled : false; // Default to false if flag not found
};

export const setFeatureFlag = async (name: string, isEnabled: boolean, description?: string): Promise<IFeatureFlag> => {
  const flag = await FeatureFlag.findOneAndUpdate(
    { name },
    { isEnabled, description },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return flag;
};

export const getAllFeatureFlags = async (): Promise<IFeatureFlag[]> => {
  return FeatureFlag.find({});
};

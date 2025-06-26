// backend/src/config/database.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config(); // If your .env file is not in the root, specify path: dotenv.config({ path: './backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined in your environment variables.');
  // In a real application, you might want to gracefully shut down or prevent startup.
  // For this script, we'll throw an error to make it obvious during development if it's missing.
  throw new Error('MONGODB_URI is not defined. Please check your .env file or environment configuration.');
}

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI, {
      // Mongoose 6+ no longer requires most of these options as they are default
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true, // Not needed in Mongoose 6+
      // useFindAndModify: false, // Not needed in Mongoose 6+
    });
    console.log('MongoDB Connected Successfully...');
  } catch (err: any) { // Explicitly type err as any or unknown then check type
    console.error('MongoDB Connection Error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;

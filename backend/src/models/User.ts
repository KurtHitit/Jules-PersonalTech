// backend/src/models/User.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface for User document (extends Mongoose Document)
export interface IUser extends Document {
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date; // Provided by timestamps
  updatedAt: Date; // Provided by timestamps
  matchPassword(enteredPassword: string): Promise<boolean>; // Instance method for password comparison
}

// Interface for User model statics (if any, not used here yet)
// interface IUserModel extends Model<IUser> {
//   // findBySomethingStatic(param: string): Promise<IUser | null>;
// }

const userSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'], // Technically passwordHash is required
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
    // Mongoose by default adds an _id field. We can use it as the primary ID.
    // If you want 'id' instead of '_id' as a virtual:
    // toJSON: { virtuals: true },
    // toObject: { virtuals: true },
  }
);

// userSchema.virtual('id').get(function() {
//   return this._id.toHexString();
// });

// Pre-save middleware to hash password if it's modified (e.g. on create or password change)
// This is useful if you set user.password directly and then save.
// However, our current userService.createUser hashes password before calling model.create,
// so this specific hook might be redundant for creation if service handles hashing.
// It's good practice for updates where password might be set directly.
userSchema.pre<IUser>('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('passwordHash') && !this.isNew) { // Check passwordHash if that's what you set
     // If you were setting a plain 'password' field on the model and then hashing it here:
     // if (!this.isModified('password')) return next();
     // For our case, if passwordHash is set directly and already hashed, we might not need this.
     // However, if we introduce a plain 'password' virtual field that sets 'passwordHash', this hook is essential.
     // Let's assume passwordHash is always set pre-hashed by the service for now.
     // If we were to set a plain password field `this.password = await bcrypt.hash(this.password, salt);`
     return next();
  }

  // This part is more relevant if you have a plain text 'password' field in your schema
  // that you want to hash before saving, e.g. this.password.
  // Since we directly save passwordHash, this hook as-is might not run as expected for hashing.
  // We'll rely on service-level hashing for now.
  // If you had a plain `password` field:
  // const salt = await bcrypt.genSalt(10);
  // this.passwordHash = await bcrypt.hash(this.password, salt); // Assuming 'password' was the plain field
  next();
});

// Method to compare entered password with the user's hashed password
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// The User model (singular 'User') will interact with the 'users' collection in MongoDB.
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;

// Utility functions for hashing and comparing passwords can remain separate or be integrated
// For example, if service always calls these before interacting with model:

export const hashPasswordUtility = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswordUtility = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

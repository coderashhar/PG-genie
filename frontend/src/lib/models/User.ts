import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email?: string;
  image?: string;
  phoneNumber?: string;
  role: 'STUDENT' | 'OWNER';
  authProvider: 'GOOGLE' | 'PHONE';
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String },
  email: { type: String, unique: true, sparse: true }, // For Google Auth
  image: { type: String },
  phoneNumber: { type: String, unique: true, sparse: true }, // For Phone Auth
  role: { type: String, enum: ['STUDENT', 'OWNER'], default: 'STUDENT' },
  authProvider: { type: String, enum: ['GOOGLE', 'PHONE'], required: true },
  createdAt: { type: Date, default: Date.now },
});

// Check if model already exists to avoid Next.js hot-reloading errors
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

import type { Document } from 'mongoose';
import mongoose from 'mongoose';

export interface UserInt extends Document {
  username: string;
  email: string;
  password: string;
  isVerified?: boolean;
  isAdmin?: boolean;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
  },
  email: { type: String, required: [true, 'Email is required'], unique: true },
  password: {
    type: String,
    required: [true, 'Password is required'],
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

const User =
  mongoose.models.User || mongoose.model<UserInt>('User', userSchema);

export default User;

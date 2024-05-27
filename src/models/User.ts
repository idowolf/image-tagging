/**
 * @fileoverview Mongoose model for storing user data.
 */

import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  fullName?: string;
  department?: string;
  team?: string;
  role?: string;
  email: string;
  password?: string;
  googleId?: string;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, default: null },
    department: { type: String, default: null },
    team: { type: String, default: null },
    role: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    googleId: { type: String, default: null },
    password: { type: String, default: null },
  },
  { timestamps: true }
);

const User = model<IUser>('User', userSchema);

export default User;

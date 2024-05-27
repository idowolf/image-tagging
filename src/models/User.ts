/**
 * @fileoverview Mongoose model for storing user data.
 */

import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  fullName: string;
  department: string;
  team: string;
  role: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    department: { type: String, required: true },
    team: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = model<IUser>('User', userSchema);

export default User;

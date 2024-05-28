/**
 * @fileoverview Mongoose model for storing tag data.
 */

import { Schema, model, Document } from 'mongoose';

interface ITag extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  embedding?: number[];
}

const tagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true, lowercase: true },
    usageCount: { type: Number, default: 0, index: true },
    embedding: { type: [Number], default: null },
  },
  { timestamps: true }
);

const Tag = model<ITag>('Tag', tagSchema);

export default Tag;

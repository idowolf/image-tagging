/**
 * @fileoverview Mongoose model for storing image data.
 */

import { Schema, model, Document } from 'mongoose';

interface IImage extends Document {
  _id: Schema.Types.ObjectId;
  key: string;
  hash: string;
  metadata?: {
    [key: string]: any;
  };
  faissIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

const imageSchema = new Schema<IImage>(
  {
    key: { type: String, required: true, index: true },
    hash: { type: String, required: true, unique: true },
    faissIndex: { type: Number, required: true, unique: true, index: true },
    metadata: { type: Map, of: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Image = model<IImage>('Image', imageSchema);

export default Image;

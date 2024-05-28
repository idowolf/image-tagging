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
  createdAt: Date;
  updatedAt: Date;
}

const imageSchema = new Schema<IImage>(
  {
    key: { type: String, required: true },
    hash: { type: String, required: true, unique: true },
    metadata: { type: Map, of: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Image = model<IImage>('Image', imageSchema);

export default Image;

/**
 * @fileoverview Mongoose model for storing FAISS index entries.
 */

import { Schema, model, Document } from 'mongoose';

interface IFaissIndex extends Document {
  faissIndex: number;
  imageId: Schema.Types.ObjectId;
}

const faissIndexSchema = new Schema<IFaissIndex>({
  faissIndex: { type: Number, required: true, unique: true },
  imageId: { type: Schema.Types.ObjectId, ref: 'Image', required: true, index: true },
});

const FaissIndex = model<IFaissIndex>('FaissIndex', faissIndexSchema);

export default FaissIndex;

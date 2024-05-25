import { Schema, model, Document } from 'mongoose';

interface IImage extends Document {
  _id: Schema.Types.ObjectId;
  url: string;
  tags: string[];
  metadata?: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const imageSchema = new Schema<IImage>(
  {
    url: { type: String, required: true },
    tags: [{ type: String, required: true, index: true }], // Indexed for fast search
    metadata: { type: Map, of: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Compound index for tags and createdAt to optimize search performance
imageSchema.index({ tags: 1, createdAt: -1 });

const Image = model<IImage>('Image', imageSchema);

export default Image;

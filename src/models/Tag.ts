import { Schema, model, Document } from 'mongoose';

interface ITag extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number; // To keep track of tag popularity
}

const tagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true, index: true },
    usageCount: { type: Number, default: 0 } // New field for tag popularity
  },
  { timestamps: true }
);

tagSchema.pre('save', function(next) {
  this.name = this.name.toLowerCase();
  next();
});

const Tag = model<ITag>('Tag', tagSchema);

export default Tag;
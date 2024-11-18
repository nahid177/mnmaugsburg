import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  title: string;
  details: string;
}

// Ensure the model is only created once during the development hot-reloading process
const CategorySchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;

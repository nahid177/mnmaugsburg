import mongoose, { Schema, Document, Types } from 'mongoose';

// Define MediaType Type and Schema
type MediaType = {
  _id?: Types.ObjectId; // Optional ID field for embedded subdocuments
  image?: string;       // URL to image, optional
  video?: string;       // URL to video, optional
};

const MediaTypeSchema = new Schema<MediaType>({
  image: { type: String, required: false },
  video: { type: String, required: false },
});

// Define Content Type and Schema
type Content = {
  _id?: Types.ObjectId; // Optional ID field for embedded subdocuments
  title: string;        // Title or big title
  detail: string;       // Detailed description or content
  media?: MediaType;    // Media can be an image or video
};

const ContentSchema = new Schema<Content>({
  title: { type: String, required: true },
  detail: { type: String, required: true },
  media: { type: MediaTypeSchema, required: false },
});

// Define Category Type and Schema
type Category = {
  _id?: Types.ObjectId; // Optional ID field for embedded subdocuments
  name?: string;        // Optional category name
  content: Content[];   // Array of Content items
};

const CategorySchema = new Schema<Category>({
  name: { type: String, required: false },
  content: { type: [ContentSchema], required: true },
});

// Define Model Type and Schema
interface IModel extends Document {
  _id: Types.ObjectId;       // MongoDB document ID
  typename: string;          // Type name
  bigTitleName: string;      // Name for the big title section
  bigTitle: Content[];       // Array of Content items
  category?: Category;       // Optional category
}

const ModelSchema = new Schema<IModel>({
  typename: { type: String, required: true },
  bigTitleName: { type: String, required: true },
  bigTitle: { type: [ContentSchema], required: true },
  category: { type: CategorySchema, required: false },
});

// Create and export the Mongoose model
const Model = mongoose.models.Model || mongoose.model<IModel>('Model', ModelSchema);
export default Model;

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

// Define Content Type and Schema with subtitle and subdetail as arrays
type Content = {
  _id?: Types.ObjectId;      // Optional ID field for embedded subdocuments
  title: string;             // Title or big title
  detail: string;            // Detailed description or content
  subtitle?: string[];       // Optional array of subtitles
  subdetail?: string[];      // Optional array of subdetails
  media?: MediaType;         // Media can be an image or video
};

const ContentSchema = new Schema<Content>({
  title: { type: String, required: true },
  detail: { type: String, required: true },
  subtitle: { type: [String], required: false },  // Optional array of subtitles
  subdetail: { type: [String], required: false }, // Optional array of subdetails
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
  categories?: Category[];   // Optional array of categories
}

const ModelSchema = new Schema<IModel>({
  typename: { type: String, required: true },
  bigTitleName: { type: String, required: true },
  bigTitle: { type: [ContentSchema], required: true },
  categories: { type: [CategorySchema], required: false }, // Changed from single category to array
});

// Create and export the Mongoose model
const Model = mongoose.models.Model || mongoose.model<IModel>('Model', ModelSchema);
export default Model;

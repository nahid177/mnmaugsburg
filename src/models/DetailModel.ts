// models/Model.ts

import mongoose, { Schema, Document, Types } from 'mongoose';

// Define MediaType Type and Schema
type MediaType = {
  _id?: Types.ObjectId;
  image?: string;
  video?: string;
};

const MediaTypeSchema = new Schema<MediaType>({
  image: { type: String, required: false },
  video: { type: String, required: false },
});

// Define Content Type and Schema with color fields
type Content = {
  _id?: Types.ObjectId;
  title: string;
  titleColor?: string;       // New field for title color
  detail: string;
  detailColor?: string;      // New field for detail color
  subtitle?: string[];
  subtitleColor?: string;    // New field for subtitle color
  subdetail?: string[];
  subdetailColor?: string;   // New field for subdetail color
  media?: MediaType;
};

const ContentSchema = new Schema<Content>({
  title: { type: String, required: true },
  titleColor: { type: String, required: false }, // New field
  detail: { type: String, required: true },
  detailColor: { type: String, required: false }, // New field
  subtitle: { type: [String], required: false },
  subtitleColor: { type: String, required: false }, // New field
  subdetail: { type: [String], required: false },
  subdetailColor: { type: String, required: false }, // New field
  media: { type: MediaTypeSchema, required: false },
});

// Define Category Type and Schema with color fields
type Category = {
  _id?: Types.ObjectId;
  name: string;
  nameColor?: string;        // New field for category name color
  content: Content[];
};

const CategorySchema = new Schema<Category>({
  name: { type: String, required: true },
  nameColor: { type: String, required: false }, // New field
  content: { type: [ContentSchema], required: true },
});

// Define Model Type and Schema with color fields
interface IModel extends Document {
  _id: Types.ObjectId;
  typename: string;
  typenameColor?: string;      // New field for typename color
  bigTitleName: string;
  bigTitleNameColor?: string;  // New field for bigTitleName color
  bigTitle: Content[];
  categories?: Category[];
}

const ModelSchema = new Schema<IModel>({
  typename: { type: String, required: true },
  typenameColor: { type: String, required: false }, // New field
  bigTitleName: { type: String, required: true },
  bigTitleNameColor: { type: String, required: false }, // New field
  bigTitle: { type: [ContentSchema], required: true },
  categories: { type: [CategorySchema], required: false },
});

// Create and export the Mongoose model
const Model = mongoose.models.Model || mongoose.model<IModel>('Model', ModelSchema);
export default Model;

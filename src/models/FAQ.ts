// /models/FAQ.ts
import mongoose, { Schema, Document } from "mongoose";

interface IFAQ extends Document {
  question: string;
  answer: string;
  isActive: boolean;
}

const FAQSchema: Schema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Check if the model already exists before compiling it
const FAQ = mongoose.models.FAQ || mongoose.model<IFAQ>("FAQ", FAQSchema);

export default FAQ;

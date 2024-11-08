// models/Message.ts
import mongoose, { Schema, model } from "mongoose";

interface IMessage {
  sender: string;
  userId: string;
  message: string;
  status: string;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

export default mongoose.models.Message || model<IMessage>("Message", MessageSchema);

// models/Message.ts
import mongoose, { Schema, model } from "mongoose";

interface IMessage {
  _id: mongoose.Types.ObjectId;
  sender: string; // 'User' or 'Admin'
  userId: string; // ID of the user
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
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

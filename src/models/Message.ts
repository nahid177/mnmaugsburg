// models/Message.ts

import mongoose, { Schema, model, models } from "mongoose";

interface IMessage {
  _id: mongoose.Types.ObjectId;
  sender: "User" | "Admin"; // Role of the sender
  senderName?: string; // Optional: Actual name of the sender
  userId: string; // ID of the user
  message: string;
  status: "sent" | "seen"; // Status of the message
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: String,
      required: true,
      enum: ["User", "Admin"], // Restricts to 'User' or 'Admin'
    },
    senderName: {
      type: String,
      required: false, // Optional: Set to true if always required
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
      enum: ["sent", "seen"], // Restricts to 'sent' or 'seen'
      default: "sent",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

export default models.Message || model<IMessage>("Message", MessageSchema);

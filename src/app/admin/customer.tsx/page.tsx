// src/app/api/messages/route.ts
import { NextResponse } from "next/server";
import Message from "@/models/Message";
import dbConnect from "@/lib/dbConnect";

// Handler for fetching all messages
export async function GET() {
  await dbConnect();

  try {
    // Fetch all messages sorted by creation time
    const messages = await Message.find().sort({ createdAt: 1 });
    const formattedMessages = messages.map((msg) => ({
      id: msg._id,
      sender: msg.sender,
      userId: msg.userId,
      message: msg.message,
      status: msg.status,
      time: msg.createdAt.toLocaleString(), // Format the createdAt timestamp
    }));

    return NextResponse.json(formattedMessages, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Handler for saving a new message
export async function POST(req: Request) {
  await dbConnect();

  try {
    const { sender, userId, message, status } = await req.json();

    // Validate the input data
    if (!sender || !userId || !message || !status) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    // Create a new message
    const newMessage = await Message.create({ sender, userId, message, status });
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

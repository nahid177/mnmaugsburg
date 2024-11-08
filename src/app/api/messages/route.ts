// src/app/api/messages/route.ts
import { NextResponse } from "next/server";
import Message from "@/models/Message";
import dbConnect from "@/lib/dbConnect";

// Handler for fetching messages for a specific user
export async function GET(req: Request) {
  await dbConnect();

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    // Fetch messages for the specific user, sorted by creation time
    const messages = await Message.find({ userId }).sort({ createdAt: 1 });
    const formattedMessages = messages.map((msg) => ({
      id: msg._id,
      sender: msg.sender,
      userId: msg.userId,
      message: msg.message,
      status: msg.status,
      time: msg.createdAt.toLocaleString(),
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

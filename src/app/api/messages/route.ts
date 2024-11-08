// src/app/api/messages/route.ts
import { NextResponse } from "next/server";
import Message from "@/models/Message";
import dbConnect from "@/lib/dbConnect";

// Handler for fetching all messages
export async function GET() {
  await dbConnect();

  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Handler for saving a new message
export async function POST(req: Request) {
  await dbConnect();

  try {
    const { sender, time, message, status } = await req.json();

    if (!sender || !message || !status) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const newMessage = await Message.create({ sender, time, message, status });
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

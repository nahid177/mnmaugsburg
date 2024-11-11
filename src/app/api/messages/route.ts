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

    // **Modified:** Update status only for admin-sent messages
    await Message.updateMany(
      { userId, sender: 'Admin', status: "sent" },
      { $set: { status: "seen" } }
    );

    // Fetch updated messages for the specific user, sorted by creation time
    const updatedMessages = await Message.find({ userId }).sort({ createdAt: 1 });

    const formattedMessages = updatedMessages.map((msg) => ({
      id: msg._id.toString(),
      sender: msg.sender, // 'User' or 'Admin'
      senderName: msg.senderName, // Optional: Actual name
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
    const { sender, senderName, userId, message, status } = await req.json();

    // Validate the input data
    if (!sender || !userId || !message) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    // Create a new message with status 'sent' by default if not provided
    const newMessage = await Message.create({
      sender,
      senderName, // Optional
      userId,
      message,
      status: status || "sent",
    });

    return NextResponse.json(
      {
        id: newMessage._id.toString(),
        sender: newMessage.sender,
        senderName: newMessage.senderName, // Optional
        userId: newMessage.userId,
        message: newMessage.message,
        status: newMessage.status,
        createdAt: newMessage.createdAt, // For frontend formatting
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// src/app/api/admin/messages/[userId]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Message from '@/models/Message';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request, context: { params: { userId: string } }) {
  await dbConnect();

  // Await the params object
  const { userId } = await context.params;

  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
    }

    // Fetch messages for the specified user
    const messages = await Message.find({ userId }).sort({ createdAt: 1 }).lean();

    // Format messages
    const formattedMessages = messages.map((msg) => ({
      id: msg._id!.toString(),
      sender: msg.sender,
      userId: msg.userId,
      message: msg.message,
      status: msg.status,
      time: msg.createdAt.toLocaleString(),
    }));

    return NextResponse.json({ messages: formattedMessages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages for user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

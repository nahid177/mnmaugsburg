// src/app/api/admin/messages/send/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Message from '@/models/Message';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
    }

    const { userId, message, status } = await req.json();

    // Validate input
    if (!userId || !message || !status) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    // Create a new message from admin
    const newMessage = await Message.create({
      sender: 'Admin', // Indicate that the sender is admin
      userId,
      message,
      status,
    });

    return NextResponse.json({
      id: newMessage._id.toString(),
      sender: newMessage.sender,
      userId: newMessage.userId,
      message: newMessage.message,
      status: newMessage.status,
      createdAt: newMessage.createdAt,
    }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

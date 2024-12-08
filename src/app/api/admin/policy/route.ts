import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Make sure to implement this
import Category from '@/models/Category';

export const GET = async () => {
  await dbConnect();
  try {
    const categories = await Category.find();
    return NextResponse.json({ success: true, data: categories }, { status: 200 });
  } catch {
    // Removed unused 'error' variable
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    const { title, details } = await req.json(); // Use req.json() to parse the body of the POST request

    if (!title || !details) {
      return NextResponse.json({ success: false, error: 'Title and details are required' }, { status: 400 });
    }

    const newCategory = new Category({ title, details });
    await newCategory.save();

    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch {
    // Removed unused 'error' variable
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 });
  }
};

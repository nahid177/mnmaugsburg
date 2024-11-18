import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  await dbConnect();

  try {
    // Await the params object before accessing its properties
    const { id } = await params; 

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: category }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch category' }, { status: 500 });
  }
};

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  await dbConnect();

  try {
    const { title, details } = await req.json();

    if (!title || !details) {
      return NextResponse.json({ success: false, error: 'Title and details are required' }, { status: 400 });
    }

    // Await the params object before accessing its properties
    const { id } = await params;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { title, details },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedCategory }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  await dbConnect();

  try {
    // Await the params object before accessing its properties
    const { id } = await params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: null }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
};

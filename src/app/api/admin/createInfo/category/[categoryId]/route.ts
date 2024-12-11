// src/app/api/admin/createInfo/category/[categoryId]/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Model from '@/models/DetailModel'; // Correct import

export async function PUT(
  request: Request,
  context: { params: Promise<{ categoryId: string }> }
) {
  await dbConnect();

  try {
    const { categoryId } = await context.params;
    const body = await request.json();

    // Validate categoryId as a non-empty string
    if (typeof categoryId !== 'string' || categoryId.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Invalid categoryId.' },
        { status: 400 }
      );
    }

    // Optional: Validate body structure here if needed

    // Update the specific category in the categories array
    const updatedData = await Model.findOneAndUpdate(
      { 'categories._id': categoryId },
      { $set: { 'categories.$': body } },
      { new: true, runValidators: true }
    ).exec();

    if (!updatedData) {
      return NextResponse.json(
        { success: false, error: 'Category not found.' },
        { status: 404 }
      );
    }

    const updatedCategory = updatedData.categories.find(
      (cat: { _id: string }) => cat._id.toString() === categoryId
    );

    return NextResponse.json({ success: true, data: updatedCategory }, { status: 200 });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ categoryId: string }> }
) {
  await dbConnect();

  try {
    const { categoryId } = await context.params;

    // Validate categoryId as a non-empty string
    if (typeof categoryId !== 'string' || categoryId.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Invalid categoryId.' },
        { status: 400 }
      );
    }

    const updatedData = await Model.findOneAndUpdate(
      { 'categories._id': categoryId },
      { $pull: { categories: { _id: categoryId } } },
      { new: true }
    ).exec();

    if (!updatedData) {
      return NextResponse.json(
        { success: false, error: 'Category not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/admin/createInfo/category/[categoryId] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category.' },
      { status: 500 }
    );
  }
}

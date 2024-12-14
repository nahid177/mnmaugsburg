/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Model from '@/models/DetailModel'; // Ensure this model includes categories subdocuments
import mongoose from 'mongoose';

export async function PUT(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  await dbConnect();
  const { categoryId } = params;

  try {
    // Validate categoryId as a valid ObjectId if necessary
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid categoryId.' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.detail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, detail' },
        { status: 400 }
      );
    }

    // Construct the new content item
    const newContentItem = {
      title: body.title,
      titleColor: body.titleColor || '#000000',
      detail: body.detail,
      detailColor: body.detailColor || '#000000',
      subtitle: body.subtitle || [],
      subtitleColor: body.subtitleColor || '#000000',
      subdetail: body.subdetail || [],
      subdetailColor: body.subdetailColor || '#000000',
      media: body.media || { image: '', video: '' },
    };

    // Update the main document to push a new content item into the category
    // identified by categoryId.
    const updatedData = await Model.findOneAndUpdate(
      { "categories._id": categoryId },
      { $push: { "categories.$.content": newContentItem } },
      { new: true, runValidators: true }
    );

    if (!updatedData) {
      return NextResponse.json(
        { success: false, error: 'Category not found.' },
        { status: 404 }
      );
    }

    // Retrieve the updated category with the newly added content
    const updatedCategory = updatedData.categories.find((cat: any) => cat._id.toString() === categoryId);

    return NextResponse.json({ success: true, data: updatedCategory }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding content item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add content item.' },
      { status: 500 }
    );
  }
}

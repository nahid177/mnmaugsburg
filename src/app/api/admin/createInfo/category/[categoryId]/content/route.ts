/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CategoryModel from '@/models/DetailModel';

export async function PUT(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  await dbConnect();
  const { categoryId } = params;

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.detail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, detail' },
        { status: 400 }
      );
    }

    // Find category by ID
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found.' },
        { status: 404 }
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

    // Add the new content item to the category's content array
    category.content.push(newContentItem);

    // Save the updated category
    await category.save();

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding content item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add content item.' },
      { status: 500 }
    );
  }
}

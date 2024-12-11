/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/admin/createInfo/[typenameID]/categories/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Model from '@/models/DetailModel';
import mongoose from 'mongoose';

export async function POST(
  request: Request,
  context: { params: { typenameID: string } }
) {
  await dbConnect();

  try {
    const { typenameID } = context.params;
    const body = await request.json();

    // Validate typenameID
    if (!mongoose.Types.ObjectId.isValid(typenameID)) {
      return NextResponse.json(
        { success: false, error: 'Invalid typenameID.' },
        { status: 400 }
      );
    }

    // Validate request body
    if (
      typeof body.name !== 'string' ||
      typeof body.nameColor !== 'string' ||
      !Array.isArray(body.content)
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid category data.' },
        { status: 400 }
      );
    }

    // Sanitize content items (remove _id if present)
    const sanitizedContent = body.content.map((content: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...rest } = content;
      return rest;
    });

    // Create the new category object without _id
    const newCategory = {
      name: body.name,
      nameColor: body.nameColor,
      content: sanitizedContent,
    };

    // Use $push to add the new category to the categories array
    const updatedData = await Model.findByIdAndUpdate(
      typenameID,
      { $push: { categories: newCategory } },
      { new: true, runValidators: true }
    ).exec();

    if (!updatedData) {
      return NextResponse.json(
        { success: false, error: 'Information not found.' },
        { status: 404 }
      );
    }

    // Retrieve the newly added category (assuming it's the last one)
    const addedCategory = updatedData.categories[updatedData.categories.length - 1];
    return NextResponse.json({ success: true, data: addedCategory }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/createInfo/[typenameID]/categories error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add category.' },
      { status: 500 }
    );
  }
}

// src/app/api/admin/createInfo/[typenameID]/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Model from '@/models/DetailModel';
import mongoose from 'mongoose';

export async function GET(
  request: Request,
  context: { params: Promise<{ typenameID: string }> }
) {
  await dbConnect();

  try {
    const { typenameID } = await context.params;

    console.log(`Received typenameID: "${typenameID}"`);

    if (!mongoose.Types.ObjectId.isValid(typenameID)) {
      return NextResponse.json(
        { success: false, error: 'Invalid typenameID.' },
        { status: 400 }
      );
    }

    // Fetch data based on typenameID
    const data = await Model.findById(typenameID).populate('categories').exec();

    console.log(`Fetched data:`, data);

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Data not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: unknown) {
    console.error('GET /api/admin/createInfo/[typenameID] error:', error);

    // Type assertion to Error type
    const e = error as Error;

    return NextResponse.json(
      { success: false, error: e.message || 'Failed to fetch data.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ typenameID: string }> }
) {
  await dbConnect();

  try {
    const { typenameID } = await context.params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(typenameID)) {
      return NextResponse.json(
        { success: false, error: 'Invalid typenameID.' },
        { status: 400 }
      );
    }

    // Optional: Validate the body to ensure only allowed fields are updated
    const allowedUpdates = ['typename', 'typenameColor', 'bigTitleName', 'bigTitleNameColor', 'bigTitle'];
    const updates = Object.keys(body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return NextResponse.json(
        { success: false, error: 'Invalid updates!' },
        { status: 400 }
      );
    }

    const updatedData = await Model.findByIdAndUpdate(typenameID, body, {
      new: true,
      runValidators: true,
    }).exec();

    if (!updatedData) {
      return NextResponse.json(
        { success: false, error: 'Data not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedData }, { status: 200 });
  } catch (error: unknown) {
    console.error('PUT /api/admin/createInfo/[typenameID] error:', error);

    // Type assertion to Error type
    const e = error as Error;

    return NextResponse.json(
      { success: false, error: e.message || 'Failed to update data.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ typenameID: string }> }
) {
  await dbConnect();

  try {
    const { typenameID } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(typenameID)) {
      return NextResponse.json(
        { success: false, error: 'Invalid typenameID.' },
        { status: 400 }
      );
    }

    const deletedData = await Model.findByIdAndDelete(typenameID).exec();

    if (!deletedData) {
      return NextResponse.json(
        { success: false, error: 'Data not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error('DELETE /api/admin/createInfo/[typenameID] error:', error);

    // Type assertion to Error type
    const e = error as Error;

    return NextResponse.json(
      { success: false, error: e.message || 'Failed to delete data.' },
      { status: 500 }
    );
  }
}

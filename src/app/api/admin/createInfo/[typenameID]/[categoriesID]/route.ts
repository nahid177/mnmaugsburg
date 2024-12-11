/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Model from '@/models/DetailModel';
import mongoose from 'mongoose';

export async function GET(request: Request, context: any) {
  await dbConnect();

  try {
    // Await the params to access them correctly
    const params = await context.params;
    const { typenameID, categoriesID } = params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(typenameID) || !mongoose.Types.ObjectId.isValid(categoriesID)) {
      return NextResponse.json({ success: false, error: 'Invalid typenameID or categoriesID.' }, { status: 400 });
    }

    // Fetch the category data
    const data = await Model.findOne(
      { _id: typenameID, 'categories._id': categoriesID },
      { 'categories.$': 1 }
    ).exec();

    // Check if data is found
    if (!data || !data.categories || data.categories.length === 0) {
      return NextResponse.json({ success: false, error: 'Data not found.' }, { status: 404 });
    }

    const category = data.categories[0];
    return NextResponse.json({ success: true, data: category }, { status: 200 });
  } catch (error) {
    console.error('Error fetching category data:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch data.' }, { status: 500 });
  }
}
// src/app/api/admin/createInfo/[typenameID]/[categoriesID]/route.ts

export async function PUT(
  request: Request,
  context: { params: { typenameID: string; categoriesID: string } }
) {
  await dbConnect();

  try {
    const { typenameID, categoriesID } = context.params;
    const body = await request.json();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(typenameID) || !mongoose.Types.ObjectId.isValid(categoriesID)) {
      return NextResponse.json(
        { success: false, error: 'Invalid typenameID or categoriesID.' },
        { status: 400 }
      );
    }

    // Remove _id fields from the body to prevent invalid assignments
    if ('_id' in body) {
      delete body._id;
    }

    if (body.content) {
      body.content = body.content.map((contentItem: any) => {
        if ('_id' in contentItem) {
          delete contentItem._id;
        }
        return contentItem;
      });
    }

    const updatedData = await Model.findOneAndUpdate(
      { _id: typenameID, 'categories._id': categoriesID },
      { $set: { 'categories.$': body } },
      { new: true, runValidators: true }
    ).exec();

    if (!updatedData) {
      return NextResponse.json({ success: false, error: 'Category not found.' }, { status: 404 });
    }

    const updatedCategory = updatedData.categories.find((cat: any) => cat._id.toString() === categoriesID);
    return NextResponse.json({ success: true, data: updatedCategory }, { status: 200 });
  } catch (error) {
    console.error('PUT /api/admin/createInfo/[typenameID]/[categoriesID] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update category.' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: { typenameID: string; categoriesID: string } }
) {
  await dbConnect();

  try {
    const { typenameID, categoriesID } = context.params;

    if (!mongoose.Types.ObjectId.isValid(typenameID) || !mongoose.Types.ObjectId.isValid(categoriesID)) {
      return NextResponse.json(
        { success: false, error: 'Invalid typenameID or categoriesID.' },
        { status: 400 }
      );
    }

    const updatedData = await Model.findOneAndUpdate(
      { _id: typenameID },
      { $pull: { categories: { _id: categoriesID } } },
      { new: true }
    ).exec();

    if (!updatedData) {
      return NextResponse.json({ success: false, error: 'Category not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/admin/createInfo/[typenameID]/[categoriesID] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete category.' }, { status: 500 });
  }
}
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

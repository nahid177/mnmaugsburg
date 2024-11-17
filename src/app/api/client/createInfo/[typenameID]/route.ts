
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
    const { typenameID } = await context.params; // Await the params

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
  } catch (error) {
    console.error('GET /api/admin/createInfo/[typenameID] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data.' },
      { status: 500 }
    );
  }
}

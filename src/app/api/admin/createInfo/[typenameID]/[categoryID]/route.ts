// src/app/api/admin/createInfo/[typenameID]/[categoryID]/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Model from '@/models/DetailModel';
import { InformationData } from '@/interfaces/InformationTypes';
import mongoose from 'mongoose';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ typenameID: string; categoryID: string }> }
) {
  await dbConnect(); // Ensure database connection

  try {
    const { typenameID, categoryID } = await params; // Await the params

    console.log(`Received typenameID: "${typenameID}", categoryID: "${categoryID}"`); // Debugging log

    if (
      !mongoose.Types.ObjectId.isValid(typenameID) ||
      !mongoose.Types.ObjectId.isValid(categoryID)
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid typenameID or categoryID.' },
        { status: 400 }
      );
    }

    // Fetch data based on typenameID and categoryID
    const data = await Model.findOne(
      { _id: typenameID, 'categories._id': categoryID },
      { 'categories.$': 1 }
    )
      .populate('categories')
      .exec() as InformationData | null;

    console.log(`Fetched data:`, data); // Debugging log

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Data not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error(
      'GET /api/admin/createInfo/[typenameID]/[categoryID] error:',
      error
    );
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data.' },
      { status: 500 }
    );
  }
}

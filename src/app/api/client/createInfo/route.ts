import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Ensure this correctly connects to MongoDB
import Model from '@/models/DetailModel'; // Ensure the path is correct

// Handle GET requests - Fetch all information entries
export const GET = async () => {
  await dbConnect();

  try {
    const models = await Model.find({});
    return NextResponse.json({ success: true, data: models }, { status: 200 });
  } catch (error) {
    console.error('GET /api/admin/createInfo error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data.' },
      { status: 500 }
    );
  }
};

// src/app/api/admin/createInfo/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Ensure you have a dbConnect function for MongoDB connection
import Model from '@/models/DetailModel'; // Import the model schema

// Handle GET requests
export const GET = async () => { // Removed 'request: Request' parameter
  await dbConnect();

  try {
    const models = await Model.find({});
    return NextResponse.json(models, { status: 200 });
  } catch (error) {
    console.error('GET /api/admin/createInfo error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data.' },
      { status: 400 }
    );
  }
};

// Handle POST requests
export const POST = async (request: Request) => {
  await dbConnect();

  try {
    const body = await request.json();
    const model = await Model.create(body);
    return NextResponse.json(model, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/createInfo error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create data.' },
      { status: 400 }
    );
  }
};

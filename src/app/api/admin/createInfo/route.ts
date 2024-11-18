// src/app/api/admin/createInfo/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Ensure this correctly connects to MongoDB
import Model from '@/models/DetailModel'; // Ensure the path is correct
import mongoose from 'mongoose';

// Handle GET requests - Fetch all information entries
export const GET = async () => {
  await dbConnect();

  try {
    const models = await Model.find({});
    return NextResponse.json({ success: true, data: models }, { status: 200 });
  } catch (error) {
    console.error('GET /api/admin/createInfo error:', error);
     // Check for MongoDB Network Error
     if (error instanceof mongoose.Error && error.name === "MongoNetworkError") {
      // Redirect to the "network problem" page
      return NextResponse.redirect("/yournetworkproblem");
    }
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data.' },
      { status: 500 }
    );
  }
};

// Handle POST requests - Create a new information entry
export const POST = async (request: Request) => {
  await dbConnect();

  try {
    const body = await request.json();

    // Basic validation (extend as needed)
    if (!body.typename || !body.bigTitleName || !body.bigTitle) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    // Additional validation can be implemented here

    const newModel = await Model.create(body);
    return NextResponse.json({ success: true, data: newModel }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/createInfo error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create data.' },
      { status: 500 }
    );
  }
};

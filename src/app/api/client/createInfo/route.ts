/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/admin/createInfo/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Ensure this correctly connects to MongoDB
import Model from '@/models/DetailModel'; // Ensure the path is correct
import mongoose from 'mongoose';

export const GET = async () => {
  await dbConnect();

  try {
    const models = await Model.find({});

    // Set Cache-Control headers to prevent caching
    return NextResponse.json(
      { success: true, data: models },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error: any) { // TypeScript requires type for 'error'
    console.error('GET /api/admin/createInfo error:', error);

    // Check for MongoDB Network Error
    if (error instanceof mongoose.Error && error.name === "MongoNetworkError") {
      // Redirect to the "network problem" page
      return NextResponse.redirect("/yournetworkproblem");
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch data.' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  }
};

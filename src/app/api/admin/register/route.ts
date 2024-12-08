// src/app/api/admin/register/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AdminUser from '@/models/AdminUser';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, password } = await req.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ username });
    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin without assigning to a variable
    await AdminUser.create({
      username,
      password: hashedPassword,
      devices: [],
    });

    return NextResponse.json(
      { message: 'Admin registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering admin:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

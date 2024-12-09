// /pages/api/faqs/index.ts
import { IFAQ } from '@/interfaces/IFAQ';
import dbConnect from '@/lib/dbConnect';
import FAQ from '@/models/FAQ';
import { NextResponse } from 'next/server';
// src/types/faq.ts

export async function GET() {
  await dbConnect();

  try {
    const faqs: IFAQ[] = await FAQ.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: faqs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch FAQs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { question, answer } = await req.json();
    const newFAQ = await FAQ.create({ question, answer });
    return NextResponse.json({ success: true, data: newFAQ }, { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json({ success: false, message: 'Failed to create FAQ' }, { status: 500 });
  }
}
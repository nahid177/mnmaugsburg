import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import FAQ from "@/models/FAQ";
import mongoose from "mongoose";

// Connect to the database
await dbConnect();

// Create a new FAQ (POST)
export async function POST(req: Request) {
  try {
    const { question, answer } = await req.json();

    if (!question || !answer) {
      return NextResponse.json({ message: "Question and answer are required" }, { status: 400 });
    }

    const newFAQ = await FAQ.create({ question, answer });
    return NextResponse.json(newFAQ, { status: 201 });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json({ message: "Failed to create FAQ" }, { status: 500 });
  }
}

// Get all FAQs (GET)
export async function GET() {
  try {
    const faqs = await FAQ.find({ isActive: true });
    return NextResponse.json(faqs, { status: 200 });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json({ message: "Failed to fetch FAQs" }, { status: 500 });
  }
}
// Update an FAQ by ID (PUT)
export async function PUT(req: Request) {
    try {
      const requestBody = await req.json();
      console.log("PUT Request Body:", requestBody);
  
      const { _id, id, question, answer, isActive } = requestBody;
      const faqId = _id || id; // Use either _id or id
  
      // Validate the input
      if (!faqId) {
        return NextResponse.json({ message: "FAQ ID is required" }, { status: 400 });
      }
  
      if (!question || !answer) {
        return NextResponse.json({ message: "Question and answer are required" }, { status: 400 });
      }
  
      // Check for valid MongoDB Object ID
      if (!mongoose.Types.ObjectId.isValid(faqId)) {
        return NextResponse.json({ message: "Invalid FAQ ID format" }, { status: 400 });
      }
  
      // Update the FAQ
      const updatedFAQ = await FAQ.findByIdAndUpdate(
        faqId,
        { question, answer, isActive },
        { new: true }
      );
  
      if (!updatedFAQ) {
        return NextResponse.json({ message: "FAQ not found" }, { status: 404 });
      }
  
      return NextResponse.json(updatedFAQ, { status: 200 });
    } catch (error) {
      console.error("Error updating FAQ:", error);
      return NextResponse.json({ message: "Failed to update FAQ" }, { status: 500 });
    }
  }
  

// Delete an FAQ by ID (DELETE)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "FAQ ID is required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid FAQ ID format" }, { status: 400 });
    }

    const deletedFAQ = await FAQ.findByIdAndDelete(id);

    if (!deletedFAQ) {
      return NextResponse.json({ message: "FAQ not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "FAQ deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json({ message: "Failed to delete FAQ" }, { status: 500 });
  }
}

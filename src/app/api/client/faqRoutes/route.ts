// /pages/api/faqs/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import FAQ from '@/models/FAQ';
// src/types/faq.ts

export interface IFAQ {
    _id: string;
    question: string;
    answer: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const faqs: IFAQ[] = await FAQ.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: faqs });
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch FAQs' });
      }
      break;
    case 'POST':
      try {
        const { question, answer } = req.body;
        const newFAQ = await FAQ.create({ question, answer });
        res.status(201).json({ success: true, data: newFAQ });
      } catch (error) {
        console.error('Error creating FAQ:', error);
        res.status(500).json({ success: false, message: 'Failed to create FAQ' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

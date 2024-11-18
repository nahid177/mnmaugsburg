// src/app/faqPage/page.tsx

import React from 'react';
import FAQAccordion from '@/components/FAQAccordion';
import dbConnect from '@/lib/dbConnect';
import FAQ from '@/models/FAQ';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import TypeNameNavbar from '@/components/CreateInfomation/TypeNameNavbar';
import mongoose from 'mongoose'; // Needed for ObjectId type
import { redirect } from 'next/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { IFAQ, IFAQFromDB } from '@/interfaces/IFAQ'; // Adjust the import path as needed

const FAQPage = async () => {
  await dbConnect();
  let faqs: IFAQ[] = [];

  try {
    // Apply the generic to the lean method
    const faqsFromDB = await FAQ.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean<IFAQFromDB[]>();

    faqs = faqsFromDB.map((faq) => ({
      _id: faq._id.toString(),
      question: faq.question,
      answer: faq.answer,
      isActive: faq.isActive,
      createdAt: faq.createdAt.toISOString(),
      updatedAt: faq.updatedAt.toISOString(),
    }));
  } catch (error: unknown) {
    console.error('Error fetching FAQs:', error);

    if (error instanceof mongoose.Error && error.name === 'MongoNetworkError') {
      // Redirect to the "Network Problem" page
      redirect('/yournetworkproblem');
    } else {
      // Optionally, handle other types of errors or redirect to a generic error page
      redirect('/yournetworkproblem');
    }
  }

  return (
    <>
      <Head>
        <title>Frequently Asked Questions | Your Company</title>
        <meta
          name="description"
          content="Find answers to the most common questions about our services."
        />
        {/* FAQPage Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map((faq) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer,
                },
              })),
            }),
          }}
        />
      </Head>
      <div>
        <Navbar />
        <LanguageSwitcher />
        <TypeNameNavbar />
      </div>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 h-full">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
          Frequently Asked Questions
        </h1>
        <FAQAccordion initialFaqs={faqs} />
      </div>
    </>
  );
};

export default FAQPage;

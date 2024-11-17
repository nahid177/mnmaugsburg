'use client';

import React from 'react';
import useSWR from 'swr';
import axios from 'axios';


export interface IFAQ {
    _id: string;
    question: string;
    answer: string;
  }
  
interface FAQAccordionProps {
  initialFaqs?: IFAQ[];
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data.data);

const FAQAccordion: React.FC<FAQAccordionProps> = ({ initialFaqs }) => {
  const { data: faqs, error } = useSWR<IFAQ[]>(
    initialFaqs ? null : '/api/client/faqRoutes',
    fetcher,
    {
      fallbackData: initialFaqs,
      refreshInterval: 2000,
    }
  );

  if (error)
    return (
      <div className="text-red-500 text-center">
        Failed to load FAQs.
      </div>
    );
  if (!faqs) return <div className="text-center">Loading...</div>;

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      {faqs.map((faq, index) => (
        <div
          key={faq._id}
          className="border border-gray-200 rounded-lg overflow-hidden"
          aria-labelledby={`faq-${index}-header`}
          role="region"
        >
          <input
            type="checkbox"
            name="faq-accordion"
            id={`faq-${index}`}
            defaultChecked={index === 0}
            className="hidden peer"
          />
          <label
            htmlFor={`faq-${index}`}
            className="flex justify-between items-center cursor-pointer p-4 bg-gray-100 hover:bg-gray-200"
            id={`faq-${index}-header`}
            role="button"
          >
            <span className="lg:text-lg md:text-lg text-sm font-medium break-words lg:w-[600px] md:w-[600px] w-[200px]">
              {faq.question.endsWith('?') ? faq.question : faq.question + '?'}
            </span>
            <svg
              className="w-6 h-6 text-gray-500 transform transition-transform duration-200 peer-checked:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </label>
          <div
            className="max-h-0 overflow-hidden bg-white transition-all duration-300 peer-checked:max-h-screen"
            id={`faq-${index}-content`}
            role="region"
            aria-labelledby={`faq-${index}-header`}
          >
            <div className="p-4 text-gray-700">
              <p className="whitespace-pre-wrap break-words lg:text-lg md:text-lg text-sm">{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;

// src/app/page.tsx
"use client"; // Ensure this page renders as a client component

import React, { useState, useEffect } from 'react';
import TypeNameNavbar from '@/components/CreateInfomation/TypeNameNavbar';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import CategoryList from '@/components/CategoryList'; // Import the CategoryList component

interface Category {
  _id: string;
  name: string;
  description: string;
  // Add other relevant fields based on your DetailModel schema
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/client/createInfo');
        const result = await response.json();

        if (response.ok && result.success) {
          setCategories(result.data);
        } else {
          setError(result.error || 'Failed to fetch categories.');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <LanguageSwitcher />
      <div className='text-center'>
        <TypeNameNavbar />
      </div>
      
     
      <div className="flex justify-center items-center p-4">
        <Image
          src="/mnm.svg"
          alt="MNMAugsburg"
          width={1150}
          height={500}
          className="rounded-lg shadow-lg h-auto"
        />
      </div>
      
    </div>
  );
}

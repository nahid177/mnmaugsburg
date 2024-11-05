// src/app/page.tsx
"use client"; // Ensure this page renders as a client component

import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Navbar from '@/components/Navbar';
import Image from 'next/image';

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <LanguageSwitcher />
      
      <div className=" flex justify-center items-center p-4">
        <Image
          src="/mnm.jpeg"
          alt="MNMAugsburg"
          width={1500}
          height={500}
          className="rounded-lg shadow-lg h-96"
        />
      </div>

      <div className="text-center mt-8">
        <h1 className="text-3xl font-bold text-gray-800">{t('welcome')}</h1>
        <p className="text-gray-600 mt-4">{t('description')}</p>
      </div>
    </div>
  );
}

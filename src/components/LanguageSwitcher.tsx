// src/components/LanguageSwitcher.tsx
"use client"; // Marks this as a client component

import i18n from 'i18next';
import Link from 'next/link';
import { useState } from 'react';

const LanguageSwitcher = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const changeLanguage = (locale: string) => {
    i18n.changeLanguage(locale);
    setSelectedLanguage(locale);
  };

  return (
    <div className="flex justify-end items-center p-4">
      <button
        onClick={() => changeLanguage('en')}
        className={`xl:px-4 xl:py-2 lg:px-4 lg:py-2 md:px-4 md:py-2 px-2 py-1 mx-1 xl:text-base md:text-base lg:text-base text-sm rounded font-bold transition-colors duration-300 ${
          selectedLanguage === 'en'
            ? 'bg-[#0284C7] text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        🇺🇸 English
      </button>
      <button
        onClick={() => changeLanguage('de')}
        className={`xl:px-4 xl:py-2 lg:px-4 lg:py-2 md:px-4 md:py-2 px-2 py-1 mx-1 rounded font-bold transition-colors duration-300 xl:text-base md:text-base lg:text-base text-sm ${
          selectedLanguage === 'de'
            ? 'bg-[#0369A1] text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        🇩🇪 German
      </button>
      <Link
        href="/about"
        className="xl:px-4 xl:py-2 lg:px-4 lg:py-2 md:px-4 md:py-2 px-2 py-1 mx-1 rounded font-bold transition-colors duration-300 xl:text-base md:text-base lg:text-base text-sm bg-sky-500 text-white hover:bg-green-700"
      >
        Contact Us
      </Link>
    </div>
  );
};

export default LanguageSwitcher;

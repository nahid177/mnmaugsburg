// src/components/LanguageSwitcher.tsx
"use client"; // Marks this as a client component

import i18n from 'i18next';
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
        className={`px-4 py-2 mx-1 rounded font-bold transition-colors duration-300 ${
          selectedLanguage === 'en'
            ? 'bg-[#0284C7] text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        🇺🇸 English
      </button>
      <button
        onClick={() => changeLanguage('de')}
        className={`px-4 py-2 mx-1 rounded font-bold transition-colors duration-300 ${
          selectedLanguage === 'de'
            ? 'bg-[#0369A1] text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        🇩🇪 German
      </button>
    </div>
  );
};

export default LanguageSwitcher;

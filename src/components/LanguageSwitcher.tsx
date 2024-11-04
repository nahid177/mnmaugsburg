// src/components/LanguageSwitcher.tsx
"use client"; // Marks this as a client component

import i18n from 'i18next';

const LanguageSwitcher = () => {
  const changeLanguage = (locale: string) => {
    i18n.changeLanguage(locale);
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('de')}>German</button>
    </div>
  );
};

export default LanguageSwitcher;

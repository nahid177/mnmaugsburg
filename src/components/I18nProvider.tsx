// src/components/I18nProvider.tsx
"use client"; // Ensures this component is treated as a client component

import React, { ReactNode } from 'react';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes values by default
  },
  resources: {
    en: {
      common: {
        welcome: "Welcome to our site",
        description: "This is a multi-language Next.js site.",
      },
    },
    de: {
      common: {
        welcome: "Willkommen auf unserer Seite",
        description: "Dies ist eine mehrsprachige Next.js-Seite.",
      },
    },
  },
});

export default function I18nProvider({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

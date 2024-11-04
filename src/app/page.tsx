// src/app/page.tsx
"use client"; // Ensure this page renders as a client component

import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Navbar from '@/components/Navbar';

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <div>
      <Navbar />
      <LanguageSwitcher />
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}

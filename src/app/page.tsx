// src/app/page.tsx
"use client";

import TypeNameNavbar from '@/components/CreateInfomation/TypeNameNavbar';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import VerticalCategoryList from '@/components/VerticalCategoryList';
import PolicyGet from '@/components/PolicyGet';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <LanguageSwitcher />
      <div className="text-center">
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

      {/* New Section for Vertical Category List */}
      <div className="xl:px-80 lg:px-28 md:px-8 px-3  py-12 xl:flex lg:flex md:flex ">
        <VerticalCategoryList />
        <PolicyGet />
      </div>
    </div>
  );
}

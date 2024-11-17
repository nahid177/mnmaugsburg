// src/app/page.tsx
"use client"; // Ensure this page renders as a client component

import TypeNameNavbar from '@/components/CreateInfomation/TypeNameNavbar';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Navbar from '@/components/Navbar';
import Image from 'next/image';

export default function Home() {

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <LanguageSwitcher />
      <div className='text-center'>
              <TypeNameNavbar />

      </div>

      <div className=" w- flex justify-center items-center p-4">
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

// src/components/TypeNameNavbar.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { InformationData, APIResponse } from '@/interfaces/InformationTypes';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const TypeNameNavbar: React.FC = () => {
  const [data, setData] = useState<InformationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const pathname = usePathname();
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/client/createInfo');
        if (!res.ok) {
          // Handle non-2xx HTTP responses
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json: APIResponse<InformationData[]> = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          // Redirect to the error page if the API response indicates failure
          router.push('/yournetworkproblem');
        }
      } catch (err) {
        console.error('Error fetching navbar data:', err);
        // Redirect to the error page in case of any unexpected errors
        router.push('/yournetworkproblem');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return null; // Optionally, replace with a loading spinner

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-auto">
          {/* Centered Menu for Desktop */}
          <div className="hidden md:flex md:space-x-6 w-full justify-center">
            {/* Home Link */}
            <Link href="/">
              <div
                className={`font-bold text-gray-800 hover:text-blue-600 cursor-pointer transition-colors duration-200 ${
                  pathname === '/' ? 'text-blue-600' : ''
                }`}
                style={{ color: pathname === '/' ? 'blue' : 'inherit' }}
              >
                Home
              </div>
            </Link>

            {/* Dynamic Menu Items */}
            {data.map((item) => (
              <div key={item._id} className="relative group">
                {item.categories && item.categories.length > 0 ? (
                  <>
                    <Link href={`/showInformationPage/${item._id}`}>
                      <div
                        className="flex items-center font-bold text-gray-800 hover:text-blue-600 focus:outline-none transition-colors duration-200"
                        style={{ color: item.typenameColor || 'inherit' }}
                      >
                        {item.typename}
                        <svg
                          className="ml-1 h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </Link>
                    {/* Dropdown Menu */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      <ul className="py-1">
                        {item.categories.map((category) => (
                          <li key={category._id}>
                            <Link href={`/showInformationPage/${item._id}/${category._id}`}>
                              <div
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer font-semibold"
                                style={{ color: category.nameColor || 'inherit' }}
                              >
                                {category.name}
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link href={`/showInformationPage/${item._id}`}>
                    <div
                      className={`font-bold text-gray-800 hover:text-blue-600 cursor-pointer transition-colors duration-200 ${
                        pathname === `/showInformationPage/${item._id}` ? 'text-blue-600' : ''
                      }`}
                      style={{ color: item.typenameColor || 'inherit' }}
                    >
                      {item.typename}
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800 hover:text-gray-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Home Link */}
            <Link href="/">
              <div
                className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer font-bold transition-colors duration-200 ${
                  pathname === '/' ? 'text-blue-600' : ''
                }`}
                style={{ color: pathname === '/' ? 'blue' : 'inherit' }}
              >
                Home
              </div>
            </Link>

            {/* Dynamic Menu Items */}
            {data.map((item) => (
              <div key={item._id}>
                {item.categories && item.categories.length > 0 ? (
                  <details className="group">
                    <summary
                      className="flex items-center justify-between font-bold text-gray-800 hover:text-blue-600 cursor-pointer py-2 transition-colors duration-200"
                      style={{ color: item.typenameColor || 'inherit' }}
                    >
                      {item.typename}
                      <svg
                        className="ml-1 h-4 w-4 transform group-open:rotate-180 transition-transform duration-200"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </summary>
                    <ul className="pl-4">
                      {item.categories.map((category) => (
                        <li key={category._id}>
                          <Link href={`/showInformationPage/${item._id}/${category._id}`}>
                            <div
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer font-semibold"
                              style={{ color: category.nameColor || 'inherit' }}
                            >
                              {category.name}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link href={`/showInformationPage/${item._id}`}>
                    <div
                      className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer font-bold transition-colors duration-200 ${
                        pathname === `/showInformationPage/${item._id}` ? 'text-blue-600' : ''
                      }`}
                      style={{ color: item.typenameColor || 'inherit' }}
                    >
                      {item.typename}
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default TypeNameNavbar;

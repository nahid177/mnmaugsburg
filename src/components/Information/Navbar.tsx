// src/components/Information/Navbar.tsx

"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaHome, FaInfoCircle, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  types: { id: string; name: string }[]; // Updated to include id
  categoriesMap: Record<string, { id: string; name: string }[]>; // Updated to include id
}

const Navbar: React.FC<NavbarProps> = ({ types, categoriesMap }) => {
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(dropdownRefs.current).forEach((type) => {
        const ref = dropdownRefs.current[type];
        if (ref && !ref.contains(event.target as Node)) {
          setDropdownOpen((prev) => (prev === type ? null : prev));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown for a specific type
  const toggleDropdown = (type: string) => {
    setDropdownOpen((prev) => (prev === type ? null : type));
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg rounded-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Dashboard Link */}
          <Link href="/admin/addInformationPage/manageInformation" className="text-white font-bold text-xl hover:text-gray-200 flex items-center">
            <FaHome className="inline-block mr-2" /> Dashboard
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            {types.map((type) => (
              <div
                key={type.id}
                className="relative"
                ref={(el) => { dropdownRefs.current[type.id] = el; }}
              >
                <Link
                  href={`/admin/addInformationPage/manageInformation/${type.id}`} // Use id instead of name
                  className={`text-white px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                    pathname?.startsWith(`/admin/addInformationPage/manageInformation/${type.id}`) ? 'bg-white text-blue-600' : 'hover:bg-white hover:text-blue-600'
                  } transition-colors duration-200`}
                >
                  <FaInfoCircle className="inline-block mr-1" /> {type.name}
                </Link>
                {categoriesMap[type.id]?.length > 0 && (
                  <>
                    <button
                      onClick={() => toggleDropdown(type.id)}
                      className="text-white px-2 py-1 focus:outline-none"
                      aria-label={`Toggle dropdown for ${type.name}`}
                      aria-expanded={dropdownOpen === type.id}
                    >
                      <FaChevronDown />
                    </button>
                    {dropdownOpen === type.id && (
                      <ul className="absolute bg-white text-blue-600 shadow-lg rounded-lg mt-2 w-40 z-10 animate-fade-in">
                        {categoriesMap[type.id].map((category) => (
                          <li key={category.id}>
                            <Link
                              href={`/admin/addInformationPage/manageInformation/${type.id}/${category.id}`} // Use categoryID
                              className={`block px-4 py-2 hover:bg-blue-600 hover:text-white ${
                                pathname === `/admin/addInformationPage/manageInformation/${type.id}/${category.id}` ? 'bg-blue-600 text-white' : ''
                              }`}
                            >
                              {category.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg rounded-b-2xl">
          <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {types.map((type) => (
              <div
                key={type.id}
                className="relative"
                ref={(el) => { dropdownRefs.current[type.id] = el; }}
              >
                <Link
                  href={`/admin/addInformationPage/manageInformation/${type.id}`} // Use id instead of name
                  className={`block text-white px-3 py-2 rounded-md text-base font-medium hover:bg-white hover:text-blue-600 transition-colors duration-200 ${
                    pathname?.startsWith(`/admin/addInformationPage/manageInformation/${type.id}`) ? 'bg-white text-blue-600' : ''
                  }`}
                  onClick={() => toggleDropdown(type.id)}
                >
                  <FaInfoCircle className="inline-block mr-1" /> {type.name}
                </Link>
                {categoriesMap[type.id]?.length > 0 && dropdownOpen === type.id && (
                  <ul className="bg-white text-blue-600 shadow-lg rounded-lg mt-1 ml-4 w-36 z-10 animate-fade-in">
                    {categoriesMap[type.id].map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/admin/addInformationPage/manageInformation/${type.id}/${category.id}`} // Use categoryID
                          className={`block px-4 py-2 hover:bg-blue-600 hover:text-white ${
                            pathname === `/admin/addInformationPage/manageInformation/${type.id}/${category.id}` ? 'bg-blue-600 text-white' : ''
                          }`}
                          onClick={() => setDropdownOpen(null)} // Close menu on selection
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );

};

export default Navbar;

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { FaPlus, FaSignOutAlt, FaQuestionCircle, FaEdit, FaTasks } from "react-icons/fa";

const AdminNavbar: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const deviceId = localStorage.getItem("deviceId");

    if (deviceId) {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deviceId }),
      });

      if (response.ok) {
        localStorage.removeItem("deviceId");
        Cookies.remove("token");
        router.push("/login");
      } else {
        console.error("Failed to log out");
      }
    } else {
      Cookies.remove("token");
      router.push("/login");
    }
  };

  return (
    <nav className="navbar bg-white shadow-md p-4 md:p-6 flex items-center justify-between">
      <div className="navbar-start flex items-center space-x-3">
        <span className="text-xl md:text-2xl font-semibold hidden lg:inline-block">
          Admin Dashboard
        </span>

        {/* Desktop Add Information Button */}
        <Link href="/admin/addInformationPage">
          <button
            className="hidden lg:flex items-center bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200"
            aria-label="Add Information"
          >
            <FaPlus className="mr-2" />
            Add Information
          </button>
        </Link>

        {/* Desktop Manage Information Button */}
        <Link href="/admin/addInformationPage/manageInformation">
          <button
            className="hidden lg:flex items-center bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-md shadow-md hover:bg-teal-700 transition-colors duration-200"
            aria-label="Manage Information"
          >
            <FaTasks className="mr-2" />
            Manage Information
          </button>
        </Link>

        {/* Desktop Manage FAQs Button */}
        <Link href="/admin/faq/showFAQ">
          <button
            className="hidden lg:flex items-center bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md shadow-md hover:bg-green-700 transition-colors duration-200"
            aria-label="Manage FAQs"
          >
            <FaQuestionCircle className="mr-2" />
            Manage FAQs
          </button>
        </Link>

        {/* Desktop Create FAQ Button */}
        <Link href="/admin/faq/create">
          <button
            className="hidden lg:flex items-center bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-md shadow-md hover:bg-purple-700 transition-colors duration-200"
            aria-label="Create FAQ"
          >
            <FaEdit className="mr-2" />
            Create FAQ
          </button>
        </Link>
      </div>

      <div className="navbar-end flex items-center space-x-3">
        {/* Desktop Logout Button */}
        <button
          className="btn btn-primary btn-sm lg:flex items-center hidden transition-colors duration-200"
          onClick={handleLogout}
          aria-label="Logout"
        >
          <FaSignOutAlt className="mr-1" />
          Logout
        </button>

        {/* Mobile Buttons */}
        <Link href="/admin/addInformationPage">
          <button
            className="btn btn-secondary lg:hidden flex items-center text-sm font-medium text-white p-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200"
            aria-label="Add Information"
          >
            <FaPlus className="mr-1" />
            Add Info
          </button>
        </Link>

        <Link href="/admin/addInformationPage/manageInformation">
          <button
            className="btn btn-info lg:hidden flex items-center text-sm font-medium text-white p-2 rounded-md shadow-md hover:bg-teal-700 transition-colors duration-200"
            aria-label="Manage Information"
          >
            <FaTasks className="mr-1" />
            Manage Info
          </button>
        </Link>

        <Link href="/admin/faq/showFAQ">
          <button
            className="btn btn-accent lg:hidden flex items-center text-sm font-medium text-white p-2 rounded-md shadow-md hover:bg-green-700 transition-colors duration-200"
            aria-label="Manage FAQs"
          >
            <FaQuestionCircle className="mr-1" />
            FAQs
          </button>
        </Link>

        <Link href="/admin/faq/create">
          <button
            className="btn btn-warning lg:hidden flex items-center text-sm font-medium text-white p-2 rounded-md shadow-md hover:bg-purple-700 transition-colors duration-200"
            aria-label="Create FAQ"
          >
            <FaEdit className="mr-1" />
            Create FAQ
          </button>
        </Link>

        {/* Mobile Dropdown Menu */}
        <div className="dropdown dropdown-end lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content mt-2 p-3 shadow-lg bg-white rounded-lg w-48 space-y-2"
          >
            <li>
              <Link
                href="/admin/addInformationPage/manageInformation"
                className="flex items-center text-teal-700 hover:bg-gray-100 p-2 rounded-md transition-colors duration-200"
                aria-label="Manage Information"
              >
                <FaTasks className="mr-2" />
                Manage Info
              </Link>
            </li>

            <li>
              <button
                className="flex items-center text-red-600 hover:bg-gray-100 p-2 rounded-md w-full transition-colors duration-200"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;

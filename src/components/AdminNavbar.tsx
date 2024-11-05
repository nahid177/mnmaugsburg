"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

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
    <nav className="navbar bg-white shadow-md p-8">
      <div className="navbar-start">
        <span className="text-2xl font-semibold hidden lg:inline-block">
          Admin Dashboard
        </span>
      </div>

      <div className="navbar-end">
        <button
          className="btn btn-outline btn-primary hidden lg:inline-block"
          onClick={handleLogout}
        >
          Logout
        </button>

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
            className="dropdown-content mt-2 p-3 shadow-lg bg-white rounded-lg w-52 space-y-1"
          >
            <li>
              <button className="btn btn-outline btn-primary w-full" onClick={handleLogout}>
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

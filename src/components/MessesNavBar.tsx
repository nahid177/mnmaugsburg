"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const MessesNavBar: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  // Check if the user is logged in by looking for a username in localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername(null);
    router.push("/smsLogin");
  };

  return (
    <div className="navbar bg-base-100 shadow-lg px-4 md:px-8 lg:px-12">
      {/* Centered Contact Us */}
      <div className="flex-1 flex justify-center">
        <a className="btn btn-ghost normal-case text-xl font-bold">
          Contact Us
        </a>
      </div>

      {/* User Options */}
      <div className="flex-none gap-2">
        {username ? (
          <div className="flex items-center space-x-4">
            <span className="text-lg">Hello, {username}</span>
            <button
              className="btn btn-outline"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              className="btn btn-outline"
              onClick={() => router.push("/smsLogin")}
            >
              Login
            </button>
            <button
              className="btn btn-primary"
              onClick={() => router.push("/register")}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessesNavBar;

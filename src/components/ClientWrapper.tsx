// src/components/ClientWrapper.tsx
"use client";
import React, { useState, useEffect } from "react";
import { FiWifiOff } from "react-icons/fi"; // Only import the offline icon for the modal

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOnline, setIsOnline] = useState(true); // Initialize as `true` to prevent server-side errors

  useEffect(() => {
    // Only run the navigator code in the browser
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    if (typeof window !== "undefined") {
      // Initialize online status
      setIsOnline(navigator.onLine);

      // Add event listeners
      window.addEventListener("online", updateOnlineStatus);
      window.addEventListener("offline", updateOnlineStatus);

      // Cleanup listeners on component unmount
      return () => {
        window.removeEventListener("online", updateOnlineStatus);
        window.removeEventListener("offline", updateOnlineStatus);
      };
    }
  }, []);

  return (
    <>
      {/* DaisyUI Modal for Offline Alert */}
      {!isOnline && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-red-600 flex items-center gap-2">
              <FiWifiOff className="text-red-600" /> Offline Mode
            </h3>
            <p className="py-4">
              You are offline. Some features may not be available.
            </p>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setIsOnline(true)} // Optionally allow the user to close the modal
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {children}
    </>
  );
}

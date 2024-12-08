"use client";
import React, { useState, useEffect } from "react";
import { FiWifiOff } from "react-icons/fi";

// Step 1: Define the NetworkInformation interface if not already available
interface NetworkInformation {
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | string;
  addEventListener(
    type: 'change',
    listener: (this: NetworkInformation, ev: Event) => unknown,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: 'change',
    listener: (this: NetworkInformation, ev: Event) => unknown,
    options?: boolean | EventListenerOptions
  ): void;
}

// Step 2: Extend the Navigator interface to include the connection property
interface NavigatorExtended extends Navigator {
  connection?: NetworkInformation;
}

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSlowNetwork, setIsSlowNetwork] = useState<boolean>(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const updateNetworkStatus = () => {
      const nav = navigator as NavigatorExtended;
      if (nav.connection) {
        const effectiveType = nav.connection.effectiveType;
        setIsSlowNetwork(effectiveType === "2g" || effectiveType === "slow-2g");
      }
    };

    // Set initial online status and network speed status
    updateOnlineStatus();
    updateNetworkStatus();

    // Add event listeners
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    const nav = navigator as NavigatorExtended;
    if (nav.connection) {
      nav.connection.addEventListener("change", updateNetworkStatus);
    }

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);

      if (nav.connection) {
        nav.connection.removeEventListener("change", updateNetworkStatus);
      }
    };
  }, []);

  return (
    <>
      {/* Offline Notification */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-sm font-medium py-2 px-4 flex items-center justify-center z-50 shadow-md">
          <FiWifiOff className="mr-2 text-lg" />
          <span>You are offline. Some features may not be available.</span>
        </div>
      )}

      {/* Slow Network Notification */}
      {isSlowNetwork && !isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-600 text-white text-sm font-medium py-2 px-4 flex items-center justify-center z-50 shadow-md">
          <FiWifiOff className="mr-2 text-lg" />
          <span>Your network is slow. Some features may experience buffering.</span>
        </div>
      )}

      {children}
    </>
  );
}

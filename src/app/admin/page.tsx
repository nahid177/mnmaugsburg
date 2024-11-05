// src/app/admin/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AdminLayout from "./AdminLayout";
import StatsCard from "@/components/StatsCard"; // Import StatsCard component

const AdminPage: React.FC = () => {
  const router = useRouter();
  const [registerCount, setRegisterCount] = useState<number>(0);
  const [loginCount, setLoginCount] = useState<number>(0);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        setRegisterCount(data.totalRegistrations || 0);
        setLoginCount(data.totalLogins || 0);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStats();
    const intervalId = setInterval(fetchStats, 9000);

    return () => clearInterval(intervalId);
  }, [router]);

  return (
    <AdminLayout>
      <div className="min-h-screen flex flex-col items-center py-12 bg-gray-100 ">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 ">
          Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl px-4">
          <StatsCard title="Total Registrations" count={registerCount} />
          <StatsCard title="Total Logins" count={loginCount} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;

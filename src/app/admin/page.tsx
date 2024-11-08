// src/app/admin/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AdminLayout from "./AdminLayout";
import StatsCard from "@/components/StatsCard"; // Ensure this path is correct
import Link from "next/link";

interface User {
  _id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  
  // Statistics State
  const [registerCount, setRegisterCount] = useState<number>(0);
  const [loginCount, setLoginCount] = useState<number>(0);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const [statsError, setStatsError] = useState<string>('');

  // Users State
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState<boolean>(true);
  const [usersError, setUsersError] = useState<string>('');

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    // Fetch Statistics
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setRegisterCount(data.totalRegistrations || 0);
          setLoginCount(data.totalLogins || 0);
        } else {
          setStatsError(data.message || "Failed to fetch statistics.");
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
        setStatsError("Network error. Please try again.");
      } finally {
        setStatsLoading(false);
      }
    };

    // Fetch Users
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUsers(data.users);
        } else if (res.status === 401 || res.status === 403) {
          router.push('/admin/login');
        } else {
          const data = await res.json();
          setUsersError(data.message || 'Failed to fetch users.');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setUsersError('Network error. Please try again.');
      } finally {
        setUsersLoading(false);
      }
    };

    fetchStats();
    fetchUsers();

    // Optionally, set intervals to refresh data periodically
    const statsInterval = setInterval(fetchStats, 900000); // Every 15 minutes
    const usersInterval = setInterval(fetchUsers, 900000); // Every 15 minutes

    return () => {
      clearInterval(statsInterval);
      clearInterval(usersInterval);
    };
  }, [router]);

  return (
    <AdminLayout>
      <div className="min-h-screen flex flex-col items-center py-12 bg-gray-100">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Admin Dashboard
        </h1>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl px-4">
          {statsLoading ? (
            <p>Loading statistics...</p>
          ) : statsError ? (
            <div className="alert alert-error">
              <span>{statsError}</span>
            </div>
          ) : (
            <>
              <StatsCard title="Total Registrations" count={registerCount} />
              <StatsCard title="Total Logins" count={loginCount} />
            </>
          )}
        </div>

        {/* Divider */}
        <div className="w-full max-w-4xl px-4 my-8 border-t border-gray-300"></div>

        {/* Users Management Section */}
        <div className="w-full max-w-4xl px-4">
          <h2 className="text-2xl font-semibold mb-4">User Management</h2>

          {usersLoading ? (
            <p>Loading users...</p>
          ) : usersError ? (
            <div className="alert alert-error">
              <span>{usersError}</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Registered At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{new Date(user.createdAt).toLocaleString()}</td>
                      <td>
                        <Link href={`/admin/chat/${user._id}`} className="btn btn-primary btn-sm">
                          Chat
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

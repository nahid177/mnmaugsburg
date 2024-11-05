// src/app/admin/AdminLayout.tsx
import React, { ReactNode } from "react";
import AdminNavbar from "@/components/AdminNavbar"; // Ensure correct import path for AdminNavbar

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div>
      <AdminNavbar />
      <main className="p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;

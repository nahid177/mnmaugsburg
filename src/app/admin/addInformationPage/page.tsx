// src/app/admin/addInformationPage/page.tsx
"use client";
import { useEffect, useState } from 'react';
import InfoForm from "@/components/CreateInfomation/InfoForm";
import AdminLayout from "../AdminLayout";

const AddInformationPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This will only run on the client-side
    setIsClient(true);
  }, []);

  // Render null or a loading spinner if it's not client-side
  if (!isClient) {
    return null; // Or you can show a loading state
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 p-8">
        <InfoForm />
      </div>
    </AdminLayout>
  );
};

export default AddInformationPage;

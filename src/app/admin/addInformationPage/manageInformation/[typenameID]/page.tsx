// src/app/admin/addInformationPage/manageInformation/[typenameID]/page.tsx

"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InformationList from '@/components/Information/InformationList';
import { InformationData, APIResponse } from '@/interfaces/InformationTypes';
import { useParams } from 'next/navigation';
import AdminLayout from '@/app/admin/AdminLayout';
import ManageInformationLayout from '../ManageInformationLayout';

const TypenamePage: React.FC = () => {
  const params = useParams();
  const typenameID = params.typenameID as string; // Type assertion

  const [data, setData] = useState<InformationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data based on typenameID
  const fetchData = async (typenameID: string) => {
    try {
      console.log(`Fetching data with typenameID: "${typenameID}"`); // Debugging log
      const response = await axios.get<APIResponse<InformationData>>(`/api/admin/createInfo/${typenameID}`);
      if (!response.data.success || !response.data.data) {
        throw new Error('Invalid API response structure.');
      }

      setData(response.data.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof typenameID === 'string' && typenameID.trim() !== '') {
      fetchData(typenameID);
    } else {
      setLoading(false);
      setError('Invalid typenameID parameter.');
    }
  }, [typenameID]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <AdminLayout>
      <ManageInformationLayout>
        {data ? <InformationList data={data} /> : <div className="text-center">No information available.</div>}
      </ManageInformationLayout>
    </AdminLayout>
  );
};

export default TypenamePage;

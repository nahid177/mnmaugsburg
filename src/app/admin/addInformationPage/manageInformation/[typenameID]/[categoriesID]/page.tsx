"use client";

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { InformationData, APIResponse } from '@/interfaces/InformationTypes';
import CategorySection from '@/components/Information/CategorySection';
import AdminLayout from '@/app/admin/AdminLayout';
import ManageInformationLayout from '@/app/admin/addInformationPage/manageInformation/ManageInformationLayout';

const CategoryPage: React.FC = () => {
  const params = useParams();
  const typenameID = Array.isArray(params.typenameID) ? params.typenameID[0] ?? '' : params.typenameID ?? '';
  const categoriesID = Array.isArray(params.categoriesID) ? params.categoriesID[0] ?? '' : params.categoriesID ?? '';

  const [data, setData] = useState<InformationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!typenameID || !categoriesID) {
      setError('Invalid route parameters.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get<APIResponse<InformationData>>(
        `/api/admin/createInfo/${typenameID}/${categoriesID}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error('Invalid API response structure.');
      }

      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching category data:', error);
      setError('Failed to fetch category data.');
    } finally {
      setLoading(false);
    }
  }, [typenameID, categoriesID]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <div className="text-center text-blue-600 font-bold">Loading data, please wait...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="text-center text-gray-500">No data available for this category.</div>;
  }

  return (
    <AdminLayout>
      <ManageInformationLayout>
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Category Details</h2>
          <CategorySection categories={[data]} />
        </div>
      </ManageInformationLayout>
    </AdminLayout>
  );
};

export default CategoryPage;

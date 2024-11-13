// src/app/admin/addInformationPage/manageInformation/ManageInformationLayout.tsx

"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import Navbar from '@/components/Information/Navbar';
import axios from 'axios';
import { InformationData, Category, APIResponse } from '@/interfaces/InformationTypes';

interface ManageInformationLayoutProps {
  children: ReactNode;
}

interface TypeItem {
  id: string;
  name: string;
  nameColor?: string;
}

interface CategoryItem {
  id: string;
  name: string;
  nameColor?: string;
}

const ManageInformationLayout: React.FC<ManageInformationLayoutProps> = ({ children }) => {
  const [types, setTypes] = useState<TypeItem[]>([]);
  const [categoriesMap, setCategoriesMap] = useState<Record<string, CategoryItem[]>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch types and categories from the API
  const fetchTypesAndCategories = async () => {
    try {
      const response = await axios.get<APIResponse<InformationData[]>>('/api/admin/createInfo');
      console.log('API Response:', response.data); // Inspect the data

      if (!response.data.success || !Array.isArray(response.data.data)) {
        throw new Error('Invalid API response structure.');
      }

      // Map types to include their IDs
      const fetchedTypes: TypeItem[] = response.data.data.map((item: InformationData) => ({
        id: item._id.toString(),
        name: item.typename,
        nameColor: item.typenameColor,
      }));

      const fetchedCategoriesMap: Record<string, CategoryItem[]> = {};
      response.data.data.forEach((item: InformationData) => {
        if (item._id && item.categories) {
          fetchedCategoriesMap[item._id.toString()] = item.categories.map((category: Category) => ({
            id: category._id.toString(),
            name: category.name,
            nameColor: category.nameColor,
          }));
        }
      });

      setTypes(fetchedTypes);
      setCategoriesMap(fetchedCategoriesMap);
    } catch (error) {
      console.error('Error fetching types and categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypesAndCategories();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <Navbar types={types} categoriesMap={categoriesMap} />
      <main className="p-8">{children}</main>
    </div>
  );
};

export default ManageInformationLayout;

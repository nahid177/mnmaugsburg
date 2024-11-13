// src/components/Information/InformationList.tsx

"use client";

import React from 'react';
import BigTitleSection from './BigTitleSection';
import CategorySection from './CategorySection';
import { InformationData } from '@/interfaces/InformationTypes';

interface InformationListProps {
  data: InformationData;
}

const InformationList: React.FC<InformationListProps> = ({ data }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
    <h2 className="text-2xl font-semibold mb-4" style={{ color: data.typenameColor || '#000' }}>
      {data.typename}
    </h2>
    <h3 className="text-xl font-semibold mb-4" style={{ color: data.bigTitleNameColor || '#000' }}>
      {data.bigTitleName}
    </h3>

    <BigTitleSection bigTitle={data.bigTitle} />
    {data.categories && data.categories.length > 0 && <CategorySection categories={data.categories} />}
  </div>
);

export default InformationList;

"use client";

import React from "react";
import BigTitleSection from "./BigTitleSection";
import CategorySection from "./CategorySection";
import { InformationData } from "@/interfaces/InformationTypes";

interface InformationListProps {
  data: InformationData;
}

const InformationList: React.FC<InformationListProps> = ({ data }) => (
  <div className="bg-white p-4 mb-8 border border-gray-200">
    {/* Main Title */}
    <h1 className="text-2xl font-bold mb-4 text-center" style={{ color: data.typenameColor || "#000" }}>
      {data.typename}
    </h1>

    {/* Sub Title */}
    <h2 className="text-xl font-semibold mb-4 text-center" style={{ color: data.bigTitleNameColor || "#000" }}>
      {data.bigTitleName}
    </h2>

    {/* Big Title Section */}
    {data.bigTitle && <BigTitleSection bigTitle={data.bigTitle} />}

    {/* Category Section */}
    {data.categories && data.categories.length > 0 && (
      <CategorySection categories={data.categories} />
    )}
  </div>
);

export default InformationList;

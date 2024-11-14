"use client";

import React from "react";
import MediaSection from "./MediaSection";
import { Category } from "@/interfaces/InformationTypes";

interface CategorySectionProps {
  categories: Category[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return <div className="text-center text-gray-500">No categories available.</div>;
  }

  return (
    <div className="space-y-8">
      {categories.map((category, catIndex) => (
        <div
          key={`${category.name}-${catIndex}`}
          className="bg-gradient-to-r from-gray-100 to-white shadow-sm rounded-lg p-6 hover:bg-gradient-to-l transition duration-300"
        >
          {/* Category Header */}
          <div className="flex items-center justify-center mb-4">
            <h4
              className="text-2xl font-bold text-center"
              style={{ color: category.nameColor || "#1F2937" }}
            >
              {decodeURIComponent(category.name)}
            </h4>
            <span className="text-sm font-medium text-gray-500 ml-4">
              {category.content?.length || 0} Items
            </span>
          </div>

          {/* Category Content */}
          <div className="space-y-6">
            {category.content && category.content.length > 0 ? (
              category.content.map((contentItem, contentIndex) => (
                <div
                  key={`${contentItem.title}-${contentIndex}`}
                  className="bg-white rounded-md p-4 shadow hover:shadow-md transition duration-200 flex flex-col items-center"
                >
                  <h5
                    className="text-lg font-semibold text-center"
                    style={{ color: contentItem.titleColor || "#111827" }}
                  >
                    {contentItem.title}
                  </h5>

                  {/* Media Section */}
                  <div className="h-auto  my-4 flex justify-center">
                    <MediaSection media={contentItem.media} />
                  </div>

                  <p
                    className="text-gray-600 mb-3 text-center"
                    style={{ color: contentItem.detailColor || "#374151" }}
                  >
                    {contentItem.detail}
                  </p>

                  {/* Subtitles Section */}
                  {contentItem.subtitle && contentItem.subtitle.length > 0 && (
                    <ul className="list-disc pl-5 text-sm text-gray-700 text-center">
                      {contentItem.subtitle.map((subtitle, subIndex) => (
                        <li
                          key={`${subtitle}-${subIndex}`}
                          className="mb-1"
                          style={{ color: contentItem.subtitleColor || "#4B5563" }}
                        >
                          {subtitle}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Subdetail Section */}
                  {contentItem.subdetail && contentItem.subdetail.length > 0 && (
                    <ul className="list-decimal pl-5 text-sm text-gray-700 text-center">
                      {contentItem.subdetail.map((subdetail, subDetailIndex) => (
                        <li
                          key={`${subdetail}-${subDetailIndex}`}
                          className="mb-1"
                          style={{ color: contentItem.subdetailColor || "#4B5563" }}
                        >
                          {subdetail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No content available for this category.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategorySection;

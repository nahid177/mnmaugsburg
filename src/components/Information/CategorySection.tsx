"use client";

import React from 'react';
import MediaSection from './MediaSection';
import { Category } from '@/interfaces/InformationTypes';

interface CategorySectionProps {
  categories: Category[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return <div className="text-center text-gray-500">No categories available.</div>;
  }

  return (
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category, catIndex) => (
        <div
          key={`${category.name}-${catIndex}`} // Ensure unique keys
          className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
        >
          {/* Category Name with Color */}
          <h4
            className="text-2xl font-bold mb-4"
            style={{ color: category.nameColor || '#000000' }}
          >
            {decodeURIComponent(category.name)}
          </h4>

          {category.content && category.content.length > 0 ? (
            category.content.map((contentItem, contentIndex) => (
              <div key={`${contentItem.title}-${contentIndex}`} className="mb-6">
                <h5
                  className="text-lg font-semibold mb-2"
                  style={{ color: contentItem.titleColor || '#000000' }}
                >
                  {contentItem.title}
                </h5>
                <p
                  className="text-gray-700 mb-4"
                  style={{ color: contentItem.detailColor || '#000000' }}
                >
                  {contentItem.detail}
                </p>

                {/* Subtitles Section */}
                {contentItem.subtitle && contentItem.subtitle.length > 0 && (
                  <ul className="list-disc pl-6 mb-4">
                    {contentItem.subtitle.map((subtitle, subIndex) => (
                      <li
                        key={`${subtitle}-${subIndex}`}
                        className="text-gray-600"
                        style={{ color: contentItem.subtitleColor || '#000000' }}
                      >
                        {subtitle}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Subdetail Section */}
                {contentItem.subdetail && contentItem.subdetail.length > 0 && (
                  <ul className="list-decimal pl-6 mb-4">
                    {contentItem.subdetail.map((subdetail, subDetailIndex) => (
                      <li
                        key={`${subdetail}-${subDetailIndex}`}
                        className="text-gray-600"
                        style={{ color: contentItem.subdetailColor || '#000000' }}
                      >
                        {subdetail}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Media Section */}
                <MediaSection media={contentItem.media} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No content available for this category.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategorySection;

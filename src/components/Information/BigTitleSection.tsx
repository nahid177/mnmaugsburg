"use client";

import React from 'react';
import { BigTitleItem } from '@/interfaces/InformationTypes';
import Image from 'next/image';

interface BigTitleSectionProps {
  bigTitle: BigTitleItem[];
}

const BigTitleSection: React.FC<BigTitleSectionProps> = ({ bigTitle }) => {
  if (!Array.isArray(bigTitle)) {
    console.warn('bigTitle is not an array:', bigTitle);
    return null;
  }

  return (
    
    <div className="mb-8">
      {bigTitle.map((item: BigTitleItem, index: number) => (
        <div key={`${item.title}-${index}`} className="mb-6">
          <h4
            className="text-lg font-semibold mb-2"
            style={{ color: item.titleColor || '#000' }}
          >
            {item.title}
          </h4>
          <p
            className="text-md mb-2"
            style={{ color: item.detailColor || '#000' }}
          >
            {item.detail}
          </p>
          {/* Render Subtitles */}
          {item.subtitle && item.subtitle.length > 0 && (
            <ul className="list-disc list-inside mb-2">
              {item.subtitle.map((subtitle: string, subIndex: number) => (
                <li key={`${subtitle}-${subIndex}`} style={{ color: item.subtitleColor || '#000' }}>
                  {subtitle}
                </li>
              ))}
            </ul>
          )}
          {/* Render Subdetails */}
          {item.subdetail && item.subdetail.length > 0 && (
            <ul className="list-disc list-inside mb-2">
              {item.subdetail.map((subdetail: string, subDetailIndex: number) => (
                <li key={`${subdetail}-${subDetailIndex}`} style={{ color: item.subdetailColor || '#000' }}>
                  {subdetail}
                </li>
              ))}
            </ul>
          )}
          {/* Render Media */}
          <div className="flex space-x-4">
            {item.media?.image && typeof item.media.image === 'string' && (
              <Image
                src={item.media.image}
                alt={`Big Title ${index + 1} Image`}
                width={128}
                height={128}
                className="object-cover rounded-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/fallback-image.png'; // Ensure this fallback image exists
                }}
              />
            )}
            {item.media?.video && (
              <video controls className="w-32 h-32 object-cover rounded-md">
                <source
                  src={
                    typeof item.media.video === 'string'
                      ? item.media.video
                      : URL.createObjectURL(item.media.video)
                  }
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BigTitleSection;

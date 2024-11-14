"use client";

import React from "react";
import { BigTitleItem } from "@/interfaces/InformationTypes";
import Image from "next/image";
import { FaCheckCircle, FaChevronRight } from "react-icons/fa";

interface BigTitleSectionProps {
  bigTitle: BigTitleItem[];
}

const BigTitleSection: React.FC<BigTitleSectionProps> = ({ bigTitle }) => {
  if (!Array.isArray(bigTitle)) {
    console.warn("bigTitle is not an array:", bigTitle);
    return null;
  }

  return (
    <div className="mb-12 px-4 md:px-8">
      {bigTitle.map((item: BigTitleItem, index: number) => (
        <div
          key={`${item.title}-${index}`}
          className="mb-10 p-6 bg-white shadow-md rounded-lg border border-gray-200"
        >
          {/* Title Section */}
          <h2
            className="text-2xl font-bold mb-4 text-center"
            style={{ color: item.titleColor || "#1A202C" }}
          >
            {item.title}
          </h2>

          {/* Media Section */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-4">
            {item.media?.image && typeof item.media.image === "string" && (
              <div className="w-full md:w-1/2 flex justify-center">
                <Image
                  src={item.media.image}
                  alt={`Image for ${item.title}`}
                  width={420}
                  height={240}
                  className="rounded-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/fallback-image.png";
                  }}
                />
              </div>
            )}

            {/* Text Content */}
            <div className="flex-1 text-center md:text-left">
              <p
                className="text-lg mb-4"
                style={{ color: item.detailColor || "#4A5568" }}
              >
                {item.detail}
              </p>

              {/* Subtitles */}
              {item.subtitle && item.subtitle.length > 0 && (
                <ul className="list-none mb-4 text-base">
                  {item.subtitle.map((subtitle, subIndex) => (
                    <li
                      key={`${subtitle}-${subIndex}`}
                      className="flex items-center gap-2"
                      style={{ color: item.subtitleColor || "#2D3748" }}
                    >
                      <FaCheckCircle className="text-green-500" />
                      {subtitle}
                    </li>
                  ))}
                </ul>
              )}

              {/* Subdetails */}
              {item.subdetail && item.subdetail.length > 0 && (
                <ul className="list-none mb-4 text-base">
                  {item.subdetail.map((subdetail, subDetailIndex) => (
                    <li
                      key={`${subdetail}-${subDetailIndex}`}
                      className="flex items-center gap-2"
                      style={{ color: item.subdetailColor || "#718096" }}
                    >
                      <FaChevronRight className="text-blue-500" />
                      {subdetail}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Video Section */}
          {item.media?.video && (
            <div className="mb-4 flex justify-center">
              <video
                controls
                className="w-full md:w-2/3 rounded-lg border border-gray-300"
              >
                <source
                  src={
                    typeof item.media.video === "string"
                      ? item.media.video
                      : URL.createObjectURL(item.media.video)
                  }
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BigTitleSection;

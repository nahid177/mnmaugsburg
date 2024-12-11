// src/app/showInformationPage/[typenameID]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { InformationData, APIResponse } from '@/interfaces/InformationTypes';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import TypeNameNavbar from '@/components/CreateInfomation/TypeNameNavbar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import axios from 'axios';

const TypePage: React.FC = () => {
  const { typenameID } = useParams() as { typenameID: string };

  const [data, setData] = useState<InformationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!typenameID) {
      router.push('/yournetworkproblem');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get<APIResponse<InformationData>>(
          `/api/client/createInfo/${typenameID}`
        );

        if (response.data.success) {
          setData(response.data.data);
        } else {
          router.push('/yournetworkproblem');
        }
      } catch (error) {
        console.error('Error fetching type data:', error);
        router.push('/yournetworkproblem');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [typenameID, router]);

  // Function to open modal with selected image
  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-16">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              role="status"
              aria-label="Loading"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
        </div>
      </nav>
    );
  }

  if (!data) {
    return <div className="p-4">No data found.</div>;
  }

  return (
    <div>
      <Navbar />
      <LanguageSwitcher />

      <TypeNameNavbar />
      <div className="xl:w-[1500px] w-auto mx-auto p-8">
        <h1
          className="text-3xl font-bold mb-4 text-center"
          style={{ color: data.bigTitleNameColor || 'inherit' }}
        >
          {data.bigTitleName}
        </h1>
        {data.bigTitle.map((item) => (
          <div key={item._id} className="mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center ">
              {/* Text Content */}
              <div className="md:w-1/2 md:pr-4">
                <h2
                  className="text-2xl font-semibold"
                  style={{ color: item.titleColor || 'inherit' }}
                >
                  {item.title}
                </h2>
                <p
                  className="mt-2 xl:text-lg lg:text-lg md:text-base text-sm"
                  style={{ color: item.detailColor || 'inherit' }}
                >
                  {item.detail}
                </p>
                <div className="mt-4 overflow-x-auto">
                  {/* Updated Subtitles and Subdetails Rendering */}
                  {item.subtitle && item.subdetail && item.subtitle.length > 0 && item.subdetail.length > 0 && (
                    <table className="min-w-full table-auto border-collapse">
                      <thead>
                        <tr>
                          <th
                            className="px-4 py-2 text-left"
                            style={{ color: item.subtitleColor || 'inherit' }}
                          >
                            {/* Header for Subtitle */}
                          </th>
                          <th
                            className="px-4 py-2 text-left"
                            style={{ color: item.subdetailColor || 'inherit' }}
                          >
                            {/* Header for Subdetail */}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.subtitle.map((subtitle, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2" style={{ color: item.subtitleColor || 'inherit' }}>
                              {subtitle}
                            </td>
                            <td className="px-4 py-2" style={{ color: item.subdetailColor || 'inherit' }}>
                              {item.subdetail![index] || 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Media Content */}
              {item.media && (
                <div className="mt-4 md:mt-0 md:w-1/2 flex justify-center">
                  {/* Image Rendering */}
                  {item.media.image &&
                    typeof item.media.image === 'string' &&
                    item.media.image.trim() !== '' && (
                      <Image
                        src={item.media.image}
                        alt={item.title}
                        width={800}
                        height={600}
                        className="w-[400px] h-auto rounded shadow cursor-pointer"
                        onClick={() => openModal(item.media.image as string)} // Type Assertion Added Here
                      />
                    )}
                  {/* Video Rendering */}
                  {item.media.video &&
                    typeof item.media.video === 'string' &&
                    item.media.video.trim() !== '' && (
                      <video
                        src={item.media.video}
                        controls
                        className="w-full h-auto rounded shadow mt-4 md:mt-0"
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Implementation */}
      {isModalOpen && selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative">
            <Image
              src={selectedImage}
              alt="Full Screen Image"
              width={1920}
              height={1080}
              className="max-w-full max-h-screen rounded shadow-lg"
            />
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypePage;

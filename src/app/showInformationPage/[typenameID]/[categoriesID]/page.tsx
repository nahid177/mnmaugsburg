// src/app/showInformationPage/[typenameID]/[categoriesID]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Category, APIResponse } from '@/interfaces/InformationTypes';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import TypeNameNavbar from '@/components/CreateInfomation/TypeNameNavbar';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const CategoryPage: React.FC = () => {
  const { typenameID, categoriesID } = useParams() as {
    typenameID: string;
    categoriesID: string;
  };

  const [data, setData] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    if (!typenameID || !categoriesID) {
      // If parameters are missing, redirect to the error page
      router.push('/yournetworkproblem');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/client/createInfo/${typenameID}/${categoriesID}`);

        if (!res.ok) {
          // Handle non-2xx HTTP responses
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json: APIResponse<Category> = await res.json();

        if (json.success) {
          setData(json.data);
        } else {
          // Redirect to the error page if the API response indicates failure
          router.push('/yournetworkproblem');
        }
      } catch (err) {
        console.error('Error fetching category data:', err);
        // Redirect to the error page in case of any unexpected errors
        router.push('/yournetworkproblem');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [typenameID, categoriesID, router]);

  if (loading) {
    // Enhanced loading indicator
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
    // This case should rarely occur as errors redirect, but handle it just in case
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
          style={{ color: data.nameColor || 'inherit' }}
        >
          {data.name}
        </h1>
        {data.content.map((item) => (
          <div key={item._id} className="mb-8">
            {/* Flex container for text and media */}
            <div className="flex flex-col md:flex-row items-start md:items-center">
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
                           
                          </th>
                          <th
                            className="px-4 py-2 text-left"
                            style={{ color: item.subdetailColor || 'inherit' }}
                          >
                          
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.subtitle.map((subtitle, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2 xl:text-lg lg:text-lg md:text-base text-sm " style={{ color: item.subtitleColor || 'inherit' }}>
                              {subtitle}
                            </td>
                            <td className="px-4 py-2 xl:text-lg lg:text-lg md:text-base text-xs" style={{ color: item.subdetailColor || 'inherit' }}>
                              {item.subdetail![index] || 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
           
                {/* End of Updated Section */}
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
                        className="xl:w-[400px] lg:w-[400px] md:w-[250px] w-[200px] h-auto rounded shadow"
                      />
                    )}
                  {/* Video Rendering */}
                  {item.media.video &&
                    typeof item.media.video === 'string' &&
                    item.media.video.trim() !== '' && (
                      <video
                        src={item.media.video}
                        controls
                        className="xl:w-[400px] lg:w-[400px] md:w-[250px] w-[200px] h-auto rounded shadow mt-4 md:mt-0"
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
    </div>
  );
};

export default CategoryPage;

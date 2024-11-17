// src/app/showInformationPage/[typenameID]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { InformationData, APIResponse } from '@/interfaces/InformationTypes';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import TypeNameNavbar from '@/components/CreateInfomation/TypeNameNavbar';

const TypePage: React.FC = () => {
  const { typenameID } = useParams() as { typenameID: string };

  const [data, setData] = useState<InformationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!typenameID) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/client/createInfo/${typenameID}`);
        const json: APIResponse<InformationData> = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error || 'Failed to fetch data.');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [typenameID]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!data) return <div className="p-4">No data found.</div>;

  return (
    <div>
      <Navbar />
      <TypeNameNavbar />
      <div className="container mx-auto p-4">
        <h1
          className="text-3xl font-bold mb-4"
          style={{ color: data.bigTitleNameColor || 'inherit' }}
        >
          {data.bigTitleName}
        </h1>
        {data.bigTitle.map((item) => (
          <div key={item._id} className="mb-8">
            <h2
              className="text-2xl font-semibold"
              style={{ color: item.titleColor || 'inherit' }}
            >
              {item.title}
            </h2>
            <p
              className="mt-2 text-lg"
              style={{ color: item.detailColor || 'inherit' }}
            >
              {item.detail}
            </p>
            {/* Render subtitles and subdetails */}
            {item.subtitle && item.subtitle.length > 0 && (
              <div className="mt-4">
                {item.subtitle.map((subtitle, index) => (
                  <h3
                    key={index}
                    className="text-xl font-medium"
                    style={{ color: item.subtitleColor || 'inherit' }}
                  >
                    {subtitle}
                  </h3>
                ))}
              </div>
            )}
            {item.subdetail && item.subdetail.length > 0 && (
              <div className="mt-2">
                {item.subdetail.map((subdetail, index) => (
                  <p
                    key={index}
                    className="text-base"
                    style={{ color: item.subdetailColor || 'inherit' }}
                  >
                    {subdetail}
                  </p>
                ))}
              </div>
            )}
            {/* Render media if available */}
            {item.media && (
              <div className="mt-4">
                {/* Image Rendering */}
                {item.media.image && typeof item.media.image === 'string' && item.media.image.trim() !== '' && (
                  <Image
                    src={item.media.image}
                    alt={item.title}
                    width={800}
                    height={600}
                    className="w-full h-auto rounded shadow"
                  />
                )}
                {/* Video Rendering */}
                {item.media.video && typeof item.media.video === 'string' && item.media.video.trim() !== '' && (
                  <video
                    src={item.media.video}
                    controls
                    className="w-full h-auto rounded shadow mt-4"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TypePage;

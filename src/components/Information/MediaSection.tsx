"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Media } from '@/interfaces/InformationTypes';

interface MediaSectionProps {
  media: Media;
}

const MediaSection: React.FC<MediaSectionProps> = ({ media }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  useEffect(() => {
    // Handle Image Preview
    if (media.image instanceof File) {
      const imageURL = URL.createObjectURL(media.image);
      setImagePreview(imageURL);

      // Cleanup function to revoke the object URL
      return () => {
        URL.revokeObjectURL(imageURL);
        setImagePreview(null);
      };
    } else if (typeof media.image === 'string') {
      setImagePreview(media.image);
    } else {
      setImagePreview(null);
    }
  }, [media.image]);

  useEffect(() => {
    // Handle Video Preview
    if (media.video instanceof File) {
      const videoURL = URL.createObjectURL(media.video);
      setVideoPreview(videoURL);

      // Cleanup function to revoke the object URL
      return () => {
        URL.revokeObjectURL(videoURL);
        setVideoPreview(null);
      };
    } else if (typeof media.video === 'string') {
      setVideoPreview(media.video);
    } else {
      setVideoPreview(null);
    }
  }, [media.video]);

  if (!media || (!media.image && !media.video)) {
    return <div className="text-center text-gray-500">No media available.</div>;
  }

  return (
    <div className="mt-4 space-y-4">
      {/* Image Preview */}
      {imagePreview && typeof media.image === 'string' && (
        <div>
          <h5 className="text-blue-600 font-semibold mb-2">Image Preview:</h5>
          <div className="relative w-full h-64">
            <Image
              src={imagePreview}
              alt="Media Image"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/fallback-image.png'; // Ensure this fallback image exists in your public directory
              }}
            />
          </div>
        </div>
      )}

      {/* Video Preview */}
      {videoPreview && (
        <div>
          <h5 className="text-blue-600 font-semibold mb-2">Video Preview:</h5>
          <video
            controls
            src={videoPreview}
            className="w-full h-64 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            onError={(e) => {
              const target = e.currentTarget as HTMLVideoElement;
              target.onerror = null;
              target.style.display = 'none'; // Hide the video element on error
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MediaSection;

// MediaSection.tsx

"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Media } from '@/interfaces/InformationTypes';
import axios from 'axios';

interface MediaSectionProps {
  media: Media;
  onUpdate: (updatedMedia: Media) => void;
}

const MediaSection: React.FC<MediaSectionProps> = ({ media, onUpdate }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);

  useEffect(() => {
    // Handle Image Preview
    if (newImageFile) {
      const imageURL = URL.createObjectURL(newImageFile);
      setImagePreview(imageURL);

      // Cleanup function to revoke the object URL
      return () => {
        URL.revokeObjectURL(imageURL);
      };
    } else if (typeof media.image === 'string' && media.image) {
      setImagePreview(media.image);
    } else {
      setImagePreview(null);
    }
  }, [media.image, newImageFile]);

  useEffect(() => {
    // Handle Video Preview
    if (newVideoFile) {
      const videoURL = URL.createObjectURL(newVideoFile);
      setVideoPreview(videoURL);

      // Cleanup function to revoke the object URL
      return () => {
        URL.revokeObjectURL(videoURL);
      };
    } else if (typeof media.video === 'string' && media.video) {
      setVideoPreview(media.video);
    } else {
      setVideoPreview(null);
    }
  }, [media.video, newVideoFile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImageFile(e.target.files[0]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewVideoFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    if (confirm('Are you sure you want to remove the image?')) {
      setNewImageFile(null);
      onUpdate({ ...media, image: '' });
    }
  };

  const handleRemoveVideo = () => {
    if (confirm('Are you sure you want to remove the video?')) {
      setNewVideoFile(null);
      onUpdate({ ...media, video: '' });
    }
  };

  const handleSave = async () => {
    const updatedMedia = { ...media };

    if (newImageFile) {
      // Upload new image
      const formData = new FormData();
      formData.append('files', newImageFile);

      try {
        const uploadResponse = await axios.post('/api/upload', formData);
        const imageUrl = uploadResponse.data.urls[0];
        updatedMedia.image = imageUrl;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Failed to upload image:', error.message);
        } else {
          console.error('An unexpected error occurred during image upload:', error);
        }
      }
    }

    if (newVideoFile) {
      // Upload new video
      const formData = new FormData();
      formData.append('files', newVideoFile);

      try {
        const uploadResponse = await axios.post('/api/upload', formData);
        const videoUrl = uploadResponse.data.urls[0];
        updatedMedia.video = videoUrl;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Failed to upload video:', error.message);
        } else {
          console.error('An unexpected error occurred during video upload:', error);
        }
      }
    }

    setIsEditMode(false);
    setNewImageFile(null);
    setNewVideoFile(null);

    onUpdate(updatedMedia);
  };

  if ((!media || (!media.image && !media.video)) && !isEditMode) {
    return (
      <div className="text-center text-gray-500">
        No media available.
        <button className="btn btn-primary ml-2" onClick={() => setIsEditMode(true)}>
          Add Media
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {isEditMode ? (
        <div className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block mb-2 font-semibold">Upload Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {newImageFile && (
              <div className="mt-2">
                <p>Selected file: {newImageFile.name}</p>
              </div>
            )}
          </div>

          {/* Video Upload */}
          <div>
            <label className="block mb-2 font-semibold">Upload Video:</label>
            <input type="file" accept="video/*" onChange={handleVideoChange} />
            {newVideoFile && (
              <div className="mt-2">
                <p>Selected file: {newVideoFile.name}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
            <button className="btn" onClick={() => setIsEditMode(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Edit Button */}
          <div className="flex justify-end">
            <button className="btn btn-sm" onClick={() => setIsEditMode(true)}>
              Edit Media
            </button>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div>
              <h5 className="text-blue-600 font-semibold mb-2">Image Preview:</h5>
              <div className="relative w-96 h-64">
                <Image
                  src={imagePreview}
                  alt="Media Image"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/fallback-image.png';
                  }}
                />
              </div>
              <button className="btn btn-error mt-2" onClick={handleRemoveImage}>
                Remove Image
              </button>
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
                  target.style.display = 'none';
                }}
              />
              <button className="btn btn-error mt-2" onClick={handleRemoveVideo}>
                Remove Video
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MediaSection;

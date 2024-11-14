// BigTitleSection.tsx

"use client";

import React, { useState } from "react";
import { BigTitleItem } from "@/interfaces/InformationTypes";
import Image from "next/image";
import { FaCheckCircle, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

interface BigTitleSectionProps {
  bigTitle: BigTitleItem[];
  typenameID: string; // Pass typenameID as a prop
  onUpdate: (updatedBigTitle: BigTitleItem[]) => void; // Callback to update parent state
}

const BigTitleSection: React.FC<BigTitleSectionProps> = ({ bigTitle, typenameID, onUpdate }) => {
  const [bigTitleState, setBigTitleState] = useState<BigTitleItem[]>(bigTitle);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editItemIndex, setEditItemIndex] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<BigTitleItem | null>(null);

  const handleEditClick = (index: number) => {
    setEditItemIndex(index);
    setEditFormData(bigTitleState[index]);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (index: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      const updatedBigTitle = [...bigTitleState];
      updatedBigTitle.splice(index, 1);

      // Update the data on the server
      try {
        const response = await axios.put(`/api/admin/createInfo/${typenameID}`, {
          bigTitle: updatedBigTitle,
        });

        if (response.data.success) {
          setBigTitleState(updatedBigTitle);
          onUpdate(updatedBigTitle);
        }
      } catch (error) {
        console.error("Failed to delete bigTitle item:", error);
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editItemIndex === null || !editFormData) return;

    const updatedBigTitle = [...bigTitleState];

    // Handle image upload if needed
    if (editFormData.media?.image instanceof File) {
      const formData = new FormData();
      formData.append('files', editFormData.media.image);

      try {
        const uploadResponse = await axios.post('/api/upload', formData);
        const imageUrl = uploadResponse.data.urls[0];
        editFormData.media.image = imageUrl;
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }

    // Handle video upload if needed
    if (editFormData.media?.video instanceof File) {
      const formData = new FormData();
      formData.append('files', editFormData.media.video);

      try {
        const uploadResponse = await axios.post('/api/upload', formData);
        const videoUrl = uploadResponse.data.urls[0];
        editFormData.media.video = videoUrl;
      } catch (error) {
        console.error('Failed to upload video:', error);
      }
    }

    updatedBigTitle[editItemIndex] = editFormData;

    // Update the data on the server
    try {
      const response = await axios.put(`/api/admin/createInfo/${typenameID}`, {
        bigTitle: updatedBigTitle,
      });

      if (response.data.success) {
        setBigTitleState(updatedBigTitle);
        onUpdate(updatedBigTitle);
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to update bigTitle:", error);
    }
  };

  // Function to add a new subtitle
  const handleAddSubtitle = () => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        subtitle: [...(editFormData.subtitle || []), ''],
      });
    }
  };

  // Function to remove a subtitle
  const handleRemoveSubtitle = (index: number) => {
    if (editFormData && editFormData.subtitle) {
      const updatedSubtitles = [...editFormData.subtitle];
      updatedSubtitles.splice(index, 1);
      setEditFormData({
        ...editFormData,
        subtitle: updatedSubtitles,
      });
    }
  };

  // Function to add a new subdetail
  const handleAddSubdetail = () => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        subdetail: [...(editFormData.subdetail || []), ''],
      });
    }
  };

  // Function to remove a subdetail
  const handleRemoveSubdetail = (index: number) => {
    if (editFormData && editFormData.subdetail) {
      const updatedSubdetails = [...editFormData.subdetail];
      updatedSubdetails.splice(index, 1);
      setEditFormData({
        ...editFormData,
        subdetail: updatedSubdetails,
      });
    }
  };

  return (
    <div className="mb-12 px-4 md:px-8">
      {bigTitleState.map((item: BigTitleItem, index: number) => (
        <div
          key={`${item.title}-${index}`}
          className="mb-10 p-6 bg-white shadow-md rounded-lg border border-gray-200"
        >
          {/* Edit and Delete Buttons */}
          <div className="flex justify-end mb-2">
            <button className="mr-2" onClick={() => handleEditClick(index)}>
              <FaEdit className="text-blue-500 hover:text-blue-700" />
            </button>
            <button onClick={() => handleDeleteClick(index)}>
              <FaTrash className="text-red-500 hover:text-red-700" />
            </button>
          </div>

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

      {/* Edit Modal */}
      {isEditModalOpen && editFormData && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg mb-4">Edit Big Title Item</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Title */}
              <div className="form-control">
                <label className="label font-semibold">Title</label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  className="input input-bordered"
                />
              </div>
              {/* Title Color */}
              <div className="form-control">
                <label className="label font-semibold">Title Color</label>
                <input
                  type="color"
                  value={editFormData.titleColor || '#000000'}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, titleColor: e.target.value })
                  }
                  className="w-16 h-10 p-0 border-none"
                />
              </div>
              {/* Detail */}
              <div className="form-control">
                <label className="label font-semibold">Detail</label>
                <textarea
                  value={editFormData.detail}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, detail: e.target.value })
                  }
                  className="textarea textarea-bordered"
                />
              </div>
              {/* Detail Color */}
              <div className="form-control">
                <label className="label font-semibold">Detail Color</label>
                <input
                  type="color"
                  value={editFormData.detailColor || '#000000'}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, detailColor: e.target.value })
                  }
                  className="w-16 h-10 p-0 border-none"
                />
              </div>
              {/* Subtitles */}
              <div className="form-control">
                <label className="label font-semibold">Subtitles</label>
                {editFormData.subtitle?.map((subtitle, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => {
                        const updatedSubtitles = [...(editFormData.subtitle || [])];
                        updatedSubtitles[index] = e.target.value;
                        setEditFormData({
                          ...editFormData,
                          subtitle: updatedSubtitles,
                        });
                      }}
                      className="input input-bordered flex-grow"
                    />
                    <button
                      type="button"
                      className="btn btn-error ml-2"
                      onClick={() => handleRemoveSubtitle(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-primary mt-2"
                  onClick={handleAddSubtitle}
                >
                  Add Subtitle
                </button>
              </div>
              {/* Subtitle Color */}
              <div className="form-control">
                <label className="label font-semibold">Subtitle Color</label>
                <input
                  type="color"
                  value={editFormData.subtitleColor || '#000000'}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, subtitleColor: e.target.value })
                  }
                  className="w-16 h-10 p-0 border-none"
                />
              </div>
              {/* Subdetails */}
              <div className="form-control">
                <label className="label font-semibold">Subdetails</label>
                {editFormData.subdetail?.map((subdetail, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={subdetail}
                      onChange={(e) => {
                        const updatedSubdetails = [...(editFormData.subdetail || [])];
                        updatedSubdetails[index] = e.target.value;
                        setEditFormData({
                          ...editFormData,
                          subdetail: updatedSubdetails,
                        });
                      }}
                      className="input input-bordered flex-grow"
                    />
                    <button
                      type="button"
                      className="btn btn-error ml-2"
                      onClick={() => handleRemoveSubdetail(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-primary mt-2"
                  onClick={handleAddSubdetail}
                >
                  Add Subdetail
                </button>
              </div>
              {/* Subdetail Color */}
              <div className="form-control">
                <label className="label font-semibold">Subdetail Color</label>
                <input
                  type="color"
                  value={editFormData.subdetailColor || '#000000'}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, subdetailColor: e.target.value })
                  }
                  className="w-16 h-10 p-0 border-none"
                />
              </div>
              {/* Media Image */}
              <div className="form-control">
                <label className="label font-semibold">Image</label>
                {editFormData.media?.image && typeof editFormData.media.image === 'string' && (
                  <div className="mb-2">
                    <Image
                      src={editFormData.media.image}
                      alt="Current Image"
                      width={200}
                      height={120}
                      className="rounded-lg"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setEditFormData({
                        ...editFormData,
                        media: {
                          ...editFormData.media,
                          image: e.target.files[0],
                        },
                      });
                    }
                  }}
                  className="file-input file-input-bordered"
                />
                {/* Remove Image Button */}
                {editFormData.media?.image && (
                  <button
                    type="button"
                    className="btn btn-error mt-2"
                    onClick={() =>
                      setEditFormData({
                        ...editFormData,
                        media: { ...editFormData.media, image: '' },
                      })
                    }
                  >
                    Remove Image
                  </button>
                )}
              </div>
              {/* Media Video */}
              <div className="form-control">
                <label className="label font-semibold">Video</label>
                {editFormData.media?.video && typeof editFormData.media.video === 'string' && (
                  <div className="mb-2">
                    <video
                      controls
                      src={editFormData.media.video}
                      className="w-full rounded-lg border border-gray-300"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setEditFormData({
                        ...editFormData,
                        media: {
                          ...editFormData.media,
                          video: e.target.files[0],
                        },
                      });
                    }
                  }}
                  className="file-input file-input-bordered"
                />
                {/* Remove Video Button */}
                {editFormData.media?.video && (
                  <button
                    type="button"
                    className="btn btn-error mt-2"
                    onClick={() =>
                      setEditFormData({
                        ...editFormData,
                        media: { ...editFormData.media, video: '' },
                      })
                    }
                  >
                    Remove Video
                  </button>
                )}
              </div>
              {/* Submit Button */}
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BigTitleSection;

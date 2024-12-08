// src/components/Information/BigTitleSection.tsx

"use client";

import React, { useState } from "react";
import { APIResponse, BigTitleItem, IModel } from "@/interfaces/InformationTypes";
import Image from "next/image";
import { FaCheckCircle, FaChevronRight, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
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

  // Function to handle opening the edit modal
  const handleEditClick = (index: number) => {
    setEditItemIndex(index);
    setEditFormData(bigTitleState[index]);
    setIsEditModalOpen(true);
  };

  // Function to handle deleting a big title item
  const handleDeleteClick = async (index: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      const updatedBigTitle = [...bigTitleState];
      updatedBigTitle.splice(index, 1);

      // Update the data on the server
      try {
        const response = await axios.put<APIResponse<IModel>>(`/api/admin/createInfo/${typenameID}`, {
          bigTitle: updatedBigTitle,
        });

        if (response.data.success && response.data.data) {
          setBigTitleState(updatedBigTitle);
          onUpdate(updatedBigTitle);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to delete bigTitle item:", error.message);
        } else {
          console.error("An unexpected error occurred:", error);
        }
      }
    }
  };

  // Function to handle submitting the edit form
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editItemIndex === null || !editFormData) return;

    const updatedBigTitle = [...bigTitleState];

    // Handle image upload if needed
    if (editFormData.media?.image instanceof File) {
      const formData = new FormData();
      formData.append('files', editFormData.media.image);

      try {
        const uploadResponse = await axios.post<{ urls: string[] }>('/api/upload', formData);
        const imageUrl = uploadResponse.data.urls[0];
        editFormData.media.image = imageUrl;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Failed to upload image:', error.message);
        } else {
          console.error('An unexpected error occurred during image upload:', error);
        }
      }
    }

    // Handle video upload if needed
    if (editFormData.media?.video instanceof File) {
      const formData = new FormData();
      formData.append('files', editFormData.media.video);

      try {
        const uploadResponse = await axios.post<{ urls: string[] }>('/api/upload', formData);
        const videoUrl = uploadResponse.data.urls[0];
        editFormData.media.video = videoUrl;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Failed to upload video:', error.message);
        } else {
          console.error('An unexpected error occurred during video upload:', error);
        }
      }
    }

    updatedBigTitle[editItemIndex] = editFormData;

    // Update the data on the server
    try {
      const response = await axios.put<APIResponse<IModel>>(`/api/admin/createInfo/${typenameID}`, {
        bigTitle: updatedBigTitle,
      });

      if (response.data.success && response.data.data) {
        setBigTitleState(updatedBigTitle);
        onUpdate(updatedBigTitle);
        setIsEditModalOpen(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to update bigTitle:", error.message);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  // Function to handle adding a new Big Title Item
  const handleAddNewItem = () => {
    const newItem: BigTitleItem = {
      title: '',
      detail: '',
      subtitle: [],
      subdetail: [],
      media: {
        image: null,
        video: null
      },
      _id: ""
    };
    setBigTitleState([...bigTitleState, newItem]);
    setEditItemIndex(bigTitleState.length);
    setEditFormData(newItem);
    setIsEditModalOpen(true);
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

  // Function to handle adding/removing media files
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    if (e.target.files && e.target.files[0] && editFormData) {
      setEditFormData({
        ...editFormData,
        media: {
          ...editFormData.media,
          [type]: e.target.files[0],
        },
      });
    }
  };

  const handleRemoveMedia = (type: 'image' | 'video') => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        media: {
          ...editFormData.media,
          [type]: '',
        },
      });
    }
  };

  return (
    <div className="mb-12 px-4 md:px-8">
      {/* Add New Big Title Item Button */}
      <div className="flex justify-end mb-4">
        <button className="btn btn-primary flex items-center" onClick={handleAddNewItem}>
          <FaPlus className="mr-2" />
          Add New Big Title Item
        </button>
      </div>

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
            {item.title || <span className="text-gray-400">Untitled</span>}
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
                {item.detail || <span className="text-gray-400">No detail provided.</span>}
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
                      {subtitle || <span className="text-gray-400">Empty subtitle</span>}
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
                      {subdetail || <span className="text-gray-400">Empty subdetail</span>}
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
          <div className="modal-box max-w-3xl overflow-y-auto">
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
                  required
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
                  required
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
                      required
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
                  className="btn btn-sm btn-primary mt-2 flex items-center"
                  onClick={handleAddSubtitle}
                >
                  <FaPlus className="mr-2" />
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
                      required
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
                  className="btn btn-sm btn-primary mt-2 flex items-center"
                  onClick={handleAddSubdetail}
                >
                  <FaPlus className="mr-2" />
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
                  onChange={(e) => handleMediaChange(e, 'image')}
                  className="file-input file-input-bordered"
                />
                {/* Remove Image Button */}
                {editFormData.media?.image && (
                  <button
                    type="button"
                    className="btn btn-error mt-2"
                    onClick={() => handleRemoveMedia('image')}
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
                  onChange={(e) => handleMediaChange(e, 'video')}
                  className="file-input file-input-bordered"
                />
                {/* Remove Video Button */}
                {editFormData.media?.video && (
                  <button
                    type="button"
                    className="btn btn-error mt-2"
                    onClick={() => handleRemoveMedia('video')}
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

// CategorySection.tsx

"use client";

import React, { useState } from "react";
import { Category, CategoryContentItem, APIResponse } from "@/interfaces/InformationTypes";
import axios from "axios";
import Image from "next/image";
import { FaCheckCircle, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa";

interface CategorySectionProps {
  categories: Category[];
  onUpdate: (updatedCategories: Category[]) => void; // Callback to update parent state
}

const CategorySection: React.FC<CategorySectionProps> = ({ categories, onUpdate }) => {
  const [categoriesState, setCategoriesState] = useState<Category[]>(categories);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState<boolean>(false);
  const [editCategoryData, setEditCategoryData] = useState<Category | null>(null);
  const [isEditContentModalOpen, setIsEditContentModalOpen] = useState<boolean>(false);
  const [editContentData, setEditContentData] = useState<{
    categoryIndex: number;
    contentIndex: number;
    contentItem: CategoryContentItem;
  } | null>(null);

  // Edit Category Functions
  const handleEditCategory = (category: Category) => {
    setEditCategoryData(category);
    setIsEditCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await axios.delete(`/api/admin/createInfo/category/${categoryId}`);
        if (response.data.success) {
          const updatedCategories = categoriesState.filter((cat) => cat._id !== categoryId);
          setCategoriesState(updatedCategories);
          onUpdate(updatedCategories);
        }
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  const handleEditCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategoryData) return;

    try {
      const response = await axios.put<APIResponse<Category>>(
        `/api/admin/createInfo/category/${editCategoryData._id}`,
        editCategoryData
      );
      if (response.data.success && response.data.data) {
        const updatedCategories = categoriesState.map((cat) =>
          cat._id === editCategoryData._id ? response.data.data : cat
        );
        setCategoriesState(updatedCategories);
        onUpdate(updatedCategories);
        setIsEditCategoryModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  // Edit Content Functions
  const handleEditContent = (categoryIndex: number, contentIndex: number) => {
    const contentItem = categoriesState[categoryIndex].content[contentIndex];
    setEditContentData({ categoryIndex, contentIndex, contentItem });
    setIsEditContentModalOpen(true);
  };

  const handleDeleteContent = async (categoryId: string, contentIndex: number) => {
    if (confirm("Are you sure you want to delete this content item?")) {
      try {
        // Remove content item from category
        const updatedCategories = [...categoriesState];
        const category = updatedCategories.find((cat) => cat._id === categoryId);
        if (category) {
          category.content.splice(contentIndex, 1);

          // Update the category on the server
          const response = await axios.put<APIResponse<Category>>(
            `/api/admin/createInfo/category/${categoryId}`,
            category
          );
          if (response.data.success && response.data.data) {
            setCategoriesState(updatedCategories);
            onUpdate(updatedCategories);
          }
        }
      } catch (error) {
        console.error("Failed to delete content item:", error);
      }
    }
  };

  const handleEditContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContentData) return;

    const { categoryIndex, contentIndex, contentItem } = editContentData;

    // Handle image upload if needed
    if (contentItem.media?.image instanceof File) {
      const formData = new FormData();
      formData.append('files', contentItem.media.image);

      try {
        const uploadResponse = await axios.post('/api/upload', formData);
        const imageUrl = uploadResponse.data.urls[0];
        contentItem.media.image = imageUrl;
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }

    // Handle video upload if needed
    if (contentItem.media?.video instanceof File) {
      const formData = new FormData();
      formData.append('files', contentItem.media.video);

      try {
        const uploadResponse = await axios.post('/api/upload', formData);
        const videoUrl = uploadResponse.data.urls[0];
        contentItem.media.video = videoUrl;
      } catch (error) {
        console.error('Failed to upload video:', error);
      }
    }

    // Update content item in state
    const updatedCategories = [...categoriesState];
    updatedCategories[categoryIndex].content[contentIndex] = contentItem;

    // Update category on server
    try {
      const categoryId = updatedCategories[categoryIndex]._id;
      const response = await axios.put<APIResponse<Category>>(
        `/api/admin/createInfo/category/${categoryId}`,
        updatedCategories[categoryIndex]
      );
      if (response.data.success && response.data.data) {
        updatedCategories[categoryIndex] = response.data.data;
        setCategoriesState(updatedCategories);
        onUpdate(updatedCategories);
        setIsEditContentModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to update content item:", error);
    }
  };

  // Functions to handle adding/removing subtitles and subdetails
  const handleAddSubtitle = () => {
    if (editContentData) {
      setEditContentData({
        ...editContentData,
        contentItem: {
          ...editContentData.contentItem,
          subtitle: [...(editContentData.contentItem.subtitle || []), ''],
        },
      });
    }
  };

  const handleRemoveSubtitle = (index: number) => {
    if (editContentData && editContentData.contentItem.subtitle) {
      const updatedSubtitles = [...editContentData.contentItem.subtitle];
      updatedSubtitles.splice(index, 1);
      setEditContentData({
        ...editContentData,
        contentItem: { ...editContentData.contentItem, subtitle: updatedSubtitles },
      });
    }
  };

  const handleAddSubdetail = () => {
    if (editContentData) {
      setEditContentData({
        ...editContentData,
        contentItem: {
          ...editContentData.contentItem,
          subdetail: [...(editContentData.contentItem.subdetail || []), ''],
        },
      });
    }
  };

  const handleRemoveSubdetail = (index: number) => {
    if (editContentData && editContentData.contentItem.subdetail) {
      const updatedSubdetails = [...editContentData.contentItem.subdetail];
      updatedSubdetails.splice(index, 1);
      setEditContentData({
        ...editContentData,
        contentItem: { ...editContentData.contentItem, subdetail: updatedSubdetails },
      });
    }
  };

  return (
    <div className="mb-12 px-4 md:px-8">
      {categoriesState.map((category, catIndex) => (
        <div
          key={`${category.name}-${catIndex}`}
          className="mb-10 p-6 bg-white shadow-md rounded-lg border border-gray-200"
        >
          {/* Edit and Delete Buttons */}
          <div className="flex justify-end mb-2">
            <button className="mr-2" onClick={() => handleEditCategory(category)}>
              <FaEdit className="text-blue-500 hover:text-blue-700" />
            </button>
            <button onClick={() => handleDeleteCategory(category._id)}>
              <FaTrash className="text-red-500 hover:text-red-700" />
            </button>
          </div>

          {/* Category Header */}
          <h4
            className="text-2xl font-bold mb-4 text-center"
            style={{ color: category.nameColor || "#1A202C" }}
          >
            {decodeURIComponent(category.name)}
          </h4>

          {/* Category Content */}
          {category.content && category.content.length > 0 ? (
            category.content.map((contentItem, contentIndex) => (
              <div
                key={`${contentItem.title}-${contentIndex}`}
                className="mb-10 p-6 bg-white shadow-md rounded-lg border border-gray-200"
              >
                {/* Edit and Delete Buttons */}
                <div className="flex justify-end mb-2">
                  <button
                    className="mr-2"
                    onClick={() => handleEditContent(catIndex, contentIndex)}
                  >
                    <FaEdit className="text-blue-500 hover:text-blue-700" />
                  </button>
                  <button onClick={() => handleDeleteContent(category._id, contentIndex)}>
                    <FaTrash className="text-red-500 hover:text-red-700" />
                  </button>
                </div>

                {/* Title Section */}
                <h5
                  className="text-lg font-semibold mb-4 text-center"
                  style={{ color: contentItem.titleColor || "#111827" }}
                >
                  {contentItem.title}
                </h5>

                {/* Media Section */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-4">
                  {contentItem.media?.image && typeof contentItem.media.image === "string" && (
                    <div className="w-full md:w-1/2 flex justify-center">
                      <Image
                        src={contentItem.media.image}
                        alt={`Image for ${contentItem.title}`}
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
                      style={{ color: contentItem.detailColor || "#4A5568" }}
                    >
                      {contentItem.detail}
                    </p>

                    {/* Subtitles */}
                    {contentItem.subtitle && contentItem.subtitle.length > 0 && (
                      <ul className="list-none mb-4 text-base">
                        {contentItem.subtitle.map((subtitle: string, subIndex: number) => (
                          <li
                            key={`${subtitle}-${subIndex}`}
                            className="flex items-center gap-2"
                            style={{ color: contentItem.subtitleColor || "#2D3748" }}
                          >
                            <FaCheckCircle className="text-green-500" />
                            {subtitle}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Subdetails */}
                    {contentItem.subdetail && contentItem.subdetail.length > 0 && (
                      <ul className="list-none mb-4 text-base">
                        {contentItem.subdetail.map((subdetail: string, subIndex: number) => (
                          <li
                            key={`${subdetail}-${subIndex}`}
                            className="flex items-center gap-2"
                            style={{ color: contentItem.subdetailColor || "#718096" }}
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
                {contentItem.media?.video && (
                  <div className="mb-4 flex justify-center">
                    <video
                      controls
                      className="w-full md:w-2/3 rounded-lg border border-gray-300"
                    >
                      <source
                        src={
                          typeof contentItem.media.video === "string"
                            ? contentItem.media.video
                            : URL.createObjectURL(contentItem.media.video)
                        }
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No content available for this category.
            </p>
          )}
        </div>
      ))}

      {/* Edit Category Modal */}
      {isEditCategoryModalOpen && editCategoryData && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Edit Category</h3>
            <form onSubmit={handleEditCategorySubmit}>
              <div className="form-control">
                <label className="label">Category Name</label>
                <input
                  type="text"
                  value={editCategoryData.name}
                  onChange={(e) =>
                    setEditCategoryData({ ...editCategoryData, name: e.target.value })
                  }
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label">Category Name Color</label>
                <input
                  type="color"
                  value={editCategoryData.nameColor || "#000000"}
                  onChange={(e) =>
                    setEditCategoryData({ ...editCategoryData, nameColor: e.target.value })
                  }
                  className="input input-bordered w-16 h-10 p-0 border-none"
                />
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsEditCategoryModalOpen(false)}
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

      {/* Edit Content Modal */}
      {isEditContentModalOpen && editContentData && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg mb-4">Edit Content Item</h3>
            <form onSubmit={handleEditContentSubmit} className="space-y-4">
              {/* Title */}
              <div className="form-control">
                <label className="label font-semibold">Title</label>
                <input
                  type="text"
                  value={editContentData.contentItem.title}
                  onChange={(e) =>
                    setEditContentData({
                      ...editContentData,
                      contentItem: { ...editContentData.contentItem, title: e.target.value },
                    })
                  }
                  className="input input-bordered"
                />
              </div>
              {/* Title Color */}
              <div className="form-control">
                <label className="label font-semibold">Title Color</label>
                <input
                  type="color"
                  value={editContentData.contentItem.titleColor || '#000000'}
                  onChange={(e) =>
                    setEditContentData({
                      ...editContentData,
                      contentItem: { ...editContentData.contentItem, titleColor: e.target.value },
                    })
                  }
                  className="w-16 h-10 p-0 border-none"
                />
              </div>
              {/* Detail */}
              <div className="form-control">
                <label className="label font-semibold">Detail</label>
                <textarea
                  value={editContentData.contentItem.detail}
                  onChange={(e) =>
                    setEditContentData({
                      ...editContentData,
                      contentItem: { ...editContentData.contentItem, detail: e.target.value },
                    })
                  }
                  className="textarea textarea-bordered"
                />
              </div>
              {/* Detail Color */}
              <div className="form-control">
                <label className="label font-semibold">Detail Color</label>
                <input
                  type="color"
                  value={editContentData.contentItem.detailColor || '#000000'}
                  onChange={(e) =>
                    setEditContentData({
                      ...editContentData,
                      contentItem: { ...editContentData.contentItem, detailColor: e.target.value },
                    })
                  }
                  className="w-16 h-10 p-0 border-none"
                />
              </div>
              {/* Subtitles */}
              <div className="form-control">
                <label className="label font-semibold">Subtitles</label>
                {editContentData.contentItem.subtitle?.map((subtitle: string, index: number) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => {
                        const updatedSubtitles = [...(editContentData.contentItem.subtitle || [])];
                        updatedSubtitles[index] = e.target.value;
                        setEditContentData({
                          ...editContentData,
                          contentItem: { ...editContentData.contentItem, subtitle: updatedSubtitles },
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
                  value={editContentData.contentItem.subtitleColor || '#000000'}
                  onChange={(e) =>
                    setEditContentData({
                      ...editContentData,
                      contentItem: { ...editContentData.contentItem, subtitleColor: e.target.value },
                    })
                  }
                  className="w-16 h-10 p-0 border-none"
                />
              </div>
              {/* Subdetails */}
              <div className="form-control">
                <label className="label font-semibold">Subdetails</label>
                {editContentData.contentItem.subdetail?.map((subdetail: string, index: number) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={subdetail}
                      onChange={(e) => {
                        const updatedSubdetails = [...(editContentData.contentItem.subdetail || [])];
                        updatedSubdetails[index] = e.target.value;
                        setEditContentData({
                          ...editContentData,
                          contentItem: { ...editContentData.contentItem, subdetail: updatedSubdetails },
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
                  value={editContentData.contentItem.subdetailColor || '#000000'}
                  onChange={(e) =>
                    setEditContentData({
                      ...editContentData,
                      contentItem: { ...editContentData.contentItem, subdetailColor: e.target.value },
                    })
                  }
                  className="w-16 h-10 p-0 border-none"
                />
              </div>
              {/* Media Image */}
              <div className="form-control">
                <label className="label font-semibold">Image</label>
                {editContentData.contentItem.media?.image &&
                  typeof editContentData.contentItem.media.image === 'string' && (
                    <div className="mb-2">
                      <Image
                        src={editContentData.contentItem.media.image}
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
                      setEditContentData({
                        ...editContentData,
                        contentItem: {
                          ...editContentData.contentItem,
                          media: {
                            ...editContentData.contentItem.media,
                            image: e.target.files[0],
                          },
                        },
                      });
                    }
                  }}
                  className="file-input file-input-bordered"
                />
                {/* Remove Image Button */}
                {editContentData.contentItem.media?.image && (
                  <button
                    type="button"
                    className="btn btn-error mt-2"
                    onClick={() =>
                      setEditContentData({
                        ...editContentData,
                        contentItem: {
                          ...editContentData.contentItem,
                          media: { ...editContentData.contentItem.media, image: '' },
                        },
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
                {editContentData.contentItem.media?.video &&
                  typeof editContentData.contentItem.media.video === 'string' && (
                    <div className="mb-2">
                      <video
                        controls
                        src={editContentData.contentItem.media.video}
                        className="w-full rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setEditContentData({
                        ...editContentData,
                        contentItem: {
                          ...editContentData.contentItem,
                          media: {
                            ...editContentData.contentItem.media,
                            video: e.target.files[0],
                          },
                        },
                      });
                    }
                  }}
                  className="file-input file-input-bordered"
                />
                {/* Remove Video Button */}
                {editContentData.contentItem.media?.video && (
                  <button
                    type="button"
                    className="btn btn-error mt-2"
                    onClick={() =>
                      setEditContentData({
                        ...editContentData,
                        contentItem: {
                          ...editContentData.contentItem,
                          media: { ...editContentData.contentItem.media, video: '' },
                        },
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
                  onClick={() => setIsEditContentModalOpen(false)}
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

export default CategorySection;

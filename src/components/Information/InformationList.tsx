// src/components/Information/InformationList.tsx

"use client";

import React, { useState } from "react";
import BigTitleSection from "./BigTitleSection";
import CategorySection from "./CategorySection";
import { InformationData, APIResponse, Category, CategoryContentItem, Media } from "@/interfaces/InformationTypes";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import MediaSection from "./MediaSection";

interface InformationListProps {
  data: InformationData;
}

const InformationList: React.FC<InformationListProps> = ({ data }) => {
  const [infoData, setInfoData] = useState<InformationData>(data);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState<boolean>(false);

  // Edit Information Form State
  const [editFormData, setEditFormData] = useState<{
    typename: string;
    typenameColor: string;
    bigTitleName: string;
    bigTitleNameColor: string;
  }>({
    typename: data.typename,
    typenameColor: data.typenameColor || "#000000",
    bigTitleName: data.bigTitleName,
    bigTitleNameColor: data.bigTitleNameColor || "#000000",
  });

  // New Category State with Content Items
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: "",
    nameColor: "#000000",
    content: [],
  });

  // Content Items State within New Category
  const [newContentItems, setNewContentItems] = useState<CategoryContentItem[]>([]);

  // Function to handle adding a new Content Item
  const handleAddContentItem = () => {
    setNewContentItems([
      ...newContentItems,
      {
        title: "",
        titleColor: "#000000",
        detail: "",
        detailColor: "#000000",
        subtitle: [],
        subtitleColor: "#000000",
        subdetail: [],
        subdetailColor: "#000000",
        media: {
          image: '',
          video: '',
        },
        _id: ""
      },
    ]);
  };

  // Function to handle removing a Content Item
  const handleRemoveContentItem = (index: number) => {
    const updatedContent = [...newContentItems];
    updatedContent.splice(index, 1);
    setNewContentItems(updatedContent);
  };

  // Function to handle changes in Content Items
  const handleContentChange = (
    index: number,
    field: keyof CategoryContentItem,
    value: string | string[] | Media
  ) => {
    const updatedContent = [...newContentItems];
    updatedContent[index] = {
      ...updatedContent[index],
      [field]: value,
    };
    setNewContentItems(updatedContent);
  };

// Example: Adding a new category without _id

const handleAddCategorySubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const newCategoryData = {
      name: newCategory.name || 'Unnamed Category',
      nameColor: newCategory.nameColor || '#000000',
      content: newContentItems.map((content) => ({
        title: content.title,
        titleColor: content.titleColor || '#000000',
        detail: content.detail,
        detailColor: content.detailColor || '#000000',
        subtitle: content.subtitle || [],
        subtitleColor: content.subtitleColor || '#000000',
        subdetail: content.subdetail || [],
        subdetailColor: content.subdetailColor || '#000000',
        media: content.media || { image: '', video: '' },
        // _id is omitted
      })),
    };

    const response = await axios.post<APIResponse<Category>>(
      `/api/admin/createInfo/${infoData._id}/categories`,
      newCategoryData
    );

    if (response.data.success && response.data.data) {
      setInfoData((prev) => ({
        ...prev,
        categories: prev.categories ? [...prev.categories, response.data.data] : [response.data.data],
      }));
      setNewCategory({ name: '', nameColor: '#000000', content: [] });
      setNewContentItems([]);
      setIsAddCategoryModalOpen(false);
    }
  } catch (error: unknown) {
    console.error('Failed to add category:', error);
    alert('An error occurred while adding the category.');
  }
};


  // Handle deleting the information
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this information?")) {
      try {
        const response = await axios.delete(`/api/admin/createInfo/${infoData._id}`);
        if (response.data.success) {
          alert("Information deleted successfully.");
          // Implement redirection or state update as needed
          // For example, you might want to redirect to another page:
          // window.location.href = "/information";
        }
      } catch (error: unknown) {
        console.error("Failed to delete information:", error);
        alert("An error occurred while deleting the information.");
      }
    }
  };

  // Handle editing the information
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put<APIResponse<InformationData>>(
        `/api/admin/createInfo/${infoData._id}`,
        editFormData
      );

      if (response.data.success && response.data.data) {
        setInfoData(response.data.data);
        setIsEditModalOpen(false);
      }
    } catch (error: unknown) {
      console.error("Failed to update information:", error);
      alert("An error occurred while updating the information.");
    }
  };

  return (
    <div className="bg-white p-4 mb-8 border border-gray-200 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4" style={{ color: infoData.typenameColor }}>
          {infoData.typename}
        </h1>
        <div>
          <button className="btn btn-primary mr-2" onClick={() => setIsEditModalOpen(true)}>
            Edit
          </button>
          <button className="btn btn-error" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      {/* Subtitle */}
      <h2 className="text-xl font-semibold mb-4" style={{ color: infoData.bigTitleNameColor }}>
        {infoData.bigTitleName}
      </h2>

      {/* Big Title Section */}
      {infoData.bigTitle && infoData.bigTitle.length > 0 && (
        <BigTitleSection
          bigTitle={infoData.bigTitle}
          typenameID={infoData._id}
          onUpdate={(updatedBigTitle) =>
            setInfoData({ ...infoData, bigTitle: updatedBigTitle })
          }
        />
      )}

      {/* Category Section */}
      {infoData.categories && infoData.categories.length > 0 && (
        <CategorySection
          categories={infoData.categories}
          onUpdate={(updatedCategories) =>
            setInfoData({ ...infoData, categories: updatedCategories })
          }
        />
      )}

      {/* Add Category Button */}
      <button
        className="btn btn-primary mt-4 flex items-center"
        onClick={() => setIsAddCategoryModalOpen(true)}
      >
        <FaPlus className="mr-2" />
        Add Category
      </button>

      {/* Add Category Modal */}
      {isAddCategoryModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl overflow-y-auto">
            <h3 className="font-bold text-lg mb-4">Add New Category</h3>
            <form onSubmit={handleAddCategorySubmit}>
              {/* Category Name */}
              <div className="form-control mb-4">
                <label className="label">Category Name</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  className="input input-bordered"
                  required
                />
              </div>

              {/* Category Name Color */}
              <div className="form-control mb-4">
                <label className="label">Category Name Color</label>
                <input
                  type="color"
                  value={newCategory.nameColor}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, nameColor: e.target.value })
                  }
                  className="input input-bordered w-16 h-10 p-0 border-none"
                />
              </div>

              {/* Content Items */}
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">Content Items</h4>
                {newContentItems.map((content, index) => (
                  <div key={index} className="border p-4 mb-4 rounded-lg bg-gray-50">
                    {/* Content Header */}
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-semibold">Content Item {index + 1}</h5>
                      <button
                        type="button"
                        className="btn btn-error btn-sm"
                        onClick={() => handleRemoveContentItem(index)}
                      >
                        Remove
                      </button>
                    </div>

                    {/* Title */}
                    <div className="form-control mb-2">
                      <label className="label">Title</label>
                      <input
                        type="text"
                        value={content.title}
                        onChange={(e) => handleContentChange(index, 'title', e.target.value)}
                        className="input input-bordered"
                        required
                      />
                    </div>

                    {/* Title Color */}
                    <div className="form-control mb-2">
                      <label className="label">Title Color</label>
                      <input
                        type="color"
                        value={content.titleColor || "#000000"}
                        onChange={(e) => handleContentChange(index, 'titleColor', e.target.value)}
                        className="input input-bordered w-16 h-10 p-0 border-none"
                      />
                    </div>

                    {/* Detail */}
                    <div className="form-control mb-2">
                      <label className="label">Detail</label>
                      <textarea
                        value={content.detail}
                        onChange={(e) => handleContentChange(index, 'detail', e.target.value)}
                        className="textarea textarea-bordered"
                        required
                      />
                    </div>

                    {/* Detail Color */}
                    <div className="form-control mb-2">
                      <label className="label">Detail Color</label>
                      <input
                        type="color"
                        value={content.detailColor || "#000000"}
                        onChange={(e) => handleContentChange(index, 'detailColor', e.target.value)}
                        className="input input-bordered w-16 h-10 p-0 border-none"
                      />
                    </div>

                    {/* Subtitles */}
                    <div className="form-control mb-2">
                      <label className="label">Subtitles</label>
                      {content.subtitle && content.subtitle.length > 0 ? (
                        content.subtitle.map((subtitle, subIndex) => (
                          <div key={subIndex} className="flex items-center mb-2">
                            <input
                              type="text"
                              value={subtitle}
                              onChange={(e) =>
                                setNewContentItems((prev) => {
                                  const updated = [...prev];
                                  if (!updated[index].subtitle) updated[index].subtitle = [];
                                  updated[index].subtitle![subIndex] = e.target.value;
                                  return updated;
                                })
                              }
                              className="input input-bordered flex-grow"
                              required
                            />
                            <button
                              type="button"
                              className="btn btn-error ml-2"
                              onClick={() => {
                                setNewContentItems((prev) => {
                                  const updated = [...prev];
                                  if (updated[index].subtitle) {
                                    updated[index].subtitle!.splice(subIndex, 1);
                                  }
                                  return updated;
                                });
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No subtitles added.</p>
                      )}
                      <button
                        type="button"
                        className="btn btn-sm btn-primary mt-2 flex items-center"
                        onClick={() => {
                          setNewContentItems((prev) => {
                            const updated = [...prev];
                            if (!updated[index].subtitle) {
                              updated[index].subtitle = [];
                            }
                            updated[index].subtitle!.push("");
                            return updated;
                          });
                        }}
                      >
                        <FaPlus className="mr-2" />
                        Add Subtitle
                      </button>
                    </div>

                    {/* Subtitle Color */}
                    <div className="form-control mb-2">
                      <label className="label">Subtitle Color</label>
                      <input
                        type="color"
                        value={content.subtitleColor || "#000000"}
                        onChange={(e) => handleContentChange(index, 'subtitleColor', e.target.value)}
                        className="input input-bordered w-16 h-10 p-0 border-none"
                      />
                    </div>

                    {/* Subdetails */}
                    <div className="form-control mb-2">
                      <label className="label">Subdetails</label>
                      {content.subdetail && content.subdetail.length > 0 ? (
                        content.subdetail.map((subdetail, subDetailIndex) => (
                          <div key={subDetailIndex} className="flex items-center mb-2">
                            <input
                              type="text"
                              value={subdetail}
                              onChange={(e) =>
                                setNewContentItems((prev) => {
                                  const updated = [...prev];
                                  if (!updated[index].subdetail) updated[index].subdetail = [];
                                  updated[index].subdetail![subDetailIndex] = e.target.value;
                                  return updated;
                                })
                              }
                              className="input input-bordered flex-grow"
                              required
                            />
                            <button
                              type="button"
                              className="btn btn-error ml-2"
                              onClick={() => {
                                setNewContentItems((prev) => {
                                  const updated = [...prev];
                                  if (updated[index].subdetail) {
                                    updated[index].subdetail!.splice(subDetailIndex, 1);
                                  }
                                  return updated;
                                });
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No subdetails added.</p>
                      )}
                      <button
                        type="button"
                        className="btn btn-sm btn-primary mt-2 flex items-center"
                        onClick={() => {
                          setNewContentItems((prev) => {
                            const updated = [...prev];
                            if (!updated[index].subdetail) {
                              updated[index].subdetail = [];
                            }
                            updated[index].subdetail!.push("");
                            return updated;
                          });
                        }}
                      >
                        <FaPlus className="mr-2" />
                        Add Subdetail
                      </button>
                    </div>

                    {/* Subdetail Color */}
                    <div className="form-control mb-2">
                      <label className="label">Subdetail Color</label>
                      <input
                        type="color"
                        value={content.subdetailColor || "#000000"}
                        onChange={(e) => handleContentChange(index, 'subdetailColor', e.target.value)}
                        className="input input-bordered w-16 h-10 p-0 border-none"
                      />
                    </div>

                    {/* Media Section */}
                    <div className="form-control mb-2">
                      <label className="label">Media</label>
                      <MediaSection
                        media={content.media}
                        onUpdate={(updatedMedia: Media) => {
                          const updatedContent = [...newContentItems];
                          updatedContent[index].media = updatedMedia;
                          setNewContentItems(updatedContent);
                        }}
                      />
                    </div>
                  </div>
                ))}
                {/* Add Content Item Button */}
                <button
                  type="button"
                  className="btn btn-sm btn-primary flex items-center mb-4"
                  onClick={handleAddContentItem}
                >
                  <FaPlus className="mr-2" />
                  Add Content Item
                </button>
              </div>
              {/* Add Category Action Buttons */}
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setIsAddCategoryModalOpen(false);
                    setNewCategory({ name: "", nameColor: "#000000", content: [] });
                    setNewContentItems([]);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Information Modal */}
      {isEditModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg">
            <h3 className="font-bold text-lg mb-4">Edit Information</h3>
            <form onSubmit={handleEditSubmit}>
              {/* Typename */}
              <div className="form-control mb-4">
                <label className="label">Typename</label>
                <input
                  type="text"
                  value={editFormData.typename}
                  onChange={(e) => setEditFormData({ ...editFormData, typename: e.target.value })}
                  className="input input-bordered"
                  required
                />
              </div>

              {/* Typename Color */}
              <div className="form-control mb-4">
                <label className="label">Typename Color</label>
                <input
                  type="color"
                  value={editFormData.typenameColor}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, typenameColor: e.target.value })
                  }
                  className="input input-bordered w-16 h-10 p-0 border-none"
                />
              </div>

              {/* Big Title Name */}
              <div className="form-control mb-4">
                <label className="label">Big Title Name</label>
                <input
                  type="text"
                  value={editFormData.bigTitleName}
                  onChange={(e) => setEditFormData({ ...editFormData, bigTitleName: e.target.value })}
                  className="input input-bordered"
                  required
                />
              </div>

              {/* Big Title Name Color */}
              <div className="form-control mb-4">
                <label className="label">Big Title Name Color</label>
                <input
                  type="color"
                  value={editFormData.bigTitleNameColor}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, bigTitleNameColor: e.target.value })
                  }
                  className="input input-bordered w-16 h-10 p-0 border-none"
                />
              </div>

              {/* Edit Information Action Buttons */}
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setIsEditModalOpen(false)}>
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

export default InformationList;

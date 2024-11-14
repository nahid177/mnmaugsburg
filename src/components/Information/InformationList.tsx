// InformationList.tsx

"use client";

import React, { useState } from "react";
import BigTitleSection from "./BigTitleSection";
import CategorySection from "./CategorySection";
import { InformationData, APIResponse } from "@/interfaces/InformationTypes";
import axios from "axios";

interface InformationListProps {
  data: InformationData;
}

const InformationList: React.FC<InformationListProps> = ({ data }) => {
  const [infoData, setInfoData] = useState<InformationData>(data);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState({
    typename: data.typename,
    typenameColor: data.typenameColor || "#000000",
    bigTitleName: data.bigTitleName,
    bigTitleNameColor: data.bigTitleNameColor || "#000000",
  });

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await axios.delete(`/api/admin/createInfo/${data._id}`);
        if (response.data.success) {
          // Redirect or update UI accordingly
          alert("Information deleted successfully.");
          // You might want to redirect or update the state here
        }
      } catch (error) {
        console.error("Failed to delete:", error);
      }
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put<APIResponse<InformationData>>(
        `/api/admin/createInfo/${data._id}`,
        editFormData
      );
      if (response.data.success && response.data.data) {
        setInfoData(response.data.data);
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  return (
    <div className="bg-white p-4 mb-8 border border-gray-200">
      {/* Header with Edit and Delete buttons */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4" style={{ color: infoData.typenameColor }}>
          {infoData.typename}
        </h1>
        <div>
          <button className="btn btn-primary mr-2" onClick={handleEdit}>
            Edit
          </button>
          <button className="btn btn-error" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      {/* Sub Title */}
      <h2 className="text-xl font-semibold mb-4" style={{ color: infoData.bigTitleNameColor }}>
        {infoData.bigTitleName}
      </h2>

      {/* Big Title Section */}
      {infoData.bigTitle && (
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

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Edit Information</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-control">
                <label className="label">Typename</label>
                <input
                  type="text"
                  value={editFormData.typename}
                  onChange={(e) => setEditFormData({ ...editFormData, typename: e.target.value })}
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
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
              <div className="form-control">
                <label className="label">Big Title Name</label>
                <input
                  type="text"
                  value={editFormData.bigTitleName}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, bigTitleName: e.target.value })
                  }
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
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

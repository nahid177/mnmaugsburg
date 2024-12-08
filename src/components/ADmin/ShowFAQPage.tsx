"use client";
import React, { useEffect, useState, useCallback } from "react";
import Toast from "@/components/Toast/Toast";
import AdminLayout from "@/app/admin/AdminLayout";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  isActive: boolean;
}

const ShowFAQPage = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Show Toast
  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
  };

  // Fetch FAQs
  const fetchFAQs = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/faqRoutes");
      const data = await response.json();
      setFaqs(data);
    } catch {
      showToast("error", "Failed to load FAQs.");
    }
  }, []);

  // Delete FAQ
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/admin/faqRoutes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        showToast("success", "FAQ deleted successfully!");
        fetchFAQs();
      } else {
        const data = await response.json();
        showToast("error", data.message || "Failed to delete FAQ.");
      }
    } catch {
      showToast("error", "An error occurred while deleting the FAQ.");
    }
  };

  // Edit FAQ
  const handleEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setIsEditModalOpen(true);
  };

  // Update FAQ
  const handleUpdate = async () => {
    if (!editingFAQ) return;

    try {
      const response = await fetch("/api/admin/faqRoutes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingFAQ),
      });

      if (response.ok) {
        showToast("success", "FAQ updated successfully!");
        setIsEditModalOpen(false);
        fetchFAQs();
      } else {
        const data = await response.json();
        showToast("error", data.message || "Failed to update FAQ.");
      }
    } catch {
      showToast("error", "An error occurred while updating the FAQ.");
    }
  };

  // Fetch FAQs on component mount
  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Manage FAQs</h2>
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

        <ul className="space-y-4 mt-12">
          {faqs.map((faq) => (
            <li key={faq._id} className="p-4 border rounded-lg shadow-md">
              <h3 className="font-semibold text-xl break-words">{faq.question}</h3>
              <p className="text-gray-600 mb-2 break-words">{faq.answer}</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleEdit(faq)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(faq._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Edit Modal */}
        {isEditModalOpen && editingFAQ && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <h3 className="text-2xl font-semibold mb-4">Edit FAQ</h3>
              <input
                type="text"
                value={editingFAQ.question}
                onChange={(e) => setEditingFAQ({ ...editingFAQ, question: e.target.value })}
                className="w-full mb-4 p-2 border rounded break-words"
                placeholder="Edit Question"
              />
              <textarea
                value={editingFAQ.answer}
                onChange={(e) => setEditingFAQ({ ...editingFAQ, answer: e.target.value })}
                className="w-full mb-4 p-2 border rounded break-words"
                placeholder="Edit Answer"
              ></textarea>
              <div className="flex justify-end space-x-4">
                <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
                  Cancel
                </button>
                <button onClick={handleUpdate} className="px-4 py-2 bg-green-500 text-white rounded">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ShowFAQPage;

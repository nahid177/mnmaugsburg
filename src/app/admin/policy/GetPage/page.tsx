"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "../../AdminLayout";

interface Category {
  _id: string;
  title: string;
  details: string;
}

const GetPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [updatedTitle, setUpdatedTitle] = useState<string>("");
  const [updatedDetails, setUpdatedDetails] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/policy");
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        } else {
          setError(data.error || "Failed to fetch categories");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while deleting the category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setUpdatedTitle(category.title);
    setUpdatedDetails(category.details);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevent scroll when modal is open
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable scroll
  };

  const handleUpdateCategory = async () => {
    if (!updatedTitle || !updatedDetails) {
      setError("Title and Details are required");
      return;
    }

    try {
      const res = await fetch(`/api/admin/policy/${selectedCategory?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: updatedTitle, details: updatedDetails }),
      });

      const data = await res.json();

      if (data.success) {
        // Update category in the state
        setCategories(
          categories.map((cat) =>
            cat._id === selectedCategory?._id
              ? { ...cat, title: updatedTitle, details: updatedDetails }
              : cat
          )
        );
        handleCloseModal();
      } else {
        setError(data.error || "Failed to update category");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while deleting the category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/policy/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        // Remove category from the state
        setCategories(categories.filter((cat) => cat._id !== id));
      } else {
        setError(data.error || "Failed to delete category");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while deleting the category");
    }
  };

  return (
    <AdminLayout>
       <div className="container mx-auto p-8 min-h-screen flex flex-col">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Categories
      </h1>
      <div className="flex justify-end mb-6">
        <Link href="/admin/policy/InputPage">
          <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400">
            Add Category
          </button>
        </Link>
      </div>

      {loading && <div className="text-center text-gray-600">Loading...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}

      <div className="  gap-6 w-[700px]">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-white p-8 border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <h2 className="text-2xl font-semibold text-gray-900 break-words">{category.title}</h2>
            <p className="text-gray-700 mt-4 break-words">{category.details}</p>
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => handleEditClick(category)}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-300 focus:outline-none"
              >
                <span className="font-medium">Edit</span>
              </button>
              <button
                onClick={() =>
                  confirm("Are you sure you want to delete this category?") &&
                  handleDeleteCategory(category._id)
                }
                className="text-red-600 hover:text-red-800 transition-colors duration-300 focus:outline-none"
              >
                <span className="font-medium">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Editing Category */}
      {isModalOpen && selectedCategory && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 relative">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Edit Category
            </h2>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">Title</label>
              <input
                type="text"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">Details</label>
              <textarea
                value={updatedDetails}
                onChange={(e) => setUpdatedDetails(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCategory}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
   
  );
};

export default GetPage;

"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { FaPlus, FaMinus, FaUpload, FaSpinner } from 'react-icons/fa'; // Icons for UI
import Link from 'next/link';
import Toast from '../Toast/Toast'; // Ensure the path is correct

interface Media {
  image: string | File | null;
  video: string | File | null;
}

interface BigTitleItem {
  title: string;
  detail: string;
  subtitle?: string[];
  subdetail?: string[];
  media: Media;
}

interface CategoryContentItem {
  title: string;
  detail: string;
  subtitle?: string[];
  subdetail?: string[];
  media: Media;
}

interface Category {
  name: string;
  content: CategoryContentItem[];
}

const InfoForm: React.FC = () => {
  const [typename, setTypename] = useState('');
  const [bigTitleName, setBigTitleName] = useState('');
  const [bigTitle, setBigTitle] = useState<BigTitleItem[]>([
    { title: '', detail: '', media: { image: null, video: null } },
  ]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);

  // Upload file to S3 and return the URL
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('files', file);

    const response = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.urls[0];
  };

  // Handle file selection and store the File objects in state
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    bigTitleIndex: number,
    field: keyof Media,
    target: 'bigTitle' | 'category',
    categoryIndex?: number,
    contentIndex?: number
  ) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (target === 'bigTitle') {
      const updatedBigTitle = [...bigTitle];
      updatedBigTitle[bigTitleIndex].media[field] = file;
      setBigTitle(updatedBigTitle);
    } else if (target === 'category' && categoryIndex !== undefined && contentIndex !== undefined) {
      const updatedCategories = [...categories];
      updatedCategories[categoryIndex].content[contentIndex].media[field] = file;
      setCategories(updatedCategories);
    }
  };

  // Add a new BigTitle item
  const addBigTitle = () => {
    setBigTitle([
      ...bigTitle,
      { title: '', detail: '', media: { image: null, video: null } },
    ]);
  };

  // Remove a BigTitle item
  const removeBigTitle = (index: number) => {
    const updatedBigTitle = bigTitle.filter((_, i) => i !== index);
    setBigTitle(updatedBigTitle);
  };

  // Add a new Category
  const addCategory = () => {
    setCategories([
      ...categories,
      {
        name: '',
        content: [{ title: '', detail: '', media: { image: null, video: null } }],
      },
    ]);
  };

  // Remove a Category
  const removeCategory = (categoryIndex: number) => {
    const updatedCategories = categories.filter((_, i) => i !== categoryIndex);
    setCategories(updatedCategories);
  };

  // Add a new Category Content item
  const addCategoryContent = (categoryIndex: number) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].content.push({
      title: '',
      detail: '',
      media: { image: null, video: null },
    });
    setCategories(updatedCategories);
  };

  // Remove a Category Content item
  const removeCategoryContent = (categoryIndex: number, contentIndex: number) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].content = updatedCategories[categoryIndex].content.filter(
      (_, i) => i !== contentIndex
    );
    setCategories(updatedCategories);
  };

  // Add a Subtitle
  const addSubtitle = (
    target: 'bigTitle' | 'category',
    bigTitleIndex?: number,
    categoryIndex?: number,
    contentIndex?: number
  ) => {
    if (target === 'bigTitle' && bigTitleIndex !== undefined) {
      const updatedBigTitle = [...bigTitle];
      if (!updatedBigTitle[bigTitleIndex].subtitle) {
        updatedBigTitle[bigTitleIndex].subtitle = [''];
      } else {
        updatedBigTitle[bigTitleIndex].subtitle!.push('');
      }
      setBigTitle(updatedBigTitle);
    } else if (
      target === 'category' &&
      categoryIndex !== undefined &&
      contentIndex !== undefined
    ) {
      const updatedCategories = [...categories];
      const contentItem = updatedCategories[categoryIndex].content[contentIndex];
      if (!contentItem.subtitle) {
        contentItem.subtitle = [''];
      } else {
        contentItem.subtitle!.push('');
      }
      setCategories(updatedCategories);
    }
  };

  // Remove a Subtitle
  const removeSubtitle = (
    target: 'bigTitle' | 'category',
    subtitleIndex: number,
    bigTitleIndex?: number,
    categoryIndex?: number,
    contentIndex?: number
  ) => {
    if (target === 'bigTitle' && bigTitleIndex !== undefined) {
      const updatedBigTitle = [...bigTitle];
      if (updatedBigTitle[bigTitleIndex].subtitle) {
        updatedBigTitle[bigTitleIndex].subtitle!.splice(subtitleIndex, 1);
        setBigTitle(updatedBigTitle);
      }
    } else if (
      target === 'category' &&
      categoryIndex !== undefined &&
      contentIndex !== undefined
    ) {
      const updatedCategories = [...categories];
      const contentItem = updatedCategories[categoryIndex].content[contentIndex];
      if (contentItem.subtitle) {
        contentItem.subtitle!.splice(subtitleIndex, 1);
        setCategories(updatedCategories);
      }
    }
  };

  // Add a Subdetail
  const addSubdetail = (
    target: 'bigTitle' | 'category',
    bigTitleIndex?: number,
    categoryIndex?: number,
    contentIndex?: number
  ) => {
    if (target === 'bigTitle' && bigTitleIndex !== undefined) {
      const updatedBigTitle = [...bigTitle];
      if (!updatedBigTitle[bigTitleIndex].subdetail) {
        updatedBigTitle[bigTitleIndex].subdetail = [''];
      } else {
        updatedBigTitle[bigTitleIndex].subdetail!.push('');
      }
      setBigTitle(updatedBigTitle);
    } else if (
      target === 'category' &&
      categoryIndex !== undefined &&
      contentIndex !== undefined
    ) {
      const updatedCategories = [...categories];
      const contentItem = updatedCategories[categoryIndex].content[contentIndex];
      if (!contentItem.subdetail) {
        contentItem.subdetail = [''];
      } else {
        contentItem.subdetail!.push('');
      }
      setCategories(updatedCategories);
    }
  };

  // Remove a Subdetail
  const removeSubdetail = (
    target: 'bigTitle' | 'category',
    subdetailIndex: number,
    bigTitleIndex?: number,
    categoryIndex?: number,
    contentIndex?: number
  ) => {
    if (target === 'bigTitle' && bigTitleIndex !== undefined) {
      const updatedBigTitle = [...bigTitle];
      if (updatedBigTitle[bigTitleIndex].subdetail) {
        updatedBigTitle[bigTitleIndex].subdetail!.splice(subdetailIndex, 1);
        setBigTitle(updatedBigTitle);
      }
    } else if (
      target === 'category' &&
      categoryIndex !== undefined &&
      contentIndex !== undefined
    ) {
      const updatedCategories = [...categories];
      const contentItem = updatedCategories[categoryIndex].content[contentIndex];
      if (contentItem.subdetail) {
        contentItem.subdetail!.splice(subdetailIndex, 1);
        setCategories(updatedCategories);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // Function to process media uploads
      const processMedia = async (
        items: BigTitleItem[] | CategoryContentItem[]
      ) => {
        return Promise.all(
          items.map(async (item) => {
            const updatedMedia: Media = { image: null, video: null };

            // Upload Image if it's a File
            if (typeof File !== 'undefined' && item.media.image instanceof File) {
              updatedMedia.image = await uploadFile(item.media.image);
            } else if (typeof item.media.image === 'string') {
              updatedMedia.image = item.media.image; // It's already a URL string
            }

            // Upload Video if it's a File
            if (typeof File !== 'undefined' && item.media.video instanceof File) {
              updatedMedia.video = await uploadFile(item.media.video);
            } else if (typeof item.media.video === 'string') {
              updatedMedia.video = item.media.video; // It's already a URL string
            }

            return { ...item, media: updatedMedia };
          })
        );
      };

      // Process Big Title Media
      const processedBigTitle = await processMedia(bigTitle);

      // Process Categories Content Media
      const processedCategories = await Promise.all(
        categories.map(async (categoryItem) => {
          const processedContent = await processMedia(categoryItem.content);
          return {
            name: categoryItem.name,
            content: processedContent,
          };
        })
      );

      // Prepare the final data
      const finalData: any = {
        typename,
        bigTitleName,
        bigTitle: processedBigTitle,
      };

      if (categories.length > 0) {
        finalData.categories = processedCategories;
      }

      // Submit the data to the backend
      await axios.post('/api/admin/createInfo', finalData);

      // Set success toast
      setToast({ type: 'success', message: 'Data submitted successfully' });

      // Optionally reset the form
      setTypename('');
      setBigTitleName('');
      setBigTitle([{ title: '', detail: '', media: { image: null, video: null } }]);
      setCategories([]);
    } catch (error: unknown) {
      console.error('Submission error:', error);
      if (axios.isAxiosError(error)) {
        // Handle Axios-specific errors
        setSubmissionError(
          error.response?.data.message || 'Failed to submit data. Please try again.'
        );
        // Set error toast
        setToast({ type: 'error', message: error.response?.data.message || 'Failed to submit data. Please try again.' });
      } else {
        setSubmissionError('Failed to submit data. Please try again.');
        // Set error toast
        setToast({ type: 'error', message: 'Failed to submit data. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg relative">
      {/* Render Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50">
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Add Information</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Name */}
        <div>
          <label htmlFor="typename" className="block text-sm font-medium text-gray-700">
            Type Name
          </label>
          <input
            id="typename"
            type="text"
            value={typename}
            onChange={(e) => setTypename(e.target.value)}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Big Title Name */}
        <div>
          <label htmlFor="bigTitleName" className="block text-sm font-medium text-gray-700">
            Big Title Name
          </label>
          <input
            id="bigTitleName"
            type="text"
            value={bigTitleName}
            onChange={(e) => setBigTitleName(e.target.value)}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Big Title Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Big Title Content</label>
          {bigTitle.map((item, index) => (
            <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-md relative bg-gray-50">
              {/* Remove Button */}
              {bigTitle.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBigTitle(index)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  aria-label="Remove Big Title Content"
                >
                  <FaMinus className="h-5 w-5" />
                </button>
              )}

              {/* Title Input */}
              <div>
                <label htmlFor={`bigTitle-${index}-title`} className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  id={`bigTitle-${index}-title`}
                  type="text"
                  placeholder="Enter title"
                  value={item.title}
                  onChange={(e) => {
                    const updatedBigTitle = [...bigTitle];
                    updatedBigTitle[index].title = e.target.value;
                    setBigTitle(updatedBigTitle);
                  }}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Detail Textarea */}
              <div>
                <label htmlFor={`bigTitle-${index}-detail`} className="block text-sm font-medium text-gray-700">
                  Detail
                </label>
                <textarea
                  id={`bigTitle-${index}-detail`}
                  placeholder="Enter detail"
                  value={item.detail}
                  onChange={(e) => {
                    const updatedBigTitle = [...bigTitle];
                    updatedBigTitle[index].detail = e.target.value;
                    setBigTitle(updatedBigTitle);
                  }}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  required
                />
              </div>

              {/* Subtitles Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Subtitles</label>
                {item.subtitle?.map((subtitle, subIndex) => (
                  <div key={subIndex} className="flex items-center space-x-3 mb-2">
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => {
                        const updatedBigTitle = [...bigTitle];
                        updatedBigTitle[index].subtitle![subIndex] = e.target.value;
                        setBigTitle(updatedBigTitle);
                      }}
                      placeholder="Enter subtitle"
                      className="p-2 border border-gray-300 rounded-md w-full"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeSubtitle('bigTitle', subIndex, index)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove Subtitle"
                    >
                      <FaMinus />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSubtitle('bigTitle', index)}
                  className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  <FaPlus className="h-5 w-5" />
                  <span>Add Subtitle</span>
                </button>
              </div>

              {/* Subdetails Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Subdetails</label>
                {item.subdetail?.map((subdetail, subDetailIndex) => (
                  <div key={subDetailIndex} className="flex items-center space-x-3 mb-2">
                    <input
                      type="text"
                      value={subdetail}
                      onChange={(e) => {
                        const updatedBigTitle = [...bigTitle];
                        updatedBigTitle[index].subdetail![subDetailIndex] = e.target.value;
                        setBigTitle(updatedBigTitle);
                      }}
                      placeholder="Enter subdetail"
                      className="p-2 border border-gray-300 rounded-md w-full"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeSubdetail('bigTitle', subDetailIndex, index)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove Subdetail"
                    >
                      <FaMinus />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSubdetail('bigTitle', index)}
                  className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  <FaPlus className="h-5 w-5" />
                  <span>Add Subdetail</span>
                </button>
              </div>

              {/* Media Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image</label>
                  <div className="mt-1 flex items-center space-x-3">
                    <label className="cursor-pointer flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:border-blue-500 hover:text-blue-500">
                      <FaUpload className="h-6 w-6" />
                      <span className="ml-2">Upload Image</span>
                      <input
                        type="file"
                        onChange={(e) =>
                          handleFileChange(e, index, 'image', 'bigTitle')
                        }
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                    {typeof File !== 'undefined' && item.media.image instanceof File ? (
                      <span className="text-sm text-gray-500">Selected</span>
                    ) : item.media.image ? (
                      <Link
                        href={item.media.image as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline text-sm"
                      >
                        View Image
                      </Link>
                    ) : null}
                  </div>
                </div>

                {/* Video Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Video</label>
                  <div className="mt-1 flex items-center space-x-3">
                    <label className="cursor-pointer flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:border-blue-500 hover:text-blue-500">
                      <FaUpload className="h-6 w-6" />
                      <span className="ml-2">Upload Video</span>
                      <input
                        type="file"
                        onChange={(e) =>
                          handleFileChange(e, index, 'video', 'bigTitle')
                        }
                        className="hidden"
                        accept="video/*"
                      />
                    </label>
                    {typeof File !== 'undefined' && item.media.video instanceof File ? (
                      <span className="text-sm text-gray-500">Selected</span>
                    ) : item.media.video ? (
                      <Link
                        href={item.media.video as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline text-sm"
                      >
                        View Video
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Big Title Content Button */}
          <button
            type="button"
            onClick={addBigTitle}
            className="mt-4 flex items-center space-x-2 text-blue-500 hover:text-blue-700 focus:outline-none"
          >
            <FaPlus className="h-5 w-5" />
            <span>Add Big Title Content</span>
          </button>
        </div>

        {/* Categories Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold text-gray-800">Categories</h3>
            <button
              type="button"
              onClick={addCategory}
              className="flex items-center space-x-2 text-green-500 hover:text-green-700 focus:outline-none"
            >
              <FaPlus className="h-5 w-5" />
              <span>Add Category</span>
            </button>
          </div>

          {categories.map((categoryItem, categoryIndex) => (
            <div
              key={categoryIndex}
              className="space-y-6 p-4 border border-gray-300 rounded-md bg-gray-50 relative"
            >
              {/* Remove Category Button */}
              <button
                type="button"
                onClick={() => removeCategory(categoryIndex)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                aria-label="Remove Category"
              >
                <FaMinus className="h-5 w-5" />
              </button>

              {/* Category Name */}
              <div>
                <label
                  htmlFor={`category-${categoryIndex}-name`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Category Name
                </label>
                <input
                  id={`category-${categoryIndex}-name`}
                  type="text"
                  value={categoryItem.name}
                  onChange={(e) => {
                    const updatedCategories = [...categories];
                    updatedCategories[categoryIndex].name = e.target.value;
                    setCategories(updatedCategories);
                  }}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Category Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Category Content</label>
                  <button
                    type="button"
                    onClick={() => addCategoryContent(categoryIndex)}
                    className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                  >
                    <FaPlus className="h-5 w-5" />
                    <span>Add Content</span>
                  </button>
                </div>

                {categoryItem.content.map((contentItem, contentIndex) => (
                  <div
                    key={contentIndex}
                    className="space-y-4 p-4 border border-gray-200 rounded-md bg-white relative"
                  >
                    {/* Remove Content Button */}
                    {categoryItem.content.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCategoryContent(categoryIndex, contentIndex)}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                        aria-label="Remove Content"
                      >
                        <FaMinus className="h-5 w-5" />
                      </button>
                    )}

                    {/* Title Input */}
                    <div>
                      <label
                        htmlFor={`category-${categoryIndex}-content-${contentIndex}-title`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Title
                      </label>
                      <input
                        id={`category-${categoryIndex}-content-${contentIndex}-title`}
                        type="text"
                        placeholder="Enter title"
                        value={contentItem.title}
                        onChange={(e) => {
                          const updatedCategories = [...categories];
                          updatedCategories[categoryIndex].content[contentIndex].title = e.target.value;
                          setCategories(updatedCategories);
                        }}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    {/* Detail Textarea */}
                    <div>
                      <label
                        htmlFor={`category-${categoryIndex}-content-${contentIndex}-detail`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Detail
                      </label>
                      <textarea
                        id={`category-${categoryIndex}-content-${contentIndex}-detail`}
                        placeholder="Enter detail"
                        value={contentItem.detail}
                        onChange={(e) => {
                          const updatedCategories = [...categories];
                          updatedCategories[categoryIndex].content[contentIndex].detail = e.target.value;
                          setCategories(updatedCategories);
                        }}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                        required
                      />
                    </div>

                    {/* Subtitles Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Subtitles</label>
                      {contentItem.subtitle?.map((subtitle, subIndex) => (
                        <div key={subIndex} className="flex items-center space-x-3 mb-2">
                          <input
                            type="text"
                            value={subtitle}
                            onChange={(e) => {
                              const updatedCategories = [...categories];
                              updatedCategories[categoryIndex].content[contentIndex].subtitle![subIndex] = e.target.value;
                              setCategories(updatedCategories);
                            }}
                            placeholder="Enter subtitle"
                            className="p-2 border border-gray-300 rounded-md w-full"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeSubtitle(
                                'category',
                                subIndex,
                                undefined,
                                categoryIndex,
                                contentIndex
                              )
                            }
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove Subtitle"
                          >
                            <FaMinus />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          addSubtitle('category', undefined, categoryIndex, contentIndex)
                        }
                        className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                      >
                        <FaPlus className="h-5 w-5" />
                        <span>Add Subtitle</span>
                      </button>
                    </div>

                    {/* Subdetails Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Subdetails</label>
                      {contentItem.subdetail?.map((subdetail, subDetailIndex) => (
                        <div key={subDetailIndex} className="flex items-center space-x-3 mb-2">
                          <input
                            type="text"
                            value={subdetail}
                            onChange={(e) => {
                              const updatedCategories = [...categories];
                              updatedCategories[categoryIndex].content[contentIndex].subdetail![subDetailIndex] = e.target.value;
                              setCategories(updatedCategories);
                            }}
                            placeholder="Enter subdetail"
                            className="p-2 border border-gray-300 rounded-md w-full"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeSubdetail(
                                'category',
                                subDetailIndex,
                                undefined,
                                categoryIndex,
                                contentIndex
                              )
                            }
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove Subdetail"
                          >
                            <FaMinus />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          addSubdetail('category', undefined, categoryIndex, contentIndex)
                        }
                        className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                      >
                        <FaPlus className="h-5 w-5" />
                        <span>Add Subdetail</span>
                      </button>
                    </div>

                    {/* Media Uploads */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Image</label>
                        <div className="mt-1 flex items-center space-x-3">
                          <label className="cursor-pointer flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:border-blue-500 hover:text-blue-500">
                            <FaUpload className="h-6 w-6" />
                            <span className="ml-2">Upload Image</span>
                            <input
                              type="file"
                              onChange={(e) =>
                                handleFileChange(e, categoryIndex, 'image', 'category', categoryIndex, contentIndex)
                              }
                              className="hidden"
                              accept="image/*"
                            />
                          </label>
                          {typeof File !== 'undefined' && contentItem.media.image instanceof File ? (
                            <span className="text-sm text-gray-500">Selected</span>
                          ) : contentItem.media.image ? (
                            <Link
                              href={contentItem.media.image as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline text-sm"
                            >
                              View Image
                            </Link>
                          ) : null}
                        </div>
                      </div>

                      {/* Video Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Video</label>
                        <div className="mt-1 flex items-center space-x-3">
                          <label className="cursor-pointer flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:border-blue-500 hover:text-blue-500">
                            <FaUpload className="h-6 w-6" />
                            <span className="ml-2">Upload Video</span>
                            <input
                              type="file"
                              onChange={(e) =>
                                handleFileChange(e, categoryIndex, 'video', 'category', categoryIndex, contentIndex)
                              }
                              className="hidden"
                              accept="video/*"
                            />
                          </label>
                          {typeof File !== 'undefined' && contentItem.media.video instanceof File ? (
                            <span className="text-sm text-gray-500">Selected</span>
                          ) : contentItem.media.video ? (
                            <Link
                              href={contentItem.media.video as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline text-sm"
                            >
                              View Video
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors ${
            isSubmitting ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin h-5 w-5 mr-2" />
              Submitting...
            </>
          ) : (
            'Submit'
          )}
        </button>
        {/* Display Submission Error */}
        {submissionError && (
          <p className="text-red-500 text-sm mt-2">{submissionError}</p>
        )}
      </form>
    </div>
  );
};

export default InfoForm;

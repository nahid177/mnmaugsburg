// src/components/CreateInformation/InfoForm.tsx

"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { FaPlus, FaMinus, FaUpload, FaSpinner } from 'react-icons/fa';
import { SketchPicker, ColorResult } from 'react-color';
import Link from 'next/link';
import Toast from '../Toast/Toast'; // Ensure the path is correct

// Define interfaces for media and content
interface Media {
  image: string | File | null;
  video: string | File | null;
}

interface BigTitleItem {
  title: string;
  titleColor?: string;
  detail: string;
  detailColor?: string;
  subtitle?: string[];
  subtitleColor?: string;
  subdetail?: string[];
  subdetailColor?: string;
  media: Media;
}

interface CategoryContentItem {
  title: string;
  titleColor?: string;
  detail: string;
  detailColor?: string;
  subtitle?: string[];
  subtitleColor?: string;
  subdetail?: string[];
  subdetailColor?: string;
  media: Media;
}

interface Category {
  name: string;
  nameColor?: string;
  content: CategoryContentItem[];
}

interface ToastProps {
  type: "success" | "error" | "warning";
  message: string;
}

const InfoForm: React.FC = () => {
  const [typename, setTypename] = useState<string>('');
  const [typenameColor, setTypenameColor] = useState<string>('#000000'); // New state
  const [bigTitleName, setBigTitleName] = useState<string>('');
  const [bigTitleNameColor, setBigTitleNameColor] = useState<string>('#000000'); // New state
  const [bigTitle, setBigTitle] = useState<BigTitleItem[]>([
    { title: '', detail: '', media: { image: null, video: null } },
  ]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [colorPicker, setColorPicker] = useState<{ [key: string]: boolean }>({}); // To handle multiple color pickers

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
  ): void => {
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
  const addBigTitle = (): void => {
    setBigTitle([
      ...bigTitle,
      { title: '', detail: '', media: { image: null, video: null } },
    ]);
  };

  // Remove a BigTitle item
  const removeBigTitle = (index: number): void => {
    const updatedBigTitle = bigTitle.filter((_, i) => i !== index);
    setBigTitle(updatedBigTitle);
  };

  // Add a new Category
  const addCategory = (): void => {
    setCategories([
      ...categories,
      {
        name: '',
        nameColor: '#000000', // Default color
        content: [{ title: '', detail: '', media: { image: null, video: null } }],
      },
    ]);
  };

  // Remove a Category
  const removeCategory = (categoryIndex: number): void => {
    const updatedCategories = categories.filter((_, i) => i !== categoryIndex);
    setCategories(updatedCategories);
  };

  // Add a new Category Content item
  const addCategoryContent = (categoryIndex: number): void => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].content.push({
      title: '',
      detail: '',
      media: { image: null, video: null },
    });
    setCategories(updatedCategories);
  };

  // Remove a Category Content item
  const removeCategoryContent = (categoryIndex: number, contentIndex: number): void => {
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
  ): void => {
    if (target === 'bigTitle' && bigTitleIndex !== undefined) {
      const updatedBigTitle = [...bigTitle];
      if (!updatedBigTitle[bigTitleIndex].subtitle) {
        updatedBigTitle[bigTitleIndex].subtitle = [''];
        updatedBigTitle[bigTitleIndex].subtitleColor = '#000000'; // Default color
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
        contentItem.subtitleColor = '#000000'; // Default color
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
  ): void => {
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
  ): void => {
    if (target === 'bigTitle' && bigTitleIndex !== undefined) {
      const updatedBigTitle = [...bigTitle];
      if (!updatedBigTitle[bigTitleIndex].subdetail) {
        updatedBigTitle[bigTitleIndex].subdetail = [''];
        updatedBigTitle[bigTitleIndex].subdetailColor = '#000000'; // Default color
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
        contentItem.subdetailColor = '#000000'; // Default color
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
  ): void => {
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

  // Define interfaces for the final data structure
  interface FinalData {
    typename: string;
    typenameColor: string;
    bigTitleName: string;
    bigTitleNameColor: string;
    bigTitle: BigTitleItem[];
    categories?: Category[];
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // Function to process media uploads
      const processMedia = async (
        items: BigTitleItem[] | CategoryContentItem[]
      ): Promise<BigTitleItem[] | CategoryContentItem[]> => {
        return Promise.all(
          items.map(async (item) => {
            const updatedMedia: Media = { image: null, video: null };

            // Upload Image if it's a File
            if (item.media.image instanceof File) {
              updatedMedia.image = await uploadFile(item.media.image);
            } else if (typeof item.media.image === 'string') {
              updatedMedia.image = item.media.image; // It's already a URL string
            }

            // Upload Video if it's a File
            if (item.media.video instanceof File) {
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
        categories.map(async (categoryItem: Category) => {
          const processedContent = await processMedia(categoryItem.content);
          return {
            name: categoryItem.name,
            nameColor: categoryItem.nameColor,
            content: processedContent,
          };
        })
      );

      // Prepare the final data
      const finalData: FinalData = {
        typename,
        typenameColor,
        bigTitleName,
        bigTitleNameColor,
        bigTitle: processedBigTitle as BigTitleItem[],
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
      setTypenameColor('#000000');
      setBigTitleName('');
      setBigTitleNameColor('#000000');
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

  // Toggle color picker visibility
  const toggleColorPicker = (key: string): void => {
    setColorPicker((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-lg relative">
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

      <h2 className="text-4xl font-bold mb-8 text-gray-800">Add Information</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Type Name */}
        <div>
          <label htmlFor="typename" className="block text-lg font-bold text-gray-700">
            Type Name
          </label>
          <div className="flex items-center space-x-4 mt-2">
            <input
              id="typename"
              type="text"
              value={typename}
              onChange={(e) => setTypename(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleColorPicker('typenameColor')}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center"
                aria-label="Choose Typename Color"
              >
                <span
                  className="block w-full h-full rounded-full"
                  style={{ backgroundColor: typenameColor }}
                ></span>
              </button>
              {colorPicker['typenameColor'] && (
                <div className="absolute z-10 mt-2">
                  <div
                    className="fixed inset-0"
                    onClick={() => toggleColorPicker('typenameColor')}
                  />
                  <SketchPicker
                    color={typenameColor}
                    onChangeComplete={(color: ColorResult) => setTypenameColor(color.hex)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Big Title Name */}
        <div>
          <label htmlFor="bigTitleName" className="block text-lg font-bold text-gray-700">
            Big Title Name
          </label>
          <div className="flex items-center space-x-4 mt-2">
            <input
              id="bigTitleName"
              type="text"
              value={bigTitleName}
              onChange={(e) => setBigTitleName(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleColorPicker('bigTitleNameColor')}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center"
                aria-label="Choose Big Title Name Color"
              >
                <span
                  className="block w-full h-full rounded-full"
                  style={{ backgroundColor: bigTitleNameColor }}
                ></span>
              </button>
              {colorPicker['bigTitleNameColor'] && (
                <div className="absolute z-10 mt-2">
                  <div
                    className="fixed inset-0"
                    onClick={() => toggleColorPicker('bigTitleNameColor')}
                  />
                  <SketchPicker
                    color={bigTitleNameColor}
                    onChangeComplete={(color: ColorResult) => setBigTitleNameColor(color.hex)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Big Title Content */}
        <div>
          <label className="block text-lg font-bold text-gray-700 mb-4">Big Title Content</label>
          {bigTitle.map((item: BigTitleItem, index: number) => (
            <div key={index} className="space-y-6 p-6 border border-gray-200 rounded-md relative bg-gray-50">
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

              {/* Title Input and Color */}
              <div>
                <label htmlFor={`bigTitle-${index}-title`} className="block text-md font-bold text-gray-700">
                  Title
                </label>
                <div className="flex items-center space-x-4 mt-2">
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
                    className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleColorPicker(`bigTitle-${index}-titleColor`)}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center"
                      aria-label="Choose Title Color"
                    >
                      <span
                        className="block w-full h-full rounded-full"
                        style={{ backgroundColor: item.titleColor || '#000000' }}
                      ></span>
                    </button>
                    {colorPicker[`bigTitle-${index}-titleColor`] && (
                      <div className="absolute z-10 mt-2">
                        <div
                          className="fixed inset-0"
                          onClick={() => toggleColorPicker(`bigTitle-${index}-titleColor`)}
                        />
                        <SketchPicker
                          color={item.titleColor || '#000000'}
                          onChangeComplete={(color: ColorResult) => {
                            const updatedBigTitle = [...bigTitle];
                            updatedBigTitle[index].titleColor = color.hex;
                            setBigTitle(updatedBigTitle);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Detail Textarea and Color */}
              <div>
                <label htmlFor={`bigTitle-${index}-detail`} className="block text-md font-bold text-gray-700">
                  Detail
                </label>
                <div className="flex items-center space-x-4 mt-2">
                  <textarea
                    id={`bigTitle-${index}-detail`}
                    placeholder="Enter detail"
                    value={item.detail}
                    onChange={(e) => {
                      const updatedBigTitle = [...bigTitle];
                      updatedBigTitle[index].detail = e.target.value;
                      setBigTitle(updatedBigTitle);
                    }}
                    className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    required
                  />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleColorPicker(`bigTitle-${index}-detailColor`)}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center"
                      aria-label="Choose Detail Color"
                    >
                      <span
                        className="block w-full h-full rounded-full"
                        style={{ backgroundColor: item.detailColor || '#000000' }}
                      ></span>
                    </button>
                    {colorPicker[`bigTitle-${index}-detailColor`] && (
                      <div className="absolute z-10 mt-2">
                        <div
                          className="fixed inset-0"
                          onClick={() => toggleColorPicker(`bigTitle-${index}-detailColor`)}
                        />
                        <SketchPicker
                          color={item.detailColor || '#000000'}
                          onChangeComplete={(color: ColorResult) => {
                            const updatedBigTitle = [...bigTitle];
                            updatedBigTitle[index].detailColor = color.hex;
                            setBigTitle(updatedBigTitle);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Subtitles Section */}
              <div>
                <label className="block text-md font-bold text-gray-700">Subtitles</label>
                {item.subtitle?.map((subtitle: string, subIndex: number) => (
                  <div key={subIndex} className="flex items-center space-x-4 mb-2">
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => {
                        const updatedBigTitle = [...bigTitle];
                        updatedBigTitle[index].subtitle![subIndex] = e.target.value;
                        setBigTitle(updatedBigTitle);
                      }}
                      placeholder="Enter subtitle"
                      className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => toggleColorPicker(`bigTitle-${index}-subtitleColor-${subIndex}`)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                        aria-label="Choose Subtitle Color"
                      >
                        <span
                          className="block w-full h-full rounded-full"
                          style={{ backgroundColor: item.subtitleColor || '#000000' }}
                        ></span>
                      </button>
                      {colorPicker[`bigTitle-${index}-subtitleColor-${subIndex}`] && (
                        <div className="absolute z-10 mt-2">
                          <div
                            className="fixed inset-0"
                            onClick={() => toggleColorPicker(`bigTitle-${index}-subtitleColor-${subIndex}`)}
                          />
                          <SketchPicker
                            color={item.subtitleColor || '#000000'}
                            onChangeComplete={(color: ColorResult) => {
                              const updatedBigTitle = [...bigTitle];
                              updatedBigTitle[index].subtitleColor = color.hex;
                              setBigTitle(updatedBigTitle);
                            }}
                          />
                        </div>
                      )}
                    </div>
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
                  className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 focus:outline-none mt-2"
                >
                  <FaPlus className="h-5 w-5" />
                  <span>Add Subtitle</span>
                </button>
              </div>

              {/* Subdetails Section */}
              <div>
                <label className="block text-md font-bold text-gray-700">Subdetails</label>
                {item.subdetail?.map((subdetail: string, subDetailIndex: number) => (
                  <div key={subDetailIndex} className="flex items-center space-x-4 mb-2">
                    <input
                      type="text"
                      value={subdetail}
                      onChange={(e) => {
                        const updatedBigTitle = [...bigTitle];
                        updatedBigTitle[index].subdetail![subDetailIndex] = e.target.value;
                        setBigTitle(updatedBigTitle);
                      }}
                      placeholder="Enter subdetail"
                      className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => toggleColorPicker(`bigTitle-${index}-subdetailColor-${subDetailIndex}`)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                        aria-label="Choose Subdetail Color"
                      >
                        <span
                          className="block w-full h-full rounded-full"
                          style={{ backgroundColor: item.subdetailColor || '#000000' }}
                        ></span>
                      </button>
                      {colorPicker[`bigTitle-${index}-subdetailColor-${subDetailIndex}`] && (
                        <div className="absolute z-10 mt-2">
                          <div
                            className="fixed inset-0"
                            onClick={() => toggleColorPicker(`bigTitle-${index}-subdetailColor-${subDetailIndex}`)}
                          />
                          <SketchPicker
                            color={item.subdetailColor || '#000000'}
                            onChangeComplete={(color: ColorResult) => {
                              const updatedBigTitle = [...bigTitle];
                              updatedBigTitle[index].subdetailColor = color.hex;
                              setBigTitle(updatedBigTitle);
                            }}
                          />
                        </div>
                      )}
                    </div>
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
                  className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 focus:outline-none mt-2"
                >
                  <FaPlus className="h-5 w-5" />
                  <span>Add Subdetail</span>
                </button>
              </div>

              {/* Media Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-md font-bold text-gray-700">Image</label>
                  <div className="mt-2 flex items-center space-x-4">
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
                    {item.media.image instanceof File ? (
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
                  <label className="block text-md font-bold text-gray-700">Video</label>
                  <div className="mt-2 flex items-center space-x-4">
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
                    {item.media.video instanceof File ? (
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
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-bold text-gray-800">Categories</h3>
            <button
              type="button"
              onClick={addCategory}
              className="flex items-center space-x-2 text-green-500 hover:text-green-700 focus:outline-none"
            >
              <FaPlus className="h-5 w-5" />
              <span>Add Category</span>
            </button>
          </div>
          </div>

          {categories.map((categoryItem: Category, categoryIndex: number) => (
            <div
              key={categoryIndex}
              className="space-y-6 p-6 border border-gray-300 rounded-md bg-gray-50 relative"
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

              {/* Category Name and Color */}
              <div>
                <label
                  htmlFor={`category-${categoryIndex}-name`}
                  className="block text-md font-bold text-gray-700"
                >
                  Category Name
                </label>
                <div className="flex items-center space-x-4 mt-2">
                  <input
                    id={`category-${categoryIndex}-name`}
                    type="text"
                    value={categoryItem.name}
                    onChange={(e) => {
                      const updatedCategories = [...categories];
                      updatedCategories[categoryIndex].name = e.target.value;
                      setCategories(updatedCategories);
                    }}
                    className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    required
                  />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleColorPicker(`category-${categoryIndex}-nameColor`)}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center"
                      aria-label="Choose Category Name Color"
                    >
                      <span
                        className="block w-full h-full rounded-full"
                        style={{ backgroundColor: categoryItem.nameColor || '#000000' }}
                      ></span>
                    </button>
                    {colorPicker[`category-${categoryIndex}-nameColor`] && (
                      <div className="absolute z-10 mt-2">
                        <div
                          className="fixed inset-0"
                          onClick={() => toggleColorPicker(`category-${categoryIndex}-nameColor`)}
                        />
                        <SketchPicker
                          color={categoryItem.nameColor || '#000000'}
                          onChangeComplete={(color: ColorResult) => {
                            const updatedCategories = [...categories];
                            updatedCategories[categoryIndex].nameColor = color.hex;
                            setCategories(updatedCategories);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Category Content */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-md font-bold text-gray-700">Category Content</label>
                  <button
                    type="button"
                    onClick={() => addCategoryContent(categoryIndex)}
                    className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                  >
                    <FaPlus className="h-5 w-5" />
                    <span>Add Content</span>
                  </button>
                </div>

                {categoryItem.content.map((contentItem: CategoryContentItem, contentIndex: number) => (
                  <div
                    key={contentIndex}
                    className="space-y-6 p-6 border border-gray-200 rounded-md bg-white relative"
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

                    {/* Title Input and Color */}
                    <div>
                      <label
                        htmlFor={`category-${categoryIndex}-content-${contentIndex}-title`}
                        className="block text-md font-bold text-gray-700"
                      >
                        Title
                      </label>
                      <div className="flex items-center space-x-4 mt-2">
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
                          className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => toggleColorPicker(`category-${categoryIndex}-content-${contentIndex}-titleColor`)}
                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center"
                            aria-label="Choose Content Title Color"
                          >
                            <span
                              className="block w-full h-full rounded-full"
                              style={{ backgroundColor: contentItem.titleColor || '#000000' }}
                            ></span>
                          </button>
                          {colorPicker[`category-${categoryIndex}-content-${contentIndex}-titleColor`] && (
                            <div className="absolute z-10 mt-2">
                              <div
                                className="fixed inset-0"
                                onClick={() => toggleColorPicker(`category-${categoryIndex}-content-${contentIndex}-titleColor`)}
                              />
                              <SketchPicker
                                color={contentItem.titleColor || '#000000'}
                                onChangeComplete={(color: ColorResult) => {
                                  const updatedCategories = [...categories];
                                  updatedCategories[categoryIndex].content[contentIndex].titleColor = color.hex;
                                  setCategories(updatedCategories);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Detail Textarea and Color */}
                    <div>
                      <label
                        htmlFor={`category-${categoryIndex}-content-${contentIndex}-detail`}
                        className="block text-md font-bold text-gray-700"
                      >
                        Detail
                      </label>
                      <div className="flex items-center space-x-4 mt-2">
                        <textarea
                          id={`category-${categoryIndex}-content-${contentIndex}-detail`}
                          placeholder="Enter detail"
                          value={contentItem.detail}
                          onChange={(e) => {
                            const updatedCategories = [...categories];
                            updatedCategories[categoryIndex].content[contentIndex].detail = e.target.value;
                            setCategories(updatedCategories);
                          }}
                          className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          rows={4}
                          required
                        />
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => toggleColorPicker(`category-${categoryIndex}-content-${contentIndex}-detailColor`)}
                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center"
                            aria-label="Choose Content Detail Color"
                          >
                            <span
                              className="block w-full h-full rounded-full"
                              style={{ backgroundColor: contentItem.detailColor || '#000000' }}
                            ></span>
                          </button>
                          {colorPicker[`category-${categoryIndex}-content-${contentIndex}-detailColor`] && (
                            <div className="absolute z-10 mt-2">
                              <div
                                className="fixed inset-0"
                                onClick={() => toggleColorPicker(`category-${categoryIndex}-content-${contentIndex}-detailColor`)}
                              />
                              <SketchPicker
                                color={contentItem.detailColor || '#000000'}
                                onChangeComplete={(color: ColorResult) => {
                                  const updatedCategories = [...categories];
                                  updatedCategories[categoryIndex].content[contentIndex].detailColor = color.hex;
                                  setCategories(updatedCategories);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Subtitles Section */}
                    <div>
                      <label className="block text-md font-bold text-gray-700">Subtitles</label>
                      {contentItem.subtitle?.map((subtitle: string, subIndex: number) => (
                        <div key={subIndex} className="flex items-center space-x-4 mb-2">
                          <input
                            type="text"
                            value={subtitle}
                            onChange={(e) => {
                              const updatedCategories = [...categories];
                              updatedCategories[categoryIndex].content[contentIndex].subtitle![subIndex] = e.target.value;
                              setCategories(updatedCategories);
                            }}
                            placeholder="Enter subtitle"
                            className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => toggleColorPicker(`category-${categoryIndex}-content-${contentIndex}-subtitleColor-${subIndex}`)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                              aria-label="Choose Subtitle Color"
                            >
                              <span
                                className="block w-full h-full rounded-full"
                                style={{ backgroundColor: contentItem.subtitleColor || '#000000' }}
                              ></span>
                            </button>
                            {colorPicker[`category-${categoryIndex}-content-${contentIndex}-subtitleColor-${subIndex}`] && (
                              <div className="absolute z-10 mt-2">
                                <div
                                  className="fixed inset-0"
                                  onClick={() => toggleColorPicker(`category-${categoryIndex}-content-${contentIndex}-subtitleColor-${subIndex}`)}
                                />
                                <SketchPicker
                                  color={contentItem.subtitleColor || '#000000'}
                                  onChangeComplete={(color: ColorResult) => {
                                    const updatedCategories = [...categories];
                                    updatedCategories[categoryIndex].content[contentIndex].subtitleColor = color.hex;
                                    setCategories(updatedCategories);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSubtitle('category', subIndex, undefined, categoryIndex, contentIndex)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove Subtitle"
                          >
                            <FaMinus />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addSubtitle('category', undefined, categoryIndex, contentIndex)}
                        className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 focus:outline-none mt-2"
                      >
                        <FaPlus className="h-5 w-5" />
                        <span>Add Subtitle</span>
                      </button>
                    </div>

                    {/* Subdetails Section */}
                    <div>
                      <label className="block text-md font-bold text-gray-700">Subdetails</label>
                      {contentItem.subdetail?.map((subdetail: string, subDetailIndex: number) => (
                        <div key={subDetailIndex} className="flex items-center space-x-4 mb-2">
                          <input
                            type="text"
                            value={subdetail}
                            onChange={(e) => {
                              const updatedCategories = [...categories];
                              updatedCategories[categoryIndex].content[contentIndex].subdetail![subDetailIndex] = e.target.value;
                              setCategories(updatedCategories);
                            }}
                            placeholder="Enter subdetail"
                            className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => toggleColorPicker(`category-${categoryIndex}-content-${contentIndex}-subdetailColor-${subDetailIndex}`)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                              aria-label="Choose Subdetail Color"
                            >
                              <span
                                className="block w-full h-full rounded-full"
                                style={{ backgroundColor: contentItem.subdetailColor || '#000000' }}
                              ></span>
                            </button>
                            {colorPicker[`category-${categoryIndex}-content-${contentIndex}-subdetailColor-${subDetailIndex}`] && (
                              <div className="absolute z-10 mt-2">
                                <div
                                  className="fixed inset-0"
                                  onClick={() => toggleColorPicker(`category-${categoryIndex}-content-${contentIndex}-subdetailColor-${subDetailIndex}`)}
                                />
                                <SketchPicker
                                  color={contentItem.subdetailColor || '#000000'}
                                  onChangeComplete={(color: ColorResult) => {
                                    const updatedCategories = [...categories];
                                    updatedCategories[categoryIndex].content[contentIndex].subdetailColor = color.hex;
                                    setCategories(updatedCategories);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSubdetail('category', subDetailIndex, undefined, categoryIndex, contentIndex)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove Subdetail"
                          >
                            <FaMinus />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addSubdetail('category', undefined, categoryIndex, contentIndex)}
                        className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 focus:outline-none mt-2"
                      >
                        <FaPlus className="h-5 w-5" />
                        <span>Add Subdetail</span>
                      </button>
                    </div>

                    {/* Media Uploads */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Image Upload */}
                      <div>
                        <label className="block text-md font-bold text-gray-700">Image</label>
                        <div className="mt-2 flex items-center space-x-4">
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
                          {contentItem.media.image instanceof File ? (
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
                        <label className="block text-md font-bold text-gray-700">Video</label>
                        <div className="mt-2 flex items-center space-x-4">
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
                          {contentItem.media.video instanceof File ? (
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition-colors ${
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

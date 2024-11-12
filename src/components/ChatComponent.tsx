// src/components/ChatComponent.tsx

"use client";

import React, { useState, useRef, useEffect } from "react";
import useSWR, { mutate } from "swr";
import Image from "next/image"; // Import the Image component

interface ChatMessage {
  id: string;
  sender: "User" | "Admin";
  senderName?: string;
  userId: string;
  message: string;
  imageUrl?: string; // Optional: URL of the image
  status: "sent" | "seen";
  time: string;
}

// Define the fetcher function with authorization
const fetcher = (url: string, token: string) => {
  if (!token) {
    throw new Error("Unauthorized");
  }

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  });
};

const ChatComponent: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Retrieve user information from localStorage
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("You");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      const storedUsername = localStorage.getItem("username") || "You";
      const storedToken = localStorage.getItem("token");
      setUserId(storedUserId);
      setUsername(storedUsername);
      setToken(storedToken);
    }
  }, []);

  // Use SWR to fetch messages with a revalidation interval of 1 second
  const { data: messages, error: fetchError } = useSWR<ChatMessage[]>(
    userId && token ? [`/api/messages?userId=${userId}`, token] : null,
    ([url, token]: [string, string]) => fetcher(url, token),
    {
      refreshInterval: 1000, // Revalidate every 1 second
      dedupingInterval: 1000, // Deduplicate requests within 1 second
      onError: (err) => {
        console.error("Error fetching messages:", err);
        setError("Unable to load messages. Please try again later.");
      },
    }
  );

  // Function to scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messages) {
      scrollToBottom();
    }
  }, [messages]);

  // Send a new message to the API
  const handleSendMessage = async () => {
    if (input.trim() === "" && !imageFile) return;
    setLoading(true);
    setError("");

    if (!userId || !token) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    let imageUrl: string | undefined;

    // If an image is selected, upload it first
    if (imageFile) {
      const formData = new FormData();
      formData.append("files", imageFile);

      try {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.urls[0]; // Assuming single file upload
        } else {
          const uploadError = await uploadRes.json();
          throw new Error(uploadError.message || "Image upload failed.");
        }
      } catch (err: unknown) {
        console.error("Error uploading image:", err);
        if (err instanceof Error) {
          setError(err.message || "Failed to upload image.");
        } else {
          setError("An unexpected error occurred during image upload.");
        }
        setLoading(false);
        return;
      }
    }

    const newMessage: Omit<ChatMessage, "id" | "time"> = {
      sender: "User",
      senderName: username,
      userId: userId!,
      message: input,
      imageUrl, // Include imageUrl if available
      status: "sent",
    };

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMessage),
      });

      if (response.ok) {
        const savedMessage = await response.json();

        // Optimistically update the messages cache
        mutate(
          [`/api/messages?userId=${userId}`, token],
          (currentData: ChatMessage[] = []) => [
            ...currentData,
            {
              id: savedMessage.id,
              sender: savedMessage.sender,
              senderName: savedMessage.senderName,
              userId: savedMessage.userId,
              message: savedMessage.message,
              imageUrl: savedMessage.imageUrl, // Include imageUrl
              status: savedMessage.status,
              time: new Date(savedMessage.createdAt).toLocaleString(),
            },
          ],
          false // Do not revalidate after mutation
        );

        setInput("");
        setImageFile(null);
        scrollToBottom();
      } else {
        console.error("Failed to send message");
        const errorData = await response.json();
        setError(
          errorData.message || "Failed to send message. Please try again."
        );
      }
    } catch (err: unknown) {
      console.error("Error sending message:", err);
      if (err instanceof Error) {
        setError(err.message || "Failed to send message.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchError) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow-md mt-16">
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error || "Failed to load messages."}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow-md mt-16">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Chat Header */}
      <div className="text-2xl font-semibold text-gray-800">
        Chat Support
      </div>

      {/* Chat Messages */}
      <div className="flex flex-col space-y-4 overflow-y-auto max-h-96 px-4">
        {(!messages || messages.length === 0) && !error && (
          <div className="text-center text-gray-500">
            No messages yet. Start the conversation!
          </div>
        )}
        {messages &&
          messages.map((chat) => {
            const isUser = chat.sender === "User";
            return (
              <div
                key={chat.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div className="flex flex-col space-y-1 max-w-xs">
                  {/* Sender and Time */}
                  <div
                    className={`flex items-center space-x-2 ${
                      isUser ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-700">
                      {isUser ? "You" : "Admin"}
                    </div>
                    <time className="text-xs text-gray-400">
                      {chat.time}
                    </time>
                  </div>
                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-2 rounded-lg shadow-md text-white break-words ${
                      isUser ? "bg-green-500 " : "bg-blue-500 "
                    }`}
                  >
                    {chat.message}
                  </div>
                  {/* Display Image if available */}
                  {chat.imageUrl && (
                    <div className="mt-2">
                      <Image
                        src={chat.imageUrl}
                        alt="Uploaded Image"
                        width={200} // Adjust as needed
                        height={200} // Adjust as needed
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}
                  {/* Status */}
                  <div
                    className={`text-xs text-gray-500 ${
                      isUser ? "text-right" : "text-left"
                    }`}
                  >
                    {chat.status === "sent" ? "Sent" : "Seen"}
                  </div>
                </div>
              </div>
            );
          })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box, Image Upload, and Send Button */}
      <div className="flex items-center space-x-2">
        {/* Image Upload Input */}
        <label className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600 hover:text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 8.828M3 5h4l3.293 3.293a1 1 0 001.414 0L14 5m0 0l3 3m-3-3v12"
            />
          </svg>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
          />
        </label>

        {/* Display Selected Image Preview */}
        {imageFile && (
          <div className="relative">
            <Image
              src={URL.createObjectURL(imageFile)}
              alt="Selected Image"
              width={48} // 12 * 4 = 48px (h-12)
              height={48} // 12 * 4 = 48px (w-12)
              className="object-cover rounded-md"
            />
            <button
              onClick={() => setImageFile(null)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
            >
              &times;
            </button>
          </div>
        )}

        {/* Text Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !loading &&
              (input.trim() !== "" || imageFile)
            ) {
              handleSendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          className={`px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading || (input.trim() === "" && !imageFile)}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;

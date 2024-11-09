// src/components/ChatComponent.tsx
"use client";

import React, { useState, useRef } from "react";
import useSWR, { mutate } from "swr";

interface ChatMessage {
  id: string; // Ensure id is always a string and required
  sender: string;
  userId: string;
  message: string;
  status: string;
  time: string;
}

// Define the fetcher function
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ChatComponent: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Retrieve user information from localStorage
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const username = typeof window !== "undefined" ? localStorage.getItem("username") || "You" : "You";

  // Use SWR to fetch messages with a revalidation interval of 1 second
  const { data: messages, error: fetchError } = useSWR<ChatMessage[]>(
    userId ? `/api/messages?userId=${userId}` : null,
    fetcher,
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
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send a new message to the API
  const handleSendMessage = async () => {
    if (input.trim() === "") return;
    setLoading(true);
    setError("");

    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const newMessage: Omit<ChatMessage, "id" | "time"> = {
      sender: username,
      userId,
      message: input,
      status: "Sent",
    };

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      if (response.ok) {
        const savedMessage = await response.json();

        // Optimistically update the messages cache
        mutate(
          `/api/messages?userId=${userId}`,
          (currentData: ChatMessage[] = []) => [
            ...currentData,
            {
              id: savedMessage.id, // Ensure id is correctly assigned
              sender: savedMessage.sender,
              userId: savedMessage.userId,
              message: savedMessage.message,
              status: savedMessage.status,
              time: new Date(savedMessage.createdAt).toLocaleString(),
            },
          ],
          false // Do not revalidate after mutation
        );

        setInput("");
        scrollToBottom();
      } else {
        console.error("Failed to send message");
        const errorData = await response.json();
        setError(errorData.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Network error. Please check your connection.");
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
            const isUser = chat.sender === username;
            return (
              <div
                key={chat.id} // Ensure chat.id is unique and defined
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div className="flex flex-col space-y-1 max-w-xs">
                  {/* Sender and Time */}
                  <div className={`flex items-center space-x-2 ${isUser ? "flex-row-reverse" : ""}`}>
                    <div className="text-sm font-medium text-gray-700">
                      {chat.sender}
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
                  {/* Status */}
                  <div className={`text-xs text-gray-500 ${isUser ? "text-right" : "text-left"}`}>
                    {chat.status}
                  </div>
                </div>
              </div>
            );
          })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box and Button */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading && input.trim() !== "") {
              handleSendMessage();
            }
          }}
        />
        <button
          onClick={handleSendMessage}
          className={`px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading || !input.trim()}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;

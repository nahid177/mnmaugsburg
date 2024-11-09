// src/app/admin/chat/[userId]/page.tsx

"use client";

import React, { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";
import useSWR from "swr";
import AdminLayout from "../../AdminLayout";

interface ChatMessage {
  id: string;
  sender: string;
  userId: string;
  message: string;
  status: string;
  time: string;
}

interface ApiGetMessagesResponse {
  messages: ChatMessage[];
  username: string;
}

// Fetcher function for SWR
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

const AdminChat: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { userId } = params;
  const token = Cookies.get("token");

  const [input, setInput] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Use SWR for fetching chat messages with a 1-second refresh interval
  const { data, error: fetchError } = useSWR<ApiGetMessagesResponse>(
    token ? [`/api/admin/messages/${userId}`, token] : null,
    ([url, token]: [string, string]) => fetcher(url, token),
    {
      refreshInterval: 1000, // Revalidate every 1 second
      dedupingInterval: 1000, // Deduplicate requests within 1 second
    }
  );

  // Scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever new messages arrive
  React.useEffect(() => {
    if (data?.messages) {
      scrollToBottom();
    }
  }, [data]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (input.trim() === "") return;
    setSending(true);
    setError("");

    if (!token) {
      router.push("/login");
      return;
    }

    const messageData = {
      userId,
      message: input,
      status: "Sent",
    };

    try {
      const res = await fetch("/api/admin/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });

      if (res.ok) {
        setInput("");
        scrollToBottom();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to send message.");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // Handle Enter key for sending message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !sending && input.trim() !== "") {
      handleSendMessage();
    }
  };

  // Redirect to login if there's an authentication error
  if (fetchError?.message === "Unauthorized") {
    router.push("/login");
    return null;
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Header */}
          <h1 className="text-2xl font-semibold text-gray-800">
            Chat with User: {data?.username || userId}
          </h1>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Loading Indicator */}
          {!data && !fetchError && <p className="text-center text-gray-500">Loading messages...</p>}

          {/* Chat Messages */}
          {data?.messages && (
            <div className="flex flex-col space-y-4 overflow-y-auto max-h-[60vh] px-4">
              {data.messages.length === 0 ? (
                <div className="text-center text-gray-500">No messages yet. Start the conversation!</div>
              ) : (
                data.messages.map((msg) => {
                  const isAdmin = msg.sender === "Admin";
                  return (
                    <div key={msg.id} className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}>
                      <div className="flex flex-col space-y-1 max-w-xs">
                        {/* Sender and Time */}
                        <div className={`flex items-center space-x-2 ${isAdmin ? "" : "flex-row-reverse"}`}>
                          <div className="text-sm font-medium text-gray-700">{msg.sender}</div>
                          <time className="text-xs text-gray-400">{msg.time}</time>
                        </div>
                        {/* Message Bubble */}
                        <div
                          className={`px-4 py-2 rounded-lg shadow-md text-white break-words ${
                            isAdmin ? "bg-blue-500" : "bg-green-500"
                          }`}
                        >
                          {msg.message}
                        </div>
                        {/* Status */}
                        <div className={`text-xs text-gray-500 ${isAdmin ? "text-left" : "text-right"}`}>
                          {msg.status}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Box and Send Button */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className={`px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200 ${
                sending ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={sending || !input.trim()}
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminChat;

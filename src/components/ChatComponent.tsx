"use client";

import React, { useState, useEffect } from "react";

interface ChatMessage {
  id?: string;
  sender: string;
  userId: string;
  message: string;
  status: string;
  time: string;
}

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch messages from the API
  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages");
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error("Failed to fetch messages");
        setError("Unable to load messages. Please try again later.");
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Network error. Please check your connection.");
    }
  };

  // Send a new message to the API
  const handleSendMessage = async () => {
    if (input.trim() === "") return;
    setLoading(true);
    setError("");

    // Retrieve user ID from localStorage
    const userId = localStorage.getItem("userId") || "unknown";
    const sender = localStorage.getItem("username") || "You";

    const newMessage: ChatMessage = {
      sender,
      userId,
      message: input,
      status: "Sent",
      time: new Date().toLocaleString(), // Fallback time
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
        setMessages([...messages, { ...savedMessage, time: new Date(savedMessage.createdAt).toLocaleString() }]);
        setInput("");
      } else {
        console.error("Failed to send message");
        setError("Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages on component load
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4 bg-base-200 rounded-lg shadow-md mt-16">
      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Chat Messages */}
      <div className="space-y-4">
        {messages.map((chat) => (
          <div
            key={chat.id}
            className={`flex flex-col ${chat.sender === "You" ? "items-end" : "items-start"}`}
          >
            <div className="flex items-center space-x-2">
              <div className="text-sm md:text-base lg:text-lg font-semibold">{chat.sender}</div>
              <time className="text-xs md:text-sm text-gray-500">{chat.time}</time>
            </div>
            <div
              className={`px-4 py-2 mt-1 rounded-lg shadow-sm text-white break-words max-w-[75%] ${
                chat.sender === "You" ? "bg-green-500" : "bg-blue-500"
              } text-sm md:text-base lg:text-lg`}
            >
              {chat.message}
            </div>
            <div className="text-xs md:text-sm text-gray-500 mt-1">{chat.status}</div>
          </div>
        ))}
      </div>

      {/* Input Box and Button */}
      <div className="flex items-center space-x-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 input input-bordered focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className={`btn btn-primary ${loading ? "loading" : ""}`}
          disabled={loading || !input.trim()}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;

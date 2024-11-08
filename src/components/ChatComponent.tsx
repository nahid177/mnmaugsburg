"use client";

import React, { useState, useEffect } from "react";

interface ChatMessage {
  id?: number;
  sender: string;
  time: string;
  message: string;
  status: string;
}

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");

  // Fetch messages from the API
  const fetchMessages = async () => {
    const response = await fetch("/api/messages");
    const data = await response.json();
    setMessages(data);
  };

  // Send a new message to the API
  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const newMessage: ChatMessage = {
      sender: "You",
      time: "Just now",
      message: input,
      status: "Sent",
    };

    // Save message to the database
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
    });

    if (response.ok) {
      const savedMessage = await response.json();
      setMessages([...messages, savedMessage]);
      setInput("");
    } else {
      console.error("Failed to send message");
    }
  };

  // Fetch messages on component load
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4 bg-gray-50 rounded-lg shadow-md mt-16">
      {/* Chat Messages */}
      {messages.map((chat, index) => (
        <div
          key={index}
          className={`flex flex-col ${
            chat.sender === "You" ? "items-end" : "items-start"
          }`}
        >
          <div className="flex items-center space-x-2">
            <div className="text-sm md:text-base lg:text-lg font-semibold">
              {chat.sender}
            </div>
            <time className="text-xs md:text-sm text-gray-500">
              {chat.time}
            </time>
          </div>
          <div
            className={`px-4 py-2 mt-1 rounded-lg shadow-sm text-white break-words max-w-[75%] ${
              chat.sender === "You" ? "bg-green-500" : "bg-blue-500"
            } text-sm md:text-base lg:text-lg`}
          >
            {chat.message}
          </div>
          <div className="text-xs md:text-sm text-gray-500 mt-1">
            {chat.status}
          </div>
        </div>
      ))}

      {/* Input Box and Button */}
      <div className="flex items-center space-x-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base lg:text-lg"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none text-sm md:text-base lg:text-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;

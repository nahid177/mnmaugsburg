// src/app/admin/chat/[userId]/page.tsx

"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import AdminLayout from '../../AdminLayout';

// Define the structure of a single chat message
interface ChatMessage {
  id: string;
  sender: string;
  userId: string;
  message: string;
  status: string;
  time: string;
}

// Define the structure of the API response
interface ApiGetMessagesResponse {
  messages: ChatMessage[];
  username: string;
}

const AdminChat: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { userId } = params;

  const [username, setUsername] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Function to scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/messages/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data: ApiGetMessagesResponse = await res.json();
          setMessages(data.messages);
          setUsername(data.username);
        } else if (res.status === 401 || res.status === 403) {
          router.push('/login');
        } else if (res.status === 404) {
          setError('User not found.');
        } else {
          const data = await res.json();
          setError(data.message || 'Failed to fetch messages.');
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [router, userId]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    setSending(true);
    setError('');

    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const messageData = {
      userId,
      message: input,
      status: 'Sent',
    };

    try {
      const res = await fetch('/api/admin/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });

      if (res.ok) {
        const data = await res.json();
        const newMessage: ChatMessage = {
          id: data.id,
          sender: 'Admin', // Assuming sender is 'Admin'
          userId: data.userId,
          message: data.message,
          status: data.status,
          time: new Date(data.createdAt).toLocaleString(),
        };
        setMessages((prev) => [...prev, newMessage]);
        setInput('');
        scrollToBottom();
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to send message.');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Handle Enter key for sending message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !sending && input.trim() !== '') {
      handleSendMessage();
    }
  };

  return (
    <AdminLayout>
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-800">
          Chat with User: {username || userId}
        </h1>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && <p className="text-center text-gray-500">Loading messages...</p>}

        {/* Chat Messages */}
        {!loading && !error && (
          <div className="flex flex-col space-y-4 overflow-y-auto max-h-[60vh] px-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500">
                No messages yet. Start the conversation!
              </div>
            )}
            {messages.map((msg) => {
              const isAdmin = msg.sender === 'Admin';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}
                >
                  <div className="flex flex-col space-y-1 max-w-xs">
                    {/* Sender and Time */}
                    <div className={`flex items-center space-x-2 ${isAdmin ? '' : 'flex-row-reverse'}`}>
                      <div className="text-sm font-medium text-gray-700">
                        {msg.sender}
                      </div>
                      <time className="text-xs text-gray-400">
                        {msg.time}
                      </time>
                    </div>
                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-2 rounded-lg shadow-md text-white break-words ${
                        isAdmin ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                    >
                      {msg.message}
                    </div>
                    {/* Status */}
                    <div className={`text-xs text-gray-500 ${isAdmin ? 'text-left' : 'text-right'}`}>
                      {msg.status}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Box and Send Button */}
        {!loading && !error && (
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
                sending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={sending || !input.trim()}
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  
  );
};

export default AdminChat;

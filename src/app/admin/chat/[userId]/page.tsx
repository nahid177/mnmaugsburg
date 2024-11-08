// src/app/admin/chat/[userId]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';

interface ChatMessage {
  id: string;
  sender: string;
  userId: string;
  message: string;
  status: string;
  time: string;
}

const AdminChat: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { userId } = params;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);

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
          const data = await res.json();
          setMessages(data.messages);
        } else if (res.status === 401 || res.status === 403) {
          router.push('/login');
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
          sender: data.sender,
          userId: data.userId,
          message: data.message,
          status: data.status,
          time: new Date(data.createdAt).toLocaleString(),
        };
        setMessages((prev) => [...prev, newMessage]);
        setInput('');
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

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Chat with User: {userId}</h1>

      {loading && <p>Loading messages...</p>}

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4 overflow-y-auto max-h-[60vh]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'Admin' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="text-sm font-semibold">{msg.sender}</div>
                <time className="text-xs text-gray-500">{msg.time}</time>
              </div>
              <div
                className={`px-4 py-2 mt-1 rounded-lg shadow-sm text-white ${
                  msg.sender === 'Admin' ? 'bg-blue-500' : 'bg-green-500'
                } max-w-xs`}
              >
                {msg.message}
              </div>
              <div className="text-xs text-gray-500 mt-1">{msg.status}</div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
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
            className={`btn btn-primary ${sending ? 'loading' : ''}`}
            disabled={sending || !input.trim()}
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminChat;

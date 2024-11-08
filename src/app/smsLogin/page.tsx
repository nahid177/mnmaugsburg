"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const SmsLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check if the user is already logged in
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setIsLoggedIn(true);
      setMessage(`Welcome back, ${storedUsername}!`);
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (res.status === 200) {
        setMessage('Login successful!');
        localStorage.setItem('username', username);
        setIsLoggedIn(true);

        // Redirect after a short delay
        setTimeout(() => {
          router.push('/contactUs');
        }, 1500);
      } else {
        setMessage(data.message || 'Login failed.');
      }
    } catch {
      setMessage('Login failed due to a network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername('');
    setIsLoggedIn(false);
    setMessage('You have been logged out.');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-center">SMS Login</h2>
          {isLoggedIn ? (
            <>
              <p className="text-lg text-center mb-4">Hello, {username}!</p>
              <button
                onClick={handleLogout}
                className="btn btn-outline w-full"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input input-bordered w-full"
              />
              <button
                onClick={handleLogin}
                className={`btn btn-primary w-full mt-4 ${loading ? 'loading' : ''}`}
                disabled={loading || !username}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </>
          )}
          {message && (
            <div className="alert alert-info mt-4">
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmsLogin;

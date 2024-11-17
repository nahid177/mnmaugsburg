// src/components/Footer.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { useState } from 'react';

const Footer: React.FC = () => {
    // State to handle chat box visibility
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<string[]>([]);

    const handleSendMessage = () => {
        if (chatMessage.trim() !== '') {
            setChatHistory([...chatHistory, chatMessage]);
            setChatMessage('');
        }
    };

    return (
        <footer className="bg-sky-200 text-black py-10 relative">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between">
                    {/* Company Information */}
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center mb-4">
                            <svg
                                width="50"
                                height="50"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="text-black">
                                {/* Include your company logo SVG path here */}
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.627 3.863 10.327 9 11.618V14h-3v-2h3V9.5c0-3.07 1.794-4.75 4.533-4.75 1.312 0 2.686.235 2.686.235v2.95h-1.513c-1.492 0-1.957.927-1.957 1.875V12h3.328l-.532 2H13.75v9.618C19.137 22.327 23 17.627 23 12 23 5.373 17.627 0 12 0z"></path>
                            </svg>
                            <span className="ml-3 text-xl font-bold">ACME Industries Ltd.</span>
                        </div>
                        <p className="text-black">Providing reliable tech since 1992</p>
                    </div>

                    {/* Quick Links */}
                    <div className="mb-6 md:mb-0">
                        <h6 className="text-lg font-semibold mb-4">Quick Links</h6>
                        <ul>

                            <li className="mb-2">
                                <Link href="/contactUs">
                                    <span className="hover:text-white cursor-pointer">Services</span>
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/contactUs">
                                    <span className="hover:text-white cursor-pointer">Contact</span>
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/faqPage">
                                    <span className="hover:text-white cursor-pointer text-lg font-semibold uppercase text-blue-700">
                                        FAQ
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social Links & Chat Box */}
                    <div className="flex flex-col">
                        {/* Social Links */}
                        <div className="mb-6 md:mb-4">
                            <h6 className="text-lg font-semibold mb-4">Connect with Us</h6>
                            <div className="flex space-x-4">
                                {/* Twitter */}
                                <Link
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Twitter"
                                    className="hover:text-blue-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="currentColor">
                                        {/* Twitter SVG path */}
                                        <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.723c-.951.564-2.005.974-3.127 1.195A4.918 4.918 0 0016.616 3c-2.733 0-4.946 2.213-4.946 4.946 0 .388.043.765.127 1.126C7.728 8.907 4.1 6.882 1.671 3.859a4.903 4.903 0 00-.666 2.482c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.24-.616v.062c0 2.386 1.693 4.374 3.946 4.827a4.935 4.935 0 01-2.224.084 4.926 4.926 0 004.6 3.417A9.869 9.869 0 010 19.54a13.94 13.94 0 007.548 2.212c9.058 0 14.01-7.514 14.01-14.01 0-.213-.004-.426-.013-.637A10.025 10.025 0 0024 4.557z"></path>
                                    </svg>
                                </Link>
                                {/* YouTube */}
                                <Link
                                    href="https://youtube.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="YouTube"
                                    className="hover:text-red-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="currentColor">
                                        {/* YouTube SVG path */}
                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.487 3.45.028 5.804 0 12c.028 6.196.487 8.55 4.385 8.816 3.6.245 11.626.246 15.23 0C23.513 20.55 23.972 18.196 24 12c-.028-6.196-.487-8.55-4.385-8.816zM9 16.081V7.919L16 12l-7 4.081z"></path>
                                    </svg>
                                </Link>
                                {/* Facebook */}
                                <Link
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="hover:text-blue-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="currentColor">
                                        {/* Facebook SVG path */}
                                        <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.337v21.326C0 23.4.6 24 1.337 24H12.81v-9.294H9.692v-3.622h3.117V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.31h3.587l-.467 3.622h-3.12V24h6.116C23.4 24 24 23.4 24 22.663V1.337C24 .6 23.4 0 22.675 0z"></path>
                                    </svg>
                                </Link>
                                {/* Email */}
                                <Link
                                    href="mailto:contact@acmeindustries.com"
                                    aria-label="Email"
                                    className="hover:text-gray-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="currentColor">
                                        {/* Email SVG path */}
                                        <path d="M12 13.065L.75 5.565v12.87h22.5V5.565L12 13.065zm0-1.35l9.75-6.5V4.5H2.25v.715l9.75 6.5z"></path>
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Chat Box */}
                        <div className="flex flex-col items-end">
                            {/* Connect with Admin Link */}
                            <Link href="/contactUs" aria-label="Connect with Admin" className="flex items-center text-blue-700 font-semibold hover:text-blue-900 transition-colors duration-300">
                                {/* User Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true">
                                    <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3 0-9 1.5-9 4.5V21h18v-2.3c0-3-6-4.5-9-4.5z" />
                                </svg>
                                <span className="hover:text-white text-lg">Connect with Admin</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-8 text-center text-gray-500">
                    <p>
                        &copy; {new Date().getFullYear()} - All rights reserved by ACME Industries Ltd.
                    </p>
                    <p className="mt-2">
                        <Link href="/terms">
                            <span className="hover:text-white cursor-pointer">Terms of Service</span>
                        </Link>
                        {' | '}
                        <Link href="/privacy">
                            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
                        </Link>
                        {' | '}
                        <Link href="/copyright">
                            <span className="hover:text-white cursor-pointer">Copyright</span>
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

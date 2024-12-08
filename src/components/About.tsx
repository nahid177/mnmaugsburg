"use client";

import React from 'react';
import { FaPhoneAlt, FaWhatsapp, FaEnvelope, FaGoogle, FaMapMarkedAlt } from 'react-icons/fa'; // Importing Font Awesome Icons
import Navbar from '@/components/Navbar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import TypeNameNavbar from '@/components/CreateInfomation/TypeNameNavbar';

const About = () => {
    const teamMembers = [
        {
            name: "MD ABDUL MAZED BHUIYAN",
            title: "Managing Director",
            contactNumber: "+49-15906808042",
            whatsapp: "+49-15902229960",
            email: "m.bhuiyan@mnmaugsburg.de",
            officeAddress: "Bürgermeister Miehle Str 14, D-86199 Augsburg, Germany",
            branch: "Germany Branch",
            location: "Germany",
        },
        {
            name: "MD MISHKATUR RAHMAN",
            title: "CEO",
            contactNumber: "+49-17656818441",
            whatsapp: "+49-15902278434",
            email: "m.rahman@mnmaugsburg.de",
            officeAddress: "Bürgermeister Miehle Str 14, D-86199 Augsburg, Germany",
            branch: "Germany Head Office",
            location: "Germany",
        },
        {
            name: "Mohammad Saleh Saoud",
            title: "Sales & Marketing Executive",
            contactNumber: "+880-1580-833111",
            whatsapp: "+880-1580-833111",
            email: "mnmaugsburg.de@gmail.com",
            officeAddress: "Swapno Shomo Flat B-1, House 93, Road 8, O.R. Nizam Road, Chittagong, Bangladesh",
            branch: "Bangladesh Branch",
            location: "Bangladesh",
        },
    ];

    // Separate members by location (Head Office, Bangladesh Branch)
    const headOfficeMembers = teamMembers.filter(member => member.location === "Germany");
    const bangladeshOfficeMembers = teamMembers.filter(member => member.location === "Bangladesh");

    return (
        <>
            <Navbar />
            <LanguageSwitcher />
            <div className="text-center">
                <TypeNameNavbar />
            </div>
            <div className="container mx-auto p-6 max-w-screen-xl">

                <h1 className="text-4xl font-bold text-center my-12 mb-16 text-gray-800">CONTACT  US</h1>

                {/* Germany Head Office Section */}
                <div className="officeSection mb-24">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-5">Head office</h2>

                    {/* Office card with nested member cards */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:translate-y-2 ">
                        <div className="p-4 mb-6 bg-gray-50 rounded-lg shadow-inner">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Office Location: Germany</h3>
                            <p className="text-sm text-gray-500 mb-2">Office Address: Bürgermeister Miehle Str 14, D-86199 Augsburg, Germany</p>
                            <p className="text-sm text-gray-500 mb-2"><strong>Office Hours:</strong></p>
                            <p className="text-sm text-gray-500 mb-2">
                                <strong>Monday:</strong> 9 AM to 5 PM
                            </p>
                            <p className="text-sm text-gray-500 mb-2">
                                <strong>Tuesday:</strong> 9 AM to 5 PM
                            </p>
                            <p className="text-sm text-gray-500 mb-2">
                                <strong>Wednesday:</strong> 9 AM to 5 PM
                            </p>
                            <p className="text-sm text-gray-500 mb-2">
                                <strong>Thursday:</strong> 9 AM to 5 PM
                            </p>
                            <p className="text-sm text-gray-500 mb-2">
                                <strong>Friday:</strong> 9 AM to 5 PM
                            </p>
                            <p className="text-sm text-gray-500 mb-2">
                                <strong>Saturday:</strong> Closed
                            </p>
                            <p className="text-sm text-gray-500 mb-2">
                                <strong>Sunday:</strong> Closed
                            </p>
                        </div>

                        {/* Google Maps Link */}
                        <div className="flex items-center space-x-3 mb-4 ">
                            <FaMapMarkedAlt className="text-2xl text-red-500" />
                            <a
                                href="https://www.google.com/maps/place/B%C3%BCrgermeister-Miehle-Stra%C3%9Fe+14,+86199+Augsburg,+Germany/@48.3357679,10.8753937,17z/data=!3m1!4b1!4m6!3m5!1s0x479ea2906ba15bd5:0x4c53f52e7424bb58!8m2!3d48.3357644!4d10.8779686!16s%2Fg%2F11gy37pmsc?entry=ttu&g_ep=EgoyMDI0MTEyNC4xIKXMDSoASAFQAw%3D%3D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                View on Google Maps
                            </a>
                        </div>

                        {/* Nested member cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-[1100px]">
                            {headOfficeMembers.map((member, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 hover:translate-y-1 max-w-xs mx-auto">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{member.name}</h2>
                                    <p className="text-base text-gray-600 mb-4">{member.title}</p>
                                    <div className="text-gray-500 text-sm space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <FaPhoneAlt className="text-2xl text-sky-500" />
                                            <a
                                                href={`tel:${member.contactNumber}`}
                                                className="text-blue-500 hover:underline"
                                            >
                                                {member.contactNumber}
                                            </a>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <FaWhatsapp className="text-2xl text-sky-500" />
                                            <p>{member.whatsapp}</p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <FaEnvelope className="text-2xl text-sky-500" />
                                            <p className="text-blue-500">{member.email}</p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <FaGoogle className="text-2xl text-sky-500" />
                                            <p
                                                className="text-blue-500 cursor-pointer"
                                                onClick={() => {
                                                    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(member.email)}`;
                                                    window.open(mailtoLink, '_blank');
                                                }}
                                            >
                                                Send via Gmail
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bangladesh Branch Section */}
                <div className="officeSection mb-28">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-5">Bangladesh office</h2>

                    {/* Office card with nested member cards */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:translate-y-2">
                        <div className="p-4 mb-6 bg-gray-50 rounded-lg shadow-inner">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Office Location: Bangladesh</h3>
                            <p className="text-sm text-gray-500 mb-2">Branch: Bangladesh Branch</p>
                            <p className="text-sm text-gray-500 mb-2">Office Address: Swapno Shomo Flat B-1, House 93, Road 8, O.R. Nizam Road, Chittagong, Bangladesh</p>
                            <p className="text-sm text-gray-500 mb-2"><strong>Office Hours:</strong></p>
                            <p className="text-sm text-gray-500 mb-2">
                                <strong>Monday:</strong> 9 AM to 5 PM
                            </p>
                            <p className="text-sm text-gray-500 mb-2">
                                <strong>Tuesday:</strong> 9 AM to 5 PM
                            </p>
                            <p className="text-sm text-gray-500 mb-2">
                                <strong>Wednesday:</strong> 9 AM to 5 PM
                            </p>
                            <p className="text-sm text-gray-500 mb-2">
                                <strong>Thursday:</strong> 9 AM to 5 PM
                            </p>
                            <p className="text-sm text-gray-500 mb-2">
                                <strong>Friday:</strong> 9 AM to 5 PM
                            </p>
                            <p className="text-sm text-gray-500 mb-2">
                                <strong>Saturday:</strong> Closed
                            </p>
                            <p className="text-sm text-gray-500 mb-2">
                                <strong>Sunday:</strong> Closed
                            </p>
                        </div>

                        {/* Google Maps Link */}
                        <div className="flex items-center space-x-3 mb-4 ">
                            <FaMapMarkedAlt className="text-2xl text-red-500" />
                            <a
                                href="https://maps.app.goo.gl/dZwnigcooc3NS3nV8"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                View on Google Maps
                            </a>
                        </div>

                        {/* Nested member cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-[180px] w-[1100px]">
                            {bangladeshOfficeMembers.map((member, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 hover:translate-y-1 max-w-xs mx-auto">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{member.name}</h2>
                                    <p className="text-base text-gray-600 mb-4">{member.title}</p>
                                    <div className="text-gray-500 text-sm space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <FaPhoneAlt className="text-2xl text-sky-500" />
                                            <a
                                                href={`tel:${member.contactNumber}`}
                                                className="text-blue-500 hover:underline"
                                            >
                                                {member.contactNumber}
                                            </a>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <FaWhatsapp className="text-2xl text-sky-500" />
                                            <p>{member.whatsapp}</p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <FaEnvelope className="text-2xl text-sky-500" />
                                            <p className="text-blue-500">{member.email}</p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <FaGoogle className="text-2xl text-sky-500" />
                                            <p
                                                className="text-blue-500 cursor-pointer"
                                                onClick={() => {
                                                    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(member.email)}`;
                                                    window.open(mailtoLink, '_blank');
                                                }}
                                            >
                                                Send via Gmail
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default About;

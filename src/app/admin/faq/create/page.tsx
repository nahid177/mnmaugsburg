"use client";
import React, { useState } from "react";
import AdminLayout from "../../AdminLayout";
import Toast from "@/components/Toast/Toast";

const CreateFAQPage = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [message, setMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error" | "warning">("success");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!question.trim() || !answer.trim()) {
            setMessage("Both question and answer are required.");
            setToastType("warning");
            return;
        }

        try {
            const response = await fetch("/api/admin/faqRoutes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question, answer }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("FAQ created successfully!");
                setToastType("success");
                setQuestion("");
                setAnswer("");
            } else {
                setMessage(data.message || "Failed to create FAQ.");
                setToastType("error");
            }
        } catch (error) {
            console.error("Error creating FAQ:", error);
            setMessage("An error occurred while creating the FAQ.");
            setToastType("error");
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Create FAQ</h2>
                {message && (
                    <Toast type={toastType} message={message} onClose={() => setMessage("")} />
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 font-medium">Question</label>
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter the question"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Answer</label>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter the answer"
                            rows={4}
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                        Create FAQ
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
};

export default CreateFAQPage;

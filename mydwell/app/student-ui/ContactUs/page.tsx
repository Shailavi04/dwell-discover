"use client";

import { useState } from "react";
import Footer from "@/app/student-ui/MyComponents/Footer";
import LoginButton from "../MyComponents/LoginButton";
import HiddenNav from "../MyComponents/HiddenNav";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    alert("Message sent! Thank you.");
    setFormData({ name: "", email: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="flex mt-20 flex-row gap-270">
        <HiddenNav />
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
          Contact Us
        </h1>

        <p className="text-gray-600 text-center mb-8 max-w-xl">
          We'd love to hear from you! Whether you have a question about listings,
          feedback, or anything else, our team is ready to help.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl p-6 w-full max-w-md space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              required
              className="mt-1 w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
              className="mt-1 w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              required
              className="mt-1 w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Your message here..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-blue-700 text-white py-2 rounded-md transition-all duration-300 hover:bg-blue-800 disabled:opacity-60`}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div className="mt-10 text-gray-700 text-center mb-20">
          <p>📍 Lucknow, Uttar Pradesh, India</p>
          <p>📧 support@dwelldiscover.com</p>
          <p>📞 +91 98765 43210</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
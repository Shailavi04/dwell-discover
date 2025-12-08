"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailFromURL = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromURL);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/panel/dashboard"); 
    }
  }, []);


  useEffect(() => {
    setEmail(emailFromURL);
  }, [emailFromURL]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:9092/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid OTP");
        return;
      }

      router.push(`/auth/reset-password?email=${email}`);

    } catch (err) {
      setError("Server not reachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md mx-auto mt-20">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-3">
        Verify OTP 🔑
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Enter the OTP sent to your email
      </p>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center font-medium">
          {error}
        </p>
      )}

      <form onSubmit={handleVerifyOtp}>
        {/* EMAIL */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-semibold">Email</label>
          <input
            className="w-full text-black border border-gray-300 rounded-xl p-3 bg-gray-100 cursor-not-allowed"
            value={email}
            readOnly
          />
        </div>

        {/* OTP */}
        <div className="mb-8">
          <label className="block text-gray-700 mb-2 font-semibold">OTP</label>
          <input
            className="w-full text-black border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold text-lg transition-transform transform hover:scale-[1.02]"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
}

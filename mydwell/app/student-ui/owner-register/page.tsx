"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import DDCard from "@/app/student-ui/MyComponents/DDCard";
import DDButton from "@/app/student-ui/MyComponents/DDButton";

export default function OwnerRegister() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");

  // ===== TIMER =====
  const startTimer = () => {
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) clearInterval(interval);
        return prev - 1;
      });
    }, 1000);
  };

  // ===== SEND OTP =====
  const handleSendOtp = async () => {
    if (!email) return setError("Please enter email");

    try {
      setLoading(true);

      const res = await fetch("http://localhost:9092/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || "Failed to send OTP");

      setOtpSent(true);
      startTimer();
    } finally {
      setLoading(false);
    }
  };

  // ===== REGISTER OWNER =====
  const handleRegister = async (e: any) => {
    e.preventDefault();

    if (!otp) return setError("Enter OTP");

    try {
      setLoading(true);

      // Step 1 — Verify OTP
      const verifyRes = await fetch("http://localhost:9092/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.verified)
        return setError("Invalid OTP");

      // Step 2 — Register owner (role = 2)
      const regRes = await fetch("http://localhost:9092/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: { id: 2 },
        }),
      });

      const regData = await regRes.json();
      if (!regRes.ok) return setError(regData.message || "Registration failed");

      router.push("/auth/login");

    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/your-bg-image.jpeg')" }}
    >
      <DDCard className="max-w-md w-full p-6 bg-white/90 backdrop-blur-xl">
        
        <h1 className="text-3xl text-center font-bold mb-1 text-gray-900">
          Dwell Discover
        </h1>
        <p className="text-center text-gray-600 mb-6 text-lg font-medium">
          Owner Registration
        </p>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleRegister}>

          {/* Name */}
          <label className="text-black text-sm font-semibold">Full Name</label>
          <input
            type="text"
            placeholder="Enter full name"
            className="w-full p-3 rounded-md border mb-4 text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Email */}
          <label className="text-black text-sm font-semibold">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full p-3 rounded-md border mb-2 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <DDButton
            text={
              otpSent
                ? timer > 0
                  ? `Resend OTP (${timer}s)`
                  : "Resend OTP"
                : "Get OTP"
            }
            onClick={handleSendOtp}
            disabled={loading || (otpSent && timer > 0)}
            className="w-full mb-4 bg-green-600"
          />

          {/* OTP */}
          {otpSent && (
            <>
              <label className="text-black text-sm font-semibold">
                Enter OTP
              </label>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full p-3 rounded-md border mb-4 text-black"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </>
          )}

          {/* Password */}
          <label className="text-black text-sm font-semibold">Password</label>
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="w-full p-3 rounded-md border text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit Button */}
          <DDButton
            text={loading ? "Registering..." : "Register as Owner"}
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          />

        </form>

        <p className="text-center text-gray-700 mt-4 text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-green-700 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </DDCard>
    </div>
  );
}

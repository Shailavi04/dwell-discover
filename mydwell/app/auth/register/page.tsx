"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("2");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);

  const startTimer = () => {
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) clearInterval(interval);
        return prev - 1;
      });
    }, 1000);
  };

  // STEP 1 — SEND OTP (real backend)
  const handleSendOtp = async () => {
    setError("");

    if (!name || !email || !password) {
      setError("Please fill all fields before requesting OTP.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:9092/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send OTP.");
        return;
      }

      setOtpSent(true);
      startTimer();
    } catch (err) {
      setError("Unable to send OTP. Server error.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 — VERIFY OTP + REGISTER
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otp) {
      setError("Please enter OTP.");
      return;
    }

    try {
      setLoading(true);

      // Verify OTP FIRST
      const verifyRes = await fetch("http://localhost:9092/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || verifyData.verified !== true) {
        setError(verifyData.message || "Invalid OTP.");
        return;
      }

      // OTP VERIFIED → Register user
      const registerRes = await fetch("http://localhost:9092/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: { id: Number(role) },
        }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        setError(registerData.message || "Registration failed.");
        return;
      }

      router.push("/auth/login");
    } catch (err) {
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
        Create an Account 🌟
      </h1>
      <p className="text-center text-sm text-gray-500 mb-8">
        Join the Dwell Discover platform today
      </p>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      <form onSubmit={handleRegister}>
        {/* NAME */}
        <div className="mb-5">
          <label className="block text-gray-600 mb-1 font-medium">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full text-black border rounded-lg p-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* EMAIL */}
        <div className="mb-5">
          <label className="block text-gray-600 mb-1 font-medium">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full text-black border rounded-lg p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-5 relative">
          <label className="block text-gray-600 mb-1 font-medium">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full text-black border rounded-lg p-3 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[42px] text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* ROLE */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-1 font-medium">Role</label>
          <select
            className="w-full text-black border rounded-lg p-3"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="2">Owner</option>
            <option value="1">Admin</option>
          </select>
        </div>

        {/* OTP INPUT AFTER SENDING */}
        {otpSent && (
          <div className="mb-6">
            <label className="block text-gray-600 mb-1 font-medium">
              Enter OTP
            </label>
            <input
              type="text"
              placeholder="Enter the OTP sent to your email"
              className="w-full text-black border rounded-lg p-3"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        )}

        {/* BUTTON SECTION */}
        {!otpSent ? (
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Sending OTP..." : "Get OTP"}
          </button>
        ) : (
          <>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {loading ? "Verifying..." : "Verify OTP & Register"}
            </button>

            <p className="text-center text-gray-600 text-sm mt-3">
              Didn’t get OTP?
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={timer > 0}
                className={`ml-1 font-semibold ${
                  timer > 0 ? "text-gray-400" : "text-blue-600 hover:underline"
                }`}
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
              </button>
            </p>
          </>
        )}
      </form>

      <p className="text-center text-gray-600 text-sm mt-6">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-green-600 font-semibold hover:underline"
        >
          Login here
        </Link>
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../MyComponents/Footer";
import HiddenNav from "../../MyComponents/HiddenNav";
import { Eye, EyeOff, User } from "lucide-react";

const UserRegister = () => {
  const router = useRouter();

  // Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // State
  const [otpSent, setOtpSent] = useState(false);
  const [isCodeInputEnabled, setIsCodeInputEnabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  // Timer
  const startTimer = () => {
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) clearInterval(interval);
        return prev - 1;
      });
    }, 1000);
  };

  // -------------------------------
  // SEND OTP
  // -------------------------------
  const handleSendOtp = async () => {
    if (!email || !name || !password) {
      setVerificationMessage("Please fill all fields before requesting OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:9092/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setVerificationMessage(data.message || "Failed to send OTP");
        setLoading(false);
        return;
      }

      setOtpSent(true);
      setIsCodeInputEnabled(true);
      startTimer();
      setVerificationMessage("OTP sent to your email!");
    } catch (err) {
      setVerificationMessage("Error sending OTP");
    }

    setLoading(false);
  };

  // -------------------------------
  // VERIFY OTP
  // -------------------------------
  const handleVerifyOtp = async () => {
    if (!otp) {
      setVerificationMessage("Please enter OTP");
      return;
    }

    try {
      const res = await fetch("http://localhost:9092/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok || data.verified !== true) {
        setVerificationMessage("Invalid OTP");
        return;
      }

      setVerificationMessage("OTP Verified Successfully!");
    } catch (err) {
      setVerificationMessage("Error verifying OTP");
    }
  };

  // -------------------------------
  // REGISTER OWNER
  // -------------------------------
  const handleRegister = async () => {
    if (!otp || !password || !name) {
      alert("Please enter all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:9092/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: { id: 3 }, // student role
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      alert("Registeration successfully!");
      router.push("/");
    } catch (err) {
      alert("Error in registering ");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center relative"
      style={{ backgroundImage: "url('/your-bg-image.jpeg')" }}
    >
      {/* NAVBAR */}
      <div className="w-full flex justify-between items-center px-6 pt-4">
        <HiddenNav />
      </div>

      {/* CENTER FORM */}
      <div className="w-full flex justify-center lg:justify-end px-4 mb-8">
        <div className="bg-[rgba(0,0,0,0.3)] p-8 rounded-lg shadow-md w-full max-w-md lg:absolute lg:right-40 lg:top-1/2 lg:-translate-y-1/2 mb-20">

          <h2 className="text-4xl font-bold text-center text-teal-500 mb-2">Dwell Discover</h2>
          {/* FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            {/* Name */}
            <div className="mb-4">
              <label className="text-sm text-black font-medium">Name</label>
              <input
                type="text"
                className="w-full mt-2 p-3 border border-white rounded-md text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="text-sm text-black font-medium">Email</label>
              <input
                type="email"
                className="w-full mt-2 p-3 border border-white rounded-md text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />

              {/* Send OTP */}
              <button
                type="button"
                onClick={handleSendOtp}
                className="mt-2 px-4 py-2 rounded-md bg-green-500 hover:bg-green-400 text-white font-semibold"
                disabled={loading}
              >
                {otpSent ? `Resend OTP (${timer}s)` : "Get OTP"}
              </button>
            </div>

            {/* OTP */}
            <div className="mb-4">
              <label className="text-sm text-black font-medium">Enter OTP</label>
              <input
                type="text"
                className="w-full mt-2 p-3 border border-white rounded-md text-white"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                disabled={!isCodeInputEnabled}
              />
            </div>

            {/* Verify OTP */}
            {isCodeInputEnabled && (
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full py-3 bg-blue-500 hover:bg-blue-400 rounded-md text-white font-semibold"
              >
                Verify OTP
              </button>
            )}

            {/* Password */}
            <div className="mb-4 mt-4">
              <label className="text-sm text-black font-medium">Password</label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full mt-2 p-3 border border-white rounded-md text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[22px] text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Verification message */}
            {verificationMessage && (
              <p
                className={`text-sm mt-2 ${
                  verificationMessage.includes("Invalid") ? "text-red-500" : "text-green-500"
                }`}
              >
                {verificationMessage}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className={`w-full mt-4 py-3 rounded-md text-white font-semibold ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserRegister;

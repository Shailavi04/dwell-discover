"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const email = useSearchParams().get("email") || "";
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

      useEffect(() => {
          const token = localStorage.getItem("token");
          if (token) {
              router.replace("/panel/dashboard"); // redirect to dashboard
          }
      }, []);
  

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch("http://localhost:9092/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword: password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Failed to reset password");
      return;
    }

    setMessage("Password reset successfully! Redirecting to login...");

    setTimeout(() => router.push("/auth/login"), 1500);
  };

  return (
    <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md mx-auto mt-20">
      <h1 className="text-4xl font-extrabold text-center text-green-600 mb-3">
        Reset Password 🔐
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Create a new password for your account
      </p>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center font-medium">
          {error}
        </p>
      )}
      {message && (
        <p className="text-green-600 text-sm mb-4 text-center font-medium">
          {message}
        </p>
      )}

      <form onSubmit={handleReset}>

        {/* Email (read-only) */}
        <div className="mb-5">
          <label className="block text-gray-700 mb-2 font-semibold">Email</label>
          <input
            disabled
            value={email}
            className="w-full text-black border border-gray-300 rounded-xl p-3 bg-gray-200 cursor-not-allowed"
          />
        </div>

        {/* New Password */}
        <div className="mb-5 relative">
          <label className="block text-gray-700 mb-2 font-semibold">
            New Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full text-black border border-gray-300 rounded-xl p-3 pr-12"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Eye icon */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[43px] text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="mb-6 relative">
          <label className="block text-gray-700 mb-2 font-semibold">
            Confirm Password
          </label>
          <input
            type={showConfirm ? "text" : "password"}
            className="w-full text-black border border-gray-300 rounded-xl p-3 pr-12"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          {/* Eye icon */}
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-[43px] text-gray-500 hover:text-gray-700"
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-lg transition-transform transform hover:scale-[1.02]"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function PanelLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/panel/dashboard"); // redirect to dashboard if already logged in
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:9092/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ Save role as string so redirects work
      localStorage.setItem("role", data.role);

      // ✅ Save permissions as JSON array
      localStorage.setItem("permissions", JSON.stringify(data.permissions || []));

      // ✅ Save token
      localStorage.setItem("token", data.token);

      alert("Login successful!");

      // Redirect based on role
      if (data.role === "ADMIN") router.push("/panel/rooms");
      else if (data.role === "OWNER") router.push("/panel/owners");
      else router.push("/panel");
    } catch (err) {
      console.error(err);
      setError("Server not reachable. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-3">
        Welcome Back 👋
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Sign in to manage listings and users
      </p>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center font-medium">
          {error}
        </p>
      )}

      <form onSubmit={handleLogin}>
        <div className="mb-5">
          <label className="block text-gray-700 mb-2 font-semibold">Email</label>
          <input
            type="email"
            className="w-full text-black border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700 mb-2 font-semibold">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full text-black border border-gray-300 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[43px] text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* 🔵 FORGOT PASSWORD LINK */}
        <div className="text-right mb-6">
          <button
            type="button"
            onClick={() => router.push("/auth/forgot-password")}
            className="text-blue-700 font-semibold text-sm hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold text-lg transition-transform transform hover:scale-[1.02]"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Don’t have an account?{" "}
        <a href="/auth/register" className="text-blue-700 font-semibold hover:underline">
          Register
        </a>
      </p>
    </div>
  );
}

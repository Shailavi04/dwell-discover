'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '../../MyComponents/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:9092/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email or password!");
        setIsLoading(false);
        return;
      }

      // ✔ match backend response structure
      if (data.role !== "STUDENT") {
        setError("Only students can log in from this page!");
        setIsLoading(false);
        return;
      }

      // ✔ save only what backend sends
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userName", data.name); 

      alert("Login successful!");
      router.push("/");

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage: 'url(/your-bg-image.jpeg)',
        backgroundSize: 'cover',
      }}
    >
      <div className="flex-grow flex items-center justify-center lg:justify-end lg:items-center mt-20 lg:mt-0">
        <div
          className="bg-[rgba(0,0,0,0.3)] p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm mx-4
                     lg:mx-0 lg:mr-40"
        >
          <h2 className="text-4xl font-bold mb-2 text-center text-teal-500">Dwell Discover</h2>
          <h2 className="text-2xl font-bold mb-6 text-center text-teal-950">Login</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-white">Email</label>
              <input
                type="email"
                className="w-full mt-2 p-3 border border-gray-300 rounded-md text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-white">Password</label>
              <input
                type="password"
                className="w-full mt-2 p-3 border border-gray-300 rounded-md text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Forgot Password */}
            <div className="mb-4 text-right">
              <Link
                href="/ForgetPassword"
                className="text-blue-600 text-sm hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full mt-2 py-3 rounded-md ${isLoading ? 'bg-gray-400' : 'bg-green-500 hover:bg-[rgba(0,0,0,0.3)]'
                } text-white font-semibold`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging In...' : 'Login'}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;

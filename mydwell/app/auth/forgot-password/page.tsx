"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            router.replace("/panel/dashboard"); // redirect to dashboard
        }
    }, []);



    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email) {
            setError("Please enter your email");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://localhost:9092/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            let data;
            try {
                data = await res.json();
            } catch (error) {
                console.error("Invalid JSON from server");
                throw new Error("Server not reachable");
            }

            if (!res.ok) {
                setError(data.error || "Failed to send reset link");
                setLoading(false);
                return;
            }

            setMessage("A password reset OTP has been sent to your email.");
            router.push(`/auth/verify-otp?email=${email}`);
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
                Forgot Password 🔐
            </h1>
            <p className="text-center text-gray-500 mb-8">
                Enter your email and we’ll send you a reset OTP.
            </p>

            {error && (
                <p className="text-red-500 text-sm mb-4 text-center font-medium">{error}</p>
            )}

            {message && (
                <p className="text-green-600 text-sm mb-4 text-center font-medium">
                    {message}
                </p>
            )}

            <form onSubmit={handleForgotPassword}>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-semibold">Email</label>
                    <input
                        type="email"
                        className="w-full text-black border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold text-lg transition-transform transform hover:scale-[1.02]"
                >
                    {loading ? "Sending..." : "Send OTP"}
                </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
                Remembered your password?{" "}
                <a href="/auth/login" className="text-blue-700 font-semibold hover:underline">
                    Login
                </a>
            </p>
        </div>
    );
}

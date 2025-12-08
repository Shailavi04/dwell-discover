"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/app/student-ui/MyComponents/Logo";
import AuthButton from "./AuthButton";
import { User, LogOut, Settings } from "lucide-react";

interface HeaderProps {
  authButton?: "login" | "register";
  showAuthButton?: boolean;
}

export default function Header({
  authButton = "login",
  showAuthButton = true,
}: HeaderProps) {
  const router = useRouter();

  // state to store token
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/auth/login");
  };

  const buttonText = authButton === "login" ? "Login" : "Register";
  const buttonHref =
    authButton === "login" ? "/auth/login" : "/auth/register";
  const buttonColor =
    authButton === "login" ? "bg-blue-700" : "bg-green-600";

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-transparent border-b border-gray-200">
      <Logo />

      {/* If NOT logged in → Show Login/Register buttons */}
      {!isLoggedIn && showAuthButton && (
        <AuthButton text={buttonText} href={buttonHref} color={buttonColor} />
      )}

      {/* If Logged In → Show Profile Dropdown */}
      {isLoggedIn && (
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-full border bg-gray-100 hover:bg-gray-200 transition"
          >
            <User size={22} className="text-gray-700" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 border">
              <button
                className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                onClick={() => router.push("/panel/profile")}
              >
                <User size={16} /> Profile
              </button>

              <button
                className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                onClick={() => router.push("/panel/settings")}
              >
                <Settings size={16} /> Settings
              </button>

              <hr className="my-1" />

              <button
                className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-100 transition"
                onClick={handleLogout}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

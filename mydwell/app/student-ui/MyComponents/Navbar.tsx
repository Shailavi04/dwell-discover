"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import LoginButton from "./LoginButton";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isStudent, setIsStudent] = useState(false);
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("userName");

    if (role === "STUDENT") {
      setIsStudent(true);
      setUserName(name || "");
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/student-ui/Login");
  };

  return (
    <nav className="flex items-center justify-between px-4 sm:px-8 py-2 bg-transparent pt-15">
      <Logo />

      <div className="mt-0 mr-0 relative">
        {/* If NOT logged in → Login Button */}
        {!isStudent && <LoginButton />}

        {/* If Logged In → User Icon + Dropdown */}
        {isStudent && (
          <div className="relative">
            {/* USER BUTTON */}
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
            >
              <User size={20} className="text-teal-800" />
              <span className="font-semibold text-teal-900">{userName}</span>
            </button>

            {/* DROPDOWN MENU */}
            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 border z-50">
                <button
                  className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => router.push("/student-ui/profile")}
                >
                  <User size={16} /> Profile
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
      </div>
    </nav>
  );
}

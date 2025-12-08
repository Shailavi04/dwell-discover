"use client";

import Header from "../panel/components/Header";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // If the path includes 'register', show "Login" button
  // If the path includes 'login', show "Register" button
  const authButton = pathname.includes("register") ? "login" : "register";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header authButton={authButton} />
      <main className="flex justify-center items-start mt-20 mb-16">
        {children}
      </main>
    </div>
  );
}

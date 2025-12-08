"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) return <p className="text-center p-10">Checking authentication...</p>;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* SIDEBAR → independent scroll */}
      <div className="w-64 bg-purple-900 text-white overflow-y-auto">
        <Sidebar />
      </div>

      {/* MAIN AREA → vertical scroll */}
      <div className="flex-1 flex flex-col overflow-hidden">

        <Header showAuthButton={false} />

        {/* Content scrolls separately */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>
    </div>
  );
}

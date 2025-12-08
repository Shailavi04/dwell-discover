"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
  allowedPermissions = [],
}: {
  children: React.ReactNode;
  allowedPermissions: string[];
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token");
    const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

    if (!token) {
      router.replace("/panel/dashboard");
      return;
    }

    const hasAccess =
      allowedPermissions.length === 0 ||
      allowedPermissions.some((p) => permissions.includes(p));

    if (!hasAccess) {
      router.replace("/panel/dashboard");
      return;
    }

    setChecking(false); // ⬅ allow page to render
  }, [router, allowedPermissions]);

  if (checking) return null; // ⬅ hide protected page until check is complete

  return <>{children}</>;
}

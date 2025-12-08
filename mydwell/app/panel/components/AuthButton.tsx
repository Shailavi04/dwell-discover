"use client";

import Link from "next/link";

interface AuthButtonProps {
  text: string; // e.g., "Login" or "Register"
  href: string; // where the button should go
  color?: string; // any Tailwind or custom color class, e.g. "bg-blue-700"
}

export default function AuthButton({
  text,
  href,
  color = "bg-blue-700", // default color
}: AuthButtonProps) {
  return (
    <Link href={href}>
      <button
        className={`text-lg text-white px-10 py-3 ${color} drop-shadow-2xl shadow-lg rounded hover:opacity-90 transition`}
      >
        {text}
      </button>
    </Link>
  );
}

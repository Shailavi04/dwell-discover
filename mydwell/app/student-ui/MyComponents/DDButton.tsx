"use client";

interface DDButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}

export default function DDButton({
  text,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: DDButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-md font-semibold transition duration-300 
                  ${disabled ? "bg-gray-400" : "bg-green-600 hover:bg-green-500"} 
                  text-white ${className}`}
    >
      {text}
    </button>
  );
}

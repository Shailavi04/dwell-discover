"use client";

import Image from "next/image";

interface DDCardProps {
  image?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function DDCard({
  image,
  title,
  subtitle,
  description,
  className = "",
  children,
}: DDCardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 ${className}`}
    >
      {/* IMAGE – dynamic height */}
      {image && (
        <div className="relative w-full h-auto">
          <Image
            src={image}
            alt={title || "listing image"}
            width={800}
            height={500}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* CONTENT */}
      <div className="p-4">
        {title && (
          <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        )}

        {subtitle && (
          <p className="text-gray-500 text-sm mb-1">{subtitle}</p>
        )}

        {description && (
          <p className="text-green-700 font-semibold mb-2">{description}</p>
        )}

        {/* BUTTONS OR EXTRA CONTENT */}
        {children}
      </div>
    </div>
  );
}

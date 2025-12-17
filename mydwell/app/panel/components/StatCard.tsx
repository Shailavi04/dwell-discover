import { ReactNode } from "react";

export default function StatCard({
  title,
  value,
  icon,
  gradient,
  danger = false,
}: {
  title: string;
  value: string;
  icon: ReactNode;
  gradient: string;
  danger?: boolean;
}) {
  return (
    <div className="relative rounded-2xl bg-white shadow-lg p-5 overflow-hidden hover:scale-[1.02] transition">
      
      {/* Gradient Strip */}
      <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${gradient}`} />

      {/* Icon */}
      <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r ${gradient} text-white mb-4`}>
        {icon}
      </div>

      {/* Content */}
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-3xl font-bold ${danger ? "text-red-600" : "text-gray-900"}`}>
        {value}
      </p>
    </div>
  );
}

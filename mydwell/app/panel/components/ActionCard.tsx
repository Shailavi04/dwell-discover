interface ActionCardProps {
  title: string;
  onClick?: () => void;
}

export default function ActionCard({ title, onClick }: ActionCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-5 shadow hover:shadow-xl hover:scale-[1.02] transition cursor-pointer"
    >
      <p className="font-semibold text-gray-900">{title}</p>
      <p className="text-sm text-gray-500 mt-1">
        Click to continue →
      </p>
    </div>
  );
}

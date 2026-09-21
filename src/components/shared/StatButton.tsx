import React from 'react';

interface StatButtonProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  onClick?: () => void;
  color?: 'purple' | 'emerald' | 'amber' | 'blue' | 'stone';
}

export const StatButton: React.FC<StatButtonProps> = ({
  icon,
  value,
  label,
  onClick,
  color = 'amber',
}) => {
  const COLOR_MAP = {
    purple: 'text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200',
    emerald: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200',
    amber: 'text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-200',
    blue: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200',
    stone: 'text-stone-700 bg-stone-50 hover:bg-stone-100 border-stone-200',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2.5 rounded-2xl border flex items-center gap-2.5 transition-all text-left shadow-2xs group ${COLOR_MAP[color]}`}
    >
      <div className="text-current group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <div className="text-xs font-black leading-tight text-stone-900 font-mono">
          {value}
        </div>
        <div className="text-[10px] text-stone-500 font-medium leading-none mt-0.5">
          {label}
        </div>
      </div>
    </button>
  );
};

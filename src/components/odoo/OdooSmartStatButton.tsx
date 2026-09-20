import React from 'react';

interface OdooSmartStatButtonProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  onClick?: () => void;
  color?: 'purple' | 'emerald' | 'amber' | 'blue' | 'stone';
}

export const OdooSmartStatButton: React.FC<OdooSmartStatButtonProps> = ({
  icon,
  value,
  label,
  onClick,
  color = 'purple',
}) => {
  const COLOR_MAP = {
    purple: 'text-[#714B67] bg-[#714B67]/5 hover:bg-[#714B67]/10 border-[#714B67]/20',
    emerald: 'text-[#00A09D] bg-[#00A09D]/5 hover:bg-[#00A09D]/10 border-[#00A09D]/20',
    amber: 'text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-200',
    blue: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200',
    stone: 'text-stone-700 bg-stone-50 hover:bg-stone-100 border-stone-200',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-xl border flex items-center gap-2.5 transition-all text-left shadow-2xs group ${COLOR_MAP[color]}`}
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

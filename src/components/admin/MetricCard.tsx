import React from 'react';

export type MetricColor = 'emerald' | 'amber' | 'blue' | 'orange' | 'purple' | 'rose' | 'stone';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: MetricColor;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  badge?: string;
  progress?: {
    current: number;
    total: number;
  };
  className?: string;
}

const COLOR_MAP: Record<
  MetricColor,
  {
    bgIcon: string;
    textIcon: string;
    borderCard: string;
    accentGlow: string;
    lightBg: string;
  }
> = {
  emerald: {
    bgIcon: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    textIcon: 'text-emerald-600',
    borderCard: 'hover:border-emerald-300/80',
    accentGlow: 'from-emerald-500/10 to-transparent',
    lightBg: 'bg-emerald-500/5',
  },
  amber: {
    bgIcon: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    textIcon: 'text-amber-600',
    borderCard: 'hover:border-amber-300/80',
    accentGlow: 'from-amber-500/10 to-transparent',
    lightBg: 'bg-amber-500/5',
  },
  blue: {
    bgIcon: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    textIcon: 'text-blue-600',
    borderCard: 'hover:border-blue-300/80',
    accentGlow: 'from-blue-500/10 to-transparent',
    lightBg: 'bg-blue-500/5',
  },
  orange: {
    bgIcon: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    textIcon: 'text-orange-600',
    borderCard: 'hover:border-orange-300/80',
    accentGlow: 'from-orange-500/10 to-transparent',
    lightBg: 'bg-orange-500/5',
  },
  purple: {
    bgIcon: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    textIcon: 'text-purple-600',
    borderCard: 'hover:border-purple-300/80',
    accentGlow: 'from-purple-500/10 to-transparent',
    lightBg: 'bg-purple-500/5',
  },
  rose: {
    bgIcon: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    textIcon: 'text-rose-600',
    borderCard: 'hover:border-rose-300/80',
    accentGlow: 'from-rose-500/10 to-transparent',
    lightBg: 'bg-rose-500/5',
  },
  stone: {
    bgIcon: 'bg-stone-500/10 text-stone-700 border-stone-500/20',
    textIcon: 'text-stone-700',
    borderCard: 'hover:border-stone-300/80',
    accentGlow: 'from-stone-500/10 to-transparent',
    lightBg: 'bg-stone-500/5',
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'amber',
  trend,
  badge,
  progress,
  className = '',
}) => {
  const styles = COLOR_MAP[color] || COLOR_MAP.amber;

  return (
    <div
      className={`relative bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group ${styles.borderCard} ${className}`}
    >
      {/* Subtle top gradient glow */}
      <div
        className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${styles.accentGlow}`}
      />

      <div>
        {/* Header: Title & Icon */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block truncate">
            {title}
          </span>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-transform duration-200 group-hover:scale-105 shrink-0 ${styles.bgIcon}`}
          >
            {icon}
          </div>
        </div>

        {/* Big Metric Value */}
        <div className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-none mb-1">
          {value}
        </div>

        {/* Optional Progress Bar */}
        {progress && (
          <div className="mt-2.5">
            <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-600 h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(0, (progress.current / progress.total) * 100))}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer: Trend or Subtitle or Badge */}
      <div className="flex items-center justify-between gap-2 pt-2.5 mt-2 border-t border-stone-100 text-xs">
        {subtitle && (
          <span className="text-stone-500 text-[11px] font-medium truncate">
            {subtitle}
          </span>
        )}

        {trend && (
          <div className="flex items-center gap-1.5 ml-auto">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight ${
                trend.isPositive !== false
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {trend.isPositive !== false ? '↑' : '↓'} {trend.value}
            </span>
            {trend.label && (
              <span className="text-[10px] text-stone-400 hidden sm:inline">
                {trend.label}
              </span>
            )}
          </div>
        )}

        {badge && !trend && (
          <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};

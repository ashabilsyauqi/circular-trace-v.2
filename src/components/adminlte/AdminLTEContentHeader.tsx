import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface AdminLTEContentHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  homePath?: string;
}

export const AdminLTEContentHeader: React.FC<AdminLTEContentHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs = [{ label: 'Admin', path: '/admin/overview' }],
  homePath = '/admin/overview',
}) => {
  return (
    <div className="py-3.5 px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-200/80 bg-white shadow-2xs">
      <div className="min-w-0 flex-1">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <span>{title}</span>
        </h1>
        {subtitle && <p className="text-xs text-stone-500 mt-0.5 max-w-4xl">{subtitle}</p>}
      </div>

      {/* Breadcrumbs (Classic AdminLTE Right-aligned) */}
      <nav className="flex items-center gap-1.5 text-xs text-stone-500 font-medium overflow-x-auto whitespace-nowrap shrink-0 py-1 md:py-0">
        <Link to={homePath} className="hover:text-amber-800 transition-colors flex items-center gap-1 shrink-0">
          <Home className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span>Home</span>
        </Link>

        {breadcrumbs.map((b, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
            {b.path ? (
              <Link to={b.path} className="hover:text-amber-800 transition-colors shrink-0">
                {b.label}
              </Link>
            ) : (
              <span className="text-stone-900 font-semibold shrink-0">{b.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};

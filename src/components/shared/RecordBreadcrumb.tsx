import React from 'react';
import { ChevronRight } from 'lucide-react';

interface RecordBreadcrumbProps {
  listLabel: string;
  recordLabel: string;
  onBack: () => void;
}

// Breadcrumb for a record detail page: "List Name / RECORD-ID",
// where the list segment is clickable to go back to the list view.
export const RecordBreadcrumb: React.FC<RecordBreadcrumbProps> = ({ listLabel, recordLabel, onBack }) => (
  <nav className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 mb-3">
    <button onClick={onBack} className="hover:text-amber-700 hover:underline transition-colors">
      {listLabel}
    </button>
    <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
    <span className="font-bold text-stone-900 text-sm font-mono">{recordLabel}</span>
  </nav>
);

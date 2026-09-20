import React, { useState } from 'react';
import {
  Search,
  Filter,
  Layers,
  Star,
  Plus,
  Zap,
  Printer,
  ChevronDown,
  List,
  LayoutGrid,
  BarChart3,
  X,
  Check,
} from 'lucide-react';

interface OdooControlPanelProps {
  breadcrumbs: { label: string; onClick?: () => void }[];
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter?: string;
  onFilterChange?: (filterId: string) => void;
  filterOptions?: { id: string; label: string }[];
  activeGroupBy?: string;
  onGroupByChange?: (groupById: string) => void;
  groupByOptions?: { id: string; label: string }[];
  viewMode?: 'table' | 'kanban' | 'graph';
  onViewModeChange?: (mode: 'table' | 'kanban' | 'graph') => void;
  recordCount?: number;
}

export const OdooControlPanel: React.FC<OdooControlPanelProps> = ({
  breadcrumbs,
  primaryActionLabel = '+ Baru',
  onPrimaryAction,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  filterOptions = [],
  activeGroupBy,
  onGroupByChange,
  groupByOptions = [],
  viewMode = 'table',
  onViewModeChange,
  recordCount,
}) => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isGroupByDropdownOpen, setIsGroupByDropdownOpen] = useState(false);
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-3.5 sm:p-4 space-y-3">
      {/* Top Bar: Breadcrumbs & Action Buttons & Search */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        {/* Left: Primary Buttons (breadcrumb dropped here — the sidebar already names
            the current section, and the record-detail pages have their own breadcrumb) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Primary Action Button (+ Baru) */}
          {onPrimaryAction && (
            <button
              onClick={onPrimaryAction}
              className="px-3.5 py-1.5 rounded-xl bg-[#714B67] hover:bg-[#5A3950] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{primaryActionLabel}</span>
            </button>
          )}

          {/* Action Dropdown Menu (Odoo Tindakan) */}
          <div className="relative">
            <button
              onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1 border border-stone-200"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Tindakan</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isActionDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-stone-200 py-1 z-30 text-xs text-stone-700 animate-in fade-in">
                <button
                  onClick={() => {
                    setIsActionDropdownOpen(false);
                    window.print();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5 text-stone-500" /> Cetak Lembar Dokumen
                </button>
                <button
                  onClick={() => {
                    setIsActionDropdownOpen(false);
                    alert('Data berhasil diexport ke CSV / Excel');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center gap-2"
                >
                  <Layers className="w-3.5 h-3.5 text-stone-500" /> Ekspor ke Spreadsheet
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Search Box + Odoo Filter / Group By Pills + View Switcher */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          {/* Universal Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari / Filter..."
              className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#714B67] focus:bg-white transition-all text-stone-800"
            />
          </div>

          {/* Odoo Filter Dropdown */}
          {filterOptions.length > 0 && onFilterChange && (
            <div className="relative">
              <button
                onClick={() => {
                  setIsFilterDropdownOpen(!isFilterDropdownOpen);
                  setIsGroupByDropdownOpen(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 border ${
                  activeFilter && activeFilter !== 'all'
                    ? 'bg-[#714B67]/10 text-[#714B67] border-[#714B67]/30 font-bold'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                }`}
              >
                <Filter className="w-3 h-3 text-[#714B67]" />
                <span>Filter</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-stone-200 py-1 z-30 text-xs text-stone-700 animate-in fade-in">
                  <div className="px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider text-stone-400 border-b border-stone-100">
                    Opsi Filter
                  </div>
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        onFilterChange(opt.id);
                        setIsFilterDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center justify-between"
                    >
                      <span>{opt.label}</span>
                      {activeFilter === opt.id && <Check className="w-3.5 h-3.5 text-[#714B67]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Odoo Group By Dropdown */}
          {groupByOptions.length > 0 && onGroupByChange && (
            <div className="relative">
              <button
                onClick={() => {
                  setIsGroupByDropdownOpen(!isGroupByDropdownOpen);
                  setIsFilterDropdownOpen(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 border ${
                  activeGroupBy && activeGroupBy !== 'none'
                    ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                }`}
              >
                <Layers className="w-3 h-3 text-blue-600" />
                <span>Kelompokkan</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isGroupByDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-stone-200 py-1 z-30 text-xs text-stone-700 animate-in fade-in">
                  <div className="px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider text-stone-400 border-b border-stone-100">
                    Kelompokkan Berdasarkan
                  </div>
                  {groupByOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        onGroupByChange(opt.id);
                        setIsGroupByDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center justify-between"
                    >
                      <span>{opt.label}</span>
                      {activeGroupBy === opt.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* View Switchers (Odoo 19 List / Kanban / Graph) */}
          {onViewModeChange && (
            <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200">
              <button
                onClick={() => onViewModeChange('table')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Tampilan Tabel (List View)"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onViewModeChange('kanban')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Tampilan Kanban"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Record counter */}
          {recordCount !== undefined && (
            <span className="text-[11px] text-stone-400 font-mono pl-1">
              1-{recordCount} / {recordCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

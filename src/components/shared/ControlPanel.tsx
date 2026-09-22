import React, { useState } from 'react';
import {
  Search,
  Filter,
  Layers,
  Plus,
  Zap,
  Printer,
  ChevronDown,
  List,
  LayoutGrid,
  Check,
  FileSpreadsheet,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface ControlPanelProps {
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

export const ControlPanel: React.FC<ControlPanelProps> = ({
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
    <header className="o_control_panel rounded-2xl border border-slate-200/90 shadow-2xs mb-4 bg-white">
      {/* Tier 1: Breadcrumbs (Left) & Search View Box (Right) */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-2.5">
        {/* Breadcrumb path */}
        <div className="flex items-center gap-1.5 o_breadcrumb min-w-0">
          {breadcrumbs.map((bc, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-300 font-normal">/</span>}
              {bc.onClick ? (
                <button
                  onClick={bc.onClick}
                  className="text-slate-600 hover:text-blue-700 font-semibold transition-colors cursor-pointer truncate"
                >
                  {bc.label}
                </button>
              ) : (
                <span className={idx === breadcrumbs.length - 1 ? 'text-slate-900 font-bold truncate' : 'text-slate-500 font-medium truncate'}>
                  {bc.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Live Search View Box */}
        <div className="o_searchview">
          <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search... (Filter data tabel)"
            className="o_searchview_input"
          />
        </div>
      </div>

      {/* Tier 2: Action Buttons (Left) & Pager + View Switchers (Right) */}
      <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-slate-100">
        {/* Left: Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Primary Action Button */}
          {onPrimaryAction && (
            <button
              onClick={onPrimaryAction}
              className="btn-odoo-primary"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{primaryActionLabel}</span>
            </button>
          )}

          {/* Action / Tindakan Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setIsActionDropdownOpen(!isActionDropdownOpen);
                setIsFilterDropdownOpen(false);
                setIsGroupByDropdownOpen(false);
              }}
              className="btn-odoo-secondary"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Tindakan</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isActionDropdownOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setIsActionDropdownOpen(false)} />
                <div className="absolute left-0 mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 text-xs text-slate-700 animate-in fade-in">
                  <button
                    onClick={() => {
                      setIsActionDropdownOpen(false);
                      window.print();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" /> Cetak Lembar Dokumen
                  </button>
                  <button
                    onClick={() => {
                      setIsActionDropdownOpen(false);
                      alert('Data berhasil diexport ke CSV / Spreadsheet');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Ekspor Spreadsheet Excel
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Filter Dropdown */}
          {filterOptions.length > 0 && onFilterChange && (
            <div className="relative">
              <button
                onClick={() => {
                  setIsFilterDropdownOpen(!isFilterDropdownOpen);
                  setIsGroupByDropdownOpen(false);
                  setIsActionDropdownOpen(false);
                }}
                className={`btn-odoo-secondary ${
                  activeFilter && activeFilter !== 'all'
                    ? 'border-blue-300 bg-blue-50 text-blue-800'
                    : ''
                }`}
              >
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <span>Filter</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isFilterDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsFilterDropdownOpen(false)} />
                  <div className="absolute left-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 text-xs text-slate-700 animate-in fade-in">
                    <div className="px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      Opsi Filter Data
                    </div>
                    {filterOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          onFilterChange(opt.id);
                          setIsFilterDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between font-medium cursor-pointer"
                      >
                        <span>{opt.label}</span>
                        {activeFilter === opt.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Group By Dropdown */}
          {groupByOptions.length > 0 && onGroupByChange && (
            <div className="relative">
              <button
                onClick={() => {
                  setIsGroupByDropdownOpen(!isGroupByDropdownOpen);
                  setIsFilterDropdownOpen(false);
                  setIsActionDropdownOpen(false);
                }}
                className={`btn-odoo-secondary ${
                  activeGroupBy && activeGroupBy !== 'none'
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-800'
                    : ''
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Kelompokkan</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isGroupByDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsGroupByDropdownOpen(false)} />
                  <div className="absolute left-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 text-xs text-slate-700 animate-in fade-in">
                    <div className="px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      Kelompokkan Berdasarkan
                    </div>
                    {groupByOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          onGroupByChange(opt.id);
                          setIsGroupByDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between font-medium cursor-pointer"
                      >
                        <span>{opt.label}</span>
                        {activeGroupBy === opt.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Record Counter & View Mode Switcher */}
        <div className="flex items-center gap-3">
          {recordCount !== undefined && (
            <span className="text-xs text-slate-500 font-mono">
              1-{recordCount} / {recordCount}
            </span>
          )}

          {onViewModeChange && (
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => onViewModeChange('table')}
                className={`px-2 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-700 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tampilan List View (Tabel ERP)"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tabel</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('kanban')}
                className={`px-2 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'kanban'
                    ? 'bg-white text-blue-700 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tampilan Kanban (Kartu)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kanban</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


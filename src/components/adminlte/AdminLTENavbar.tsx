import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import {
  Menu,
  Bell,
  Search,
  Maximize2,
  Minimize2,
  LogOut,
  User,
  ShieldCheck,
  ChevronDown,
  Building2,
  ExternalLink,
  Store,
} from 'lucide-react';
import { ROLE_DETAILS } from '../../constants/roles';

interface AdminLTENavbarProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export const AdminLTENavbar: React.FC<AdminLTENavbarProps> = ({
  onToggleSidebar,
  isSidebarCollapsed,
}) => {
  const { currentUser, logout, transactions, users } = useCoffee();
  const navigate = useNavigate();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentRoleInfo = currentUser ? ROLE_DETAILS[currentUser.role] : null;
  const recentTransactions = transactions.slice(0, 4);

  return (
    <nav className="h-14 bg-white border-b border-stone-200 px-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left nav links */}
      <div className="flex items-center gap-3">
        {/* Hamburger Toggle Button */}
        <button
          onClick={onToggleSidebar}
          type="button"
          className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
          title={isSidebarCollapsed ? 'Buka Sidebar' : 'Ciutkan Sidebar'}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Navigation Links */}
        <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-stone-600">
          {(() => {
            switch (currentUser?.role) {
              case 'roaster':
                return (
                  <>
                    <Link
                      to="/admin/roaster/inventory"
                      className="hover:text-amber-800 transition-colors"
                    >
                      Stok Roasted Beans
                    </Link>
                    <Link
                      to="/admin/roaster/production"
                      className="hover:text-amber-800 transition-colors"
                    >
                      Jadwal Sangrai
                    </Link>
                    <Link
                      to="/admin/roaster/cupping"
                      className="hover:text-amber-800 transition-colors"
                    >
                      Cupping SCA
                    </Link>
                    <Link
                      to="/admin/roaster/pengadaan"
                      className="hover:text-amber-800 transition-colors"
                    >
                      Pengadaan Green Beans
                    </Link>
                    <Link
                      to="/admin/seller"
                      className="text-orange-600 font-bold hover:text-orange-700 transition-colors flex items-center gap-1"
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Seller Panel</span>
                    </Link>
                  </>
                );
              case 'gudang':
                return (
                  <>
                    <Link
                      to="/admin/gudang/inventory"
                      className="hover:text-amber-800 transition-colors"
                    >
                      Stok Gudang
                    </Link>
                    <Link
                      to="/admin/gudang/pengadaan"
                      className="hover:text-amber-800 transition-colors"
                    >
                      Pengadaan Green Bean
                    </Link>
                    <Link
                      to="/admin/gudang/sortir"
                      className="hover:text-amber-800 transition-colors"
                    >
                      Lembar Kerja Sortir
                    </Link>
                    <Link
                      to="/admin/seller"
                      className="text-orange-600 font-bold hover:text-orange-700 transition-colors flex items-center gap-1"
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Seller Panel</span>
                    </Link>
                  </>
                );
              case 'pengolah':
                return (
                  <>
                    <Link
                      to="/admin/pengolah"
                      className="hover:text-amber-800 transition-colors"
                    >
                      Dashboard Wet Mill
                    </Link>
                  </>
                );
              case 'cafe':
                return (
                  <>
                    <Link
                      to="/admin/cafe"
                      className="hover:text-amber-800 transition-colors"
                    >
                      Coffee Shop & Barista
                    </Link>
                  </>
                );
              case 'petani':
                return (
                  <>
                    <Link
                      to="/admin/kebun"
                      className="hover:text-amber-800 transition-colors"
                    >
                      Master Kebun
                    </Link>
                    <Link
                      to="/admin/panen"
                      className="hover:text-amber-800 transition-colors"
                    >
                      Hasil Panen
                    </Link>
                    <Link
                      to="/admin/ledger"
                      className="hover:text-amber-800 transition-colors"
                    >
                      Buku Kas & Ledger
                    </Link>
                  </>
                );
              case 'ict':
              case 'verifikator':
                return (
                  <>
                    <Link
                      to="/admin/ict"
                      className="hover:text-amber-800 transition-colors"
                    >
                      Verifikasi ICT
                    </Link>
                    <Link
                      to="/admin/ict/audit"
                      className="hover:text-amber-800 transition-colors"
                    >
                      Lembar Kerja ICS
                    </Link>
                  </>
                );
              case 'admin_kelompok_tani':
              default:
                return (
                  <>
                    <Link
                      to="/admin/overview"
                      className="hover:text-amber-800 transition-colors"
                    >
                      Control Tower
                    </Link>
                    <Link
                      to="/admin/users"
                      className="hover:text-amber-800 transition-colors"
                    >
                      Master Users
                    </Link>
                  </>
                );
            }
          })()}
          <a
            href="https://marketplace.circulartrace.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-800 transition-colors flex items-center gap-1"
          >
            <span>Marketplace</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </a>
        </div>
      </div>

      {/* Right nav items */}
      <div className="flex items-center gap-2">
        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          type="button"
          className="hidden md:flex p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
          title="Fullscreen Mode"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            type="button"
            className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer relative"
            title="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 text-xs animate-in fade-in">
              <div className="px-4 py-2 border-b border-stone-100 font-bold text-stone-800 flex items-center justify-between">
                <span>Notifikasi Rantai Pasok</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {recentTransactions.length} Baru
                </span>
              </div>
              <div className="divide-y divide-stone-50 max-h-60 overflow-y-auto">
                {recentTransactions.map((t) => (
                  <div key={t.id} className="p-3 hover:bg-stone-50 transition-colors">
                    <div className="font-semibold text-stone-800 text-[11px] truncate">
                      {t.itemName} ({t.quantity})
                    </div>
                    <div className="text-[10px] text-stone-500 mt-0.5">
                      {t.fromName} → {t.toName}
                    </div>
                    <div className="text-[9px] text-amber-700 font-bold mt-1">
                      {t.date} • {t.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        {currentUser && (
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              type="button"
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-stone-300"
              />
              <div className="hidden lg:block text-left text-xs">
                <span className="font-bold text-stone-900 block leading-tight truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-stone-500 block leading-tight">
                  {currentRoleInfo?.label || currentUser.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-3 z-50 text-xs animate-in fade-in">
                {/* Header card inside dropdown */}
                <div className="px-4 pb-3 border-b border-stone-100 text-center">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-500 mx-auto mb-2"
                  />
                  <strong className="text-stone-900 block text-sm font-bold">
                    {currentUser.name}
                  </strong>
                  <span className="text-[11px] text-stone-500 block">
                    {currentUser.organization}
                  </span>
                  <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    <Building2 className="w-3 h-3 text-amber-700" />
                    <span>{currentRoleInfo?.label}</span>
                  </div>
                </div>

                <div className="p-2 space-y-1">
                  <Link
                    to="/admin/users"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-50 font-medium transition-colors"
                  >
                    <User className="w-4 h-4 text-stone-400" />
                    <span>Kelola Master Users</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    type="button"
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Keluar (Sign Out)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

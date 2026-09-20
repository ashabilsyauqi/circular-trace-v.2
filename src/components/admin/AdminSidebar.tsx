import React from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { UserRole } from '../../types/coffee';
import { ROLE_DETAILS } from '../../constants/roles';
import {
  Coffee,
  Store,
  LayoutDashboard,
  Package,
  QrCode,
  Receipt,
  LogOut,
  ChevronRight,
  ChevronLeft,
  X,
  UserCheck,
  Wallet,
  Sparkles,
  Sprout,
  Cog,
  Warehouse,
  Flame,
  ShoppingCart,
  Sliders,
  Award,
  History,
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  mobileOpen,
  setMobileOpen,
  collapsed,
  setCollapsed,
  currentTab,
  onSelectTab,
}) => {
  const {
    currentUser,
    loginAsRole,
    logout,
    activeView,
    setActiveView,
    farmerLots,
    processedLots,
    warehouseLots,
    roastedLots,
    cafeInventory,
    cafeProducts,
    workOrders,
    purchaseOrders,
    masterProfiles,
    qcSessions,
    salesOrders,
    transactions,
    roasterActiveTab,
    setRoasterActiveTab,
  } = useCoffee();

  if (!currentUser) return null;

  const currentRoleInfo = ROLE_DETAILS[currentUser.role];

  // Count active stock/items according to user's role
  const getRoleInventoryCount = () => {
    switch (currentUser.role) {
      case 'petani':
        return farmerLots.length;
      case 'pengolah':
        return processedLots.length;
      case 'gudang':
        return warehouseLots.length;
      case 'roaster':
        return roastedLots.length;
      case 'cafe':
        return cafeInventory.length + cafeProducts.length;
      default:
        return 0;
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'petani':
        return <Sprout className="w-4 h-4 text-emerald-400" />;
      case 'pengolah':
        return <Cog className="w-4 h-4 text-amber-400" />;
      case 'gudang':
        return <Warehouse className="w-4 h-4 text-blue-400" />;
      case 'roaster':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'cafe':
        return <Coffee className="w-4 h-4 text-stone-300" />;
    }
  };

  // Dedicated Roastery ERP navigation tabs (Work Orders -> Buku Kas)
  const roasterNavItems = [
    {
      id: 'work_orders' as const,
      label: 'Work Orders',
      subtitle: 'MRP Sangrai',
      icon: Flame,
      badge: workOrders.filter((w) => w.status !== 'completed').length,
      badgeColor: 'bg-amber-500 text-stone-950',
    },
    {
      id: 'purchasing' as const,
      label: 'Purchasing',
      subtitle: 'Pengadaan Green Bean',
      icon: ShoppingCart,
      badge: purchaseOrders.filter((p) => p.status !== 'received').length,
      badgeColor: 'bg-blue-500 text-white',
    },
    {
      id: 'production' as const,
      label: 'Productions',
      subtitle: 'Resep & Mesin Sangrai',
      icon: Sliders,
      badge: masterProfiles.length,
      badgeColor: 'bg-stone-700 text-stone-200',
    },
    {
      id: 'qc' as const,
      label: 'Quality Control',
      subtitle: 'SCA Cupping Lab',
      icon: Award,
      badge: qcSessions.length,
      badgeColor: 'bg-purple-500 text-white',
    },
    {
      id: 'inventory' as const,
      label: 'Inventory Silo',
      subtitle: 'Green, Roasted & Pack',
      icon: Warehouse,
      badge: `${warehouseLots.length} Lot`,
      badgeColor: 'bg-emerald-500 text-white',
    },
    {
      id: 'selling' as const,
      label: 'Selling Wholesale',
      subtitle: 'Pesanan Cafe & CRM',
      icon: Store,
      badge: salesOrders.filter((s) => s.status !== 'dispatched').length,
      badgeColor: 'bg-[#00A09D] text-white',
    },
    {
      id: 'history' as const,
      label: 'Buku Kas Roastery',
      subtitle: 'Buku Kas & Riwayat TRX',
      icon: History,
      badge: transactions.filter(
        (t) =>
          t.fromRole === 'roaster' ||
          t.toRole === 'roaster' ||
          t.fromName === currentUser.name ||
          t.toName === currentUser.name
      ).length,
      badgeColor: 'bg-stone-700 text-stone-300',
    },
  ];

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-950/70 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Container (Cruip Dark Slate Theme) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between bg-stone-900 text-stone-200 border-r border-stone-800/80 transition-all duration-300 ease-in-out lg:static lg:inset-auto ${
          collapsed ? 'w-20' : 'w-72'
        } ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Section */}
        <div className="flex flex-col min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-800">
          {/* Brand Header */}
          <div
            className={`p-4 border-b border-stone-800/90 flex items-center ${
              collapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#714B67] to-[#5A3950] text-white flex items-center justify-center font-black shadow-md shrink-0 border border-[#714B67]/30">
                <Coffee className="w-6 h-6" />
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-white text-base tracking-tight truncate block">
                      CCT-Coffee
                    </span>
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#714B67]/30 text-purple-300 border border-[#714B67]/40">
                      ODOO 19
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block truncate">
                    Enterprise Coffee ERP
                  </span>
                </div>
              )}
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop Collapse Toggle Button */}
            {!collapsed && (
              <button
                onClick={() => setCollapsed(true)}
                className="hidden lg:flex p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                title="Sembunyikan Sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Desktop Expand Button when collapsed */}
          {collapsed && (
            <div className="hidden lg:flex justify-center p-2 border-b border-stone-800/60">
              <button
                onClick={() => setCollapsed(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                title="Perluas Sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Current Role Indicator Pill */}
          {!collapsed ? (
            <div className="px-4 pt-3 pb-1">
              <div className="bg-stone-800/80 rounded-2xl p-3 border border-stone-700/60 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-stone-700/80 flex items-center justify-center shrink-0">
                    {getRoleIcon(currentUser.role)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] text-stone-400 uppercase font-bold tracking-wider block truncate">
                      Hak Akses Panel Aktif
                    </span>
                    <span className="text-xs font-black text-amber-400 block truncate mt-0.5">
                      {currentRoleInfo.label}
                    </span>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center pt-3 pb-1">
              <div
                className="w-10 h-10 rounded-xl bg-stone-800 border border-stone-700/80 flex items-center justify-center"
                title={`Akses Aktif: ${currentRoleInfo.label}`}
              >
                {getRoleIcon(currentUser.role)}
              </div>
            </div>
          )}

          {/* Primary Action Button: Buka Toko / Marketplace */}
          <div className={`px-4 py-2.5 ${collapsed ? 'px-2' : ''}`}>
            <button
              onClick={() => {
                setActiveView('marketplace');
                setMobileOpen(false);
              }}
              className={`w-full group py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-xs transition-all shadow-sm flex items-center ${
                collapsed ? 'justify-center p-2.5' : 'justify-between'
              }`}
              title="Kembali ke E-Commerce Storefront"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Store className="w-4 h-4 text-stone-950 shrink-0" />
                {!collapsed && <span className="truncate">Ke Toko E-Commerce</span>}
              </div>
              {!collapsed && (
                <ChevronRight className="w-4 h-4 text-stone-900 group-hover:translate-x-1 transition-transform shrink-0" />
              )}
            </button>
          </div>

          {/* Navigation Sections */}
          <nav className="px-3 py-2 space-y-4">
            {/* CASE 1: ROASTER USER - RENDER DEDICATED ROASTERY ERP TABS (Work Orders -> Buku Kas) */}
            {currentUser.role === 'roaster' ? (
              <div>
                {!collapsed && (
                  <div className="px-3 pb-1.5 text-[10px] uppercase font-black text-stone-400 tracking-wider flex items-center justify-between">
                    <span>Roastery MRP & Operasi</span>
                    <span className="text-[9px] text-[#00A09D] font-mono font-bold">Odoo 19</span>
                  </div>
                )}
                <div className="space-y-1">
                  {roasterNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === 'dashboard' && roasterActiveTab === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveView('dashboard');
                          setRoasterActiveTab(item.id);
                          if (onSelectTab) onSelectTab(item.id);
                          setMobileOpen(false);
                        }}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center ${
                          collapsed ? 'justify-center' : 'justify-between'
                        } ${
                          isActive
                            ? 'bg-gradient-to-r from-[#714B67] to-[#5A3950] text-white border border-[#714B67]/70 shadow-md shadow-[#714B67]/20 font-black'
                            : 'text-stone-300 hover:text-white hover:bg-stone-800/70 border border-transparent'
                        }`}
                        title={`${item.label} - ${item.subtitle}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-amber-300' : 'text-stone-400 group-hover:text-amber-400'
                            }`}
                          />
                          {!collapsed && (
                            <div className="text-left min-w-0">
                              <span className="truncate block leading-tight">{item.label}</span>
                              <span className="text-[9px] text-stone-400 block truncate font-normal leading-tight">
                                {item.subtitle}
                              </span>
                            </div>
                          )}
                        </div>

                        {!collapsed && (
                          <span
                            className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded shadow-2xs ${
                              isActive ? 'bg-[#00A09D] text-white' : item.badgeColor
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* CASE 2: OTHER ROLES - RENDER THEIR RESPECTIVE OPERATIONAL MENUS */
              <div>
                {!collapsed && (
                  <div className="px-3 pb-1 text-[10px] uppercase font-black text-stone-500 tracking-wider">
                    Menu Utama
                  </div>
                )}
                <div className="space-y-1">
                  {/* Dashboard Operasional */}
                  <button
                    onClick={() => {
                      setActiveView('dashboard');
                      if (onSelectTab) onSelectTab('overview');
                      setMobileOpen(false);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center ${
                      collapsed ? 'justify-center' : 'justify-between'
                    } ${
                      activeView === 'dashboard' && (!currentTab || currentTab === 'overview' || currentTab === 'catalog')
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-xs'
                        : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                    }`}
                    title="Dashboard & Operasional"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <LayoutDashboard className="w-4 h-4 text-amber-400 shrink-0" />
                      {!collapsed && <span className="truncate">Dashboard & Operasi</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-[10px] bg-stone-800 text-stone-300 font-mono px-1.5 py-0.5 rounded">
                        Aktif
                      </span>
                    )}
                  </button>

                  {/* Stok & Katalog Komoditas */}
                  <button
                    onClick={() => {
                      setActiveView('dashboard');
                      if (onSelectTab) onSelectTab('catalog');
                      setMobileOpen(false);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center ${
                      collapsed ? 'justify-center' : 'justify-between'
                    } ${
                      activeView === 'dashboard' && currentTab === 'catalog'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-xs'
                        : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                    }`}
                    title="Katalog & Stok Komoditas"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Package className="w-4 h-4 text-amber-400 shrink-0" />
                      {!collapsed && <span className="truncate">Katalog & Stok Saya</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-[10px] bg-amber-400/20 text-amber-300 font-mono font-bold px-1.5 py-0.5 rounded border border-amber-400/30">
                        {getRoleInventoryCount()}
                      </span>
                    )}
                  </button>

                  {/* Barcode & Stiker Fisik */}
                  <button
                    onClick={() => {
                      setActiveView('dashboard');
                      if (onSelectTab) onSelectTab('barcode');
                      setMobileOpen(false);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center ${
                      collapsed ? 'justify-center' : 'justify-between'
                    } ${
                      activeView === 'dashboard' && currentTab === 'barcode'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-xs'
                        : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                    }`}
                    title="Barcode & Stiker Label"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <QrCode className="w-4 h-4 text-amber-400 shrink-0" />
                      {!collapsed && (
                        <span className="truncate">
                          {currentUser.role === 'cafe'
                            ? 'Stiker Gelas & Meja'
                            : 'Stiker Barcode Karung'}
                        </span>
                      )}
                    </div>
                    {!collapsed && (
                      <span className="text-[9px] text-stone-500 font-bold uppercase">QR</span>
                    )}
                  </button>

                  {/* Buku Besar Transaksi (Audit Trail) */}
                  <button
                    onClick={() => {
                      setActiveView('transactions');
                      setMobileOpen(false);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center ${
                      collapsed ? 'justify-center' : 'justify-between'
                    } ${
                      activeView === 'transactions'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-xs'
                        : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                    }`}
                    title="Buku Besar Transaksi"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Receipt className="w-4 h-4 text-amber-400 shrink-0" />
                      {!collapsed && <span className="truncate">Buku Besar Transaksi</span>}
                    </div>
                    {!collapsed && (
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Category: DEMO SWITCHER / ROLE ACCORDION */}
            {!collapsed && (
              <div className="pt-2 border-t border-stone-800/80">
                <div className="px-3 pb-2 text-[10px] uppercase font-black text-stone-500 tracking-wider flex items-center justify-between">
                  <span>Pindah Peran (Demo)</span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </div>
                <div className="grid grid-cols-2 gap-1.5 px-1">
                  {(Object.keys(ROLE_DETAILS) as UserRole[]).map((roleKey) => {
                    const isActive = currentUser.role === roleKey;
                    return (
                      <button
                        key={roleKey}
                        onClick={() => {
                          loginAsRole(roleKey);
                          setActiveView('dashboard');
                          setMobileOpen(false);
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all flex items-center justify-between ${
                          isActive
                            ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                            : 'bg-stone-800/70 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700/50'
                        }`}
                      >
                        <span className="truncate">{ROLE_DETAILS[roleKey].label.split(' ')[0]}</span>
                        {isActive && <UserCheck className="w-3.5 h-3.5 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* Sidebar Footer: Profile Card & Logout */}
        <div className="p-3 border-t border-stone-800/90 bg-stone-950/60 shrink-0">
          {!collapsed ? (
            <div>
              <div className="flex items-center gap-3 mb-2.5 p-1.5 rounded-xl bg-stone-900/60 border border-stone-800">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-amber-500 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-white block truncate leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-stone-400 block truncate leading-tight">
                    {currentUser.organization}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono mt-0.5">
                    <Wallet className="w-3 h-3 shrink-0" />
                    <span className="truncate">Rp {currentUser.balance.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full py-2 px-3 rounded-xl bg-stone-800/60 hover:bg-rose-950/40 text-stone-400 hover:text-rose-300 hover:border-rose-900/50 border border-stone-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar Akun</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-amber-500"
                title={`${currentUser.name} (${currentUser.organization})`}
              />
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800"
                title="Keluar Akun"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

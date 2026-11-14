import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import {
  Building2,
  Users,
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Coffee,
  LayoutDashboard,
  Search,
  Globe,
  Store,
  History,
  Circle,
  ChevronRight,
  ChevronDown,
  ShieldAlert,
  ShieldCheck,
  ClipboardCheck,
  TreePine,
  Package,
  ShoppingCart,
  Award,
  ExternalLink,
} from 'lucide-react';
import { ROLE_DETAILS } from '../../constants/roles';

interface AdminLTESidebarProps {
  isCollapsed: boolean;
}

export const AdminLTESidebar: React.FC<AdminLTESidebarProps> = ({ isCollapsed }) => {
  const {
    currentUser,
    users,
    farmerLots,
    coffeeFarms,
    processedLots,
    warehouseLots,
    roastedLots,
    farmerActiveTab,
    setFarmerActiveTab,
    processorActiveTab,
    setProcessorActiveTab,
  } = useCoffee();
  const location = useLocation();
  const [filterQuery, setFilterQuery] = useState('');
  
  const isPetaniSectionActive =
    location.pathname.startsWith('/admin/petani') ||
    location.pathname.startsWith('/admin/kebun') ||
    location.pathname.startsWith('/admin/panen') ||
    location.pathname.startsWith('/admin/ledger');

  const isGudangSectionActive = location.pathname.startsWith('/admin/gudang');
  const isRoasterSectionActive = location.pathname.startsWith('/admin/roaster');

  const [petaniOpen, setPetaniOpen] = useState(true);
  const [pengolahOpen, setPengolahOpen] = useState(location.pathname.includes('/admin/pengolah'));
  const [gudangOpen, setGudangOpen] = useState<boolean>(true);
  const [roasterOpen, setRoasterOpen] = useState<boolean>(true);

  const currentRoleInfo = currentUser ? ROLE_DETAILS[currentUser.role] : null;
  const userRole = currentUser?.role;
  const isAdminKelompok = userRole === 'admin_kelompok_tani';

  // Role-based visibility gates: outside Kelompok Tani only see their specific service
  const canSeePusatKendali = isAdminKelompok;
  const canSeePetani = isAdminKelompok || userRole === 'petani' || userRole === 'ict' || userRole === 'verifikator';
  const canSeePengolah = isAdminKelompok || userRole === 'pengolah';
  const canSeeGudang = isAdminKelompok || userRole === 'gudang';
  const canSeeRoaster = isAdminKelompok || userRole === 'roaster';
  const canSeeCafe = isAdminKelompok || userRole === 'cafe';
  const canSeeIct = isAdminKelompok || userRole === 'ict' || userRole === 'verifikator';
  const canSeeSeller = isAdminKelompok || userRole === 'roaster' || userRole === 'gudang' || userRole === 'pengolah' || userRole === 'petani';

  const getHomePath = () => {
    switch (userRole) {
      case 'roaster':
        return '/admin/roaster/inventory';
      case 'gudang':
        return '/admin/gudang/inventory';
      case 'pengolah':
        return '/admin/pengolah';
      case 'cafe':
        return '/admin/cafe';
      case 'petani':
        return '/admin/petani';
      case 'ict':
      case 'verifikator':
        return '/admin/ict';
      default:
        return '/admin/overview';
    }
  };

  const getBrandSubtitle = () => {
    if (isAdminKelompok) {
      return 'Admin Kelompok Tani';
    }
    return currentUser?.organization || currentRoleInfo?.label || 'sangrAI Platform';
  };

  const getBrandIcon = () => {
    switch (userRole) {
      case 'roaster':
        return <Flame className="w-5 h-5 text-stone-950" />;
      case 'gudang':
        return <Warehouse className="w-5 h-5 text-stone-950" />;
      case 'pengolah':
        return <Cog className="w-5 h-5 text-stone-950" />;
      case 'cafe':
        return <Coffee className="w-5 h-5 text-stone-950" />;
      case 'petani':
        return <Sprout className="w-5 h-5 text-stone-950" />;
      case 'ict':
        return <ShieldCheck className="w-5 h-5 text-stone-950" />;
      default:
        return <Building2 className="w-5 h-5 text-stone-950" />;
    }
  };

  const getSectionTitle = () => {
    switch (userRole) {
      case 'roaster':
        return 'Layanan Roastery (ERP)';
      case 'gudang':
        return 'Layanan Gudang (QA)';
      case 'pengolah':
        return 'Layanan Pengolah (Mill)';
      case 'cafe':
        return 'Layanan Coffee Shop & Cafe';
      case 'petani':
        return 'Layanan Petani Kopi';
      case 'ict':
        return 'Verifikasi Internal ICT';
      default:
        return 'Scope Kelompok Tani';
    }
  };

  return (
    <aside
      className={`bg-[#343a40] text-[#c2c7d0] transition-all duration-300 flex flex-col shrink-0 select-none z-40 ${
        isCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* 1. Brand Logo Header */}
      <Link
        to={getHomePath()}
        className="h-14 bg-[#343a40] border-b border-[#4f5962] flex items-center px-4 gap-3 text-white transition-colors hover:text-amber-400 overflow-hidden"
      >
        <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
          {getBrandIcon()}
        </div>
        {!isCollapsed && (
          <div className="leading-tight truncate">
            <span className="font-extrabold text-sm tracking-wide text-white block">
              sangr<span className="text-amber-400">AI</span>
            </span>
            <span className="text-[10px] text-stone-400 font-normal block truncate">
              {getBrandSubtitle()}
            </span>
          </div>
        )}
      </Link>

      {/* 2. User Info Panel */}
      {currentUser && (
        <div className="p-3 border-b border-[#4f5962] flex items-center gap-3 overflow-hidden">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover border border-[#6c757d] shrink-0"
          />
          {!isCollapsed && (
            <div className="min-w-0 flex-1 leading-tight">
              <span className="font-bold text-xs text-white block truncate">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400" />
                <span>Online • {currentRoleInfo?.label || currentUser.role}</span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* 3. Search Bar (AdminLTE Style) */}
      {!isCollapsed && (
        <div className="p-3">
          <div className="relative">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Cari Menu..."
              className="w-full bg-[#3f474e] text-xs text-white placeholder-[#869099] rounded-md px-3 py-1.5 pl-8 border border-[#4f5962] focus:outline-none focus:border-amber-400"
            />
            <Search className="w-3.5 h-3.5 text-[#869099] absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      )}

      {/* 4. Sidebar Navigation Menus */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4 text-xs font-medium">
        {/* SECTION: UTAMA (KHUSUS ADMIN KELOMPOK TANI) */}
        {canSeePusatKendali && (
          <div>
            {!isCollapsed && (
              <div className="px-3 py-1 text-[10px] font-bold text-[#6c757d] uppercase tracking-wider">
                Pusat Kendali
              </div>
            )}

            <div className="space-y-1 mt-1">
              <NavLink
                to="/admin/overview"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : 'text-[#c2c7d0] hover:bg-[#494e53] hover:text-white'
                  }`
                }
                title="Control Tower"
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="flex-1 truncate">Control Tower</span>}
                {!isCollapsed && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-stone-900/40 text-amber-200">
                    5 Stasiun
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : 'text-[#c2c7d0] hover:bg-[#494e53] hover:text-white'
                  }`
                }
                title="Master Users"
              >
                <Users className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="flex-1 truncate">Master Users</span>}
                {!isCollapsed && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-700 text-white font-bold">
                    {users.filter((u) => u.role !== 'verifikator').length}
                  </span>
                )}
              </NavLink>
            </div>
          </div>
        )}

        {/* SECTION: LAYANAN OPERASIONAL */}
        <div>
          {!isCollapsed && (
            <div className="px-3 py-1 text-[10px] font-bold text-[#6c757d] uppercase tracking-wider">
              {getSectionTitle()}
            </div>
          )}

          <div className="space-y-1 mt-1">
            {/* 1. LAYANAN PETANI (COLLAPSIBLE DROPDOWN) */}
            {canSeePetani && (
              <div>
                <div
                  onClick={() => setPetaniOpen(!petaniOpen)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer select-none ${
                    isPetaniSectionActive
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : 'text-[#c2c7d0] hover:bg-[#494e53] hover:text-white'
                  }`}
                >
                  <Link
                    to="/admin/petani"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPetaniOpen(true);
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate">
                        {isAdminKelompok ? '1. Layanan Petani' : 'Layanan Petani Kopi'}
                      </span>
                    )}
                  </Link>

                  {!isCollapsed && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full text-white font-bold bg-emerald-600">
                        {farmerLots.length}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPetaniOpen(!petaniOpen);
                        }}
                        className="p-0.5 hover:text-white"
                      >
                        {petaniOpen ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub-menu Dropdown Items */}
                {petaniOpen && !isCollapsed && (
                  <div className="pl-6 pr-1 py-1 space-y-0.5 mt-0.5 border-l-2 border-stone-600 ml-4">
                    {[
                      {
                        to: '/admin/petani',
                        label: 'Data Master Petani',
                        icon: Users,
                        badge: users.filter((u) => u.role === 'petani' || u.assignedService === 'petani').length,
                        isActive: location.pathname.startsWith('/admin/petani'),
                      },
                      {
                        to: '/admin/kebun',
                        label: 'Data Master Kebun',
                        icon: TreePine,
                        badge: `${coffeeFarms.length} Blok`,
                        isActive: location.pathname.startsWith('/admin/kebun'),
                      },
                      {
                        to: '/admin/panen',
                        label: 'Data Hasil Panen',
                        icon: Package,
                        badge: `${farmerLots.length} Lot`,
                        isActive: location.pathname.startsWith('/admin/panen'),
                      },
                      {
                        to: '/admin/ledger',
                        label: 'Buku Kas & Ledger',
                        icon: History,
                        badge: 'Ledger',
                        isActive: location.pathname.startsWith('/admin/ledger'),
                      },
                    ].map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                            sub.isActive
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'text-[#869099] hover:bg-[#3f474e] hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <SubIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{sub.label}</span>
                          </span>
                          <span className="text-[9px] opacity-75">{sub.badge}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 2. LAYANAN PENGOLAH (COLLAPSIBLE DROPDOWN) */}
            {canSeePengolah && (
              <div>
                <div
                  onClick={() => setPengolahOpen(!pengolahOpen)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer select-none ${
                    location.pathname === '/admin/pengolah'
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : 'text-[#c2c7d0] hover:bg-[#494e53] hover:text-white'
                  }`}
                >
                  <Link
                    to="/admin/pengolah"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPengolahOpen(true);
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <Cog className="w-4 h-4 text-amber-400 shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate">
                        {isAdminKelompok ? '2. Layanan Pengolah (Wet Mill)' : 'Layanan Pengolah (Wet Mill)'}
                      </span>
                    )}
                  </Link>

                  {!isCollapsed && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full text-white font-bold bg-amber-600">
                        {processedLots.length}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPengolahOpen(!pengolahOpen);
                        }}
                        className="p-0.5 hover:text-white"
                      >
                        {pengolahOpen ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub-menu Dropdown Items */}
                {pengolahOpen && !isCollapsed && (
                  <div className="pl-6 pr-1 py-1 space-y-0.5 mt-0.5 border-l-2 border-stone-600 ml-4">
                    {[
                      { id: 'dashboard' as const, label: 'Dashboard Wet Mill', icon: LayoutDashboard },
                      { id: 'sourcing' as const, label: 'Penerimaan Ceri (Sourcing)', icon: Sprout },
                      { id: 'batches' as const, label: 'Batch Olah (7 Metode)', icon: Cog },
                      { id: 'inventory' as const, label: 'Gudang Green Bean', icon: Warehouse },
                      { id: 'selling' as const, label: 'Rilis Pasar / Penjualan', icon: Store },
                      { id: 'history' as const, label: 'Riwayat Transaksi', icon: History },
                    ].map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive =
                        location.pathname === '/admin/pengolah' && processorActiveTab === sub.id;

                      return (
                        <Link
                          key={sub.id}
                          to="/admin/pengolah"
                          onClick={() => setProcessorActiveTab(sub.id)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                            isSubActive
                              ? 'bg-amber-600 text-white font-bold'
                              : 'text-[#869099] hover:bg-[#3f474e] hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <SubIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{sub.label}</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 3. LAYANAN GUDANG (COLLAPSIBLE DROPDOWN) */}
            {canSeeGudang && (
              <div>
                <div
                  onClick={() => setGudangOpen(!gudangOpen)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer select-none ${
                    isGudangSectionActive
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : 'text-[#c2c7d0] hover:bg-[#494e53] hover:text-white'
                  }`}
                >
                  <Link
                    to="/admin/gudang/inventory"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGudangOpen(true);
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <Warehouse className="w-4 h-4 text-amber-300 shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate">
                        {isAdminKelompok ? '3. Layanan Gudang (QA)' : 'Layanan Gudang (QA)'}
                      </span>
                    )}
                  </Link>

                  {!isCollapsed && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full text-white font-bold bg-stone-700">
                        {warehouseLots.length}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setGudangOpen(!gudangOpen);
                        }}
                        className="p-0.5 hover:text-white"
                      >
                        {gudangOpen ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub-menu Dropdown Items */}
                {gudangOpen && !isCollapsed && (
                  <div className="pl-6 pr-1 py-1 space-y-0.5 mt-0.5 border-l-2 border-stone-600 ml-4">
                    {[
                      {
                        to: '/admin/gudang/inventory',
                        label: 'Stok & Gudang Sementara',
                        icon: Warehouse,
                        badge: `${warehouseLots.length} Lot`,
                        isActive: location.pathname === '/admin/gudang' || location.pathname === '/admin/gudang/inventory',
                      },
                      {
                        to: '/admin/gudang/pengadaan',
                        label: 'Pengadaan Green Bean',
                        icon: ShoppingCart,
                        badge: 'Inbound',
                        isActive: location.pathname === '/admin/gudang/pengadaan',
                      },
                      {
                        to: '/admin/gudang/sortir',
                        label: 'Lembar Kerja Sortir',
                        icon: ClipboardCheck,
                        badge: `${warehouseLots.filter((l) => l.sortingStatus === 'pending_sorting').length} Menunggu`,
                        badgeColor: warehouseLots.some((l) => l.sortingStatus === 'pending_sorting') ? 'bg-amber-500 text-stone-950 font-black' : '',
                        isActive: location.pathname.startsWith('/admin/gudang/sortir'),
                      },
                    ].map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                            sub.isActive
                              ? 'bg-amber-600 text-white font-bold'
                              : 'text-[#869099] hover:bg-[#3f474e] hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <SubIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{sub.label}</span>
                          </span>
                          <span className={`text-[9px] px-1 py-0.2 rounded ${sub.badgeColor || 'opacity-75'}`}>
                            {sub.badge}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 4. LAYANAN ROASTER (ROASTERY ERP - COLLAPSIBLE DROPDOWN) */}
            {canSeeRoaster && (
              <div>
                <div
                  onClick={() => setRoasterOpen(!roasterOpen)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer select-none ${
                    isRoasterSectionActive
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : 'text-[#c2c7d0] hover:bg-[#494e53] hover:text-white'
                  }`}
                >
                  <Link
                    to="/admin/roaster/inventory"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRoasterOpen(true);
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate">
                        {isAdminKelompok ? '4. Layanan Roaster (ERP)' : 'Layanan Roaster (ERP)'}
                      </span>
                    )}
                  </Link>

                  {!isCollapsed && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full text-white font-bold bg-orange-600">
                        {roastedLots.length}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRoasterOpen(!roasterOpen);
                        }}
                        className="p-0.5 hover:text-white"
                      >
                        {roasterOpen ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub-menu Dropdown Items */}
                {roasterOpen && !isCollapsed && (
                  <div className="pl-6 pr-1 py-1 space-y-0.5 mt-0.5 border-l-2 border-stone-600 ml-4">
                    {[
                      {
                        to: '/admin/roaster/inventory',
                        label: 'Stok Roasted Beans',
                        icon: Warehouse,
                        badge: `${roastedLots.length} Lot`,
                        isActive:
                          location.pathname === '/admin/roaster' ||
                          location.pathname === '/admin/roaster/inventory',
                      },
                      {
                        to: '/admin/roaster/production',
                        label: 'Jadwal & Artisan Roasting',
                        icon: Flame,
                        badge: 'Live',
                        badgeColor: 'bg-orange-500 text-stone-950 font-black',
                        isActive: location.pathname === '/admin/roaster/production',
                      },
                      {
                        to: '/admin/roaster/cupping',
                        label: 'Lembar Kerja Cupping SCA',
                        icon: Award,
                        badge: `${roastedLots.filter((r) => r.roastStatus === 'cupping_pending').length} Menunggu`,
                        badgeColor: roastedLots.some((r) => r.roastStatus === 'cupping_pending')
                          ? 'bg-purple-500 text-white font-black'
                          : '',
                        isActive: location.pathname.startsWith('/admin/roaster/cupping'),
                      },
                      {
                        to: '/admin/roaster/pengadaan',
                        label: 'Pengadaan Green Beans',
                        icon: ShoppingCart,
                        badge: 'Inbound',
                        isActive: location.pathname === '/admin/roaster/pengadaan',
                      },
                      {
                        to: '/admin/seller',
                        label: 'Toko & Monitoring Penjualan',
                        icon: Store,
                        badge: 'Seller Panel',
                        badgeColor: 'bg-orange-600 text-white font-bold',
                        isActive: location.pathname === '/admin/seller',
                      },
                    ].map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                            sub.isActive
                              ? 'bg-amber-600 text-white font-bold'
                              : 'text-[#869099] hover:bg-[#3f474e] hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <SubIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{sub.label}</span>
                          </span>
                          <span className={`text-[9px] px-1 py-0.2 rounded ${sub.badgeColor || 'opacity-75'}`}>
                            {sub.badge}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 5. LAYANAN COFFEE SHOP / CAFE */}
            {canSeeCafe && (
              <div>
                <NavLink
                  to="/admin/cafe"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-amber-600 text-white font-bold shadow-xs'
                        : 'text-[#c2c7d0] hover:bg-[#494e53] hover:text-white'
                    }`
                  }
                  title="Coffee Shop & Cafe"
                >
                  <Coffee className="w-4 h-4 text-amber-300 shrink-0" />
                  {!isCollapsed && (
                    <span className="flex-1 truncate">
                      {isAdminKelompok ? '5. Layanan Coffee Shop' : 'Layanan Coffee Shop & Cafe'}
                    </span>
                  )}
                  {!isCollapsed && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-stone-700 text-white font-bold">
                      Cafe
                    </span>
                  )}
                </NavLink>
              </div>
            )}

            {/* 6. VERIFIKASI INTERNAL ICT & AUDIT ICS */}
            {canSeeIct && (
              <div className="space-y-1">
                <NavLink
                  to="/admin/ict"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'text-[#c2c7d0] hover:bg-[#494e53] hover:text-white'
                    }`
                  }
                  title="Pusat Verifikasi ICT (Petani, Kebun, Panen)"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  {!isCollapsed && <span className="flex-1 truncate">Verifikasi ICT</span>}
                  {!isCollapsed && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-700 text-white font-bold">
                      Audit
                    </span>
                  )}
                </NavLink>

                <NavLink
                  to="/admin/ict/ct-dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-1.5 rounded-md text-[11px] transition-colors ml-2 ${
                      isActive
                        ? 'bg-amber-600 text-white font-bold shadow-xs'
                        : 'text-[#869099] hover:bg-[#494e53] hover:text-white'
                    }`
                  }
                  title="Sertifikasi Kebun (CircularTrace Index Engine: CT-4CI / CCI / SDI)"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  {!isCollapsed && <span className="flex-1 truncate">Sertifikasi Kebun (CT)</span>}
                  {!isCollapsed && (
                    <span className="text-[8px] px-1 py-0.2 rounded-full bg-amber-700 text-white font-bold">
                      4C
                    </span>
                  )}
                </NavLink>

                <NavLink
                  to="/admin/ict/audit"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-1.5 rounded-md text-[11px] transition-colors ml-2 ${
                      isActive
                        ? 'bg-blue-700 text-white font-bold shadow-xs'
                        : 'text-[#869099] hover:bg-[#494e53] hover:text-white'
                    }`
                  }
                  title="Lembar Kerja Audit ICS"
                >
                  <ClipboardCheck className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                  {!isCollapsed && <span className="flex-1 truncate">Lembar Kerja ICS</span>}
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {/* SECTION: EKSTERNAL / PUBLIK */}
        <div>
          {!isCollapsed && (
            <div className="px-3 py-1 text-[10px] font-bold text-[#6c757d] uppercase tracking-wider">
              Portal Terhubung
            </div>
          )}

          <div className="space-y-1 mt-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-[#c2c7d0] hover:bg-[#494e53] hover:text-white transition-colors"
              title="Landing Page"
            >
              <Globe className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="flex-1 truncate">Landing Page Publik</span>}
            </Link>

            <a
              href="https://marketplace.circulartrace.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-[#c2c7d0] hover:bg-[#494e53] hover:text-white transition-colors"
              title="Katalog Marketplace"
            >
              <Store className="w-4 h-4 shrink-0" />
              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span>Marketplace Kopi</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </div>
              )}
            </a>

            {canSeeSeller && (
              <NavLink
                to="/admin/seller"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-orange-600 text-white font-bold shadow-xs'
                      : 'text-[#c2c7d0] hover:bg-[#494e53] hover:text-white'
                  }`
                }
                title="Admin Seller Panel & Monitoring Penjualan"
              >
                <Store className="w-4 h-4 text-orange-400 shrink-0" />
                {!isCollapsed && <span className="flex-1 truncate">Seller Panel &amp; Penjualan</span>}
                {!isCollapsed && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-orange-500 text-stone-950 font-black">
                    Seller Hub
                  </span>
                )}
              </NavLink>
            )}

            <Link
              to="/transactions"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-[#c2c7d0] hover:bg-[#494e53] hover:text-white transition-colors"
              title="Buku Besar Transaksi"
            >
              <History className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="flex-1 truncate">Buku Transaksi</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Bottom Brand Footnote */}
      {!isCollapsed && (
        <div className="p-3 border-t border-[#4f5962] text-[10px] text-[#869099] text-center">
          AdminLTE v3.2 • sangrAI System
        </div>
      )}
    </aside>
  );
};

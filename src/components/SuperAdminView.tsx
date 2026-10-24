import React, { useState, useEffect, useRef } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { UserRole, UserStatus, AppUser } from '../types/coffee';
import { ROLE_DETAILS } from '../constants/roles';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  UserCheck,
  UserX,
  Trash2,
  Crown,
  Search,
  Filter,
  Users,
  LogIn,
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Coffee,
  Award,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  ExternalLink,
  Ban,
  RefreshCw,
  Database,
  FileText,
  Activity,
  ArrowRight,
  TrendingUp,
  Server,
  Zap,
  UserPlus,
} from 'lucide-react';
import { UserMasterDataDetailPage } from './admin/UserMasterDataDetailPage';
import { RegisterModal } from './RegisterModal';

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  petani: <Sprout className="w-4 h-4 text-emerald-600" />,
  pengolah: <Cog className="w-4 h-4 text-amber-600" />,
  gudang: <Warehouse className="w-4 h-4 text-blue-600" />,
  roaster: <Flame className="w-4 h-4 text-orange-600" />,
  cafe: <Coffee className="w-4 h-4 text-stone-700" />,
  verifikator: <Award className="w-4 h-4 text-purple-600" />,
  superadmin: <Crown className="w-4 h-4 text-amber-500" />,
};

export const SuperAdminView: React.FC = () => {
  const {
    currentUser,
    users,
    route,
    navigate,
    approveUser,
    rejectUser,
    deleteUser,
    suspendUser,
    loginAsUser,
    transactions,
    superAdminActiveTab,
    setSuperAdminActiveTab,
    superAdminRoleFilter,
    setSuperAdminRoleFilter,
  } = useCoffee();

  const activeTab = superAdminActiveTab;
  const setActiveTab = setSuperAdminActiveTab;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Selected master user is derived directly from the unified route
  const selectedMasterUser = route.userId
    ? users.find((u) => u.id === route.userId) || null
    : null;

  const handleSelectUser = (user: AppUser) => {
    navigate({ userId: user.id });
  };

  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // Rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [targetRejectUser, setTargetRejectUser] = useState<AppUser | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Pending users (status === 'pending_approval')
  const pendingUsers = users.filter((u) => u.status === 'pending_approval');
  const activeUsers = users.filter((u) => !u.status || u.status === 'active');
  const rejectedUsers = users.filter((u) => u.status === 'rejected');
  const suspendedUsers = users.filter((u) => u.status === 'suspended');

  // Role counts
  const petaniUsers = users.filter((u) => u.role === 'petani');
  const pengolahUsers = users.filter((u) => u.role === 'pengolah');
  const gudangUsers = users.filter((u) => u.role === 'gudang');
  const roasterUsers = users.filter((u) => u.role === 'roaster');
  const cafeUsers = users.filter((u) => u.role === 'cafe');
  const verifikatorUsers = users.filter((u) => u.role === 'verifikator');

  const handleApprove = (userId: string) => {
    const res = approveUser(userId);
    setStatusMessage({ type: 'success', text: res.message });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const openRejectModal = (user: AppUser) => {
    setTargetRejectUser(user);
    setRejectReason('Data registrasi fasilitas/lahan belum memenuhi kualifikasi mitra.');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!targetRejectUser) return;
    const res = rejectUser(targetRejectUser.id, rejectReason);
    setStatusMessage({ type: 'success', text: res.message });
    setRejectModalOpen(false);
    setTargetRejectUser(null);
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handleDelete = (userId: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus pendaftaran atas nama "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      const res = deleteUser(userId);
      setStatusMessage({ type: 'success', text: res.message });
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  const handleSuspendToggle = (userId: string) => {
    const res = suspendUser(userId);
    setStatusMessage({ type: 'success', text: res.message });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // Filtered users for directory tab
  const filteredUsers = users.filter((u) => {
    if (superAdminRoleFilter !== 'all' && u.role !== superAdminRoleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = (u.email || '').toLowerCase().includes(q);
      const matchOrg = (u.organization || '').toLowerCase().includes(q);
      const matchLoc = (u.location || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchOrg && !matchLoc) return false;
    }
    return true;
  });

  // Dedicated Full Page View for User Master Data Deep Inspector
  if (selectedMasterUser) {
    return (
      <UserMasterDataDetailPage
        user={selectedMasterUser}
        onBack={() => {
          navigate({ userId: null });
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Feedback Notification */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between shadow-md transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-stone-400 hover:text-stone-700 text-xs font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB: DASHBOARD (IKHTISAR UTAMA)                                    */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Welcome Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300/80 mb-1">
                <Crown className="w-3 h-3 text-amber-600" />
                <span>SUPER ADMINISTRATOR & OWNER</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Selamat Datang Kembali, {currentUser?.name || 'Novizar'} 👋
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 max-w-2xl">
                Berikut adalah ringkasan tata kelola ekosistem rantai pasok kopi sangrAI. Kelola persetujuan akun pendaftar baru, pantau data mitra, dan periksa master data stasiun.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setActiveTab('approvals')}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black transition-all cursor-pointer shadow-sm flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                <span>Tinjau Antrean ({pendingUsers.length})</span>
              </button>

              <button
                onClick={() => {
                  setSuperAdminRoleFilter('all');
                  setActiveTab('directory');
                }}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>Semua Mitra</span>
              </button>
            </div>
          </div>

          {/* 4 Standard Top KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Antrean ACC */}
            <div
              onClick={() => setActiveTab('approvals')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                pendingUsers.length > 0
                  ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-sm'
                  : 'border-stone-200/80 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Menunggu ACC
                </span>
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  pendingUsers.length > 0 ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-stone-100 text-stone-500'
                }`}>
                  <Clock className="w-4 h-4" />
                </span>
              </div>
              <p className="text-3xl font-black text-amber-900 mt-2">{pendingUsers.length}</p>
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-stone-500">Pendaftaran perlu ACC</span>
                <span className="text-amber-700 font-bold flex items-center gap-0.5">
                  Buka &rarr;
                </span>
              </div>
            </div>

            {/* Card 2: Mitra Aktif */}
            <div
              onClick={() => {
                setSuperAdminRoleFilter('all');
                setActiveTab('directory');
              }}
              className="p-5 rounded-2xl bg-white border border-stone-200/80 hover:border-stone-300 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Mitra Aktif
                </span>
                <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </span>
              </div>
              <p className="text-3xl font-black text-emerald-900 mt-2">{activeUsers.length}</p>
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-stone-500">Stasiun operasional</span>
                <span className="text-emerald-700 font-bold font-mono">100% Berizin</span>
              </div>
            </div>

            {/* Card 3: Total Akun */}
            <div
              onClick={() => {
                setSuperAdminRoleFilter('all');
                setActiveTab('directory');
              }}
              className="p-5 rounded-2xl bg-white border border-stone-200/80 hover:border-stone-300 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Total Akun
                </span>
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <p className="text-3xl font-black text-stone-900 mt-2">{users.length}</p>
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-stone-500">Mitra & Super Admin</span>
                <span className="text-blue-700 font-bold">Terdata</span>
              </div>
            </div>

            {/* Card 4: Transaksi Rantai Pasok */}
            <div
              onClick={() => setActiveTab('logs')}
              className="p-5 rounded-2xl bg-white border border-stone-200/80 hover:border-stone-300 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Log Transaksi
                </span>
                <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </span>
              </div>
              <p className="text-3xl font-black text-purple-900 mt-2">{transactions.length}</p>
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-stone-500">Aliran terverifikasi</span>
                <span className="text-purple-700 font-bold">Tercatat</span>
              </div>
            </div>
          </div>

          {/* Sebaran Ekosistem Berdasarkan Peran */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Sebaran Stasiun Rantai Pasok Kopi
                </h3>
                <p className="text-xs text-stone-500">
                  Klik stasiun di bawah untuk langsung membuka direktori mitra yang bersangkutan.
                </p>
              </div>
              <span className="text-xs font-bold text-stone-400">6 Kategori Aktor</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Petani */}
              <button
                onClick={() => {
                  setSuperAdminRoleFilter('petani');
                  setActiveTab('directory');
                }}
                className="p-4 rounded-2xl bg-stone-50 hover:bg-emerald-50/60 border border-stone-200/80 hover:border-emerald-300 transition-all text-left cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sprout className="w-4 h-4" />
                </div>
                <p className="text-xl font-black text-stone-900 mt-3">{petaniUsers.length}</p>
                <p className="text-xs font-bold text-stone-600">Petani & Kebun</p>
                <p className="text-[10px] text-stone-400 mt-0.5">Lahan & Panen</p>
              </button>

              {/* Pengolah */}
              <button
                onClick={() => {
                  setSuperAdminRoleFilter('pengolah');
                  setActiveTab('directory');
                }}
                className="p-4 rounded-2xl bg-stone-50 hover:bg-amber-50/60 border border-stone-200/80 hover:border-amber-300 transition-all text-left cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Cog className="w-4 h-4" />
                </div>
                <p className="text-xl font-black text-stone-900 mt-3">{pengolahUsers.length}</p>
                <p className="text-xs font-bold text-stone-600">Pabrik / Mill</p>
                <p className="text-[10px] text-stone-400 mt-0.5">Fermentasi & GB</p>
              </button>

              {/* Gudang */}
              <button
                onClick={() => {
                  setSuperAdminRoleFilter('gudang');
                  setActiveTab('directory');
                }}
                className="p-4 rounded-2xl bg-stone-50 hover:bg-blue-50/60 border border-stone-200/80 hover:border-blue-300 transition-all text-left cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Warehouse className="w-4 h-4" />
                </div>
                <p className="text-xl font-black text-stone-900 mt-3">{gudangUsers.length}</p>
                <p className="text-xs font-bold text-stone-600">Gudang & Silo</p>
                <p className="text-[10px] text-stone-400 mt-0.5">Suhu & Karung</p>
              </button>

              {/* Roaster */}
              <button
                onClick={() => {
                  setSuperAdminRoleFilter('roaster');
                  setActiveTab('directory');
                }}
                className="p-4 rounded-2xl bg-stone-50 hover:bg-orange-50/60 border border-stone-200/80 hover:border-orange-300 transition-all text-left cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Flame className="w-4 h-4" />
                </div>
                <p className="text-xl font-black text-stone-900 mt-3">{roasterUsers.length}</p>
                <p className="text-xs font-bold text-stone-600">Roastery</p>
                <p className="text-[10px] text-stone-400 mt-0.5">Mesin & Kurva</p>
              </button>

              {/* Cafe */}
              <button
                onClick={() => {
                  setSuperAdminRoleFilter('cafe');
                  setActiveTab('directory');
                }}
                className="p-4 rounded-2xl bg-stone-50 hover:bg-amber-100/60 border border-stone-200/80 hover:border-amber-400 transition-all text-left cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-200 text-stone-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Coffee className="w-4 h-4" />
                </div>
                <p className="text-xl font-black text-stone-900 mt-3">{cafeUsers.length}</p>
                <p className="text-xs font-bold text-stone-600">Cafe & Kedai</p>
                <p className="text-[10px] text-stone-400 mt-0.5">Menu & Seduhan</p>
              </button>

              {/* Verifikator */}
              <button
                onClick={() => {
                  setSuperAdminRoleFilter('verifikator');
                  setActiveTab('directory');
                }}
                className="p-4 rounded-2xl bg-stone-50 hover:bg-purple-50/60 border border-stone-200/80 hover:border-purple-300 transition-all text-left cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="w-4 h-4" />
                </div>
                <p className="text-xl font-black text-stone-900 mt-3">{verifikatorUsers.length}</p>
                <p className="text-xs font-bold text-stone-600">Verifikator</p>
                <p className="text-[10px] text-stone-400 mt-0.5">Audit & Cupping</p>
              </button>
            </div>
          </div>

          {/* Quick Review: Antrean ACC Mendesak */}
          {pendingUsers.length > 0 && (
            <div className="bg-amber-50/70 rounded-3xl p-6 border border-amber-300/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                  <h3 className="text-base font-black text-amber-950">
                    Antrean Permohonan Mitra Perlu Ditinjau Segera ({pendingUsers.length})
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('approvals')}
                  className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Buka Semua Antrean</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingUsers.slice(0, 4).map((user) => {
                  const roleInfo = ROLE_DETAILS[user.role] || {
                    label: user.role,
                    badgeClass: 'bg-stone-100 text-stone-800 border-stone-300',
                  };

                  return (
                    <div
                      key={user.id}
                      className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                          />
                          <div>
                            <p className="font-bold text-stone-900 text-sm">{user.name}</p>
                            <p className="text-xs text-stone-500">{user.organization}</p>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${roleInfo.badgeClass}`}
                        >
                          {ROLE_ICONS[user.role]}
                          <span>{roleInfo.label}</span>
                        </span>
                      </div>

                      <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200/60">
                        <p className="truncate">
                          <strong>Lokasi:</strong> {user.location}
                        </p>
                        <p className="text-stone-500 truncate mt-0.5">
                          <strong>Kontak:</strong> {user.phone} &bull; {user.email}
                        </p>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-stone-100">
                        <button
                          onClick={() => handleSelectUser(user)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 border border-amber-300 font-bold text-[11px] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Database className="w-3 h-3 text-amber-700" />
                          <span>Master Data</span>
                        </button>

                        <button
                          onClick={() => openRejectModal(user)}
                          className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-[11px] font-bold cursor-pointer"
                        >
                          Tolak
                        </button>

                        <button
                          onClick={() => handleApprove(user.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>ACC</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Transaksi Rantai Pasok Terkini & Status Sistem */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Transaksi Terkini */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Aktivitas Transaksi Rantai Pasok Terkini
                  </h3>
                  <p className="text-xs text-stone-500">
                    Aliran kopi dari kebun, pengolah, gudang, roastery hingga cafe.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('logs')}
                  className="text-xs font-bold text-amber-800 hover:underline cursor-pointer"
                >
                  Lihat Semua
                </button>
              </div>

              <div className="divide-y divide-stone-100 text-xs">
                {transactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded font-bold border border-stone-200">
                          {tx.id}
                        </span>
                        <p className="font-bold text-stone-900 truncate">{tx.itemName}</p>
                      </div>
                      <p className="text-stone-500 text-[11px] truncate">
                        Dari: <strong>{tx.fromName}</strong> &rarr; Ke: <strong>{tx.toName}</strong>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {tx.status}
                      </span>
                      <p className="text-stone-400 text-[10px] mt-0.5">{tx.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Server & Kepatuhan */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">Infrastruktur & Status</h3>
                <p className="text-xs text-stone-500">Kondisi operasional server root sangrAI.</p>

                <div className="space-y-3 mt-4 text-xs">
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Server className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="font-bold text-stone-900">Engine Server PM2</p>
                        <p className="text-[10px] text-stone-500">ID 49 • Port 3032</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Online
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-bold text-stone-900">Cloudflare Edge</p>
                        <p className="text-[10px] text-stone-500">SSL Dynamic Tunnel</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                      Aktif
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="font-bold text-stone-900">EUDR & SCA Seal</p>
                        <p className="text-[10px] text-stone-500">Verifikasi Geodetik</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                      Valid
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 text-center">
                <span className="text-[11px] text-stone-400 font-mono">
                  sangrAI v2.4 • Root Authority
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB: ANTREAN PERSETUJUAN (ACC)                                    */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Permohonan Akun Mitra Menunggu Persetujuan (ACC)
              </h2>
              <p className="text-xs text-stone-500">
                Pendaftar tidak dapat login ke sistem sebelum Anda memberikan ACC pada permohonan mereka.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRegisterModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title="Daftarkan calon mitra baru langsung dari panel Super Admin"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Daftarkan Mitra Baru</span>
              </button>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/80">
                {pendingUsers.length} Permohonan
              </span>
            </div>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-xs space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Semua Pendaftaran Telah Ditinjau</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Tidak ada antrean pendaftar baru yang tertunda. Formulir registrasi publik akan otomatis meneruskan permohonan baru ke halaman ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingUsers.map((user) => {
                const roleInfo = ROLE_DETAILS[user.role] || {
                  label: user.role,
                  badgeClass: 'bg-stone-100 text-stone-800 border-stone-300',
                };

                return (
                  <div
                    key={user.id}
                    className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-sm hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Identity */}
                      <div className="flex items-center gap-3.5">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-300 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-stone-900 text-base">{user.name}</h3>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${roleInfo.badgeClass}`}
                            >
                              {ROLE_ICONS[user.role]}
                              <span>{roleInfo.label}</span>
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
                            <div className="flex items-center gap-1 font-semibold text-stone-700">
                              <Building2 className="w-3.5 h-3.5 text-stone-400" />
                              <span>{user.organization}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-stone-400" />
                              <span>{user.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-stone-400" />
                              <a
                                href={`https://wa.me/${user.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-700 hover:underline font-medium"
                              >
                                {user.phone}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Registration Date */}
                      <div className="text-left sm:text-right text-xs text-stone-500 shrink-0">
                        <div className="flex items-center sm:justify-end gap-1 text-stone-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Waktu Daftar:</span>
                        </div>
                        <p className="font-medium text-stone-700 mt-0.5">
                          {user.registeredAt || 'Hari Ini'}
                        </p>
                      </div>
                    </div>

                    {/* Bio / Facility Description */}
                    {user.bio && (
                      <div className="bg-[#FAF7F2] p-3 rounded-xl border border-stone-200/80 text-xs text-stone-700">
                        <span className="font-bold text-stone-900 mr-1.5">Catatan Pendaftar:</span>
                        <span>{user.bio}</span>
                      </div>
                    )}

                    {/* Action Buttons: ACC / Reject / Delete / Master Data */}
                    <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-stone-500">
                        Username Login: <strong className="font-mono text-stone-800">{user.username || user.email}</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSelectUser(user)}
                          className="px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-300 text-amber-900 hover:bg-amber-500/25 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                          title="Buka data kebun/fasilitas dan master data pendaftar"
                        >
                          <Database className="w-3.5 h-3.5 text-amber-700" />
                          <span>Master Data Pendaftar</span>
                        </button>

                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="px-3 py-2 rounded-xl border border-stone-200 text-stone-500 hover:text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                          title="Hapus berkas pendaftaran ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>

                        <button
                          onClick={() => openRejectModal(user)}
                          className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Tolak</span>
                        </button>

                        <button
                          onClick={() => handleApprove(user.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>ACC / Setujui Akun</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB: DIREKTORI SEMUA MITRA & MASTER DATA                          */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          {/* Search, Actions & Role Filter Toolbar */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
            {/* Row 1: Search Bar & Primary Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-xl">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama mitra, email, kebun, roastery, atau kota..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-amber-500 focus:bg-white transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-stone-200 text-stone-600 hover:bg-stone-300 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                    title="Hapus pencarian"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Action Buttons & Counter */}
              <div className="flex items-center gap-2.5 justify-between sm:justify-end shrink-0">
                <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs text-stone-500">
                  <Users className="w-3.5 h-3.5 text-stone-400" />
                  <span>
                    Menampilkan <strong className="text-stone-800">{filteredUsers.length}</strong> dari {users.length}
                  </span>
                </div>

                <button
                  onClick={() => setRegisterModalOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:shadow-md active:scale-98"
                  title="Daftarkan calon mitra baru langsung dari panel Super Admin"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Daftarkan Mitra</span>
                </button>
              </div>
            </div>

            {/* Row 2: Role Filter Pills (Full-Width Segmented Bar, Never Drops Solitary Pills) */}
            <div className="pt-3 border-t border-stone-100 flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5 mr-1">
                <Filter className="w-3.5 h-3.5 text-stone-400" />
                <span>Filter Peran:</span>
              </span>

              {/* Filter Pills */}
              <button
                onClick={() => setSuperAdminRoleFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  superAdminRoleFilter === 'all'
                    ? 'bg-stone-950 text-white shadow-sm ring-2 ring-stone-900/10'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
                }`}
              >
                <span>Semua</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    superAdminRoleFilter === 'all' ? 'bg-stone-800 text-stone-200' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {users.length}
                </span>
              </button>

              <button
                onClick={() => setSuperAdminRoleFilter('petani')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  superAdminRoleFilter === 'petani'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
                }`}
              >
                <Sprout className="w-3.5 h-3.5" />
                <span>Petani</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    superAdminRoleFilter === 'petani' ? 'bg-emerald-700 text-emerald-100' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {petaniUsers.length}
                </span>
              </button>

              <button
                onClick={() => setSuperAdminRoleFilter('pengolah')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  superAdminRoleFilter === 'pengolah'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
                }`}
              >
                <Cog className="w-3.5 h-3.5" />
                <span>Pengolah</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    superAdminRoleFilter === 'pengolah' ? 'bg-amber-700 text-amber-100' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {pengolahUsers.length}
                </span>
              </button>

              <button
                onClick={() => setSuperAdminRoleFilter('gudang')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  superAdminRoleFilter === 'gudang'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
                }`}
              >
                <Warehouse className="w-3.5 h-3.5" />
                <span>Gudang</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    superAdminRoleFilter === 'gudang' ? 'bg-blue-700 text-blue-100' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {gudangUsers.length}
                </span>
              </button>

              <button
                onClick={() => setSuperAdminRoleFilter('roaster')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  superAdminRoleFilter === 'roaster'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Roaster</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    superAdminRoleFilter === 'roaster' ? 'bg-orange-700 text-orange-100' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {roasterUsers.length}
                </span>
              </button>

              <button
                onClick={() => setSuperAdminRoleFilter('cafe')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  superAdminRoleFilter === 'cafe'
                    ? 'bg-stone-800 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Cafe</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    superAdminRoleFilter === 'cafe' ? 'bg-stone-900 text-stone-200' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {cafeUsers.length}
                </span>
              </button>

              <button
                onClick={() => setSuperAdminRoleFilter('verifikator')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  superAdminRoleFilter === 'verifikator'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Verifikator</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    superAdminRoleFilter === 'verifikator'
                      ? 'bg-purple-700 text-purple-100'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {verifikatorUsers.length}
                </span>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap min-w-[950px]">
                <thead className="bg-[#FAF7F2] text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4 whitespace-nowrap">Nama & Akun</th>
                    <th className="py-3 px-4 whitespace-nowrap">Peran / Stasiun</th>
                    <th className="py-3 px-4 whitespace-nowrap">Organisasi & Lokasi</th>
                    <th className="py-3 px-4 whitespace-nowrap">No. Telepon / WA</th>
                    <th className="py-3 px-4 whitespace-nowrap">Status Akun</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredUsers.map((user) => {
                    const roleInfo = ROLE_DETAILS[user.role] || {
                      label: user.role,
                      badgeClass: 'bg-stone-100 text-stone-800 border-stone-300',
                    };
                    const isSelf = user.id === currentUser?.id;

                    return (
                      <tr key={user.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div
                            onClick={() => handleSelectUser(user)}
                            className="flex items-center gap-3 cursor-pointer group"
                            title="Klik untuk membuka Master Data lengkap pengguna ini"
                          >
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-9 h-9 rounded-xl object-cover border border-stone-200 shrink-0 group-hover:ring-2 group-hover:ring-amber-500 transition-all"
                            />
                            <div>
                              <p className="font-bold text-stone-900 flex items-center gap-1.5 group-hover:text-amber-800 transition-colors">
                                <span className="group-hover:underline whitespace-nowrap">{user.name}</span>
                                {user.isSuperAdmin && (
                                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded border border-amber-300 whitespace-nowrap">
                                    Owner
                                  </span>
                                )}
                              </p>
                              <p className="text-[11px] font-mono text-stone-500 whitespace-nowrap">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold border whitespace-nowrap text-xs shadow-2xs ${roleInfo.badgeClass}`}
                          >
                            {ROLE_ICONS[user.role]}
                            <span>{roleInfo.label}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <p className="font-semibold text-stone-800 max-w-[260px] truncate" title={user.organization}>
                            {user.organization}
                          </p>
                          <p className="text-stone-500 text-[11px] max-w-[260px] truncate" title={user.location}>
                            {user.location}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono text-stone-700 whitespace-nowrap select-all">{user.phone}</span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {user.status === 'pending_approval' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300 text-[11px] whitespace-nowrap">
                              <Clock className="w-3.5 h-3.5 text-amber-700" />
                              <span>Menunggu ACC</span>
                            </span>
                          ) : user.status === 'rejected' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 font-bold border border-rose-300 text-[11px] whitespace-nowrap">
                              <XCircle className="w-3.5 h-3.5 text-rose-700" />
                              <span>Ditolak</span>
                            </span>
                          ) : user.status === 'suspended' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-200 text-stone-800 font-bold text-[11px] whitespace-nowrap">
                              <Ban className="w-3.5 h-3.5 text-stone-600" />
                              <span>Ditangguhkan</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 text-[11px] whitespace-nowrap">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Aktif</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Master Data Inspector Button */}
                            <button
                              onClick={() => handleSelectUser(user)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 border border-amber-300 font-bold text-[11px] flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                              title="Buka Master Data Lengkap (Kebun/Roasting/Mill/Gudang/Kafe/Sertifikasi)"
                            >
                              <Database className="w-3 h-3 text-amber-700" />
                              <span>Master Data</span>
                            </button>

                            {user.status === 'pending_approval' ? (
                              <button
                                onClick={() => handleApprove(user.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                              >
                                ACC
                              </button>
                            ) : (
                              <>
                                {!isSelf && (
                                  <>
                                    <button
                                      onClick={() => loginAsUser(user.id)}
                                      className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-[11px] cursor-pointer flex items-center gap-1"
                                      title="Masuk sebagai akun mitra ini untuk inspeksi"
                                    >
                                      <LogIn className="w-3 h-3" />
                                      <span>Masuk</span>
                                    </button>

                                    <button
                                      onClick={() => handleSuspendToggle(user.id)}
                                      className="px-2 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 text-[11px] cursor-pointer"
                                      title={user.status === 'suspended' ? 'Aktifkan kembali' : 'Tangguhkan sementara'}
                                    >
                                      {user.status === 'suspended' ? 'Aktifkan' : 'Suspend'}
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB: AUDIT LOG & TRANSAKSI                                        */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Log Transaksi & Riwayat ACC Super Admin
              </h3>
              <p className="text-xs text-stone-500">
                Catatan resmi tindakan administratif dan aliran transaksi rantai pasok kopi.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-stone-400">
              Total {transactions.length} Transaksi
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200/60 hover:bg-stone-100/60 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-stone-200 text-stone-800 px-1.5 py-0.5 rounded font-bold">
                      {tx.id}
                    </span>
                    <span className="font-bold text-stone-900">{tx.itemName}</span>
                  </div>
                  <p className="text-stone-500 text-[11px]">
                    Dari: <strong>{tx.fromName}</strong> ({tx.fromRole}) &rarr; Ke:{' '}
                    <strong>{tx.toName}</strong> ({tx.toRole})
                  </p>
                </div>

                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {tx.status}
                  </span>
                  <p className="text-stone-400 text-[10px] mt-0.5">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Rejection Modal Dialog                                            */}
      {/* ----------------------------------------------------------------- */}
      {rejectModalOpen && targetRejectUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Tolak Pendaftaran Mitra</h3>
                <p className="text-xs text-stone-500">{targetRejectUser.name} &bull; {targetRejectUser.organization}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                Alasan Penolakan (Akan tampil saat pendaftar mencoba login):
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Tuliskan alasan penolakan..."
                className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer shadow-md"
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Partner Registration Modal */}
      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />
    </div>
  );
};
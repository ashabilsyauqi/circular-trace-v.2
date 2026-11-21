import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Building2,
  Warehouse,
  Flame,
  Coffee,
  ShieldCheck,
  Package,
  CreditCard,
  Users,
  History,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Zap,
  Globe,
  DollarSign,
  QrCode,
  TreePine,
  Sparkles,
  Settings,
  Sliders,
  ChevronRight,
  Store,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { useCoffee } from '../../../context/CoffeeContext';
import {
  DEFAULT_SERVICE_CONFIGS,
  DEFAULT_SUBSCRIBED_ORGANIZATIONS,
  DEFAULT_ECOSYSTEM_TELEMETRY,
  DEFAULT_SAAS_INVOICES,
  getSavedServiceConfigs,
  getSavedSubscriptions,
  getSavedTelemetry,
} from '../../../data/superAdminData';

export const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { users, currentUser } = useCoffee();

  const serviceConfigs = useMemo(() => getSavedServiceConfigs(), []);
  const subscriptions = useMemo(() => getSavedSubscriptions(), []);
  const telemetry = useMemo(() => getSavedTelemetry(), []);
  const invoices = DEFAULT_SAAS_INVOICES;

  // Realtime user counts per service
  const kelompokTaniCount = (users || []).filter(
    (u) =>
      u.role === 'admin_kelompok_tani' ||
      u.role === 'petani' ||
      u.role === 'pengolah' ||
      u.role === 'ict'
  ).length;
  const gudangCount = (users || []).filter((u) => u.role === 'gudang').length;
  const roasterCount = (users || []).filter((u) => u.role === 'roaster').length;
  const cafeCount = (users || []).filter((u) => u.role === 'cafe').length;
  const verifikatorCount = (users || []).filter((u) => u.role === 'verifikator').length;

  const totalMRR = subscriptions
    .filter((s) => s.status === 'active' || s.status === 'trial')
    .reduce((acc, s) => acc + (s.mrrContribution || 0), 0);
  const totalARR = totalMRR * 12;

  // 5 Pillars metadata
  const pillars = [
    {
      id: 'admin_kelompok_tani' as const,
      name: 'Kelompok Tani & Hulu',
      subtitle: 'Kebun Petani, Wet/Dry Mill & Tim ICS',
      icon: Building2,
      color: 'amber',
      bgCard: 'bg-amber-50/70 border-amber-200',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      usersCount: kelompokTaniCount,
      tenantsCount: 6,
      maxUsersPerOrg: serviceConfigs.admin_kelompok_tani.quota.maxUsersPerOrg,
      metricKey: 'Luas Lahan EUDR',
      metricVal: '512.4 Ha (342 Kebun)',
      status: serviceConfigs.admin_kelompok_tani.status,
    },
    {
      id: 'gudang' as const,
      name: 'Gudang & QA Lab',
      subtitle: 'Karung Hermetik, Uji Kadar Air & Aw',
      icon: Warehouse,
      color: 'blue',
      bgCard: 'bg-blue-50/70 border-blue-200',
      badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
      usersCount: gudangCount,
      tenantsCount: 3,
      maxUsersPerOrg: serviceConfigs.gudang.quota.maxUsersPerOrg,
      metricKey: 'Green Bean Stored',
      metricVal: '42.1 Ton (Specialty)',
      status: serviceConfigs.gudang.status,
    },
    {
      id: 'roaster' as const,
      name: 'Artisan Roastery',
      subtitle: 'Profiling Agtron, Work Orders & Sensory',
      icon: Flame,
      color: 'orange',
      bgCard: 'bg-orange-50/70 border-orange-200',
      badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
      usersCount: roasterCount,
      tenantsCount: 4,
      maxUsersPerOrg: serviceConfigs.roaster.quota.maxUsersPerOrg,
      metricKey: 'Roasted Bean Pack',
      metricVal: '21.2 Ton (B2B / Retail)',
      status: serviceConfigs.roaster.status,
    },
    {
      id: 'cafe' as const,
      name: 'Specialty Cafe & Kedai',
      subtitle: 'Seduhan Cangkir, Digital Menu & Retail',
      icon: Coffee,
      color: 'stone',
      bgCard: 'bg-stone-100/70 border-stone-300',
      badgeBg: 'bg-stone-200 text-stone-900 border-stone-400',
      usersCount: cafeCount,
      tenantsCount: 4,
      maxUsersPerOrg: serviceConfigs.cafe.quota.maxUsersPerOrg,
      metricKey: 'Farm-to-Cup Scans',
      metricVal: '41,920 Tamu Kedai',
      status: serviceConfigs.cafe.status,
    },
    {
      id: 'verifikator' as const,
      name: 'Verifikator Mutu (Auditor)',
      subtitle: 'Audit Lapangan & Stempel SHA-256',
      icon: ShieldCheck,
      color: 'purple',
      bgCard: 'bg-purple-50/70 border-purple-200',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
      usersCount: verifikatorCount,
      tenantsCount: 2,
      maxUsersPerOrg: serviceConfigs.verifikator.quota.maxUsersPerOrg,
      metricKey: 'Stempel SHA-256',
      metricVal: '100% Valid & Verified',
      status: serviceConfigs.verifikator.status,
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Executive Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#120B08] via-[#1E110A] to-[#0D0705] text-white p-6 sm:p-8 border border-amber-900/40 shadow-2xl relative overflow-hidden">
        {/* Glow ambient decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-md shadow-amber-950/40 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-stone-950" />
                Super Admin Console
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-stone-300 border border-white/15">
                🟢 Platform Owner HQ • Live Production
              </span>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2">
              <Link
                to="/admin/superadmin/subscriptions"
                className="py-2 px-3.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 font-bold text-xs border border-purple-700/60 shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Subscribed Users</span>
              </Link>

              <Link
                to="/admin/superadmin/packages"
                className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md shadow-amber-950/30 flex items-center gap-1.5 transition-colors"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Katalog Paket SaaS</span>
              </Link>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Pusat Kendali Ekosistem &amp; Executive SaaS Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-3xl mt-1 leading-relaxed">
              Monitoring holistik platform CircularTrace: pendapatan berulang (MRR), utilisasi kuota pilar hulu-hilir, kepatuhan deforestasi EUDR, dan aktivitas transaksi komoditas kopi specialty.
            </p>
          </div>

          {/* 4 Core Executive KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {/* KPI 1: MRR */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center justify-between text-[11px] text-stone-400 font-bold uppercase tracking-wider mb-1">
                <span>Monthly Recurring (MRR)</span>
                <span className="text-emerald-400 font-bold">+14.2% MoM</span>
              </div>
              <div className="text-2xl font-black text-emerald-400">
                Rp {totalMRR.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">
                ARR: <strong className="text-white">Rp {totalARR.toLocaleString('id-ID')}</strong>/thn
              </div>
            </div>

            {/* KPI 2: Subscribed Tenants */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center justify-between text-[11px] text-stone-400 font-bold uppercase tracking-wider mb-1">
                <span>Organisasi Pelanggan</span>
                <span className="text-amber-400 font-bold">5 Pilar</span>
              </div>
              <div className="text-2xl font-black text-white">
                {subscriptions.length} <span className="text-sm font-bold text-stone-400">Tenant</span>
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">
                Retensi: <strong className="text-emerald-400">96.4%</strong> • Churn &lt; 4%
              </div>
            </div>

            {/* KPI 3: Total Users */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center justify-between text-[11px] text-stone-400 font-bold uppercase tracking-wider mb-1">
                <span>Akun Pengguna Terdaftar</span>
                <span className="text-cyan-400 font-bold">Realtime</span>
              </div>
              <div className="text-2xl font-black text-white">
                {users.length} <span className="text-sm font-bold text-stone-400">Pengguna</span>
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">
                Verifikasi: <strong className="text-emerald-400">100% Email Valid</strong>
              </div>
            </div>

            {/* KPI 4: Traced Volume */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center justify-between text-[11px] text-stone-400 font-bold uppercase tracking-wider mb-1">
                <span>Volume Kopi Tertelusur</span>
                <span className="text-purple-400 font-bold">Farm-to-Cup</span>
              </div>
              <div className="text-2xl font-black text-cyan-400">
                {(telemetry.totalTracedVolumeKg / 1000).toFixed(1)}{' '}
                <span className="text-sm font-bold text-stone-300">Ton</span>
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">
                Scan Tamu: <strong className="text-white">{telemetry.totalFarmToCupQrScans.toLocaleString('id-ID')} QR</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Pilar Rantai Pasok (5 Service Clusters Overview) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
              Status 5 Pilar Layanan Rantai Pasok (Service Control)
            </h2>
            <p className="text-xs text-stone-500">
              Pantau jumlah pengguna, kuota seat per organisasi, dan pengaturan masing-masing service
            </p>
          </div>
          <Link
            to="/admin/superadmin/services/admin_kelompok_tani"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline"
          >
            <span>Buka Konfigurasi Lengkap</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className={`p-4 rounded-3xl border flex flex-col justify-between transition-all hover:shadow-md ${p.bgCard}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="p-2.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
                      <Icon className="w-5 h-5 text-stone-900" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      🟢 {p.status === 'active' ? 'Aktif' : p.status}
                    </span>
                  </div>

                  <h3 className="font-black text-xs text-stone-900 leading-tight">{p.name}</h3>
                  <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">{p.subtitle}</p>

                  <div className="my-3 pt-2 border-t border-stone-200/60 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-stone-500">User Terdaftar:</span>
                      <strong className="text-stone-900 font-black">{p.usersCount} Akun</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-stone-500">Batas/Organisasi:</span>
                      <span className="text-stone-700 font-bold">max {p.maxUsersPerOrg}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-stone-500">{p.metricKey}:</span>
                      <span className="text-amber-900 font-bold text-[10px]">{p.metricVal}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/admin/superadmin/services/${p.id}`}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Settings className="w-3.5 h-3.5 text-stone-500" />
                  <span>Setting Service</span>
                  <ArrowRight className="w-3 h-3 text-stone-400 ml-auto" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Middle Section: Subscriptions Table Preview & Telemetry Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Pelanggan Berlangganan Terbaru */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-stone-900">
                    Pelanggan Berlangganan Aktif (Tenant Subscriptions)
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Daftar organisasi dengan status langganan dan siklus billing
                  </p>
                </div>
              </div>

              <Link
                to="/admin/superadmin/subscriptions"
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline"
              >
                <span>Lihat Semua Pelanggan ({subscriptions.length})</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Organisasi Pelanggan</th>
                    <th className="py-3 px-4">Paket SaaS</th>
                    <th className="py-3 px-4">Tagihan</th>
                    <th className="py-3 px-4">Alokasi Seat</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {subscriptions.slice(0, 5).map((sub) => (
                    <tr key={sub.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900 leading-tight">
                          {sub.organizationName}
                        </div>
                        <div className="text-[10px] text-stone-500">{sub.picName}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-stone-800">
                        {sub.packageName}
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">
                        Rp {sub.pricePerCycle.toLocaleString('id-ID')}
                        <span className="text-[10px] text-stone-400 font-normal block capitalize">
                          {sub.billingCycle}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-stone-100 font-mono text-[11px] font-bold text-stone-800">
                          {sub.userSeatsUsed}/{sub.userSeatsLimit} seats
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sub.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : sub.status === 'trial'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {sub.status === 'active'
                            ? '🟢 Aktif'
                            : sub.status === 'trial'
                            ? '🟡 Trial'
                            : '🔴 Jatuh Tempo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">
              Total Kontribusi MRR dari pelanggan aktif:{' '}
              <strong className="text-stone-900">Rp {totalMRR.toLocaleString('id-ID')}</strong>/bulan
            </span>
            <Link
              to="/admin/superadmin/subscriptions"
              className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-black text-white font-bold text-xs transition-colors"
            >
              Kelola Billing &amp; Subscription →
            </Link>
          </div>
        </div>

        {/* Right Column: Telemetri Sirkularitas & Quick Actions */}
        <div className="space-y-6">
          {/* Box 1: Dampak Keberlanjutan */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <TreePine className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-xs text-stone-900 uppercase tracking-wider">
                  Dampak Lingkungan &amp; EUDR
                </h3>
                <span className="text-[10px] text-stone-400">Zero Deforestation Compliance</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between">
                <span className="font-bold">Kepatuhan EUDR:</span>
                <span className="font-black text-base text-emerald-800">
                  {telemetry.eudrComplianceRatePercent}%
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Lahan Terpetakan:</span>
                <span className="font-bold text-stone-900">{telemetry.totalGeofencedHectares} Ha</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Limbah Sirkular:</span>
                <span className="font-bold text-purple-700">
                  {(telemetry.totalCircularWasteDivertedKg / 1000).toFixed(1)} Ton Terolah
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-stone-500">Skor Sirkularitas:</span>
                <span className="font-bold text-stone-900">
                  {telemetry.circularityScoreAverage} / 100 (Grade A)
                </span>
              </div>
            </div>

            <Link
              to="/admin/superadmin/telemetry"
              className="w-full py-2 px-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Buka Dasbor Telemetri Lengkap</span>
            </Link>
          </div>

          {/* Box 2: Quick Links Console Super Admin */}
          <div className="bg-[#1C120C] text-white p-5 rounded-3xl border border-amber-900/30 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>Akses Cepat Platform Owner</span>
            </div>

            <div className="space-y-1.5">
              <Link
                to="/admin/superadmin/packages"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-colors"
              >
                <span>📦 Buat / Ubah Paket SaaS Baru</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>

              <Link
                to="/admin/transaksi"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-colors"
              >
                <span>📑 Rekap Buku Transaksi Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>

              <Link
                to="/admin/users"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-colors"
              >
                <span>👥 Master Kelola Semua Pengguna ({users.length})</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

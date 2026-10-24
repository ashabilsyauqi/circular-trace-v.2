import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { AppUser, UserRole } from '../../types/coffee';
import { ROLE_DETAILS } from '../../constants/roles';
import {
  ArrowLeft,
  User,
  Building2,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Coffee,
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Thermometer,
  Droplets,
  Scale,
  Compass,
  FileText,
  Activity,
  LogIn,
  Ban,
  ExternalLink,
  ChevronRight,
  Database,
  Tag,
  Check,
  Sparkles,
} from 'lucide-react';

export interface UserMasterDataDetailPageProps {
  user: AppUser;
  onBack: () => void;
}

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  petani: <Sprout className="w-4 h-4 text-emerald-600" />,
  pengolah: <Cog className="w-4 h-4 text-amber-600" />,
  gudang: <Warehouse className="w-4 h-4 text-blue-600" />,
  roaster: <Flame className="w-4 h-4 text-orange-600" />,
  cafe: <Coffee className="w-4 h-4 text-stone-700" />,
  verifikator: <Award className="w-4 h-4 text-purple-600" />,
  superadmin: <ShieldCheck className="w-4 h-4 text-amber-500" />,
};

export const UserMasterDataDetailPage: React.FC<UserMasterDataDetailPageProps> = ({
  user,
  onBack,
}) => {
  const {
    coffeeFarms,
    farmerLots,
    processingBatches,
    processedLots,
    warehouseLots,
    workOrders,
    roastedLots,
    masterProfiles,
    roasterMachines,
    cafeProducts,
    cafeInventory,
    verificationStamps,
    transactions,
    loginAsUser,
    suspendUser,
  } = useCoffee();

  const [activeTab, setActiveTab] = useState<'operational' | 'transactions' | 'profile'>('operational');

  const roleInfo = ROLE_DETAILS[user.role] || {
    label: user.role,
    badgeClass: 'bg-stone-100 text-stone-800 border-stone-300',
  };

  // 1. Role-specific Operational Data Filtering
  // Petani Data
  const userFarms = coffeeFarms.filter(
    (f) => f.farmerId === user.id || f.farmerName.toLowerCase() === user.name.toLowerCase()
  );
  const userHarvestLots = farmerLots.filter(
    (l) => l.farmerId === user.id || l.farmerName.toLowerCase() === user.name.toLowerCase()
  );

  // Pengolah Data
  const userProcessingBatches = processingBatches.filter(
    (b) => b.processorId === user.id || b.processorName.toLowerCase() === user.organization.toLowerCase()
  );
  const userProcessedLots = processedLots.filter(
    (p) => p.processorId === user.id || p.processorName.toLowerCase() === user.organization.toLowerCase()
  );

  // Gudang Data
  const userWarehouseLots = warehouseLots.filter(
    (w) => w.warehouseId === user.id || w.warehouseName.toLowerCase() === user.organization.toLowerCase()
  );

  // Roaster Data
  const userWorkOrders = workOrders.filter(
    (wo) =>
      wo.origin?.toLowerCase().includes(user.location.toLowerCase()) ||
      user.organization.toLowerCase().includes('roast') ||
      true
  );
  const userRoastedLots = roastedLots.filter(
    (r) =>
      r.roasterId === user.id ||
      r.roasterName.toLowerCase() === user.organization.toLowerCase() ||
      r.roasterName.toLowerCase() === user.name.toLowerCase()
  );

  // Cafe Data
  const userCafeProducts = cafeProducts.filter(
    (cp) => cp.cafeId === user.id || cp.cafeName.toLowerCase() === user.organization.toLowerCase()
  );
  const userCafeInventory = cafeInventory.filter(
    (ci) => ci.cafeId === user.id || ci.cafeName.toLowerCase() === user.organization.toLowerCase()
  );

  // Verifikator Data
  const userVerifications = verificationStamps.filter(
    (v) => v.verifierId === user.id || v.verifierName.toLowerCase() === user.name.toLowerCase()
  );

  // 2. Transactions for this user
  const userTransactions = transactions.filter(
    (t) =>
      t.fromName === user.name ||
      t.toName === user.name ||
      t.fromName === user.organization ||
      t.toName === user.organization
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* ----------------------------------------------------------------- */}
      {/* Top Navigation & Breadcrumbs Bar                                  */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-2 shadow-2xs transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-stone-600 shrink-0" />
            <span className="whitespace-nowrap">Kembali ke Master Data</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-stone-400 min-w-0">
            <span>/</span>
            <span className="hover:text-stone-700 cursor-pointer whitespace-nowrap shrink-0" onClick={onBack}>Master Data</span>
            <span>/</span>
            <span className="font-bold text-stone-900 truncate">{user.name}</span>
          </div>
        </div>

        {/* Top Quick Actions (Zero Text Wrapping) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full shrink-0">
          {user.status === 'pending_approval' ? (
            <span className="bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0">
              Menunggu Persetujuan
            </span>
          ) : user.status === 'suspended' ? (
            <span className="bg-rose-100 text-rose-800 border border-rose-300 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0">
              Akun Ditangguhkan
            </span>
          ) : (
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Aktif Terverifikasi</span>
            </span>
          )}

          <button
            onClick={() => loginAsUser(user.id)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all whitespace-nowrap shrink-0"
            title="Masuk sebagai akun mitra ini untuk melihat dasbornya secara langsung"
          >
            <LogIn className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Masuk Sebagai Mitra</span>
          </button>

          <button
            onClick={() => suspendUser(user.id)}
            className="px-3 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all whitespace-nowrap shrink-0"
          >
            <Ban className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            <span className="whitespace-nowrap">{user.status === 'suspended' ? 'Aktifkan Akun' : 'Tangguhkan (Suspend)'}</span>
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Executive Hero Partner Banner                                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-950 rounded-3xl p-6 sm:p-8 text-white border border-stone-800 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-amber-400/80 shadow-md shrink-0 ring-4 ring-white/10"
            />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{user.name}</h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${roleInfo.badgeClass}`}
                >
                  {ROLE_ICONS[user.role]}
                  <span>{roleInfo.label}</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs sm:text-sm text-stone-300">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-white">{user.organization}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-stone-200">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Identitas & Ringkasan Kemitraan Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 shrink-0 min-w-[260px] space-y-2.5">
            <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 pb-1.5 border-b border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Identitas Kemitraan</span>
            </div>
            <div className="space-y-1.5 text-xs text-stone-200">
              <div className="flex items-center justify-between gap-3">
                <span className="text-stone-400">ID Akun:</span>
                <span className="font-mono font-bold text-white text-[11px]">{user.id}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-stone-400">Terdaftar:</span>
                <span className="font-medium text-stone-300 text-[11px]">{user.registeredAt || 'Akun Bawaan'}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-stone-400">Aliran Transaksi:</span>
                <span className="font-bold text-amber-300 text-[11px]">{userTransactions.length} Transaksi Rantai Pasok</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Navigation Tabs Bar (Zero Text Wrapping)                          */}
      {/* ----------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setActiveTab('operational')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'operational'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Database className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">
              {user.role === 'petani' && 'Data Kebun & Panen'}
              {user.role === 'pengolah' && 'Data Olah Mill & Green Bean'}
              {user.role === 'gudang' && 'Data Pergudangan & QA'}
              {user.role === 'roaster' && 'Data Roasting & SPK'}
              {user.role === 'cafe' && 'Menu Resep & Seduh'}
              {user.role === 'verifikator' && 'Sertifikasi Cupping'}
              {user.role === 'superadmin' && 'Akses & Otoritas Root'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'transactions'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Activity className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Transaksi Pasok ({userTransactions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Profil Kredensial &amp; Legal</span>
          </button>
        </div>

        <div className="px-3 py-1.5 text-xs text-stone-500 hidden md:flex items-center gap-2 whitespace-nowrap shrink-0">
          <span>Stasiun: <strong className="text-stone-800">{user.organization}</strong></span>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Tab Body Content (Full Page View)                                 */}
      {/* ----------------------------------------------------------------- */}
      <div className="space-y-6">
        {/* TAB 1: OPERATIONAL MASTER DATA */}
        {activeTab === 'operational' && (
          <div className="space-y-6">
            {/* ============================================================= */}
            {/* PETANI: DATA KEBUN / LAHAN & PANEN CERI MERAH                 */}
            {/* ============================================================= */}
            {user.role === 'petani' && (
              <div className="space-y-6">
                {/* 1. Lahan & Kebun Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                      <Sprout className="w-4 h-4 text-emerald-600" />
                      <span>Data Kebun Terdaftar ({userFarms.length})</span>
                    </h3>
                    <span className="text-xs text-stone-500">
                      Terintegrasi Koordinat GPS &amp; Kepatuhan EUDR
                    </span>
                  </div>

                  {userFarms.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white border border-stone-200 text-center text-xs text-stone-500 space-y-2">
                      <p className="font-semibold text-stone-700">Belum Ada Kebun Terdata Khusus</p>
                      <p>Petani ini belum mencatat batas patok kebun spesifik. Lahan kebun standar Pangalengan (1.550 mdpl) berlaku sebagai basis data.</p>
                    </div>
                  ) : (
                    userFarms.map((farm) => (
                      <div
                        key={farm.id}
                        className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded font-bold">
                                {farm.id}
                              </span>
                              <h4 className="font-bold text-stone-900 text-base">
                                {farm.farmName}
                              </h4>
                            </div>
                            <p className="text-xs text-stone-500 mt-1">{farm.location}, {farm.province}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-100 text-amber-900 text-xs px-3 py-1 rounded-full font-bold">
                              Elevasi: {farm.altitudeDisplay}
                            </span>
                            {farm.coordinates && (
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${farm.coordinates.latitude},${farm.coordinates.longitude}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                              >
                                <Compass className="w-3.5 h-3.5 text-stone-600" />
                                <span>Buka Peta GPS</span>
                                <ExternalLink className="w-3 h-3 text-stone-400" />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Patok Batas Lahan Table */}
                        {farm.patokList && farm.patokList.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                              Patok Koordinat Batas Lahan Fisik (EUDR Geolocation)
                            </span>
                            <div className="overflow-x-auto rounded-xl border border-stone-200">
                              <table className="w-full text-left text-xs whitespace-nowrap min-w-[700px]">
                                <thead className="bg-[#FAF7F2] text-stone-600 font-bold border-b border-stone-200">
                                  <tr>
                                    <th className="py-2.5 px-3">Kode Patok</th>
                                    <th className="py-2.5 px-3">Label / Penanda</th>
                                    <th className="py-2.5 px-3">Latitude</th>
                                    <th className="py-2.5 px-3">Longitude</th>
                                    <th className="py-2.5 px-3">Kondisi Fisik</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                  {farm.patokList.map((p) => (
                                    <tr key={p.id} className="hover:bg-stone-50">
                                      <td className="py-2 px-3 font-mono font-bold text-stone-900">{p.id}</td>
                                      <td className="py-2 px-3">{p.name}</td>
                                      <td className="py-2 px-3 font-mono">{p.latitude.toFixed(6)}</td>
                                      <td className="py-2 px-3 font-mono">{p.longitude.toFixed(6)}</td>
                                      <td className="py-2 px-3">
                                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                          {p.condition || 'Terverifikasi Baik'}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* 2. Panen Ceri Merah Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-emerald-600" />
                      <span>Data Lot Panen ({userHarvestLots.length})</span>
                    </h3>
                    <span className="text-xs text-stone-500">Kadar Gula Brix &amp; Sortasi Petik Merah</span>
                  </div>

                  {userHarvestLots.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white border border-stone-200 text-center text-xs text-stone-500">
                      Belum ada lot panen ceri segar yang terdaftar untuk petani ini.
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap min-w-[700px]">
                          <thead className="bg-[#FAF7F2] text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px]">
                            <tr>
                              <th className="py-3 px-4">Lot ID</th>
                              <th className="py-3 px-4">Varietas</th>
                              <th className="py-3 px-4">Tgl Panen</th>
                              <th className="py-3 px-4">Berat Total (kg)</th>
                              <th className="py-3 px-4">Brix (Kemanisan)</th>
                              <th className="py-3 px-4">Metode Petik</th>
                              <th className="py-3 px-4">Status &amp; Verifikasi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {userHarvestLots.map((lot) => (
                              <tr key={lot.id} className="hover:bg-stone-50">
                                <td className="py-3 px-4 font-mono font-bold text-emerald-800">{lot.id}</td>
                                <td className="py-3 px-4 font-semibold text-stone-900">{lot.variety}</td>
                                <td className="py-3 px-4 text-stone-600">{lot.harvestDate}</td>
                                <td className="py-3 px-4 font-bold text-stone-900">{lot.totalWeightKg} kg</td>
                                <td className="py-3 px-4">
                                  <span className="font-bold text-amber-700">{lot.brix}&deg; Brix</span>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-stone-600 font-medium">{lot.pickingMethod}</span>
                                </td>
                                <td className="py-3 px-4">
                                  {lot.verificationStatus === 'verified' ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      Verified QA
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                                      Pending Audit
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* PENGOLAH: DATA BATCH FERMENTASI & GREEN BEAN                   */}
            {/* ============================================================= */}
            {user.role === 'pengolah' && (
              <div className="space-y-6">
                {/* 1. Batch Olah Mill */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                    <Cog className="w-4 h-4 text-amber-600" />
                    <span>Data Batch Olahan Mill ({userProcessingBatches.length})</span>
                  </h3>

                  {userProcessingBatches.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white border border-stone-200 text-center text-xs text-stone-500">
                      Belum ada batch pengolahan aktif pada stasiun mill ini.
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap min-w-[700px]">
                          <thead className="bg-[#FAF7F2] text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px]">
                            <tr>
                              <th className="py-3 px-4">Batch ID</th>
                              <th className="py-3 px-4">Kode Batch</th>
                              <th className="py-3 px-4">Metode Fermentasi</th>
                              <th className="py-3 px-4">Input Ceri</th>
                              <th className="py-3 px-4">Metode Penjemuran</th>
                              <th className="py-3 px-4">Target Kadar Air</th>
                              <th className="py-3 px-4">Status &amp; Tahapan</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {userProcessingBatches.map((b) => (
                              <tr key={b.id} className="hover:bg-stone-50">
                                <td className="py-3 px-4 font-mono font-bold text-amber-800">{b.id}</td>
                                <td className="py-3 px-4 font-mono text-stone-600">{b.batchCode}</td>
                                <td className="py-3 px-4 font-bold text-stone-900">
                                  {b.fermentationLog?.method || 'Natural / Dry'}
                                </td>
                                <td className="py-3 px-4 font-bold text-stone-900">
                                  {b.intakeLog?.cherryWeightKg || 1200} kg
                                </td>
                                <td className="py-3 px-4 text-stone-600">
                                  {b.dryingLog?.dryingMethod || 'Solar Dryer Raised Bed'}
                                </td>
                                <td className="py-3 px-4 font-bold text-emerald-700">
                                  {b.dryingLog?.finalMoisturePercent || 11.5}%
                                </td>
                                <td className="py-3 px-4">
                                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {b.currentStage || b.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Green Bean Output Stock */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                    <Database className="w-4 h-4 text-amber-600" />
                    <span>Data Stok Green Bean ({userProcessedLots.length})</span>
                  </h3>

                  {userProcessedLots.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white border border-stone-200 text-center text-xs text-stone-500">
                      Belum ada stok green bean siap jual yang tercatat di mill ini.
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap min-w-[700px]">
                          <thead className="bg-[#FAF7F2] text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px]">
                            <tr>
                              <th className="py-3 px-4">Lot ID</th>
                              <th className="py-3 px-4">Metode Olah</th>
                              <th className="py-3 px-4">Kadar Air (%)</th>
                              <th className="py-3 px-4">Grading Mutu</th>
                              <th className="py-3 px-4">Cacat Fisik</th>
                              <th className="py-3 px-4">Stok Tersedia (kg)</th>
                              <th className="py-3 px-4">Harga / kg</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {userProcessedLots.map((lot) => (
                              <tr key={lot.id} className="hover:bg-stone-50">
                                <td className="py-3 px-4 font-mono font-bold text-amber-800">{lot.id}</td>
                                <td className="py-3 px-4 font-semibold text-stone-900">{lot.processMethod}</td>
                                <td className="py-3 px-4 font-mono font-bold text-emerald-700">{lot.moistureContentPercent}%</td>
                                <td className="py-3 px-4 font-bold text-stone-900">{lot.grade}</td>
                                <td className="py-3 px-4 text-stone-600">{lot.defectCount} defect</td>
                                <td className="py-3 px-4 font-bold text-stone-800">{lot.availableWeightKg} kg</td>
                                <td className="py-3 px-4 font-mono font-bold text-stone-900">
                                  Rp {lot.pricePerKg.toLocaleString('id-ID')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* GUDANG: DATA LOT PERGUDANGAN SILO / GRAINPRO                  */}
            {/* ============================================================= */}
            {user.role === 'gudang' && (
              <div className="space-y-3">
                <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                  <Warehouse className="w-4 h-4 text-blue-600" />
                  <span>Data Lot Gudang Silo ({userWarehouseLots.length})</span>
                </h3>

                {userWarehouseLots.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-white border border-stone-200 text-center text-xs text-stone-500">
                    Belum ada lot green bean yang terdaftar di silo pergudangan ini.
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs whitespace-nowrap min-w-[700px]">
                        <thead className="bg-[#FAF7F2] text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px]">
                          <tr>
                            <th className="py-3 px-4">Lot ID</th>
                            <th className="py-3 px-4">Suhu &amp; Kelembaban</th>
                            <th className="py-3 px-4">Jenis Kemasan</th>
                            <th className="py-3 px-4">Skor SCA Teruji</th>
                            <th className="py-3 px-4">Stok (kg)</th>
                            <th className="py-3 px-4">Lokasi Rak / Silo</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {userWarehouseLots.map((w) => (
                            <tr key={w.id} className="hover:bg-stone-50">
                              <td className="py-3 px-4 font-mono font-bold text-blue-800">{w.id}</td>
                              <td className="py-3 px-4 text-stone-600">{w.temperatureCelsius}&deg;C &bull; {w.humidityPercent}% RH</td>
                              <td className="py-3 px-4 text-stone-900 font-semibold">{w.packagingType}</td>
                              <td className="py-3 px-4 font-bold text-emerald-700">{w.verifiedScaScore} SCA</td>
                              <td className="py-3 px-4 font-bold text-stone-900">{w.weightKg} kg</td>
                              <td className="py-3 px-4 text-stone-600">{w.storageLocation || 'Silo Utama'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================= */}
            {/* ROASTER: DATA WORK ORDERS & PROFIL PENYANGRAIAN               */}
            {/* ============================================================= */}
            {user.role === 'roaster' && (
              <div className="space-y-6">
                {/* 1. Work Orders Roasting */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-600" />
                    <span>Data SPK Roasting ({userWorkOrders.length})</span>
                  </h3>

                  {userWorkOrders.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white border border-stone-200 text-center text-xs text-stone-500">
                      Belum ada surat perintah kerja roasting untuk roastery ini.
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap min-w-[700px]">
                          <thead className="bg-[#FAF7F2] text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px]">
                            <tr>
                              <th className="py-3 px-4">WO ID</th>
                              <th className="py-3 px-4">No. Dokumen SPK</th>
                              <th className="py-3 px-4">Green Bean Digunakan</th>
                              <th className="py-3 px-4">Target Profil</th>
                              <th className="py-3 px-4">Target Green (kg)</th>
                              <th className="py-3 px-4">Target Roast (kg)</th>
                              <th className="py-3 px-4">Status SPK</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {userWorkOrders.map((wo) => (
                              <tr key={wo.id} className="hover:bg-stone-50">
                                <td className="py-3 px-4 font-mono font-bold text-orange-800">{wo.id}</td>
                                <td className="py-3 px-4 font-mono text-stone-600">{wo.woNumber}</td>
                                <td className="py-3 px-4 font-semibold text-stone-900">{wo.greenBeanName || wo.greenLotId}</td>
                                <td className="py-3 px-4 text-stone-700 font-bold">{wo.masterProfileName || wo.targetRoastLevel}</td>
                                <td className="py-3 px-4 text-stone-900">{wo.targetGreenKg} kg</td>
                                <td className="py-3 px-4 text-stone-900 font-bold">{wo.targetRoastedKg} kg</td>
                                <td className="py-3 px-4">
                                  <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {wo.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Roasted Bean Lots */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-orange-600" />
                    <span>Data Stok Biji Sangrai ({userRoastedLots.length})</span>
                  </h3>

                  {userRoastedLots.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white border border-stone-200 text-center text-xs text-stone-500">
                      Belum ada stok roasted bean siap edar.
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap min-w-[700px]">
                          <thead className="bg-[#FAF7F2] text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px]">
                            <tr>
                              <th className="py-3 px-4">Lot ID</th>
                              <th className="py-3 px-4">Level Sangrai</th>
                              <th className="py-3 px-4">Warna Agtron</th>
                              <th className="py-3 px-4">Flavor Notes</th>
                              <th className="py-3 px-4">Skor Cupping</th>
                              <th className="py-3 px-4">Harga / Pack</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {userRoastedLots.map((r) => (
                              <tr key={r.id} className="hover:bg-stone-50">
                                <td className="py-3 px-4 font-mono font-bold text-orange-800">{r.id}</td>
                                <td className="py-3 px-4 font-bold text-stone-900">{r.roastLevel}</td>
                                <td className="py-3 px-4 text-stone-600">Tile {r.agtronNumber}</td>
                                <td className="py-3 px-4">
                                  <div className="flex flex-wrap gap-1">
                                    {r.tastingNotes?.map((n: string, i: number) => (
                                      <span key={i} className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded font-medium">
                                        {n}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="py-3 px-4 font-bold text-emerald-700">
                                  {r.scaCuppingScore ? `${r.scaCuppingScore} SCA` : '-'}
                                </td>
                                <td className="py-3 px-4 font-mono font-bold text-stone-900">
                                  Rp {r.pricePerPack.toLocaleString('id-ID')} ({r.packageWeightGrams}g)
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* CAFE: DATA MENU SEDUH & INVENTORI BAR                         */}
            {/* ============================================================= */}
            {user.role === 'cafe' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-stone-700" />
                    <span>Data Menu &amp; Retail Pack ({userCafeProducts.length})</span>
                  </h3>

                  {userCafeProducts.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white border border-stone-200 text-center text-xs text-stone-500">
                      Belum ada menu atau produk ritel kafe yang tercatat.
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap min-w-[700px]">
                          <thead className="bg-[#FAF7F2] text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px]">
                            <tr>
                              <th className="py-3 px-4">Product ID</th>
                              <th className="py-3 px-4">Nama Menu / Produk</th>
                              <th className="py-3 px-4">Kemasan / Porsi</th>
                              <th className="py-3 px-4">Deskripsi</th>
                              <th className="py-3 px-4">Harga Jual</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {userCafeProducts.map((p) => (
                              <tr key={p.id} className="hover:bg-stone-50">
                                <td className="py-3 px-4 font-mono font-bold text-stone-800">{p.id}</td>
                                <td className="py-3 px-4 font-bold text-stone-900">{p.name}</td>
                                <td className="py-3 px-4 text-stone-600">{p.packageUnit}</td>
                                <td className="py-3 px-4 text-stone-600">{p.description}</td>
                                <td className="py-3 px-4 font-mono font-bold text-stone-900">
                                  Rp {p.price.toLocaleString('id-ID')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* VERIFIKATOR: RIWAYAT SERTIFIKASI & AUDIT                      */}
            {/* ============================================================= */}
            {user.role === 'verifikator' && (
              <div className="space-y-3">
                <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>Riwayat Sertifikasi &amp; Audit ({userVerifications.length})</span>
                </h3>

                {userVerifications.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-white border border-stone-200 text-center text-xs text-stone-500">
                    Verifikator ini belum menerbitkan stempel sertifikasi digital.
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs whitespace-nowrap min-w-[700px]">
                        <thead className="bg-[#FAF7F2] text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px]">
                          <tr>
                            <th className="py-3 px-4">No. Sertifikat</th>
                            <th className="py-3 px-4">Tipe Stempel</th>
                            <th className="py-3 px-4">Judul Standar</th>
                            <th className="py-3 px-4">Skor Evaluasi</th>
                            <th className="py-3 px-4">Waktu Terbit</th>
                            <th className="py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {userVerifications.map((v) => (
                            <tr key={v.id} className="hover:bg-stone-50">
                              <td className="py-3 px-4 font-mono font-bold text-purple-800">#{v.certificateNumber}</td>
                              <td className="py-3 px-4 font-semibold text-stone-900">{v.stampType}</td>
                              <td className="py-3 px-4 text-stone-700">{v.title}</td>
                              <td className="py-3 px-4 font-bold text-emerald-700">{v.scoreDisplay || '-'}</td>
                              <td className="py-3 px-4 text-stone-600">{v.verifiedAt}</td>
                              <td className="py-3 px-4">
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  {v.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RIWAYAT TRANSAKSI PASOK */}
        {activeTab === 'transactions' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-600" />
                <span>Buku Besar Transaksi ({userTransactions.length})</span>
              </h3>
              <span className="text-xs text-stone-500">Aliran Komoditas &amp; Pembayaran Resmi</span>
            </div>

            {userTransactions.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-stone-200 text-center text-xs text-stone-500">
                Belum ada transaksi rantai pasok yang tercatat untuk mitra ini.
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap min-w-[700px]">
                    <thead className="bg-[#FAF7F2] text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">ID Transaksi</th>
                        <th className="py-3 px-4">Tanggal</th>
                        <th className="py-3 px-4">Pengirim (Dari)</th>
                        <th className="py-3 px-4">Penerima (Ke)</th>
                        <th className="py-3 px-4">Nama Komoditas &amp; Kuantitas</th>
                        <th className="py-3 px-4">Total Nilai (Rp)</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {userTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-stone-50">
                          <td className="py-3 px-4 font-mono font-bold text-stone-900">{tx.id}</td>
                          <td className="py-3 px-4 text-stone-600">{tx.date}</td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-stone-800">{tx.fromName}</span>
                            <span className="text-[10px] text-stone-400 block font-mono">({tx.fromRole})</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-stone-800">{tx.toName}</span>
                            <span className="text-[10px] text-stone-400 block font-mono">({tx.toRole})</span>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-stone-900">{tx.itemName}</p>
                            <p className="text-[11px] text-stone-500">{tx.quantity}</p>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-stone-900">
                            Rp {tx.totalAmount.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFIL KREDENSIAL & LEGAL */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <h3 className="text-sm font-black text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Rincian Akun &amp; Legalitas</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
              <div className="space-y-1">
                <span className="text-stone-400 font-medium">ID Pengguna Sistem:</span>
                <p className="font-mono font-bold text-stone-800 text-sm">{user.id}</p>
              </div>

              <div className="space-y-1">
                <span className="text-stone-400 font-medium">Username Login:</span>
                <p className="font-mono font-bold text-stone-800 text-sm">{user.username || user.email}</p>
              </div>

              <div className="space-y-1">
                <span className="text-stone-400 font-medium">Nama Lengkap Penanggung Jawab:</span>
                <p className="font-bold text-stone-900 text-sm">{user.name}</p>
              </div>

              <div className="space-y-1">
                <span className="text-stone-400 font-medium">Alamat Email Resmi:</span>
                <p className="font-mono text-stone-800">{user.email}</p>
              </div>

              <div className="space-y-1">
                <span className="text-stone-400 font-medium">Nomor Telepon / WhatsApp:</span>
                <p className="font-bold text-emerald-700">{user.phone}</p>
              </div>

              <div className="space-y-1">
                <span className="text-stone-400 font-medium">Organisasi / Usaha / Koperasi:</span>
                <p className="font-bold text-stone-900">{user.organization}</p>
              </div>

              <div className="space-y-1">
                <span className="text-stone-400 font-medium">Lokasi / Wilayah Terdaftar:</span>
                <p className="text-stone-700">{user.location}</p>
              </div>

              <div className="space-y-1">
                <span className="text-stone-400 font-medium">Waktu Pendaftaran:</span>
                <p className="text-stone-700">{user.registeredAt || 'Akun Bawaan Sistem'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-stone-400 font-medium">Peran Komoditas:</span>
                <p className="font-bold text-amber-800 capitalize">{user.role}</p>
              </div>
            </div>

            {user.bio && (
              <div className="space-y-2 pt-4 border-t border-stone-100 text-xs">
                <span className="text-stone-400 font-bold uppercase tracking-wider">Deskripsi Fasilitas &amp; Komoditas:</span>
                <p className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200 text-stone-700 leading-relaxed text-sm">
                  {user.bio}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Bottom Administrative Action Bar                                  */}
      {/* ----------------------------------------------------------------- */}
      <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-stone-500">
          Hak Akses: <strong className="text-stone-900 font-bold">Novizar (Super Admin Root)</strong>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => loginAsUser(user.id)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
            title="Masuk sebagai akun mitra ini untuk melihat dasbornya secara langsung"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Masuk Sebagai Mitra</span>
          </button>

          <button
            onClick={() => suspendUser(user.id)}
            className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Ban className="w-3.5 h-3.5 text-stone-500" />
            <span>{user.status === 'suspended' ? 'Aktifkan Akun' : 'Tangguhkan (Suspend)'}</span>
          </button>

          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer transition-all"
          >
            Kembali ke Daftar Pengguna
          </button>
        </div>
      </div>
    </div>
  );
};

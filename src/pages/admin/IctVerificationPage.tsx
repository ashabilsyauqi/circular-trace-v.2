import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  TreePine,
  Sprout,
  Award,
  Search,
  Filter,
  MapPin,
  ExternalLink,
  ChevronRight,
  FileCheck,
  Calendar,
  Layers,
  Scale,
  Sparkles,
  Info,
  Clock,
  RotateCcw,
  Check,
  X,
  Printer,
  BadgeCheck,
  ClipboardCheck,
} from 'lucide-react';

export const IctVerificationPage: React.FC = () => {
  const {
    users,
    coffeeFarms,
    farmerLots,
    verificationStamps,
    verifyFarmer,
    verifyFarm,
    verifyHarvestLot,
    rejectVerification,
    revokeVerificationStamp,
    currentUser,
  } = useCoffee();

  // Active Tab: 'petani' | 'kebun' | 'panen' | 'stamps'
  const [activeTab, setActiveTab] = useState<'petani' | 'kebun' | 'panen' | 'stamps'>('petani');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

  // Modal / Prompt State for Action with Reason or Notes
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    type: 'verify' | 'reject';
    targetType: 'farmer' | 'farm' | 'harvest';
    targetId: string;
    targetTitle: string;
    notes: string;
  }>({
    isOpen: false,
    type: 'verify',
    targetType: 'farmer',
    targetId: '',
    targetTitle: '',
    notes: '',
  });

  // Filtered farmers
  const farmersList = users.filter((u) => u.role === 'petani' || u.assignedService === 'petani');
  const filteredFarmers = farmersList.filter((f) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      f.name.toLowerCase().includes(q) ||
      (f.nik && f.nik.toLowerCase().includes(q)) ||
      (f.farmerCardNumber && f.farmerCardNumber.toLowerCase().includes(q)) ||
      (f.village && f.village.toLowerCase().includes(q)) ||
      f.location.toLowerCase().includes(q);

    const status = f.verificationStatus || 'unverified';
    const matchStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'pending'
        ? status === 'pending' || status === 'unverified'
        : status === filterStatus;

    return matchQuery && matchStatus;
  });

  // Filtered farms
  const filteredFarms = coffeeFarms.filter((farm) => {
    const q = searchQuery.toLowerCase();
    const varieties = Array.isArray(farm.primaryVarieties) ? farm.primaryVarieties.join(' ') : (farm.primaryVarieties || '');
    const matchQuery =
      farm.farmName.toLowerCase().includes(q) ||
      farm.farmerName.toLowerCase().includes(q) ||
      farm.location.toLowerCase().includes(q) ||
      varieties.toLowerCase().includes(q);

    const status = farm.verificationStatus || 'unverified';
    const matchStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'pending'
        ? status === 'pending' || status === 'unverified'
        : status === filterStatus;

    return matchQuery && matchStatus;
  });

  // Filtered harvest lots
  const filteredHarvestLots = farmerLots.filter((lot) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      lot.id.toLowerCase().includes(q) ||
      lot.farmerName.toLowerCase().includes(q) ||
      (lot.farmName && lot.farmName.toLowerCase().includes(q)) ||
      lot.variety.toLowerCase().includes(q);

    const status = lot.verificationStatus || 'unverified';
    const matchStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'pending'
        ? status === 'pending' || status === 'unverified'
        : status === filterStatus;

    return matchQuery && matchStatus;
  });

  // Summary Metrics
  const pendingFarmers = farmersList.filter((f) => !f.verificationStatus || f.verificationStatus === 'pending' || f.verificationStatus === 'unverified').length;
  const verifiedFarmers = farmersList.filter((f) => f.verificationStatus === 'verified').length;

  const pendingFarms = coffeeFarms.filter((f) => !f.verificationStatus || f.verificationStatus === 'pending' || f.verificationStatus === 'unverified').length;
  const verifiedFarms = coffeeFarms.filter((f) => f.verificationStatus === 'verified').length;

  const pendingLots = farmerLots.filter((l) => !l.verificationStatus || l.verificationStatus === 'pending' || l.verificationStatus === 'unverified').length;
  const verifiedLots = farmerLots.filter((l) => l.verificationStatus === 'verified').length;

  // Handler for Confirming Verification / Rejection
  const handleConfirmAction = () => {
    const { type, targetType, targetId, notes } = actionModal;

    if (type === 'verify') {
      if (targetType === 'farmer') {
        verifyFarmer(targetId, notes || undefined);
      } else if (targetType === 'farm') {
        verifyFarm(targetId, notes || undefined);
      } else if (targetType === 'harvest') {
        verifyHarvestLot(targetId, notes || undefined);
      }
    } else {
      const reason = notes.trim() || 'Data belum memenuhi kualifikasi standar internal kelompok tani.';
      rejectVerification(targetType, targetId, reason);
    }

    setActionModal({ ...actionModal, isOpen: false, notes: '' });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner (AdminLTE Box Style) */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-900 tracking-tight">
                Pusat Audit &amp; Verifikasi ICT Kelompok Tani
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-100 text-blue-900 border border-blue-300">
                <BadgeCheck className="w-3.5 h-3.5 text-blue-700" />
                <span>Petugas ICT</span>
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Tanggung jawab Tim ICT: Verifikasi keabsahan identitas petani, validasi koordinat GPS &amp; batas patok kebun (EUDR), serta uji mutu kadar brix panen ceri segar.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            to="/admin/ict/ct-dashboard"
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Award className="w-4 h-4 text-amber-200" />
            <span>Sertifikasi Kebun (CT Index)</span>
          </Link>

          <Link
            to="/admin/ict/audit"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Lembar Kerja Audit ICS</span>
          </Link>

          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-stone-800">
              {currentUser?.name || 'Petugas ICT'}
            </div>
            <div className="text-[11px] text-stone-500">
              {currentUser?.organization || 'Kelompok Tani Kopi Mandiri'}
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center border border-blue-200">
            ICT
          </div>
        </div>
      </div>

      {/* 2. AdminLTE Small-Box KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Box 1: Petani */}
        <div className="bg-white rounded-lg border border-[#d2d6de] shadow-xs overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-stone-900">{verifiedFarmers} / {farmersList.length}</div>
              <div className="text-xs font-bold text-stone-600 mt-0.5">Petani Terverifikasi</div>
              <div className="text-[11px] text-amber-700 font-semibold mt-1">
                {pendingFarmers} menunggu verifikasi
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <button
            onClick={() => setActiveTab('petani')}
            className="w-full py-1.5 px-4 bg-stone-50 hover:bg-stone-100 border-t border-stone-200 text-stone-600 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>Buka Antrean Petani</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Box 2: Kebun & EUDR */}
        <div className="bg-white rounded-lg border border-[#d2d6de] shadow-xs overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-stone-900">{verifiedFarms} / {coffeeFarms.length}</div>
              <div className="text-xs font-bold text-stone-600 mt-0.5">Lahan Kebun EUDR Lolos</div>
              <div className="text-[11px] text-amber-700 font-semibold mt-1">
                {pendingFarms} menunggu audit geolokasi
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <TreePine className="w-6 h-6" />
            </div>
          </div>
          <button
            onClick={() => setActiveTab('kebun')}
            className="w-full py-1.5 px-4 bg-stone-50 hover:bg-stone-100 border-t border-stone-200 text-stone-600 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>Buka Antrean Lahan Kebun</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Box 3: Hasil Panen Ceri */}
        <div className="bg-white rounded-lg border border-[#d2d6de] shadow-xs overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-stone-900">{verifiedLots} / {farmerLots.length}</div>
              <div className="text-xs font-bold text-stone-600 mt-0.5">Lot Ceri Lolos QC Mutu</div>
              <div className="text-[11px] text-amber-700 font-semibold mt-1">
                {pendingLots} menunggu uji brix
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
          </div>
          <button
            onClick={() => setActiveTab('panen')}
            className="w-full py-1.5 px-4 bg-stone-50 hover:bg-stone-100 border-t border-stone-200 text-stone-600 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>Buka Antrean Panen Ceri</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Box 4: Total Stempel Diterbitkan */}
        <div className="bg-white rounded-lg border border-[#d2d6de] shadow-xs overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-stone-900">{verificationStamps.length}</div>
              <div className="text-xs font-bold text-stone-600 mt-0.5">Sertifikat Mutu Diterbitkan</div>
              <div className="text-[11px] text-blue-700 font-semibold mt-1">
                Tersimpan di Buku Ledger
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <button
            onClick={() => setActiveTab('stamps')}
            className="w-full py-1.5 px-4 bg-stone-50 hover:bg-stone-100 border-t border-stone-200 text-stone-600 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>Lihat Buku Audit Stempel</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feature Banner: CircularTrace CT-4CI Farm Certification Engine */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 rounded-lg p-5 text-white shadow-md border border-emerald-700/40 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            CircularTrace v2.0 Standard
          </div>
          <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
            Audit Standar Mutu Berkelanjutan: 4C Code of Conduct v4.1 (CT-4CI)
          </h3>
          <p className="text-xs text-emerald-100/80 max-w-2xl leading-relaxed">
            Evaluasi 108 checkpoint produsen, Major Gate Safeguards (Zero Banned Agro-Chemicals), Circularity Index (CT-CCI-Lite), dan Sustainability Index (CT-SDI-Lite) dengan penerbitan digital seal stempel verifikasi.
          </p>
        </div>
        <Link
          to="/admin/ict/ct-dashboard"
          className="shrink-0 relative z-10 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs flex items-center gap-2 shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer whitespace-nowrap"
        >
          <span>Buka Dashboard Sertifikasi CT</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 3. Tab Navigation & Search Toolbar */}
      <div className="bg-white rounded-lg border border-[#d2d6de] shadow-xs p-4 space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => { setActiveTab('petani'); setFilterStatus('all'); }}
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'petani'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>1. Verifikasi Data Petani</span>
            {pendingFarmers > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'petani' ? 'bg-blue-800 text-white' : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                {pendingFarmers}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('kebun'); setFilterStatus('all'); }}
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'kebun'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <TreePine className="w-4 h-4" />
            <span>2. Verifikasi Data Kebun (EUDR)</span>
            {pendingFarms > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'kebun' ? 'bg-blue-800 text-white' : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                {pendingFarms}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('panen'); setFilterStatus('all'); }}
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'panen'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>3. Verifikasi Panen Ceri (Brix &amp; Netto)</span>
            {pendingLots > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'panen' ? 'bg-blue-800 text-white' : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                {pendingLots}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('stamps'); setFilterStatus('all'); }}
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'stamps'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>4. Buku Audit &amp; Stempel Mutu ({verificationStamps.length})</span>
          </button>
        </div>

        {/* Search & Status Filters */}
        {activeTab !== 'stamps' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === 'petani'
                    ? 'Cari nama petani, NIK, nomor KTA, desa...'
                    : activeTab === 'kebun'
                    ? 'Cari nama kebun, petani, varietas, desa...'
                    : 'Cari ID lot, nama petani, varietas...'
                }
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs overflow-x-auto w-full sm:w-auto">
              <span className="text-stone-400 font-bold shrink-0 mr-1 flex items-center gap-1 text-[11px]">
                <Filter className="w-3.5 h-3.5" /> Status:
              </span>
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                  filterStatus === 'all'
                    ? 'bg-stone-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                  filterStatus === 'pending'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Menunggu Audit
              </button>
              <button
                onClick={() => setFilterStatus('verified')}
                className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                  filterStatus === 'verified'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Terverifikasi ICT
              </button>
              <button
                onClick={() => setFilterStatus('rejected')}
                className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                  filterStatus === 'rejected'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Ditolak / Revisi
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Content Area Based on Active Tab */}

      {/* ================= TAB 1: VERIFIKASI DATA PETANI ================= */}
      {activeTab === 'petani' && (
        <div className="bg-white rounded-lg border border-[#d2d6de] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Antrean Verifikasi Profil &amp; KTP/NIK Petani</span>
              </h2>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Pastikan NIK 16-digit valid sesuai Dukcapil, nomor KTA kelompok tani aktif, dan desa domisili sesuai wilayah binaan koperasi.
              </p>
            </div>
            <Link
              to="/admin/petani"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Lihat Master Petani</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[1050px]">
              <thead>
                <tr className="bg-stone-100/80 border-b border-stone-200 text-stone-600 font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 whitespace-nowrap min-w-[200px]">Petani</th>
                  <th className="py-3 px-4 whitespace-nowrap min-w-[180px]">NIK &amp; KTA Kelompok Tani</th>
                  <th className="py-3 px-4 whitespace-nowrap min-w-[160px]">Domisili &amp; Wilayah</th>
                  <th className="py-3 px-4 whitespace-nowrap min-w-[140px]">Lahan Garapan</th>
                  <th className="py-3 px-4 whitespace-nowrap min-w-[180px]">Status Verifikasi</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap min-w-[300px]">Aksi Audit ICT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredFarmers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-stone-400">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="font-medium text-xs">Tidak ada data petani yang cocok dengan filter.</p>
                    </td>
                  </tr>
                ) : (
                  filteredFarmers.map((farmer) => {
                    const status = farmer.verificationStatus || 'unverified';
                    const isVerified = status === 'verified';
                    const isRejected = status === 'rejected';

                    const farmerFarms = coffeeFarms.filter((f) => f.farmerId === farmer.id);

                    return (
                      <tr key={farmer.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img
                              src={farmer.avatar}
                              alt={farmer.name}
                              className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                                <span>{farmer.name}</span>
                                {isVerified && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                )}
                              </div>
                              <div className="text-[11px] text-stone-500">{farmer.phone || '-'}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-mono text-xs font-semibold text-stone-800">
                            {farmer.nik || 'NIK Belum Terisi'}
                          </div>
                          <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                            KTA: {farmer.farmerCardNumber || 'KTA-BELUM-ADA'}
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-medium text-stone-800 text-xs">
                            {farmer.village ? `Desa ${farmer.village}` : farmer.location}
                          </div>
                          <div className="text-[11px] text-stone-400 mt-0.5">
                            {farmer.subdistrict ? `Kec. ${farmer.subdistrict}` : 'Kab. Bandung'}
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-bold text-stone-800 text-xs">
                            {farmer.totalLandAreaHa ? `${farmer.totalLandAreaHa} Ha` : '-'}
                          </div>
                          <div className="text-[11px] text-stone-500">
                            {farmerFarms.length} Bidang Kebun Terdaftar
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          {isVerified ? (
                            <div>
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 whitespace-nowrap shrink-0">
                                <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0" />
                                <span>Terverifikasi ICT</span>
                              </span>
                              {farmer.verifiedAt && (
                                <div className="text-[10px] text-stone-400 mt-0.5 whitespace-nowrap">
                                  {new Date(farmer.verifiedAt).toLocaleDateString('id-ID')}
                                </div>
                              )}
                            </div>
                          ) : isRejected ? (
                            <div>
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-red-100 text-red-900 border border-red-300 whitespace-nowrap shrink-0">
                                <XCircle className="w-3 h-3 text-red-700 shrink-0" />
                                <span>Revisi Diperlukan</span>
                              </span>
                              {farmer.verificationNotes && (
                                <div className="text-[10px] text-red-600 mt-0.5 max-w-xs truncate" title={farmer.verificationNotes}>
                                  {farmer.verificationNotes}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap shrink-0">
                              <Clock className="w-3 h-3 text-amber-700 shrink-0" />
                              <span>Menunggu Audit ICT</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5 whitespace-nowrap shrink-0">
                            {!isVerified && (
                              <button
                                onClick={() =>
                                  setActionModal({
                                    isOpen: true,
                                    type: 'verify',
                                    targetType: 'farmer',
                                    targetId: farmer.id,
                                    targetTitle: `Verifikasi Data Petani: ${farmer.name}`,
                                    notes: 'Data KTP/NIK, KTA kelompok tani, dan biodata profil telah diverifikasi valid oleh Tim ICT.',
                                  })
                                }
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] inline-flex items-center gap-1 shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
                              >
                                <Check className="w-3 h-3 shrink-0" />
                                <span>Verifikasi</span>
                              </button>
                            )}

                            {!isRejected && (
                              <button
                                onClick={() =>
                                  setActionModal({
                                    isOpen: true,
                                    type: 'reject',
                                    targetType: 'farmer',
                                    targetId: farmer.id,
                                    targetTitle: `Tolak / Minta Revisi Petani: ${farmer.name}`,
                                    notes: 'NIK atau dokumen KTP tidak jelas / nomor KTA belum sinkron dengan data kelompok tani.',
                                  })
                                }
                                className="px-2.5 py-1.5 bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 rounded font-bold text-[11px] border border-stone-300 hover:border-red-300 inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                              >
                                <X className="w-3 h-3 shrink-0" />
                                <span>Tolak</span>
                              </button>
                            )}

                            <Link
                              to={`/admin/ict/audit/farmer/${farmer.id}`}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] rounded border border-blue-200 inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
                              title="Buka Lembar Kerja Audit ICS Petani"
                            >
                              <ClipboardCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span>Lembar Kerja</span>
                            </Link>

                            <Link
                              to={`/admin/petani/edit/${farmer.id}`}
                              className="p-1.5 text-stone-500 hover:text-blue-700 hover:bg-blue-50 rounded border border-transparent hover:border-blue-200 transition-colors shrink-0"
                              title="Lihat / Edit Profil Petani"
                            >
                              <ExternalLink className="w-4 h-4 shrink-0" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: VERIFIKASI DATA KEBUN (EUDR) ================= */}
      {activeTab === 'kebun' && (
        <div className="bg-white rounded-lg border border-[#d2d6de] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <TreePine className="w-4 h-4 text-blue-600" />
                <span>Antrean Audit Titik Koordinat &amp; EUDR Kebun</span>
              </h2>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Validasi geolokasi GPS actual, elevasi ketinggian (mdpl), dan patokan sudut tapal batas (polygon BPN) bebas deforestasi EUDR.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/admin/kebun"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Master Kebun</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[1100px]">
              <thead>
                <tr className="bg-stone-100/80 border-b border-stone-200 text-stone-600 font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 whitespace-nowrap min-w-[200px]">Kebun &amp; Petani</th>
                  <th className="py-3 px-4 whitespace-nowrap min-w-[170px]">Geolokasi &amp; Elevasi</th>
                  <th className="py-3 px-4 whitespace-nowrap min-w-[170px]">Patok Batas Poligon</th>
                  <th className="py-3 px-4 whitespace-nowrap min-w-[160px]">Kepatuhan EUDR</th>
                  <th className="py-3 px-4 whitespace-nowrap min-w-[170px]">Status Audit ICT</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap min-w-[300px]">Aksi Audit ICT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredFarms.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-stone-400">
                      <TreePine className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="font-medium text-xs">Tidak ada data kebun yang cocok dengan filter.</p>
                    </td>
                  </tr>
                ) : (
                  filteredFarms.map((farm) => {
                    const status = farm.verificationStatus || 'unverified';
                    const isVerified = status === 'verified';
                    const isRejected = status === 'rejected';

                    const patokCount = farm.patokList?.length || 4;
                    const lat = farm.coordinates?.latitude || -7.1524;
                    const lng = farm.coordinates?.longitude || 107.5932;
                    const varieties = Array.isArray(farm.primaryVarieties) ? farm.primaryVarieties.join(', ') : (farm.primaryVarieties || 'Arabika');

                    return (
                      <tr key={farm.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-bold text-stone-900 text-xs">{farm.farmName}</div>
                          <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                            <span className="font-medium">{farm.farmerName}</span>
                            <span>•</span>
                            <span>{varieties}</span>
                          </div>
                          <div className="text-[10px] text-stone-400 mt-0.5">{farm.location}</div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-mono text-xs font-semibold text-stone-800 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{lat.toFixed(5)}, {lng.toFixed(5)}</span>
                          </div>
                          <div className="text-[11px] text-stone-500 mt-0.5">
                            Elevasi: <strong className="text-stone-700">{farm.altitudeDisplay || `${farm.altitudeMeters} mdpl`}</strong>
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap shrink-0">
                              {patokCount} Patok Sudut BPN
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-500 mt-0.5 whitespace-nowrap">
                            Luas: {farm.landAreaHectares} Ha (~{farm.totalTreesCount.toLocaleString()} Pohon)
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          {farm.eudrCompliant ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 whitespace-nowrap shrink-0">
                              <Check className="w-3 h-3 text-emerald-700 shrink-0" />
                              <span>Deforestation-Free</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap shrink-0">
                              <AlertTriangle className="w-3 h-3 text-amber-700 shrink-0" />
                              <span>Audit Dibutuhkan</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 whitespace-nowrap shrink-0">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0" />
                              <span>Lolos EUDR &amp; Patok</span>
                            </span>
                          ) : isRejected ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-red-100 text-red-900 border border-red-300 whitespace-nowrap shrink-0">
                              <XCircle className="w-3 h-3 text-red-700 shrink-0" />
                              <span>Perlu Revisi Titik</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap shrink-0">
                              <Clock className="w-3 h-3 text-amber-700 shrink-0" />
                              <span>Menunggu Audit</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5 whitespace-nowrap shrink-0">
                            {!isVerified && (
                              <button
                                onClick={() =>
                                  setActionModal({
                                    isOpen: true,
                                    type: 'verify',
                                    targetType: 'farm',
                                    targetId: farm.id,
                                    targetTitle: `Verifikasi Lahan Kebun: ${farm.farmName}`,
                                    notes: 'Koordinat GPS actual dan patok batas poligon BPN telah diaudit dan dinyatakan lolos verifikasi EUDR oleh Tim ICT.',
                                  })
                                }
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] inline-flex items-center gap-1 shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
                              >
                                <Check className="w-3 h-3 shrink-0" />
                                <span>Verifikasi</span>
                              </button>
                            )}

                            {!isRejected && (
                              <button
                                onClick={() =>
                                  setActionModal({
                                    isOpen: true,
                                    type: 'reject',
                                    targetType: 'farm',
                                    targetId: farm.id,
                                    targetTitle: `Minta Koreksi Kebun: ${farm.farmName}`,
                                    notes: 'Titik koordinat tidak presisi atau patok sudut tumpang tindih dengan kawasan lindung.',
                                  })
                                }
                                className="px-2.5 py-1.5 bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 rounded font-bold text-[11px] border border-stone-300 hover:border-red-300 inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                              >
                                <X className="w-3 h-3 shrink-0" />
                                <span>Koreksi</span>
                              </button>
                            )}

                            <Link
                              to={`/admin/ict/audit/farm/${farm.id}`}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] rounded border border-blue-200 inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
                              title="Buka Lembar Kerja Audit ICS Lahan Kebun"
                            >
                              <ClipboardCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span>Lembar Kerja</span>
                            </Link>

                            <Link
                              to={`/admin/kebun/peta/${farm.id}`}
                              className="p-1.5 text-stone-500 hover:text-blue-700 hover:bg-blue-50 rounded border border-transparent hover:border-blue-200 transition-colors shrink-0"
                              title="Lihat Peta Poligon Kebun"
                            >
                              <ExternalLink className="w-4 h-4 shrink-0" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: VERIFIKASI MUTU PANEN CERI ================= */}
      {activeTab === 'panen' && (
        <div className="bg-white rounded-lg border border-[#d2d6de] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Sprout className="w-4 h-4 text-blue-600" />
                <span>Antrean Uji Mutu &amp; Kemanisan Brix Panen Ceri</span>
              </h2>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Pastikan lot ceri kopi segar memenuhi uji refraktometer kemanisan brix minimal 18°Bx, petik merah selektif 95%+, dan timbangan berat netto akurat.
              </p>
            </div>
            <Link
              to="/admin/panen"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Lihat Master Panen</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[1100px]">
              <thead>
                <tr className="bg-stone-100/80 border-b border-stone-200 text-stone-600 font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 whitespace-nowrap min-w-[170px]">Nomor Lot &amp; Tanggal</th>
                  <th className="py-3 px-4 whitespace-nowrap min-w-[190px]">Petani &amp; Kebun Asal</th>
                  <th className="py-3 px-4 whitespace-nowrap min-w-[120px]">Berat Netto</th>
                  <th className="py-3 px-4 whitespace-nowrap min-w-[180px]">Kadar Kemanisan Brix</th>
                  <th className="py-3 px-4 whitespace-nowrap min-w-[180px]">Alokasi &amp; Status QC</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap min-w-[310px]">Aksi Audit ICT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredHarvestLots.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-stone-400">
                      <Sprout className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="font-medium text-xs">Tidak ada data panen yang cocok dengan filter.</p>
                    </td>
                  </tr>
                ) : (
                  filteredHarvestLots.map((lot) => {
                    const status = lot.verificationStatus || 'unverified';
                    const isVerified = status === 'verified';
                    const isRejected = status === 'rejected';

                    const brix = lot.brix || 0;
                    const isHighBrix = brix >= 18;

                    return (
                      <tr key={lot.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-mono text-xs font-bold text-stone-900">{lot.id}</div>
                          <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 text-stone-400 shrink-0" />
                            <span>{new Date(lot.harvestDate).toLocaleDateString('id-ID')}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-bold text-stone-800 text-xs">{lot.farmerName}</div>
                          <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                            <span>{lot.farmName || lot.farmLocation}</span>
                            <span>•</span>
                            <span className="font-medium text-amber-800">{lot.variety}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-black text-stone-900 text-xs">
                            {lot.totalWeightKg.toLocaleString()} kg
                          </div>
                          <div className="text-[10px] text-stone-500">
                            Rp {(lot.pricePerKg || 12000).toLocaleString('id-ID')} / kg
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-black whitespace-nowrap shrink-0 ${
                              isHighBrix
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-stone-100 text-stone-700 border border-stone-200'
                            }`}>
                              {brix > 0 ? `${brix}°Bx` : 'Belum Diuji'}
                            </span>
                            {isHighBrix && (
                              <span className="text-[10px] font-bold text-amber-700 whitespace-nowrap shrink-0">Manis Optimal</span>
                            )}
                          </div>
                          <div className="text-[10px] text-stone-500 mt-0.5 whitespace-nowrap">
                            {lot.notes || 'Petik Merah 95%+'}
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="space-y-1">
                            {isVerified ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 whitespace-nowrap shrink-0">
                                <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0" />
                                <span>QC Passed (ICT)</span>
                              </span>
                            ) : isRejected ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-900 border border-red-300 whitespace-nowrap shrink-0">
                                <XCircle className="w-3 h-3 text-red-700 shrink-0" />
                                <span>Afkir / Ditolak</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap shrink-0">
                                <Clock className="w-3 h-3 text-amber-700 shrink-0" />
                                <span>Menunggu Uji Mutu</span>
                              </span>
                            )}

                            <div>
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold whitespace-nowrap ${
                                lot.isReleasedToMarketplace
                                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                  : 'bg-stone-100 text-stone-600'
                              }`}>
                                {lot.isReleasedToMarketplace ? 'Marketplace Aktif' : 'Simpan Gudang Petani'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5 whitespace-nowrap shrink-0">
                            {!isVerified && (
                              <button
                                onClick={() =>
                                  setActionModal({
                                    isOpen: true,
                                    type: 'verify',
                                    targetType: 'harvest',
                                    targetId: lot.id,
                                    targetTitle: `Uji Mutu Lot: ${lot.id}`,
                                    notes: 'Timbangan berat netto dan kadar kemanisan brix buah ceri segar telah diuji dan memenuhi standar mutu kelompok tani.',
                                  })
                                }
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] inline-flex items-center gap-1 shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
                              >
                                <Check className="w-3 h-3 shrink-0" />
                                <span>Loloskan QC</span>
                              </button>
                            )}

                            {!isRejected && (
                              <button
                                onClick={() =>
                                  setActionModal({
                                    isOpen: true,
                                    type: 'reject',
                                    targetType: 'harvest',
                                    targetId: lot.id,
                                    targetTitle: `Afkir / Tolak Lot: ${lot.id}`,
                                    notes: 'Tingkat kematangan ceri hijau terlalu tinggi (>15%) atau buah busuk/cacat fisik melebihi ambang batas toleransi.',
                                  })
                                }
                                className="px-2.5 py-1.5 bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 rounded font-bold text-[11px] border border-stone-300 hover:border-red-300 inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                              >
                                <X className="w-3 h-3 shrink-0" />
                                <span>Afkir</span>
                              </button>
                            )}

                            <Link
                              to={`/admin/ict/audit/harvest/${lot.id}`}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] rounded border border-blue-200 inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
                              title="Buka Lembar Kerja Audit Mutu Panen Ceri"
                            >
                              <ClipboardCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span>Lembar Kerja</span>
                            </Link>

                            <Link
                              to={`/admin/panen/detail/${lot.id}`}
                              className="p-1.5 text-stone-500 hover:text-blue-700 hover:bg-blue-50 rounded border border-transparent hover:border-blue-200 transition-colors shrink-0"
                              title="Lihat Detail Lot Panen"
                            >
                              <ExternalLink className="w-4 h-4 shrink-0" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 4: BUKU AUDIT & STEMPEL MUTU ================= */}
      {activeTab === 'stamps' && (
        <div className="bg-white rounded-lg border border-[#d2d6de] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span>Buku Audit Digital &amp; Stempel Kriptografis</span>
              </h2>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Riwayat seluruh stempel verifikasi yang diterbitkan oleh Tim ICT Kelompok Tani dengan checksum integritas data.
              </p>
            </div>
            <span className="text-xs font-bold text-stone-600 bg-white px-2.5 py-1 rounded border border-stone-200">
              Total {verificationStamps.length} Sertifikat
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {verificationStamps.length === 0 ? (
              <div className="py-12 text-center text-stone-400">
                <Award className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="font-medium text-xs">Belum ada stempel verifikasi yang diterbitkan.</p>
              </div>
            ) : (
              verificationStamps.map((stamp) => (
                <div key={stamp.id} className="p-4 hover:bg-blue-50/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-xs">{stamp.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 text-blue-900">
                          {stamp.stampType}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-600 mt-1 max-w-xl">
                        {stamp.notes}
                      </div>
                      <div className="text-[10px] text-stone-400 mt-1 flex flex-wrap items-center gap-2 font-mono">
                        <span>ID: {stamp.id}</span>
                        <span>•</span>
                        <span>Oleh: {stamp.verifierName}</span>
                        <span>•</span>
                        <span>{new Date(stamp.verifiedAt).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => {
                        if (confirm(`Cabut stempel verifikasi ${stamp.title}?`)) {
                          revokeVerificationStamp(stamp.targetType || 'farm', stamp.targetId || stamp.id);
                        }
                      }}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-700 text-xs font-bold rounded border border-stone-300 hover:border-red-300 transition-colors cursor-pointer"
                    >
                      Cabut Stempel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. Modal Konfirmasi Audit / Rejection */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className={`p-4 border-b flex items-center justify-between ${
              actionModal.type === 'verify' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {actionModal.type === 'verify' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-700" />
                )}
                <h3 className={`font-bold text-sm ${actionModal.type === 'verify' ? 'text-emerald-950' : 'text-red-950'}`}>
                  {actionModal.targetTitle}
                </h3>
              </div>
              <button
                onClick={() => setActionModal({ ...actionModal, isOpen: false })}
                className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">
                  {actionModal.type === 'verify' ? 'Catatan Verifikasi & Hasil Audit ICT:' : 'Alasan Penolakan / Permintaan Revisi:'}
                </label>
                <textarea
                  rows={3}
                  value={actionModal.notes}
                  onChange={(e) => setActionModal({ ...actionModal, notes: e.target.value })}
                  placeholder={
                    actionModal.type === 'verify'
                      ? 'Tuliskan catatan kepatuhan atau stempel validitas...'
                      : 'Tuliskan alasan spesifik kenapa data ditolak atau perlu diperbaiki...'
                  }
                  className="w-full p-3 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
                />
              </div>

              <div className="bg-stone-50 rounded-lg p-3 text-[11px] text-stone-600 border border-stone-200 space-y-1">
                <div className="font-bold text-stone-800 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>Informasi Auditor ICT</span>
                </div>
                <div>Auditor: <strong>{currentUser?.name || 'Petugas ICT'}</strong></div>
                <div>Status yang akan diterapkan: <strong className={actionModal.type === 'verify' ? 'text-emerald-700' : 'text-red-700'}>
                  {actionModal.type === 'verify' ? 'Terverifikasi (Verified)' : 'Ditolak / Revisi (Rejected)'}
                </strong></div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setActionModal({ ...actionModal, isOpen: false })}
                  className="px-4 py-2 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  className={`px-4 py-2 rounded-md text-white font-bold cursor-pointer shadow-xs ${
                    actionModal.type === 'verify'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {actionModal.type === 'verify' ? 'Terbitkan Verifikasi' : 'Simpan Penolakan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

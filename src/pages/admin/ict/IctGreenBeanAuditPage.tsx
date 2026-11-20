import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCoffee } from '../../../context/CoffeeContext';
import { ProcessedGreenBeanLot, VerificationStamp } from '../../../types/coffee';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  MapPin,
  Calendar,
  Layers,
  Scale,
  Sparkles,
  Printer,
  ChevronRight,
  Info,
  Clock,
  BadgeCheck,
  ClipboardCheck,
  Coffee,
  Droplets,
  Award,
  Check,
  X,
  FileCheck,
  QrCode,
  Flame,
  ArrowRight,
  CheckSquare,
} from 'lucide-react';
import { ProcessorBarcodeModal } from '../../../components/ProcessorBarcodeModal';

export const IctGreenBeanAuditPage: React.FC = () => {
  const {
    processedLots,
    currentUser,
    verifyProcessedLotByICS,
    openBlankoModal,
  } = useCoffee();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  // Inspection Modal State
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<ProcessedGreenBeanLot | null>(null);

  // Form Fields inside Inspection Modal
  const [inspectedMoisture, setInspectedMoisture] = useState<number>(11.2);
  const [inspectedWaterActivity, setInspectedWaterActivity] = useState<number>(0.56);
  const [inspectedDefect, setInspectedDefect] = useState<number>(2);
  const [inspectedYieldRatio, setInspectedYieldRatio] = useState<number>(18.5);
  const [methodMatch, setMethodMatch] = useState<boolean>(true);
  const [sanitationPassed, setSanitationPassed] = useState<boolean>(true);
  const [auditNotes, setAuditNotes] = useState<string>('');

  // Stamp / Certificate View Modal State
  const [stampModalOpen, setStampModalOpen] = useState(false);
  const [selectedStampLot, setSelectedStampLot] = useState<ProcessedGreenBeanLot | null>(null);

  // Barcode Modal
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [selectedBarcodeLot, setSelectedBarcodeLot] = useState<ProcessedGreenBeanLot | null>(null);

  // Feedback Notification
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filtered lots computation
  const filteredLots = processedLots.filter((lot) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      lot.id.toLowerCase().includes(q) ||
      lot.variety.toLowerCase().includes(q) ||
      lot.processorName.toLowerCase().includes(q) ||
      lot.sourceFarmerName.toLowerCase().includes(q) ||
      lot.sourceOrigin.toLowerCase().includes(q) ||
      lot.processMethod.toLowerCase().includes(q);

    const status = lot.ics_verification_status || 'unverified';
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'pending'
        ? status === 'pending' || status === 'unverified'
        : status === statusFilter;

    const matchesMethod = methodFilter === 'all' ? true : lot.processMethod === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  // KPI Counts
  const totalLots = processedLots.length;
  const pendingLots = processedLots.filter(
    (l) => !l.ics_verification_status || l.ics_verification_status === 'pending' || l.ics_verification_status === 'unverified'
  ).length;
  const verifiedLots = processedLots.filter((l) => l.ics_verification_status === 'verified').length;
  const rejectedLots = processedLots.filter((l) => l.ics_verification_status === 'rejected').length;

  // Open Inspection Modal with initial values from lot
  const handleOpenInspection = (lot: ProcessedGreenBeanLot) => {
    setSelectedLot(lot);
    setInspectedMoisture(lot.ics_inspected_moisture ?? lot.moistureContentPercent ?? 11.2);
    setInspectedWaterActivity(lot.ics_inspected_water_activity ?? lot.waterActivityAw ?? 0.56);
    setInspectedDefect(lot.ics_inspected_defect ?? lot.defectCount ?? 2);
    
    // Calculate estimated yield ratio if source cherry weight exists
    if (lot.sourceTotalCherryWeightKg && lot.greenBeanWeightKg) {
      const calculatedYield = Number(((lot.greenBeanWeightKg / lot.sourceTotalCherryWeightKg) * 100).toFixed(1));
      setInspectedYieldRatio(lot.ics_inspected_yield_ratio ?? calculatedYield);
    } else {
      setInspectedYieldRatio(lot.ics_inspected_yield_ratio ?? 18.5);
    }

    setMethodMatch(lot.ics_inspected_method_match ?? true);
    setSanitationPassed(true);
    setAuditNotes(
      lot.ics_notes ||
        `Pemeriksaan fisik green bean stasiun ${lot.processorName}. Kadar air memenuhi standar SNI, defect fisik terkontrol.`
    );
    setInspectModalOpen(true);
  };

  // Submit Inspection: Approve or Reject
  const handleExecuteVerification = (approved: boolean) => {
    if (!selectedLot) return;

    if (!approved && !auditNotes.trim()) {
      alert('Harap masukkan catatan/alasan meminta pengeringan atau sortasi ulang.');
      return;
    }

    const res = verifyProcessedLotByICS(selectedLot.id, approved, {
      moistureContentPercent: Number(inspectedMoisture),
      waterActivityAw: Number(inspectedWaterActivity),
      defectCount: Number(inspectedDefect),
      yieldRatioPercent: Number(inspectedYieldRatio),
      processMethodMatch: methodMatch && sanitationPassed,
      notes: auditNotes.trim(),
    });

    setInspectModalOpen(false);
    setFeedback({
      type: approved ? 'success' : 'error',
      message: res.message,
    });
    setTimeout(() => setFeedback(null), 6000);
  };

  // Helpers for moisture badge and defect tier
  const getMoistureBadge = (val: number) => {
    if (val >= 10.0 && val <= 12.0) {
      return {
        label: 'Ideal (10.0% - 12.0% SNI/SCA)',
        className: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        isGood: true,
      };
    } else if (val > 12.0) {
      return {
        label: 'Terlalu Basah (> 12.0% - Rawan Jamur)',
        className: 'bg-rose-100 text-rose-800 border-rose-300',
        isGood: false,
      };
    } else {
      return {
        label: 'Terlalu Kering (< 10.0%)',
        className: 'bg-amber-100 text-amber-800 border-amber-300',
        isGood: false,
      };
    }
  };

  const getDefectTier = (defects: number) => {
    if (defects <= 5) {
      return { label: 'Specialty Grade 1 (0-5 Defect)', color: 'text-emerald-700' };
    } else if (defects <= 11) {
      return { label: 'Premium Grade 2 (6-11 Defect)', color: 'text-blue-700' };
    } else if (defects <= 25) {
      return { label: 'Commercial Fine Grade 3 (12-25 Defect)', color: 'text-amber-700' };
    } else {
      return { label: 'Off-Grade / Asalan (>25 Defect)', color: 'text-rose-700' };
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner (AdminLTE Box Style) */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
            <ClipboardCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-900 tracking-tight">
                Verifikasi Mutu Hasil Olahan Pengolah (Green Bean)
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-teal-100 text-teal-900 border border-teal-300">
                <BadgeCheck className="w-3.5 h-3.5 text-teal-700" />
                <span>Petugas ICS</span>
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Inspeksi keabsahan metode fermentasi, uji kadar air (standar 10-12% MC), nilai defect fisik SCA/SNI, serta kepatuhan sanitasi stasiun pengolah kelompok tani sebelum green bean didistribusikan.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => openBlankoModal('pengolah')}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-md text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
            title="Download / Cetak Blanko Formulir Fisik Lapangan (A4) untuk Pengolah"
          >
            <Printer className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Blanko Audit Pengolah (A4)</span>
          </button>

          <Link
            to="/admin/ict"
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md text-xs font-bold flex items-center gap-2 shadow-xs transition-colors whitespace-nowrap shrink-0 border border-stone-300"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Dashboard Pusat ICS</span>
          </Link>

          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-stone-800">
              {currentUser?.name || 'Petugas ICS Kelompok Tani'}
            </div>
            <div className="text-[11px] text-stone-500">
              {currentUser?.organization || 'Kelompok Tani Kopi Mandiri'}
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center border border-teal-200">
            ICS
          </div>
        </div>
      </div>

      {/* Alert Banner / Notification */}
      {feedback && (
        <div
          className={`p-4 rounded-lg flex items-center justify-between text-xs font-bold border transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-rose-50 text-rose-900 border-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-stone-400 hover:text-stone-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. AdminLTE Small-Box KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Box 1: Total Lot */}
        <div className="bg-white rounded-lg border border-[#d2d6de] shadow-xs overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-stone-900">{totalLots} Lot</div>
              <div className="text-xs font-bold text-stone-600 mt-0.5">Total Green Bean Diproduksi</div>
              <div className="text-[11px] text-stone-500 mt-1">Stasiun Wet/Dry Mill Binaan</div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
              <Coffee className="w-6 h-6" />
            </div>
          </div>
          <div className="w-full py-1.5 px-4 bg-stone-50 border-t border-stone-200 text-stone-500 font-bold text-[11px] flex items-center justify-between">
            <span>Kapasitas Lot Pengolah</span>
            <span className="font-mono text-stone-700">100% Tercatat</span>
          </div>
        </div>

        {/* Box 2: Menunggu Verifikasi (Pending) */}
        <div className="bg-white rounded-lg border border-[#d2d6de] shadow-xs overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-amber-600">{pendingLots} Lot</div>
              <div className="text-xs font-bold text-stone-600 mt-0.5">Menunggu Verifikasi ICS</div>
              <div className="text-[11px] text-amber-800 font-semibold mt-1">
                Perlu Uji Kadar Air &amp; Defect
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <button
            onClick={() => setStatusFilter('pending')}
            className="w-full py-1.5 px-4 bg-amber-50/70 hover:bg-amber-100 border-t border-amber-200 text-amber-900 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>Buka Antrean Audit</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Box 3: Lolos & Berstempel ICS (Verified) */}
        <div className="bg-white rounded-lg border border-[#d2d6de] shadow-xs overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-emerald-600">{verifiedLots} Lot</div>
              <div className="text-xs font-bold text-stone-600 mt-0.5">Lolos Sertifikasi ICS</div>
              <div className="text-[11px] text-emerald-800 font-semibold mt-1">
                Stempel Digital Resmi Aktif
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <button
            onClick={() => setStatusFilter('verified')}
            className="w-full py-1.5 px-4 bg-emerald-50/70 hover:bg-emerald-100 border-t border-emerald-200 text-emerald-900 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>Daftar Lot Tersertifikasi</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Box 4: Minta Perbaikan (Rejected) */}
        <div className="bg-white rounded-lg border border-[#d2d6de] shadow-xs overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-rose-600">{rejectedLots} Lot</div>
              <div className="text-xs font-bold text-stone-600 mt-0.5">Minta Pengeringan / Sortasi</div>
              <div className="text-[11px] text-rose-800 font-semibold mt-1">
                Catatan Revisi Terkirim
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
          </div>
          <button
            onClick={() => setStatusFilter('rejected')}
            className="w-full py-1.5 px-4 bg-rose-50/70 hover:bg-rose-100 border-t border-rose-200 text-rose-900 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>Lihat Catatan Revisi</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Main Data Card: Table of Processed Lots with Inspection Actions */}
      <div className="bg-white rounded-lg border border-[#d2d6de] shadow-xs overflow-hidden">
        {/* Card Header & Controls */}
        <div className="p-4 border-b border-stone-200 bg-stone-50/75 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter Buttons */}
            {[
              { id: 'all', label: 'Semua Status', count: totalLots },
              { id: 'pending', label: 'Menunggu Verifikasi', count: pendingLots, color: 'text-amber-700 bg-amber-100' },
              { id: 'verified', label: 'Terverifikasi ICS', count: verifiedLots, color: 'text-emerald-700 bg-emerald-100' },
              { id: 'rejected', label: 'Perlu Revisi', count: rejectedLots, color: 'text-rose-700 bg-rose-100' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    statusFilter === tab.id ? 'bg-blue-800 text-white' : tab.color || 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari ID Lot, varietas, pengolah..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-300 rounded-md text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Method Filter Dropdown */}
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-md text-xs text-stone-800 font-medium focus:outline-hidden focus:border-blue-500"
            >
              <option value="all">Semua Metode Olah</option>
              <option value="Anaerobic Natural">Anaerobic Natural</option>
              <option value="Full Washed">Full Washed</option>
              <option value="Honey (Yellow/Red)">Honey</option>
              <option value="Natural / Dry">Natural / Dry</option>
              <option value="Wet Hulled (Giling Basah)">Wet Hulled (Giling Basah)</option>
              <option value="Wine Process">Wine Process</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-100/80 text-stone-600 uppercase text-[10px] font-bold border-b border-stone-200">
                <th className="py-3 px-4">Lot ID &amp; Foto</th>
                <th className="py-3 px-4">Stasiun Pengolah</th>
                <th className="py-3 px-4">Varietas &amp; Asal Ceri</th>
                <th className="py-3 px-4">Metode &amp; Durasi Olah</th>
                <th className="py-3 px-4">Uji Fisik (MC &amp; Defect)</th>
                <th className="py-3 px-4">Status Verifikasi ICS</th>
                <th className="py-3 px-4 text-right">Tindakan Petugas ICS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredLots.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    <Coffee className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                    <div className="font-bold text-sm text-stone-600">Tidak ada lot olahan yang sesuai filter</div>
                    <p className="text-xs text-stone-400 mt-1">
                      Coba ganti kata kunci pencarian atau reset filter status.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLots.map((lot) => {
                  const icsStatus = lot.ics_verification_status || 'unverified';
                  const moistureVal = lot.ics_inspected_moisture ?? lot.moistureContentPercent;
                  const moistureBadge = getMoistureBadge(moistureVal);
                  const defectVal = lot.ics_inspected_defect ?? lot.defectCount;
                  const defectTier = getDefectTier(defectVal);

                  return (
                    <tr
                      key={lot.id}
                      className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                      onClick={() => handleOpenInspection(lot)}
                    >
                      {/* 1. Lot ID & Photo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={lot.photoUrl || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=120'}
                            alt={lot.variety}
                            className="w-11 h-11 rounded-lg object-cover border border-stone-200 shrink-0"
                          />
                          <div>
                            <div className="font-mono font-black text-stone-900 group-hover:text-blue-700 transition-colors">
                              {lot.id}
                            </div>
                            <div className="text-[11px] text-stone-500 font-medium">
                              Tgl Olah: {lot.processedDate}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBarcodeLot(lot);
                                setBarcodeModalOpen(true);
                              }}
                              className="text-[10px] text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 mt-0.5"
                            >
                              <QrCode className="w-3 h-3" />
                              <span>QR Barcode</span>
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* 2. Stasiun Pengolah */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-800">{lot.processorName}</div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{lot.sourceOrigin}</span>
                        </div>
                      </td>

                      {/* 3. Varietas & Asal Ceri */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900">{lot.variety}</div>
                        <div className="text-[11px] text-stone-500">
                          Petani: <span className="font-semibold text-stone-700">{lot.sourceFarmerName}</span>
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                          Lot Ceri: {lot.sourceFarmerLotId} ({lot.altitude})
                        </div>
                      </td>

                      {/* 4. Metode & Durasi Olah */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap">
                          {lot.processMethod}
                        </span>
                        <div className="text-[11px] text-stone-600 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>Fermentasi: <strong>{lot.fermentationTimeHours} Jam</strong></span>
                        </div>
                        <div className="text-[10px] text-stone-400">
                          Drying: {lot.dryingMethod}
                        </div>
                      </td>

                      {/* 5. Uji Fisik (MC & Defect) */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Droplets className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="font-bold text-stone-900">{moistureVal}% MC</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-bold border ${moistureBadge.className}`}
                            title={moistureBadge.label}
                          >
                            {moistureVal >= 10.0 && moistureVal <= 12.0 ? 'SNI 10-12%' : 'Luar Batas'}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-600 mt-1">
                          Defect: <strong className="text-stone-800">{defectVal} defect</strong>
                          <span className="text-[10px] text-stone-400"> / 350g</span>
                        </div>
                        <div className={`text-[10px] font-bold ${defectTier.color}`}>
                          {lot.grade}
                        </div>
                      </td>

                      {/* 6. Status Verifikasi ICS */}
                      <td className="py-3 px-4">
                        {icsStatus === 'verified' && (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Terverifikasi ICS ✓</span>
                            </span>
                            {lot.ics_verified_at && (
                              <div className="text-[10px] text-stone-500">
                                {lot.ics_verified_at.split('T')[0]}
                              </div>
                            )}
                            {lot.verificationStamp && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStampLot(lot);
                                  setStampModalOpen(true);
                                }}
                                className="text-[10px] text-emerald-700 hover:text-emerald-900 underline font-bold flex items-center gap-1 mt-0.5"
                              >
                                <Award className="w-3 h-3 text-emerald-600" />
                                <span>Lihat Stempel ICS</span>
                              </button>
                            )}
                          </div>
                        )}

                        {icsStatus === 'pending' && (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>Menunggu Verifikasi ⏳</span>
                            </span>
                            <div className="text-[10px] text-amber-700 font-medium">
                              Belum ada stempel ICS
                            </div>
                          </div>
                        )}

                        {icsStatus === 'rejected' && (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-900 border border-rose-300">
                              <RotateCcw className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                              <span>Minta Pengeringan/Sortasi ⚠️</span>
                            </span>
                            {lot.ics_notes && (
                              <div className="text-[10px] text-rose-700 max-w-[180px] truncate" title={lot.ics_notes}>
                                Catatan: {lot.ics_notes}
                              </div>
                            )}
                          </div>
                        )}

                        {icsStatus === 'unverified' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-300">
                            <span>Belum Diaudit</span>
                          </span>
                        )}
                      </td>

                      {/* 7. Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleOpenInspection(lot)}
                            className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                            title="Buka Lembar Kerja Uji Mutu & Verifikasi ICS"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>{icsStatus === 'verified' ? 'Audit Ulang' : 'Inspeksi & Verifikasi'}</span>
                          </button>
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

      {/* ========================================================================= */}
      {/* 4. MODAL FORMULIR UJI MUTU OLAHAN ICS (FORM AUDIT & STEMPEL DIGITAL)     */}
      {/* ========================================================================= */}
      {inspectModalOpen && selectedLot && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-300 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-800 to-blue-900 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                  <ClipboardCheck className="w-6 h-6 text-teal-300" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-teal-200 font-bold">
                    Lembar Kerja Petugas ICS Kelompok Tani
                  </div>
                  <h3 className="text-lg font-black text-white">
                    Inspeksi Mutu Lot Green Bean #{selectedLot.id}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-stone-800">
              {/* Lot Profile Summary Banner */}
              <div className="bg-stone-50 rounded-lg p-4 border border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">Stasiun Pengolah</span>
                  <strong className="text-stone-900 text-xs">{selectedLot.processorName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">Varietas &amp; Asal</span>
                  <strong className="text-stone-900 text-xs">{selectedLot.variety}</strong>
                  <div className="text-[10px] text-stone-500">{selectedLot.sourceOrigin}</div>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">Petani Ceri Asal</span>
                  <strong className="text-stone-900 text-xs">{selectedLot.sourceFarmerName}</strong>
                  <div className="text-[10px] text-stone-500 font-mono">Lot {selectedLot.sourceFarmerLotId}</div>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">Volume Biji / Ceri</span>
                  <strong className="text-stone-900 text-xs font-mono">
                    {selectedLot.greenBeanWeightKg} kg Green Bean
                  </strong>
                  <div className="text-[10px] text-stone-500 font-mono">
                    dari {selectedLot.sourceTotalCherryWeightKg || selectedLot.greenBeanWeightKg * 5} kg ceri
                  </div>
                </div>
              </div>

              {/* SECTION A: Validasi Metode Olah & Sanitasi Tangki */}
              <div className="border border-stone-200 rounded-lg p-4 space-y-3 bg-white">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span>1. Validasi Metode Fermentasi &amp; Kepatuhan Sanitasi</span>
                  </h4>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {selectedLot.processMethod} ({selectedLot.fermentationTimeHours} Jam)
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="flex items-start gap-2.5 p-2 rounded-md hover:bg-stone-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={methodMatch}
                      onChange={(e) => setMethodMatch(e.target.checked)}
                      className="mt-0.5 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-bold text-stone-900 block">
                        Kesesuaian SOP Metode Fermentasi ({selectedLot.processMethod})
                      </span>
                      <span className="text-[11px] text-stone-500">
                        Durasi waktu fermentasi ({selectedLot.fermentationTimeHours} jam) tercatat jujur dan metode penjemuran ({selectedLot.dryingMethod}) sesuai standar kelompok tani.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2 rounded-md hover:bg-stone-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sanitationPassed}
                      onChange={(e) => setSanitationPassed(e.target.checked)}
                      className="mt-0.5 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-bold text-stone-900 block">
                        Kepatuhan Sanitasi Tangki &amp; Area Penjemuran
                      </span>
                      <span className="text-[11px] text-stone-500">
                        Tangki fermentasi higienis bebas kontaminasi jamur liar; air pencucian tidak mencemari lingkungan (IPAL aman).
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* SECTION B: Uji Parameter Fisik (Kadar Air, Defect, aW, Rendemen) */}
              <div className="border border-stone-200 rounded-lg p-4 space-y-4 bg-white">
                <div className="border-b border-stone-100 pb-2">
                  <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
                    <Scale className="w-4 h-4 text-blue-600" />
                    <span>2. Pengukuran Parameter Fisik &amp; Laboratorium Lapangan</span>
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Masukkan hasil pengukuran aktual dari alat uji moisture meter dan sampling sortasi defect 350 gram.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Parameter 1: Kadar Air (% Moisture Content) */}
                  <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-stone-900 flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-blue-600" />
                        <span>Kadar Air (% MC)</span>
                      </label>
                      <span className="text-[10px] text-stone-500 font-semibold">Standar: 10.0% - 12.0%</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        min="5"
                        max="25"
                        value={inspectedMoisture}
                        onChange={(e) => setInspectedMoisture(parseFloat(e.target.value) || 0)}
                        className="w-28 px-3 py-1.5 bg-white border border-stone-300 rounded font-mono font-bold text-sm text-stone-900 focus:outline-hidden focus:border-blue-600"
                      />
                      <span className="text-xs font-bold text-stone-600">% MC</span>
                    </div>

                    {/* Indicator Badge */}
                    {(() => {
                      const badge = getMoistureBadge(Number(inspectedMoisture));
                      return (
                        <div
                          className={`px-2.5 py-1 rounded text-[10px] font-bold border flex items-center gap-1.5 ${badge.className}`}
                        >
                          {badge.isGood ? (
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          )}
                          <span>{badge.label}</span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Parameter 2: Nilai Defect Fisik */}
                  <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-stone-900 flex items-center gap-1">
                        <CheckSquare className="w-3.5 h-3.5 text-stone-700" />
                        <span>Nilai Defect (per 350g)</span>
                      </label>
                      <span className="text-[10px] text-stone-500 font-semibold">Standar SNI / SCA</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        value={inspectedDefect}
                        onChange={(e) => setInspectedDefect(parseInt(e.target.value) || 0)}
                        className="w-28 px-3 py-1.5 bg-white border border-stone-300 rounded font-mono font-bold text-sm text-stone-900 focus:outline-hidden focus:border-blue-600"
                      />
                      <span className="text-xs font-bold text-stone-600">Poin Cacat</span>
                    </div>

                    {/* Defect Tier */}
                    {(() => {
                      const tier = getDefectTier(Number(inspectedDefect));
                      return (
                        <div className="px-2.5 py-1 rounded bg-white text-[10px] font-bold border border-stone-200 text-stone-800">
                          Klasifikasi: <span className={tier.color}>{tier.label}</span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Parameter 3: Water Activity (Aw) */}
                  <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-stone-900">Aktivitas Air (aW)</label>
                      <span className="text-[10px] text-stone-500 font-semibold">Standar: 0.50 - 0.65</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0.30"
                        max="0.99"
                        value={inspectedWaterActivity}
                        onChange={(e) => setInspectedWaterActivity(parseFloat(e.target.value) || 0)}
                        className="w-28 px-3 py-1.5 bg-white border border-stone-300 rounded font-mono font-bold text-sm text-stone-900 focus:outline-hidden focus:border-blue-600"
                      />
                      <span className="text-xs font-bold text-stone-600">aW</span>
                    </div>
                    <div className="text-[10px] text-stone-500">
                      Mencegah perkecambahan spora &amp; degradasi lipid rasa kopi.
                    </div>
                  </div>

                  {/* Parameter 4: Estimasi Rendemen (% Yield) */}
                  <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-stone-900">Perhitungan Rendemen (%)</label>
                      <span className="text-[10px] text-stone-500 font-semibold">Cherry-to-Green Bean</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        min="5"
                        max="50"
                        value={inspectedYieldRatio}
                        onChange={(e) => setInspectedYieldRatio(parseFloat(e.target.value) || 0)}
                        className="w-28 px-3 py-1.5 bg-white border border-stone-300 rounded font-mono font-bold text-sm text-stone-900 focus:outline-hidden focus:border-blue-600"
                      />
                      <span className="text-xs font-bold text-stone-600">% Rendemen</span>
                    </div>
                    <div className="text-[10px] text-stone-500">
                      Standar arabika olah basah ~18%-20%, natural ~14%-17%.
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION C: Catatan & Rekomendasi Petugas ICS */}
              <div className="space-y-1.5">
                <label className="font-bold text-stone-900 flex items-center justify-between">
                  <span>Catatan Audit Mutu &amp; Rekomendasi ICS:</span>
                  <span className="text-[10px] text-stone-400 font-normal">Tercatat di rantai ketertelusuran</span>
                </label>
                <textarea
                  rows={3}
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                  placeholder="Tuliskan catatan hasil uji mutu fisik, sanitasi, atau instruksi perbaikan untuk pengolah..."
                  className="w-full p-3 bg-white border border-stone-300 rounded-md text-xs text-stone-900 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Warning Notice jika kadar air di luar standar */}
              {(inspectedMoisture > 12.0 || inspectedMoisture < 10.0 || inspectedDefect > 15) && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-300 text-amber-900 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Perhatian Parameter Mutu:</strong>
                    {inspectedMoisture > 12.0 && (
                      <p>• Kadar air {inspectedMoisture}% di atas batas maksimum 12.0%. Disarankan meminta penjemuran ulang (*re-drying*).</p>
                    )}
                    {inspectedDefect > 15 && (
                      <p>• Nilai defect {inspectedDefect} melebihi batas Grade 2. Disarankan meminta sortasi fisik ulang (*re-sorting*).</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer (Action Buttons) */}
            <div className="p-4 bg-stone-100 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setInspectModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-md bg-white hover:bg-stone-200 text-stone-700 font-bold text-xs border border-stone-300 transition-colors cursor-pointer"
              >
                Batal
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {/* Tombol Tolak / Minta Perbaikan */}
                <button
                  type="button"
                  onClick={() => handleExecuteVerification(false)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  title="Tolak sertifikasi dan minta pengeringan atau sortasi ulang"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>[✕ Minta Pengeringan / Sortasi Ulang]</span>
                </button>

                {/* Tombol Setujui & Terbitkan Stempel */}
                <button
                  type="button"
                  onClick={() => handleExecuteVerification(true)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  title="Setujui mutu dan terbitkan Stempel Resmi ICS Kelompok Tani"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>[✓ Setujui &amp; Terbitkan Stempel ICS]</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL TAMPILAN STEMPEL DIGITAL RESMI ICS                              */}
      {/* ========================================================================= */}
      {stampModalOpen && selectedStampLot && selectedStampLot.verificationStamp && (
        <div className="fixed inset-0 z-50 bg-stone-900/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-emerald-500 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Stamp Card Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 text-center relative">
              <button
                type="button"
                onClick={() => setStampModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white absolute top-4 right-4 flex items-center justify-center text-xs"
              >
                ✕
              </button>
              <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-emerald-400 mx-auto flex items-center justify-center mb-2 shadow-inner">
                <ShieldCheck className="w-8 h-8 text-emerald-300" />
              </div>
              <h3 className="font-black text-lg text-white tracking-wide">
                SERTIFIKASI MUTU HASIL OLAHAN ICS
              </h3>
              <p className="text-[11px] text-emerald-200">
                Internal Control System (ICS) - Gabungan Kelompok Tani Kopi
              </p>
            </div>

            {/* Stamp Card Body */}
            <div className="p-6 space-y-4 text-xs text-stone-800">
              <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-stone-500 font-medium">Nomor Dokumen Sertifikat:</span>
                  <span className="font-mono font-bold text-stone-900">
                    {selectedStampLot.verificationStamp.certificateNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-stone-500 font-medium">ID Lot Green Bean:</span>
                  <span className="font-mono font-bold text-blue-700">{selectedStampLot.id}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-stone-500 font-medium">Stasiun Pengolah:</span>
                  <span className="font-bold text-stone-900">{selectedStampLot.processorName}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-stone-500 font-medium">Petani Asal:</span>
                  <span className="font-bold text-stone-800">{selectedStampLot.sourceFarmerName}</span>
                </div>
              </div>

              {/* Tested Quality Score */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Uji Mutu Fisik ICS:</span>
                  <span className="px-2 py-0.5 rounded font-black text-[11px] bg-emerald-600 text-white">
                    {selectedStampLot.verificationStamp.scoreDisplay || 'Lolos Uji Mutu'}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-900 italic">
                  "{selectedStampLot.verificationStamp.notes}"
                </p>
              </div>

              {/* Digital Signature Hash */}
              <div className="p-3 bg-stone-100 rounded-lg border border-stone-200 space-y-1">
                <span className="text-[10px] text-stone-500 block uppercase font-bold">
                  Digital Signature Cryptographic Hash:
                </span>
                <div className="font-mono text-[10px] text-stone-700 break-all bg-white p-1.5 rounded border border-stone-300">
                  {selectedStampLot.verificationStamp.digitalSignatureHash}
                </div>
                <div className="flex justify-between text-[10px] text-stone-500 pt-1">
                  <span>Diverifikasi: {selectedStampLot.verificationStamp.verifierName}</span>
                  <span>{selectedStampLot.verificationStamp.verifiedAt}</span>
                </div>
              </div>

              <div className="text-center pt-1">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-black rounded-full text-[10px]">
                  ✓ SAH UNTUK DISTRIBUSI GUDANG &amp; MARKETPLACE RESMI
                </span>
              </div>
            </div>

            {/* Stamp Card Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 text-center">
              <button
                type="button"
                onClick={() => setStampModalOpen(false)}
                className="px-6 py-2 rounded-lg bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Tutup Tampilan Sertifikat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barcode Modal */}
      {barcodeModalOpen && selectedBarcodeLot && (
        <ProcessorBarcodeModal
          lot={selectedBarcodeLot}
          isOpen={barcodeModalOpen}
          onClose={() => {
            setBarcodeModalOpen(false);
            setSelectedBarcodeLot(null);
          }}
        />
      )}
    </div>
  );
};

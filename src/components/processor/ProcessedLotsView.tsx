import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { ProcessedGreenBeanLot } from '../../types/coffee';
import {
  Package,
  Search,
  Filter,
  MapPin,
  Recycle,
  Star,
  Printer,
  X,
  Droplets,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertTriangle,
  Award,
  ShieldCheck,
  ChevronRight,
  Store,
  Layers,
  Sparkles,
  Coffee,
  Info,
} from 'lucide-react';
import { ProcessorBarcodeModal } from '../ProcessorBarcodeModal';
import { calculateProcessorEcoRating } from '../../utils/ecoRating';

interface ProcessedLotsViewProps {
  onSelectLot?: (lot: ProcessedGreenBeanLot) => void;
}

export const ProcessedLotsView: React.FC<ProcessedLotsViewProps> = ({ onSelectLot }) => {
  const {
    currentUser,
    processedLots,
    setActiveView,
  } = useCoffee();

  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [icsFilter, setIcsFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Detail Modal
  const [selectedLotDetail, setSelectedLotDetail] = useState<ProcessedGreenBeanLot | null>(null);

  // Barcode Modal
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [selectedBarcodeLot, setSelectedBarcodeLot] = useState<ProcessedGreenBeanLot | null>(null);

  // Filter lots belonging to current processor (or all if admin)
  const myProcessedLots = processedLots.filter(
    (lot) => !lot.processorId || lot.processorId === currentUser?.id || currentUser?.role === 'admin_kelompok_tani' || currentUser?.role === 'ict'
  );

  const filteredLots = myProcessedLots.filter((lot) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      lot.id.toLowerCase().includes(q) ||
      lot.variety.toLowerCase().includes(q) ||
      lot.sourceFarmerName.toLowerCase().includes(q) ||
      lot.sourceOrigin.toLowerCase().includes(q) ||
      lot.processMethod.toLowerCase().includes(q);

    const matchMethod = methodFilter === 'all' || lot.processMethod === methodFilter;

    const icsStatus = lot.ics_verification_status || 'unverified';
    const matchIcs =
      icsFilter === 'all'
        ? true
        : icsFilter === 'pending'
        ? icsStatus === 'pending' || icsStatus === 'unverified'
        : icsStatus === icsFilter;

    return matchQuery && matchMethod && matchIcs;
  });

  // Render ICS Verification Status Badge Component
  const renderIcsBadge = (lot: ProcessedGreenBeanLot, isCompact: boolean = false) => {
    const status = lot.ics_verification_status || 'unverified';

    if (status === 'verified') {
      return (
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Terverifikasi ICS ✓</span>
          </span>
          {!isCompact && lot.ics_verified_at && (
            <div className="text-[10px] text-stone-500 font-medium">
              Sah per {lot.ics_verified_at.split('T')[0]}
            </div>
          )}
        </div>
      );
    }

    if (status === 'pending') {
      return (
        <div className="space-y-0.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs whitespace-nowrap">
            <Clock className="w-3 h-3 text-amber-600 shrink-0" />
            <span>Menunggu Verifikasi ICS ⏳</span>
          </span>
          {!isCompact && (
            <div className="text-[10px] text-amber-700 font-medium">
              Antrean Uji Kadar Air &amp; Defect
            </div>
          )}
        </div>
      );
    }

    if (status === 'rejected') {
      return (
        <div className="space-y-0.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-900 border border-rose-300 shadow-2xs whitespace-nowrap">
            <RotateCcw className="w-3 h-3 text-rose-600 shrink-0" />
            <span>Minta Pengeringan/Sortasi ⚠️</span>
          </span>
          {!isCompact && lot.ics_notes && (
            <div className="text-[10px] text-rose-700 font-medium max-w-[200px] truncate" title={lot.ics_notes}>
              {lot.ics_notes}
            </div>
          )}
        </div>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200 whitespace-nowrap">
        <span>Belum Diverifikasi ICS</span>
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header and Filter Controls */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-600" />
              <span>Daftar Lot Green Bean Stasiun Pengolah</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Pantau stok barang jadi, kadar air, nilai defect fisik, serta status stempel verifikasi mutu oleh Petugas ICS Kelompok Tani.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Tabel
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Kartu (Grid)
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
          {/* Status ICS Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'Semua Lot', count: myProcessedLots.length },
              {
                id: 'verified',
                label: 'Terverifikasi ICS',
                count: myProcessedLots.filter((l) => l.ics_verification_status === 'verified').length,
                color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
              },
              {
                id: 'pending',
                label: 'Menunggu ICS',
                count: myProcessedLots.filter((l) => !l.ics_verification_status || l.ics_verification_status === 'pending' || l.ics_verification_status === 'unverified').length,
                color: 'text-amber-700 bg-amber-50 border-amber-200',
              },
              {
                id: 'rejected',
                label: 'Perlu Revisi / Re-Dry',
                count: myProcessedLots.filter((l) => l.ics_verification_status === 'rejected').length,
                color: 'text-rose-700 bg-rose-50 border-rose-200',
              },
            ].map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setIcsFilter(pill.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  icsFilter === pill.id
                    ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                    : pill.color || 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>{pill.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  icsFilter === pill.id ? 'bg-stone-700 text-white' : 'bg-stone-200 text-stone-800'
                }`}>
                  {pill.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Method Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari varietas, lot, petani..."
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:bg-white focus:border-amber-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 font-medium focus:outline-hidden focus:bg-white focus:border-amber-500"
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
      </div>

      {/* Main Listing View */}
      {filteredLots.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">Tidak ada lot green bean ditemukan</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Tidak ada lot olahan yang sesuai dengan filter pencarian atau status verifikasi ICS yang dipilih.
          </p>
        </div>
      ) : (
        <>
          {/* 1. TABLE VIEW */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs min-w-[950px]">
                  <thead>
                    <tr className="bg-stone-50 text-stone-500 uppercase text-[10px] font-bold border-b border-stone-200">
                      <th className="py-3 px-4">ID Green Bean</th>
                      <th className="py-3 px-4">Varietas &amp; Metode Olah</th>
                      <th className="py-3 px-4">Asal Petani &amp; Ceri</th>
                      <th className="py-3 px-4">Kadar Air &amp; Defect</th>
                      <th className="py-3 px-4">Stok Tersedia</th>
                      <th className="py-3 px-4">Status Verifikasi ICS</th>
                      <th className="py-3 px-4 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredLots.map((gb) => {
                      const moisture = gb.ics_inspected_moisture ?? gb.moistureContentPercent;
                      const defect = gb.ics_inspected_defect ?? gb.defectCount;

                      return (
                        <tr
                          key={gb.id}
                          onClick={() => {
                            setSelectedLotDetail(gb);
                            if (onSelectLot) onSelectLot(gb);
                          }}
                          className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                        >
                          {/* ID & Processed Date */}
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-stone-900 group-hover:text-amber-800 transition-colors block">
                              {gb.id}
                            </span>
                            <span className="text-[10px] text-stone-400 font-medium">
                              Tgl Olah: {gb.processedDate}
                            </span>
                          </td>

                          {/* Variety & Method */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-stone-900">{gb.variety}</div>
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 whitespace-nowrap mt-0.5">
                              {gb.processMethod}
                            </span>
                          </td>

                          {/* Farmer & Origin */}
                          <td className="py-3 px-4">
                            <div className="font-medium text-stone-800">{gb.sourceFarmerName}</div>
                            <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                              <span>{gb.sourceOrigin}</span>
                            </div>
                          </td>

                          {/* Moisture & Defect */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-stone-900 flex items-center gap-1">
                              <Droplets className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span>{moisture}% MC</span>
                            </div>
                            <div className="text-[11px] text-stone-500">
                              {defect} defect / 350g ({gb.grade})
                            </div>
                          </td>

                          {/* Available Stock */}
                          <td className="py-3 px-4 font-mono font-bold text-stone-900">
                            {gb.availableWeightKg} / {gb.greenBeanWeightKg} kg
                          </td>

                          {/* ICS VERIFICATION STATUS BADGE */}
                          <td className="py-3 px-4">
                            {renderIcsBadge(gb, false)}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedBarcodeLot(gb);
                                  setBarcodeModalOpen(true);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors inline-flex items-center gap-1"
                                title="Cetak Barcode Karung"
                              >
                                <Printer className="w-3 h-3" />
                                <span>Barcode</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedLotDetail(gb);
                                  if (onSelectLot) onSelectLot(gb);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors inline-flex items-center gap-1"
                              >
                                <span>Detail</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. GRID / CARDS VIEW */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLots.map((gb) => {
                const isAvailable = gb.availableWeightKg > 0;
                const ecoRating = calculateProcessorEcoRating(
                  gb.wasteManagement,
                  gb.sourceTotalCherryWeightKg || gb.greenBeanWeightKg * 5,
                  gb.greenBeanWeightKg
                );
                const moisture = gb.ics_inspected_moisture ?? gb.moistureContentPercent;
                const defect = gb.ics_inspected_defect ?? gb.defectCount;

                return (
                  <div
                    key={gb.id}
                    onClick={() => {
                      setSelectedLotDetail(gb);
                      if (onSelectLot) onSelectLot(gb);
                    }}
                    className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      {/* Image Thumbnail & Top Overlays */}
                      <div className="relative h-44 bg-stone-100 overflow-hidden">
                        <img
                          src={gb.photoUrl || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600'}
                          alt={gb.variety}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-0.5 rounded-md font-bold">
                          {gb.id}
                        </div>
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <span className="bg-amber-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                            {gb.processMethod}
                          </span>
                        </div>

                        {/* ICS Status Floating Pill at Bottom of Image */}
                        <div className="absolute bottom-2.5 left-3">
                          {renderIcsBadge(gb, true)}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 space-y-3">
                        <div>
                          <div className="flex items-center gap-1 text-[11px] text-stone-500 mb-1">
                            <span>Petani:</span>
                            <strong className="text-stone-800">{gb.sourceFarmerName}</strong>
                            <span>({gb.sourceFarmerLotId})</span>
                          </div>
                          <h3 className="font-bold text-base text-stone-900 group-hover:text-amber-800 transition-colors">
                            {gb.variety} - {gb.grade}
                          </h3>
                          <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span>{gb.sourceOrigin} ({gb.altitude})</span>
                          </p>
                        </div>

                        {/* Parameter Grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-100">
                          <div>
                            <span className="text-[10px] text-stone-400 block font-semibold">Kadar Air:</span>
                            <span className="font-bold text-stone-800 flex items-center gap-1">
                              <Droplets className="w-3 h-3 text-blue-500" />
                              {moisture}% MC
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 block font-semibold">Defect Biji:</span>
                            <span className="font-bold text-stone-800">{defect} defect/350g</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 block font-semibold">Stok Biji:</span>
                            <span className="font-mono font-bold text-stone-900">
                              {gb.availableWeightKg} / {gb.greenBeanWeightKg} kg
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 block font-semibold">Fermentasi:</span>
                            <span className="font-bold text-stone-800">{gb.fermentationTimeHours} Jam</span>
                          </div>
                        </div>

                        {/* Cupping Notes */}
                        {gb.cuppingNotes && gb.cuppingNotes.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {gb.cuppingNotes.map((note, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-200"
                              >
                                {note}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Zero-Waste Eco Rating */}
                        <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 text-[11px] flex items-center justify-between">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Recycle className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                            <span className="font-bold truncate text-teal-950">
                              {gb.wasteManagement?.utilization || 'Dikomposkan Jadi Pupuk'}
                            </span>
                          </div>
                          <span className="font-bold text-[10px] text-emerald-800 shrink-0 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300 flex items-center gap-0.5">
                            ⭐ {ecoRating.starRating} ({ecoRating.ecoScore} Pts)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 block">Harga Green Bean:</span>
                        <span className="text-sm font-black text-stone-900">
                          Rp {gb.pricePerKg.toLocaleString()}
                          <span className="text-xs font-normal text-stone-500"> / kg</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBarcodeLot(gb);
                            setBarcodeModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition-colors"
                          title="Cetak Barcode Karung"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveView('marketplace')}
                          className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs transition-colors flex items-center gap-1"
                        >
                          <Store className="w-3.5 h-3.5" />
                          <span>Pasar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ===================================================================== */}
      {/* DETAIL MODAL / SLIDE-OVER                                             */}
      {/* ===================================================================== */}
      {selectedLotDetail && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 font-mono uppercase font-bold tracking-wider">
                  Detail Lot Green Bean
                </span>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                  <span>{selectedLotDetail.variety} - {selectedLotDetail.id}</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLotDetail(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs text-stone-800 max-h-[75vh] overflow-y-auto">
              {/* ICS Status Section Banner */}
              <div className="p-4 rounded-xl border space-y-2 bg-stone-50 border-stone-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>Status Verifikasi Petugas ICS Kelompok Tani:</span>
                  </span>
                  {renderIcsBadge(selectedLotDetail, true)}
                </div>

                {selectedLotDetail.ics_notes && (
                  <div className="text-xs p-2.5 rounded-lg bg-white border border-stone-200 text-stone-800">
                    <strong className="text-stone-600 block text-[10px] uppercase font-bold">Catatan Audit ICS:</strong>
                    <span>{selectedLotDetail.ics_notes}</span>
                  </div>
                )}

                {selectedLotDetail.verificationStamp && (
                  <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>No. Sertifikat: {selectedLotDetail.verificationStamp.certificateNumber}</span>
                      <span>Diverifikasi oleh: {selectedLotDetail.verificationStamp.verifierName}</span>
                    </div>
                    <div className="text-[10px] font-mono text-emerald-700 break-all">
                      Hash: {selectedLotDetail.verificationStamp.digitalSignatureHash}
                    </div>
                  </div>
                )}
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-2 gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">Metode Olah</span>
                  <strong className="text-stone-900">{selectedLotDetail.processMethod}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">Waktu Fermentasi</span>
                  <strong className="text-stone-900">{selectedLotDetail.fermentationTimeHours} Jam</strong>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">Kadar Air (% MC)</span>
                  <strong className="text-stone-900">{selectedLotDetail.ics_inspected_moisture ?? selectedLotDetail.moistureContentPercent}% MC</strong>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">Water Activity (aW)</span>
                  <strong className="text-stone-900">{selectedLotDetail.ics_inspected_water_activity ?? selectedLotDetail.waterActivityAw} aW</strong>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">Defect Count</span>
                  <strong className="text-stone-900">{selectedLotDetail.ics_inspected_defect ?? selectedLotDetail.defectCount} defect/350g</strong>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">Metode Penjemuran</span>
                  <strong className="text-stone-900">{selectedLotDetail.dryingMethod}</strong>
                </div>
              </div>

              {/* Lineage Info */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-amber-950 space-y-1.5">
                <span className="font-bold text-[11px] block">Rantai Asal Ceri Petani:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Petani: <strong>{selectedLotDetail.sourceFarmerName}</strong></div>
                  <div>Asal: <strong>{selectedLotDetail.sourceOrigin}</strong></div>
                  <div>Ketinggian: <strong>{selectedLotDetail.altitude}</strong></div>
                  <div>Lot Ceri: <strong className="font-mono">{selectedLotDetail.sourceFarmerLotId}</strong></div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedBarcodeLot(selectedLotDetail);
                  setBarcodeModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs inline-flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Barcode</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedLotDetail(null)}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs"
              >
                Tutup
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

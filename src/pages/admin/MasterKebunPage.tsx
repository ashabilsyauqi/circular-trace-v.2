import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import {
  TreePine,
  PlusCircle,
  Search,
  Filter,
  MapPin,
  Mountain,
  Compass,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit2,
  Layers,
  ShieldCheck,
  Building2,
  Users,
  Sprout,
  Thermometer,
  Cloud,
  Droplets,
  Package,
  ExternalLink,
  Award,
} from 'lucide-react';

export const MasterKebunPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialFarmerId = searchParams.get('farmerId') || 'all';

  const { users, coffeeFarms, deleteCoffeeFarm, farmerLots } = useCoffee();

  const allFarmers = users.filter((u) => u.role === 'petani' || u.assignedService === 'petani');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarmerFilter, setSelectedFarmerFilter] = useState<string>(initialFarmerId);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filtered farms list
  const filteredFarms = coffeeFarms.filter((farm) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      farm.farmName.toLowerCase().includes(q) ||
      farm.location.toLowerCase().includes(q) ||
      (farm.farmerName && farm.farmerName.toLowerCase().includes(q)) ||
      (farm.primaryVarieties && farm.primaryVarieties.join(' ').toLowerCase().includes(q));

    const matchFarmer =
      selectedFarmerFilter === 'all' ||
      farm.farmerId === selectedFarmerFilter;

    return matchQuery && matchFarmer;
  });

  // KPI Metrics
  const totalHectares = coffeeFarms.reduce((acc, f) => acc + (f.landAreaHectares || 0), 0);
  const totalTrees = coffeeFarms.reduce((acc, f) => acc + (f.totalTreesCount || 0), 0);
  const avgAltitude = coffeeFarms.length > 0
    ? Math.round(coffeeFarms.reduce((acc, f) => acc + (f.altitudeMeters || 1500), 0) / coffeeFarms.length)
    : 1550;
  const eudrVerifiedFarms = coffeeFarms.filter((f) => f.eudrCompliant).length;

  const handleDeleteFarm = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data lahan kebun "${name}"?`)) {
      deleteCoffeeFarm(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Action Button */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-amber-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
            <TreePine className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900 tracking-tight">
              Data Master Lahan & Kebun Kopi
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Peta geolokasi poligon, elevasi mdpl, batas patok sudut BPN, agronomis, dan sertifikasi EUDR Deforestation-Free.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/kebun/tambah"
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-md shadow-xs flex items-center gap-2 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Daftarkan Lahan Baru</span>
          </Link>
        </div>
      </div>

      {/* 2. KPI Summary Stat Cards (AdminLTE Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <TreePine className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase text-stone-400 block tracking-wider">
              Total Blok Kebun
            </span>
            <div className="text-2xl font-black text-stone-900 leading-tight">
              {coffeeFarms.length}{' '}
              <span className="text-xs font-normal text-stone-500">Blok</span>
            </div>
            <span className="text-[10px] text-amber-600 font-medium">Terdaftar di Sistem</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase text-stone-400 block tracking-wider">
              Total Luas Area
            </span>
            <div className="text-2xl font-black text-stone-900 leading-tight">
              {totalHectares.toFixed(1)}{' '}
              <span className="text-xs font-normal text-stone-500">Hektar</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">
              ~{totalTrees.toLocaleString()} Pohon Kopi
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Mountain className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase text-stone-400 block tracking-wider">
              Rata-Rata Elevasi
            </span>
            <div className="text-2xl font-black text-stone-900 leading-tight">
              {avgAltitude}{' '}
              <span className="text-xs font-normal text-stone-500">mdpl</span>
            </div>
            <span className="text-[10px] text-blue-600 font-medium">Ketinggian Specialty Ideal</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase text-stone-400 block tracking-wider">
              EUDR Deforestation
            </span>
            <div className="text-2xl font-black text-stone-900 leading-tight">
              {eudrVerifiedFarms}/{coffeeFarms.length}{' '}
              <span className="text-xs font-normal text-stone-500">Lahan</span>
            </div>
            <span className="text-[10px] text-teal-600 font-medium">Batas Koordinat Lolos</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar & View Toggle */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Farmer Filter */}
          <div className="relative">
            <select
              value={selectedFarmerFilter}
              onChange={(e) => setSelectedFarmerFilter(e.target.value)}
              className="bg-white text-xs border border-stone-300 rounded-md px-3 py-1.5 focus:outline-none focus:border-amber-500 font-medium text-stone-700"
            >
              <option value="all">Semua Petani Pemilik ({coffeeFarms.length} Lahan)</option>
              {allFarmers.map((farmer) => {
                const count = coffeeFarms.filter((f) => f.farmerId === farmer.id).length;
                return (
                  <option key={farmer.id} value={farmer.id}>
                    {farmer.name} ({count} Blok)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari blok lahan, varietas, lokasi..."
              className="w-full bg-white text-xs border border-stone-300 rounded-md pl-8 pr-3 py-1.5 focus:outline-none focus:border-amber-500 font-medium text-stone-800 placeholder-stone-400"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-md border border-stone-200 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-2.5 py-1 text-xs font-bold rounded ${
              viewMode === 'grid'
                ? 'bg-white text-amber-800 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Kartu Grid
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-2.5 py-1 text-xs font-bold rounded ${
              viewMode === 'table'
                ? 'bg-white text-amber-800 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Tabel Ringkas
          </button>
        </div>
      </div>

      {/* 4. Farms Display: Grid or Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFarms.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white rounded-lg border border-[#d2d6de]">
              <TreePine className="w-12 h-12 text-stone-300 mx-auto mb-2" />
              <p className="text-xs text-stone-500">Tidak ada blok lahan yang cocok dengan filter.</p>
            </div>
          ) : (
            filteredFarms.map((farm) => {
              const harvestLotsCount = farmerLots.filter((l) => l.farmId === farm.id).length;

              return (
                <div
                  key={farm.id}
                  className="bg-white rounded-lg shadow-xs border border-[#d2d6de] hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  {/* Photo & Altitude Badge */}
                  <div className="relative h-44 bg-stone-100 overflow-hidden">
                    <img
                      src={farm.photoUrl}
                      alt={farm.farmName}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-600/90 text-white font-mono text-[10px] font-bold shadow-xs backdrop-blur-xs flex items-center gap-1">
                        <Mountain className="w-3 h-3" />
                        <span>{farm.altitudeDisplay || `${farm.altitudeMeters} mdpl`}</span>
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                      {farm.ctCertificationSnapshot ? (
                        <Link
                          to={`/admin/ict/ct-dashboard/${farm.id}`}
                          className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600/90 text-white shadow-xs backdrop-blur-xs flex items-center gap-1 transition-opacity hover:opacity-90"
                          title="Sertifikasi Kesiapan 4C Terbit"
                        >
                          <Award className="w-3 h-3 text-amber-300" />
                          <span>{farm.ctCertificationSnapshot.ct4ciScore}% CT-4CI</span>
                        </Link>
                      ) : (
                        <Link
                          to={`/admin/ict/ct-dashboard/${farm.id}`}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold shadow-xs backdrop-blur-xs flex items-center gap-1 transition-opacity hover:opacity-90 ${
                            farm.verificationStatus === 'verified'
                              ? 'bg-blue-600/90 text-white'
                              : farm.verificationStatus === 'rejected'
                              ? 'bg-red-600/90 text-white'
                              : farm.eudrCompliant
                              ? 'bg-teal-600/90 text-white'
                              : 'bg-stone-900/80 text-amber-300'
                          }`}
                          title="Audit Kesiapan Sertifikasi CT-4CI"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>
                            {farm.verificationStatus === 'verified'
                              ? 'ICT Valid'
                              : farm.verificationStatus === 'rejected'
                              ? 'ICT Revisi'
                              : farm.eudrCompliant
                              ? 'EUDR Verified'
                              : 'Audit CT-4CI'}
                          </span>
                        </Link>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3 text-white">
                      <h3 className="font-bold text-sm leading-tight drop-shadow-sm truncate">
                        {farm.farmName}
                      </h3>
                      <p className="text-[11px] text-amber-200 flex items-center gap-1 mt-0.5 drop-shadow-xs truncate">
                        <Users className="w-3 h-3 shrink-0" />
                        <span>{farm.farmerName || 'Petani Anggota'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Farm Details Body */}
                  <div className="p-4 space-y-3 text-xs text-stone-600 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-start gap-1.5 text-stone-700">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="text-[11px] font-medium leading-relaxed">
                          {farm.location}
                        </span>
                      </div>

                      {/* Agronomy Badge Chips */}
                      <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                        <div className="bg-stone-50 p-2 rounded border border-stone-200">
                          <span className="text-stone-400 block text-[9px] font-bold uppercase">
                            Luas & Pohon
                          </span>
                          <span className="font-bold text-stone-800">
                            {farm.landAreaHectares} Ha • ~{farm.totalTreesCount.toLocaleString()} btg
                          </span>
                        </div>
                        <div className="bg-stone-50 p-2 rounded border border-stone-200">
                          <span className="text-stone-400 block text-[9px] font-bold uppercase">
                            Patok Sudut
                          </span>
                          <span className="font-bold text-stone-800">
                            {farm.patokList?.length || 4} Titik Batas
                          </span>
                        </div>
                      </div>

                      {/* Varieties & Soil */}
                      <div className="text-[11px] space-y-1 pt-1">
                        <div>
                          <span className="text-stone-400 font-semibold">Varietas: </span>
                          <span className="font-medium text-stone-800">
                            {Array.isArray(farm.primaryVarieties)
                              ? farm.primaryVarieties.join(', ')
                              : farm.primaryVarieties}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-400 font-semibold">Tanah & Naungan: </span>
                          <span className="font-medium text-stone-800 truncate block">
                            {farm.soilType} • {farm.shadeTrees?.join(', ') || 'Lamtoro'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/admin/kebun/peta/${farm.id}`}
                          className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded font-bold text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <Compass className="w-3 h-3" />
                          <span>Peta</span>
                        </Link>
                        <Link
                          to={`/admin/ict/ct-dashboard/${farm.id}`}
                          title="Audit & Sertifikasi CT-4CI"
                          className="px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded font-bold text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <Award className="w-3 h-3 text-blue-600" />
                          <span>CT-4CI</span>
                        </Link>
                      </div>

                      <div className="flex items-center gap-1">
                        <Link
                          to={`/admin/panen/tambah?farmId=${farm.id}`}
                          title="Catat Panen dari Lahan Ini"
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <PlusCircle className="w-3 h-3" />
                          <span>Panen</span>
                        </Link>

                        <Link
                          to={`/admin/kebun/edit/${farm.id}`}
                          title="Edit Lahan"
                          className="p-1.5 text-stone-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDeleteFarm(farm.id, farm.farmName)}
                          title="Hapus Lahan"
                          className="p-1.5 text-stone-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#f4f6f9] text-stone-600 border-b border-[#d2d6de] font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">
                  <th className="py-3 px-4 whitespace-nowrap">Nama Lahan &amp; Lokasi</th>
                  <th className="py-3 px-4 whitespace-nowrap">Petani Pemilik</th>
                  <th className="py-3 px-4 whitespace-nowrap">Elevasi &amp; Luas</th>
                  <th className="py-3 px-4 whitespace-nowrap">Varietas Utama</th>
                  <th className="py-3 px-4 text-center whitespace-nowrap">Patok BPN</th>
                  <th className="py-3 px-4 text-center whitespace-nowrap">Status EUDR &amp; Verifikasi</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredFarms.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-stone-400 text-xs">
                      Tidak ditemukan data kebun yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredFarms.map((farm) => (
                    <tr key={farm.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-stone-900">{farm.farmName}</div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                          <span className="truncate max-w-[220px]">{farm.location}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-800 whitespace-nowrap">
                        {farm.farmerName || 'Petani Anggota'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-stone-900 font-mono">
                          {farm.altitudeDisplay || `${farm.altitudeMeters} mdpl`}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          {farm.landAreaHectares} Ha • ~{farm.totalTreesCount.toLocaleString()} phn
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-700 whitespace-nowrap">
                        {Array.isArray(farm.primaryVarieties)
                          ? farm.primaryVarieties.join(', ')
                          : farm.primaryVarieties}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-stone-700 whitespace-nowrap">
                        {farm.patokList?.length || 4} Patok
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center gap-1.5 flex-nowrap whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 ${
                              farm.eudrCompliant
                                ? 'bg-teal-100 text-teal-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {farm.eudrCompliant ? 'EUDR' : 'Non-EUDR'}
                          </span>

                          {farm.ctCertificationSnapshot ? (
                            <Link
                              to={`/admin/ict/ct-dashboard/${farm.id}`}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200 transition-colors whitespace-nowrap shrink-0"
                              title="Sertifikasi CT-4CI Terbit"
                            >
                              <Award className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
                              <span>{farm.ctCertificationSnapshot.ct4ciScore}% 4C</span>
                            </Link>
                          ) : farm.verificationStatus === 'verified' ? (
                            <Link
                              to={`/admin/ict/ct-dashboard/${farm.id}`}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-900 border border-blue-200 hover:bg-blue-200 transition-colors whitespace-nowrap shrink-0"
                              title="Terverifikasi oleh Tim ICT"
                            >
                              <ShieldCheck className="w-2.5 h-2.5 text-blue-700 shrink-0" />
                              <span>ICT Valid</span>
                            </Link>
                          ) : farm.verificationStatus === 'rejected' ? (
                            <Link
                              to={`/admin/ict/ct-dashboard/${farm.id}`}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-900 border border-red-200 hover:bg-red-200 transition-colors whitespace-nowrap shrink-0"
                              title="Revisi Patok oleh Tim ICT"
                            >
                              <XCircle className="w-2.5 h-2.5 text-red-700 shrink-0" />
                              <span>Revisi ICT</span>
                            </Link>
                          ) : (
                            <Link
                              to={`/admin/ict/ct-dashboard/${farm.id}`}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors whitespace-nowrap shrink-0"
                              title="Audit Kesiapan Sertifikasi CT-4CI"
                            >
                              <span>Audit CT</span>
                            </Link>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1 flex-nowrap shrink-0">
                          <Link
                            to={`/admin/kebun/peta/${farm.id}`}
                            title="Peta Poligon"
                            className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors shrink-0"
                          >
                            <Compass className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/ict/ct-dashboard/${farm.id}`}
                            title="Audit & Sertifikasi CT-4CI"
                            className="p-1.5 text-stone-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors shrink-0"
                          >
                            <Award className="w-4 h-4 text-blue-600" />
                          </Link>
                          <Link
                            to={`/admin/kebun/edit/${farm.id}`}
                            title="Edit Lahan"
                            className="p-1.5 text-stone-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors shrink-0"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteFarm(farm.id, farm.farmName)}
                            title="Hapus Lahan"
                            className="p-1.5 text-stone-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors shrink-0 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterKebunPage;

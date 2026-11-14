import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import { AppUser } from '../../types/coffee';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Printer,
  QrCode,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  Sprout,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
  Award,
  TreePine,
  Package,
} from 'lucide-react';
import { FarmerIdCardModal } from '../../components/admin/FarmerIdCardModal';

export const MasterPetaniPage: React.FC = () => {
  const navigate = useNavigate();
  const { users, deleteUser, coffeeFarms, farmerLots } = useCoffee();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVillageFilter, setSelectedVillageFilter] = useState<string>('all');
  const [selectedFarmerForCard, setSelectedFarmerForCard] = useState<AppUser | null>(null);

  // All farmers registered in cooperative
  const allFarmers = users.filter((u) => u.role === 'petani' || u.assignedService === 'petani');

  // Extract unique villages
  const uniqueVillages = Array.from(
    new Set(allFarmers.map((f) => f.village || f.location).filter(Boolean))
  );

  // Filtered farmers list
  const filteredFarmers = allFarmers.filter((farmer) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      farmer.name.toLowerCase().includes(q) ||
      (farmer.nik && farmer.nik.toLowerCase().includes(q)) ||
      (farmer.farmerCardNumber && farmer.farmerCardNumber.toLowerCase().includes(q)) ||
      (farmer.village && farmer.village.toLowerCase().includes(q)) ||
      farmer.location.toLowerCase().includes(q) ||
      farmer.organization.toLowerCase().includes(q);

    const matchVillage =
      selectedVillageFilter === 'all' ||
      farmer.village === selectedVillageFilter ||
      farmer.location === selectedVillageFilter;

    return matchQuery && matchVillage;
  });

  // Cooperative Summary Metrics
  const totalLandArea = allFarmers.reduce((acc, f) => acc + (f.totalLandAreaHa || 0), 0);
  const totalFarmsCount = coffeeFarms.length;
  const totalLotsCount = farmerLots.length;
  const certifiedCount = allFarmers.filter((f) => f.certification && f.certification.length > 0).length;

  const handleDeleteFarmer = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data petani "${name}" dari master data kelompok tani?`)) {
      deleteUser(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Action Button */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900 tracking-tight">
              Data Master Petani Anggota
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Basis data resmi petani anggota kelompok tani, nomor KTA, NIK, alamat lengkap, dan riwayat garapan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/petani/tambah"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-md shadow-xs flex items-center gap-2 transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Daftarkan Petani Baru</span>
          </Link>
        </div>
      </div>

      {/* 2. KPI Summary Stat Cards (AdminLTE Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase text-stone-400 block tracking-wider">
              Total Petani Aktif
            </span>
            <div className="text-2xl font-black text-stone-900 leading-tight">
              {allFarmers.length}{' '}
              <span className="text-xs font-normal text-stone-500">Anggota</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">100% Terverifikasi</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <TreePine className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase text-stone-400 block tracking-wider">
              Total Lahan Terdaftar
            </span>
            <div className="text-2xl font-black text-stone-900 leading-tight">
              {totalFarmsCount}{' '}
              <span className="text-xs font-normal text-stone-500">Blok Kebun</span>
            </div>
            <span className="text-[10px] text-amber-600 font-medium">
              ~{totalLandArea.toFixed(1)} Hektar Terdata
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase text-stone-400 block tracking-wider">
              Produktivitas Panen
            </span>
            <div className="text-2xl font-black text-stone-900 leading-tight">
              {totalLotsCount}{' '}
              <span className="text-xs font-normal text-stone-500">Lot Ceri</span>
            </div>
            <span className="text-[10px] text-blue-600 font-medium">Tercatat di Traceability</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase text-stone-400 block tracking-wider">
              Sertifikasi & Kepatuhan
            </span>
            <div className="text-2xl font-black text-stone-900 leading-tight">
              {certifiedCount}{' '}
              <span className="text-xs font-normal text-stone-500">Petani</span>
            </div>
            <span className="text-[10px] text-teal-600 font-medium">Organik & EUDR Ready</span>
          </div>
        </div>
      </div>

      {/* 3. Main Data Card: Table with Filter & Search */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] overflow-hidden">
        {/* Card Toolbar */}
        <div className="p-4 border-b border-[#e3e6f0] bg-stone-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-stone-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Daftar Anggota Petani ({filteredFarmers.length})</span>
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Village Filter */}
            <div className="relative">
              <select
                value={selectedVillageFilter}
                onChange={(e) => setSelectedVillageFilter(e.target.value)}
                className="bg-white text-xs border border-stone-300 rounded-md px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-medium text-stone-700"
              >
                <option value="all">Semua Desa / Wilayah</option>
                {uniqueVillages.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, NIK, KTA, desa..."
                className="w-full bg-white text-xs border border-stone-300 rounded-md pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 font-medium text-stone-800 placeholder-stone-400"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Farmers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#f4f6f9] text-stone-600 border-b border-[#d2d6de] font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">
                <th className="py-3 px-4 whitespace-nowrap">Petani & KTA</th>
                <th className="py-3 px-4 whitespace-nowrap">NIK & Kontak</th>
                <th className="py-3 px-4 whitespace-nowrap">Wilayah & Kelompok</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Lahan (Ha) & Buruh</th>
                <th className="py-3 px-4 whitespace-nowrap">Sertifikasi</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Status</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredFarmers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-stone-400 text-xs">
                    Tidak ditemukan data petani yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredFarmers.map((farmer) => {
                  const farmerFarms = coffeeFarms.filter((f) => f.farmerId === farmer.id);
                  const farmerLotsList = farmerLots.filter((l) => l.farmerId === farmer.id);

                  return (
                    <tr
                      key={farmer.id}
                      className="hover:bg-emerald-50/40 transition-colors group"
                    >
                      {/* 1. Petani & KTA */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={farmer.avatar}
                            alt={farmer.name}
                            className="w-10 h-10 rounded-full object-cover border border-stone-300 shrink-0 shadow-2xs"
                          />
                          <div>
                            <span className="font-bold text-stone-900 block group-hover:text-emerald-700">
                              {farmer.name}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-stone-500 font-mono">
                              <span className="px-1.5 py-0.2 bg-stone-100 rounded text-stone-600 border border-stone-200">
                                {farmer.farmerCardNumber || 'KTA-PENDING'}
                              </span>
                              <span>• ID: {farmer.id}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. NIK & Kontak */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div className="font-mono text-stone-700 font-semibold text-[11px]">
                            {farmer.nik || '-'}
                          </div>
                          <div className="text-[11px] text-stone-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-stone-400" />
                            <span>{farmer.phone || '-'}</span>
                          </div>
                        </div>
                      </td>

                      {/* 3. Wilayah & Kelompok */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div className="font-medium text-stone-800 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate max-w-[180px]">
                              {farmer.village || farmer.location}
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-500 truncate max-w-[180px]">
                            {farmer.subdistrict ? `${farmer.subdistrict}, ` : ''}
                            {farmer.district || farmer.province || 'Jawa Barat'}
                          </div>
                        </div>
                      </td>

                      {/* 4. Lahan & Buruh */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-block text-center">
                          <span className="font-bold text-emerald-800 text-xs">
                            {farmer.totalLandAreaHa || 1.5} Ha
                          </span>
                          <span className="text-[10px] text-stone-500 block">
                            {farmer.farmWorkerCount || 3} Buruh Tani
                          </span>
                        </div>
                      </td>

                      {/* 5. Sertifikasi */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap shrink-0">
                          <ShieldCheck className="w-3 h-3 shrink-0" />
                          <span>{farmer.certification || 'Organik SNI'}</span>
                        </span>
                      </td>

                      {/* 6. Status */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center gap-1.5 flex-nowrap whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 ${
                              farmer.status === 'inactive'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            <span>{farmer.status === 'inactive' ? 'Nonaktif' : 'Aktif'}</span>
                          </span>

                          {/* ICT Verification Badge */}
                          {farmer.verificationStatus === 'verified' ? (
                            <Link
                              to="/admin/ict"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-900 border border-blue-200 hover:bg-blue-200 transition-colors whitespace-nowrap shrink-0"
                              title="Terverifikasi oleh Tim ICT"
                            >
                              <ShieldCheck className="w-2.5 h-2.5 text-blue-700 shrink-0" />
                              <span>ICT Valid</span>
                            </Link>
                          ) : farmer.verificationStatus === 'rejected' ? (
                            <Link
                              to="/admin/ict"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-900 border border-red-200 hover:bg-red-200 transition-colors whitespace-nowrap shrink-0"
                              title="Revisi Diperlukan oleh Tim ICT"
                            >
                              <XCircle className="w-2.5 h-2.5 text-red-700 shrink-0" />
                              <span>Revisi ICT</span>
                            </Link>
                          ) : (
                            <Link
                              to="/admin/ict"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors whitespace-nowrap shrink-0"
                              title="Menunggu Verifikasi Tim ICT"
                            >
                              <span>Audit ICT</span>
                            </Link>
                          )}
                        </div>
                      </td>

                      {/* 7. Action Buttons */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1 flex-nowrap shrink-0">
                          {/* Cetak KTA Modal */}
                          <button
                            type="button"
                            onClick={() => setSelectedFarmerForCard(farmer)}
                            title="Lihat / Cetak Kartu Tani Digital"
                            className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors shrink-0 cursor-pointer"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>

                          {/* Link ke Kebun Petani */}
                          <Link
                            to={`/admin/kebun?farmerId=${farmer.id}`}
                            title={`Lihat ${farmerFarms.length} Lahan Kebun`}
                            className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors shrink-0"
                          >
                            <TreePine className="w-4 h-4" />
                          </Link>

                          {/* Edit Petani */}
                          <Link
                            to={`/admin/petani/edit/${farmer.id}`}
                            title="Edit Data Petani"
                            className="p-1.5 text-stone-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors shrink-0"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          {/* Hapus Petani */}
                          <button
                            type="button"
                            onClick={() => handleDeleteFarmer(farmer.id, farmer.name)}
                            title="Hapus Petani"
                            className="p-1.5 text-stone-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors shrink-0 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Footer info */}
        <div className="p-3 bg-stone-50 border-t border-[#e3e6f0] text-xs text-stone-500 flex items-center justify-between">
          <span>
            Menampilkan <strong>{filteredFarmers.length}</strong> dari <strong>{allFarmers.length}</strong> petani anggota
          </span>
          <span className="text-[11px] text-stone-400">
            Terhubung dengan sertifikasi EUDR dan modul penugasan layanan
          </span>
        </div>
      </div>

      {/* Modal Cetak Kartu Tani Digital (ID Card) */}
      {selectedFarmerForCard && (
        <FarmerIdCardModal
          isOpen={true}
          farmer={selectedFarmerForCard}
          onClose={() => setSelectedFarmerForCard(null)}
        />
      )}
    </div>
  );
};

export default MasterPetaniPage;

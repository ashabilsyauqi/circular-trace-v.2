import React, { useState } from 'react';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import { getScopedTenantData } from '../../utils/tenantScoping';
import { FarmerIdCardModal } from '../../components/admin/FarmerIdCardModal';
import {
  Users,
  ArrowLeft,
  QrCode,
  Edit2,
  TreePine,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Calendar,
  ExternalLink,
  Sprout,
  Package,
  Award,
  Globe2,
  Building2,
  Mail,
  UserCheck,
  Plus,
} from 'lucide-react';

export const MasterPetaniDetailPage: React.FC = () => {
  const { farmerId } = useParams<{ farmerId?: string }>();
  const navigate = useNavigate();
  const { currentUser, users, coffeeFarms, farmerLots } = useCoffee();

  const [copiedId, setCopiedId] = useState(false);
  const [copiedKta, setCopiedKta] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  // Scoped data
  const {
    scopedFarmers: allFarmers,
    scopedFarms: tenantFarms,
    scopedLots: tenantLots,
  } = getScopedTenantData(currentUser, { users, coffeeFarms, farmerLots });

  const farmer = allFarmers.find((f) => f.id === farmerId);

  if (!farmer) {
    return <Navigate to="/admin/petani" replace />;
  }

  const farmerFarms = tenantFarms.filter((f) => f.farmerId === farmer.id);
  const farmerLotsList = tenantLots.filter((l) => l.farmerId === farmer.id);

  const copyToClipboard = (text: string, type: 'id' | 'kta') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedKta(true);
      setTimeout(() => setCopiedKta(false), 2000);
    }
  };

  const cleanPhone = farmer.phone?.replace(/[^0-9]/g, '') || '';
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone}?text=Halo%20Bpk/Ibu%20${encodeURIComponent(farmer.name)},%20kami%20dari%20Kelompok%20Tani`
    : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to="/admin/petani"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-emerald-700 bg-white px-3.5 py-2 rounded-lg border border-[#d2d6de] shadow-2xs transition-colors self-start whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Kembali ke Daftar Petani</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {/* Cetak KTA Digital */}
          <button
            type="button"
            onClick={() => setIsCardModalOpen(true)}
            className="px-3 py-2 bg-white border border-[#d2d6de] hover:bg-emerald-50 text-stone-800 hover:text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kartu KTA Digital</span>
          </button>

          {/* Lihat Kebun Petani */}
          <Link
            to={`/admin/kebun?farmerId=${farmer.id}`}
            className="px-3 py-2 bg-white border border-[#d2d6de] hover:bg-amber-50 text-stone-800 hover:text-amber-800 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <TreePine className="w-3.5 h-3.5 text-amber-600" />
            <span>Lihat Kebun ({farmerFarms.length})</span>
          </Link>

          {/* Edit Petani */}
          <Link
            to={`/admin/petani/edit/${farmer.id}`}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profil</span>
          </Link>
        </div>
      </div>

      {/* 2. Farmer Primary Profile Hero Card */}
      <div className="bg-white rounded-xl shadow-xs border border-[#d2d6de] p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-100/50 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={farmer.avatar}
              alt={farmer.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                  {farmer.name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    farmer.status === 'inactive'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{farmer.status === 'inactive' ? 'Nonaktif' : 'Aktif'}</span>
                </span>
                {farmer.verificationStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
                    <ShieldCheck className="w-3 h-3 text-blue-700" />
                    <span>ICT Valid</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    <span>Audit ICT</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-stone-500">
                <span className="flex items-center gap-1 text-stone-700 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-stone-400" />
                  <span>{farmer.organization || 'Kelompok Tani'}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{farmer.village || farmer.location}, {farmer.district || farmer.province}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>Bergabung {farmer.registeredAt ? new Date(farmer.registeredAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' }) : '2026'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200 shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Luas Lahan</span>
              <span className="text-base font-black text-emerald-700">{farmer.totalLandAreaHa || 1.5} Ha</span>
            </div>
            <div className="text-center px-2 border-l border-stone-200">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Buruh Tani</span>
              <span className="text-base font-black text-stone-800">{farmer.farmWorkerCount || 3} Orang</span>
            </div>
            <div className="text-center px-2 border-l border-stone-200">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Lahan Kebun</span>
              <span className="text-base font-black text-amber-700">{farmerFarms.length} Plot</span>
            </div>
            <div className="text-center px-2 border-l border-stone-200">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Panen Tercatat</span>
              <span className="text-base font-black text-blue-700">{farmerLotsList.length} Batch</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Dedicated Code & Identity Card (Where ID & KTA are clearly presented) */}
      <div className="bg-emerald-950 text-white rounded-xl p-5 shadow-sm border border-emerald-800">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-emerald-300">
            Kode Identifikasi &amp; Nomor KTA Resmi Petani
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Farmer Code / ID */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/15 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">ID Petani (Sistem)</span>
              <span className="font-mono text-xs font-bold text-white">{farmer.id}</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(farmer.id, 'id')}
              className="p-1.5 rounded bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
              title="Salin ID Petani"
            >
              {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Nomor KTA */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/15 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Nomor KTA Kelompok Tani</span>
              <span className="font-mono text-xs font-bold text-amber-300">{farmer.farmerCardNumber || 'KTA-PENDING'}</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(farmer.farmerCardNumber || farmer.id, 'kta')}
              className="p-1.5 rounded bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
              title="Salin Nomor KTA"
            >
              {copiedKta ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* NIK KTP */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/15 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">NIK KTP (Dukcapil)</span>
              <span className="font-mono text-xs font-bold text-white">{farmer.nik || '-'}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 font-bold">16 Digit</span>
          </div>
        </div>
      </div>

      {/* 4. Details Grid: Biodata & Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Biodata, Kebun & Panen */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Biodata Lengkap */}
          <div className="bg-white rounded-xl shadow-xs border border-[#d2d6de] p-5">
            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-3 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Biodata &amp; Informasi Domisili</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block mb-0.5">Nama Lengkap</span>
                <span className="font-bold text-stone-800 text-sm">{farmer.name}</span>
              </div>

              <div>
                <span className="text-stone-400 block mb-0.5">Nomor KTP (NIK)</span>
                <span className="font-mono font-bold text-stone-800">{farmer.nik || '-'}</span>
              </div>

              <div>
                <span className="text-stone-400 block mb-0.5">Nomor Kontak / WhatsApp</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-stone-800">{farmer.phone || '-'}</span>
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-[10px] font-bold flex items-center gap-1"
                    >
                      <Phone className="w-2.5 h-2.5" />
                      <span>Chat WA</span>
                    </a>
                  )}
                </div>
              </div>

              <div>
                <span className="text-stone-400 block mb-0.5">Alamat Email</span>
                <span className="text-stone-700">{farmer.email || '-'}</span>
              </div>

              <div>
                <span className="text-stone-400 block mb-0.5">Desa / Kelurahan</span>
                <span className="font-medium text-stone-800">{farmer.village || farmer.location}</span>
              </div>

              <div>
                <span className="text-stone-400 block mb-0.5">RT / RW</span>
                <span className="font-medium text-stone-800">{farmer.rtRw || '-'}</span>
              </div>

              <div>
                <span className="text-stone-400 block mb-0.5">Kecamatan</span>
                <span className="font-medium text-stone-800">{farmer.subdistrict || '-'}</span>
              </div>

              <div>
                <span className="text-stone-400 block mb-0.5">Kabupaten / Provinsi</span>
                <span className="font-medium text-stone-800">
                  {farmer.district ? `${farmer.district}, ` : ''}{farmer.province || 'Jawa Barat'}
                </span>
              </div>
            </div>
          </div>

          {/* Card Lahan Kebun Terdaftar */}
          <div className="bg-white rounded-xl shadow-xs border border-[#d2d6de] p-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <TreePine className="w-4 h-4 text-emerald-600" />
                <span>Lahan Kebun Terdaftar ({farmerFarms.length})</span>
              </h3>
              <Link
                to={`/admin/kebun/tambah?farmerId=${farmer.id}`}
                className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1 border border-emerald-200"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah Lahan</span>
              </Link>
            </div>

            {farmerFarms.length === 0 ? (
              <div className="text-center py-8 text-stone-400 text-xs">
                <TreePine className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p>Belum ada bidang lahan kebun yang terhubung dengan petani ini.</p>
                <Link
                  to={`/admin/kebun/tambah?farmerId=${farmer.id}`}
                  className="mt-2 text-emerald-700 hover:underline font-bold inline-block"
                >
                  + Daftarkan Lahan Pertama
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {farmerFarms.map((farm) => (
                  <div
                    key={farm.id}
                    className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 hover:border-emerald-500/40 hover:bg-emerald-50/30 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-stone-900 text-xs">{farm.farmName}</h4>
                        <span className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>{farm.location}</span>
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {farm.landAreaHectares} Ha
                      </span>
                    </div>

                    <div className="pt-1 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-600">
                      <span className="truncate max-w-[180px]">
                        {farm.primaryVarieties?.length ? farm.primaryVarieties.join(', ') : 'Arabika Typica'}
                      </span>
                      <span className="font-mono">{farm.altitudeDisplay || `${farm.altitudeMeters} mdpl`}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card Riwayat Hasil Panen Ceri */}
          <div className="bg-white rounded-xl shadow-xs border border-[#d2d6de] p-5">
            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-3 mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Riwayat Hasil Panen Ceri ({farmerLotsList.length})</span>
            </h3>

            {farmerLotsList.length === 0 ? (
              <div className="text-center py-8 text-stone-400 text-xs">
                <Sprout className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p>Belum ada catatan panen untuk petani ini pada musim berjalan.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200 text-[10px] uppercase">
                      <th className="py-2 px-3">Kode Lot</th>
                      <th className="py-2 px-3">Tanggal Panen</th>
                      <th className="py-2 px-3">Volume Ceri</th>
                      <th className="py-2 px-3">Brix</th>
                      <th className="py-2 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {farmerLotsList.slice(0, 5).map((lot) => (
                      <tr key={lot.id} className="hover:bg-stone-50 transition-colors">
                        <td className="py-2 px-3 font-mono font-bold text-stone-900">{lot.id}</td>
                        <td className="py-2 px-3 text-stone-600">{lot.harvestDate || '-'}</td>
                        <td className="py-2 px-3 font-bold text-emerald-800">{lot.totalWeightKg} kg</td>
                        <td className="py-2 px-3 text-amber-700 font-semibold">{lot.brix ? `${lot.brix}° Brix` : '-'}</td>
                        <td className="py-2 px-3 text-right">
                          <Link
                            to={`/admin/panen/detail/${lot.id}`}
                            className="text-emerald-700 hover:underline font-bold text-[11px]"
                          >
                            Detail &rarr;
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Sertifikasi & Kartu Tani */}
        <div className="space-y-6">
          {/* Sertifikasi & EUDR Compliance */}
          <div className="bg-white rounded-xl shadow-xs border border-[#d2d6de] p-5 space-y-4">
            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Sertifikasi &amp; Standar Mutu</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
                <Award className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">Sertifikasi Pertanian</span>
                  <span className="text-xs text-emerald-800 font-semibold">{farmer.certification || 'Organik SNI 6729:2016'}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 flex items-start gap-2.5">
                <Globe2 className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-sky-950 block">Kepatuhan Regulasi EUDR</span>
                  <span className="text-[11px] text-sky-800 leading-relaxed block">
                    Lahan terbebas dari deforestasi hutan sejak batas waktu regulasi 31 Desember 2020.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Status Verifikasi ICT</span>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-stone-800">
                    {farmer.verificationStatus === 'verified' ? 'Tervalidasi oleh Verifikator ICT' : 'Menunggu Jadwal Audit Lapangan'}
                  </span>
                </div>
                {farmer.verifiedAt && (
                  <span className="text-[10px] text-stone-400 block">
                    Diverifikasi: {new Date(farmer.verifiedAt).toLocaleDateString('id-ID')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Kartu Tani Digital Preview Card */}
          <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-xl shadow-md p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-200">
                  Kartu KTA Digital
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-white/20 rounded text-emerald-100">
                Resmi KT
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3.5 border border-white/20 space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src={farmer.avatar}
                  alt={farmer.name}
                  className="w-12 h-12 rounded-lg object-cover border border-white/40"
                />
                <div>
                  <span className="font-bold text-white text-sm block leading-tight">{farmer.name}</span>
                  <span className="font-mono text-[11px] text-amber-300 block">{farmer.farmerCardNumber || 'KTA-PENDING'}</span>
                  <span className="text-[10px] text-emerald-200 block truncate">{farmer.organization}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCardModalOpen(true)}
              className="w-full py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Cetak / Unduh Kartu Tani</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Cetak Kartu Tani Digital */}
      {isCardModalOpen && (
        <FarmerIdCardModal
          isOpen={true}
          farmer={farmer}
          onClose={() => setIsCardModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MasterPetaniDetailPage;

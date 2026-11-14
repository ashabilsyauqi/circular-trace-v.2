import React, { useState, useRef } from 'react';
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
  MapPin,
  Phone,
  Sprout,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  Building2,
  Camera,
  Upload,
  Image as ImageIcon,
  Award,
  Briefcase,
  Mail,
  ArrowLeft,
} from 'lucide-react';
import { FarmerIdCardModal } from './FarmerIdCardModal';

interface MasterPetaniTabProps {
  onSelectFarmerForFarms?: (farmerId: string) => void;
  onSelectFarmerForHarvest?: (farmerId: string) => void;
}

export const MasterPetaniTab: React.FC<MasterPetaniTabProps> = ({
  onSelectFarmerForFarms,
  onSelectFarmerForHarvest,
}) => {
  const { users, addUser, updateUser, deleteUser, coffeeFarms, farmerLots } = useCoffee();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVillageFilter, setSelectedVillageFilter] = useState<string>('all');
  const [selectedFarmerForCard, setSelectedFarmerForCard] = useState<AppUser | null>(null);

  // In-Page View State: 'list' (tabel & kartu), 'form' (halaman formulir pendaftaran/edit)
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [editingFarmerId, setEditingFarmerId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<{
    name: string;
    nik: string;
    farmerCardNumber: string;
    avatar: string;
    village: string;
    rtRw: string;
    subdistrict: string;
    district: string;
    province: string;
    organization: string;
    phone: string;
    email: string;
    totalLandAreaHa: number;
    farmWorkerCount: number;
    startYear: number;
    certification: string;
    bio: string;
    status: 'active' | 'inactive';
  }>({
    name: '',
    nik: '',
    farmerCardNumber: '',
    avatar: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&auto=format&fit=crop&q=80',
    village: 'Desa Margamukti',
    rtRw: 'RT 03 / RW 08',
    subdistrict: 'Kec. Pangalengan',
    district: 'Kab. Bandung',
    province: 'Jawa Barat',
    organization: 'Gapoktan Kopi Mandiri Nusantara',
    phone: '',
    email: '',
    totalLandAreaHa: 2.0,
    farmWorkerCount: 4,
    startYear: 2015,
    certification: 'Organik SNI & EUDR Ready',
    bio: 'Petani kopi specialty anggota kelompok tani aktif memproduksi ceri kualitas petik merah optimal.',
    status: 'active',
  });

  const [formError, setFormError] = useState<string | null>(null);

  // Filter only farmers
  const allFarmers = users.filter((u) => u.role === 'petani' || u.assignedService === 'petani');

  // Filtered farmers list
  const filteredFarmers = allFarmers
    .filter((f) => {
      if (selectedVillageFilter === 'all') return true;
      return (f.village || f.location).toLowerCase().includes(selectedVillageFilter.toLowerCase());
    })
    .filter((f) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        (f.nik && f.nik.includes(q)) ||
        (f.farmerCardNumber && f.farmerCardNumber.toLowerCase().includes(q)) ||
        (f.village && f.village.toLowerCase().includes(q)) ||
        f.location.toLowerCase().includes(q) ||
        (f.phone && f.phone.includes(q))
      );
    });

  // Calculate stats
  const totalLandArea = allFarmers.reduce((acc, f) => acc + (f.totalLandAreaHa || 1.5), 0);
  const totalActive = allFarmers.filter((f) => (f.status || 'active') === 'active').length;

  // Handle Image Upload via FileReader
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Ukuran file foto maksimal 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFormData((prev) => ({
          ...prev,
          avatar: event.target?.result as string,
        }));
        setFormError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddPage = () => {
    setEditingFarmerId(null);
    const count = allFarmers.length + 1;
    const nextCode = `KPT-PGL-2026-${String(count).padStart(3, '0')}`;
    setFormData({
      name: '',
      nik: '',
      farmerCardNumber: nextCode,
      avatar: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&auto=format&fit=crop&q=80',
      village: 'Desa Margamukti',
      rtRw: 'RT 03 / RW 08',
      subdistrict: 'Kec. Pangalengan',
      district: 'Kab. Bandung',
      province: 'Jawa Barat',
      organization: 'Gapoktan Kopi Mandiri Nusantara',
      phone: '',
      email: '',
      totalLandAreaHa: 2.0,
      farmWorkerCount: 4,
      startYear: 2015,
      certification: 'Organik SNI & EUDR Ready',
      bio: 'Petani kopi specialty anggota kelompok tani aktif memproduksi ceri kualitas petik merah optimal.',
      status: 'active',
    });
    setFormError(null);
    setCurrentView('form');
  };

  const handleOpenEditPage = (farmer: AppUser) => {
    setEditingFarmerId(farmer.id);
    setFormData({
      name: farmer.name,
      nik: farmer.nik || '',
      farmerCardNumber: farmer.farmerCardNumber || '',
      avatar: farmer.avatar || 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&auto=format&fit=crop&q=80',
      village: farmer.village || 'Desa Margamukti',
      rtRw: farmer.rtRw || 'RT 03 / RW 08',
      subdistrict: farmer.subdistrict || 'Kec. Pangalengan',
      district: farmer.district || 'Kab. Bandung',
      province: farmer.province || 'Jawa Barat',
      organization: farmer.organization || 'Gapoktan Kopi Mandiri Nusantara',
      phone: farmer.phone || '',
      email: farmer.email || '',
      totalLandAreaHa: farmer.totalLandAreaHa || 2.0,
      farmWorkerCount: farmer.farmWorkerCount || 4,
      startYear: farmer.startYear || 2015,
      certification: farmer.certification || 'Organik SNI & EUDR Ready',
      bio: farmer.bio || '',
      status: farmer.status || 'active',
    });
    setFormError(null);
    setCurrentView('form');
  };

  const handleSaveFarmer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Nama lengkap petani wajib diisi.');
      return;
    }
    if (!formData.phone.trim()) {
      setFormError('Nomor WhatsApp / HP wajib diisi.');
      return;
    }

    const fullLocation = `${formData.village}, ${formData.subdistrict}, ${formData.district}, ${formData.province}`;

    if (editingFarmerId) {
      updateUser(editingFarmerId, {
        name: formData.name,
        nik: formData.nik,
        farmerCardNumber: formData.farmerCardNumber,
        avatar: formData.avatar,
        village: formData.village,
        rtRw: formData.rtRw,
        subdistrict: formData.subdistrict,
        district: formData.district,
        province: formData.province,
        location: fullLocation,
        organization: formData.organization,
        phone: formData.phone,
        email: formData.email || undefined,
        totalLandAreaHa: Number(formData.totalLandAreaHa),
        farmWorkerCount: Number(formData.farmWorkerCount),
        startYear: Number(formData.startYear),
        certification: formData.certification,
        bio: formData.bio,
        status: formData.status,
      });
    } else {
      addUser({
        name: formData.name,
        nik: formData.nik,
        farmerCardNumber: formData.farmerCardNumber,
        avatar: formData.avatar,
        village: formData.village,
        rtRw: formData.rtRw,
        subdistrict: formData.subdistrict,
        district: formData.district,
        province: formData.province,
        location: fullLocation,
        organization: formData.organization,
        phone: formData.phone,
        email: formData.email || `petani.${Date.now()}@sangrai.id`,
        role: 'petani',
        assignedService: 'petani',
        totalLandAreaHa: Number(formData.totalLandAreaHa),
        farmWorkerCount: Number(formData.farmWorkerCount),
        startYear: Number(formData.startYear),
        certification: formData.certification,
        bio: formData.bio,
        status: formData.status,
        balance: 0,
        registeredAt: new Date().toISOString().split('T')[0],
      });
    }

    setCurrentView('list');
  };

  const handleDeleteFarmer = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus petani "${name}" dari master data kelompok tani?`)) {
      deleteUser(id);
    }
  };

  // =========================================================================
  // VIEW MODE 1: FORMULIR DEDIKASI IN-PAGE (BUKAN POP-UP MODAL)
  // =========================================================================
  if (currentView === 'form') {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        {/* Breadcrumb & Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('list')}
              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar Petani</span>
            </button>
            <div>
              <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>{editingFarmerId ? 'Edit Biodata Lengkap Petani' : 'Form Pendaftaran Petani Baru & Foto Profil'}</span>
              </h3>
              <p className="text-[11px] text-stone-500">
                Pencatatan identitas resmi anggota kelompok tani, upload foto KTA, kontak WhatsApp, dan legalitas lahan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentView('list')}
              className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              form="farmer-form-element"
              className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>{editingFarmerId ? 'Simpan Perubahan Biodata' : 'Daftarkan Petani & Terbitkan KTA'}</span>
            </button>
          </div>
        </div>

        {/* Dedicated AdminLTE Card Body */}
        <div className="bg-white rounded-lg border border-stone-200 border-t-4 border-t-emerald-600 shadow-sm p-6">
          <form id="farmer-form-element" onSubmit={handleSaveFarmer} className="space-y-6 text-xs">
            {formError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* SECTION: FOTO PROFIL PETANI & UPLOAD */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
              <label className="font-bold text-stone-800 uppercase tracking-wider text-[11px] block">
                Foto Resmi Petani (Untuk ID Card &amp; Marketplace Traceability) *
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group shrink-0">
                  <img
                    src={formData.avatar}
                    alt="Preview Foto Petani"
                    className="w-24 h-24 rounded-full object-cover border-4 border-emerald-600/30 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity cursor-pointer text-[10px] font-bold"
                  >
                    <Camera className="w-5 h-5 mb-0.5" />
                    <span>Ubah Foto</span>
                  </button>
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-2 cursor-pointer shadow-xs text-xs"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Foto dari Laptop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          avatar: `https://images.unsplash.com/photo-${
                            editingFarmerId ? '1507003211169-0a1dd7228f2d' : '1534528741775-53994a69daeb'
                          }?w=400&auto=format&fit=crop&q=80`,
                        })
                      }
                      className="px-3 py-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 font-medium cursor-pointer text-xs"
                    >
                      Gunakan Foto Sampel
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Mendukung format JPG, PNG, atau WebP (maks 5MB). Foto ini otomatis dicetak pada Kartu Identitas Petani dan verifikasi QR pasar.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION: DATA PRIBADI & IDENTITAS */}
            <div className="space-y-3">
              <h5 className="font-bold text-stone-800 uppercase tracking-wider text-[11px] pb-1 border-b border-stone-200">
                1. Data Pribadi &amp; Nomor Kependudukan (KTP)
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Nama Lengkap Petani *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Asep Supriatna"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    NIK (Nomor Induk Kependudukan / KTP)
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, '') })}
                    placeholder="16 digit NIK KTP"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 font-mono bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    No. KTA / Kartu Anggota Gapoktan *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.farmerCardNumber}
                    onChange={(e) => setFormData({ ...formData, farmerCardNumber: e.target.value })}
                    placeholder="e.g. KPT-PGL-2026-005"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 font-mono font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Status Keanggotaan
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 font-bold bg-white cursor-pointer"
                  >
                    <option value="active">Aktif (Aktif Berproduksi &amp; Terdaftar)</option>
                    <option value="inactive">Non-Aktif (Cuti / Belum Panen)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION: KONTAK & KOMUNIKASI */}
            <div className="space-y-3">
              <h5 className="font-bold text-stone-800 uppercase tracking-wider text-[11px] pb-1 border-b border-stone-200">
                2. Kontak WhatsApp &amp; Komunikasi
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Nomor WhatsApp / HP *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 0812-3456-7890"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Alamat Email (Opsional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. asep.petani@sangrai.id"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* SECTION: DOMISILI ADMINISTRATIF LENGKAP */}
            <div className="space-y-3">
              <h5 className="font-bold text-stone-800 uppercase tracking-wider text-[11px] pb-1 border-b border-stone-200">
                3. Alamat Wilayah Domisili Administratif
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Desa / Kelurahan *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    placeholder="e.g. Desa Margamukti"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    RT / RW
                  </label>
                  <input
                    type="text"
                    value={formData.rtRw}
                    onChange={(e) => setFormData({ ...formData, rtRw: e.target.value })}
                    placeholder="e.g. RT 03 / RW 08"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Kecamatan *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subdistrict}
                    onChange={(e) => setFormData({ ...formData, subdistrict: e.target.value })}
                    placeholder="e.g. Kec. Pangalengan"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Kabupaten / Kota *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g. Kab. Bandung"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Provinsi *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    placeholder="e.g. Jawa Barat"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* SECTION: KELEMBAGAAN & DATA BUDIDAYA KOPI */}
            <div className="space-y-3">
              <h5 className="font-bold text-stone-800 uppercase tracking-wider text-[11px] pb-1 border-b border-stone-200">
                4. Kelembagaan Kelompok Tani &amp; Parameter Budidaya
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Nama Kelompok Tani / Gapoktan *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. Gapoktan Kopi Mandiri Nusantara"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Total Luas Garapan Petani (Hektar) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    min={0.1}
                    value={formData.totalLandAreaHa}
                    onChange={(e) => setFormData({ ...formData, totalLandAreaHa: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 font-bold bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Jumlah Tenaga Kerja / Pemetik
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.farmWorkerCount}
                    onChange={(e) => setFormData({ ...formData, farmWorkerCount: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Tahun Mulai Menanam Kopi
                  </label>
                  <input
                    type="number"
                    min={1970}
                    max={2030}
                    value={formData.startYear}
                    onChange={(e) => setFormData({ ...formData, startYear: parseInt(e.target.value) || 2015 })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Sertifikasi Mutu / Lahan
                  </label>
                  <input
                    type="text"
                    value={formData.certification}
                    onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                    placeholder="e.g. Organik SNI, EUDR Ready"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Profil / Catatan Khusus Budidaya &amp; Varietas Unggulan
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Contoh: Mengembangkan Arabica Sigarar Utang dan Typica dengan sistem tumpangsari pohon alpukat dan naungan lamtoro di ketinggian 1.550 mdpl."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setCurrentView('list')}
                className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{editingFarmerId ? 'Simpan Perubahan Biodata' : 'Daftarkan Petani & Terbitkan KTA'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE 2: DAFTAR MASTER PETANI (DEFAULT)
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* 1. Header & Summary KPI Small-Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-stone-200 border-t-4 border-t-emerald-600 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Total Petani Anggota
            </span>
            <span className="text-2xl font-black text-stone-900 mt-1 block">
              {allFarmers.length} <span className="text-xs font-normal text-stone-500">Orang</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-stone-200 border-t-4 border-t-amber-600 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Total Luas Garapan
            </span>
            <span className="text-2xl font-black text-stone-900 mt-1 block">
              {totalLandArea.toFixed(1)} <span className="text-xs font-normal text-stone-500">Hektar</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Sprout className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-stone-200 border-t-4 border-t-stone-600 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Petani Aktif Berproduksi
            </span>
            <span className="text-2xl font-black text-stone-900 mt-1 block">
              {totalActive} <span className="text-xs font-normal text-stone-500">Petani</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* 2. Top Control Panel (Search, Filter, Tambah Petani) */}
      <div className="bg-white rounded-lg p-4 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama, NIK, No. Anggota, atau desa..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-stone-400 font-bold flex items-center gap-1 text-[11px]">
              <MapPin className="w-3.5 h-3.5" /> Desa:
            </span>
            <select
              value={selectedVillageFilter}
              onChange={(e) => setSelectedVillageFilter(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-lg px-2.5 py-2 font-medium focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="all">Semua Wilayah Desa</option>
              <option value="Margamukti">Desa Margamukti</option>
              <option value="Pulosari">Desa Pulosari</option>
              <option value="Sukaluyu">Desa Sukaluyu</option>
              <option value="Lamajang">Desa Lamajang</option>
              <option value="Warnasari">Desa Warnasari</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleOpenAddPage}
          className="px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Daftarkan Petani Baru (Buka Halaman Form)</span>
        </button>
      </div>

      {/* 3. Tabel Data Master Petani (AdminLTE Style with Photo) */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 bg-stone-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-800">
              Daftar Petani Anggota Kelompok Tani
            </h3>
          </div>
          <span className="text-[11px] text-stone-500">
            {filteredFarmers.length} Petani Terdaftar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[1000px]">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 whitespace-nowrap">Foto &amp; Biodata Petani</th>
                <th className="py-3.5 px-4 whitespace-nowrap">NIK &amp; No. KTA Gapoktan</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Domisili &amp; Kontak</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Luas Lahan &amp; Sertifikasi</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Lahan &amp; Lot Terdaftar</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredFarmers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-medium text-xs">Tidak ada data petani yang sesuai dengan pencarian.</p>
                  </td>
                </tr>
              ) : (
                filteredFarmers.map((farmer) => {
                  const farmerFarms = coffeeFarms.filter((f) => f.farmerId === farmer.id);
                  const farmerLotsList = farmerLots.filter((l) => l.farmerId === farmer.id);

                  return (
                    <tr key={farmer.id} className="hover:bg-emerald-50/30 transition-colors">
                      {/* Foto & Nama */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <img
                              src={farmer.avatar}
                              alt={farmer.name}
                              className="w-11 h-11 rounded-full object-cover border-2 border-emerald-600/30 shadow-xs"
                            />
                            <span
                              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                (farmer.status || 'active') === 'active' ? 'bg-emerald-500' : 'bg-stone-400'
                              }`}
                              title={(farmer.status || 'active') === 'active' ? 'Aktif' : 'Non-Aktif'}
                            />
                          </div>
                          <div>
                            <strong className="font-bold text-stone-900 block text-xs">
                              {farmer.name}
                            </strong>
                            <span className="text-[11px] text-stone-500 block">
                              {farmer.organization || 'Gapoktan Kopi Mandiri'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* NIK & No. KTA */}
                      <td className="py-3.5 px-4 font-mono text-[11px] space-y-1 whitespace-nowrap">
                        <div className="text-stone-900 font-bold">
                          NIK: {farmer.nik || '-'}
                        </div>
                        <div className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded w-fit text-[10px] font-bold border border-emerald-200 whitespace-nowrap shrink-0">
                          {farmer.farmerCardNumber || farmer.id}
                        </div>
                      </td>

                      {/* Domisili & Kontak */}
                      <td className="py-3.5 px-4 space-y-1 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-stone-800">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="font-medium text-[11px]">{farmer.village || farmer.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-stone-600 font-mono text-[11px]">
                          <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{farmer.phone}</span>
                        </div>
                      </td>

                      {/* Luas Lahan & Sertifikasi */}
                      <td className="py-3.5 px-4 space-y-1 whitespace-nowrap">
                        <div className="font-bold text-stone-900">
                          {farmer.totalLandAreaHa || 1.5} Ha{' '}
                          <span className="text-[10px] text-stone-500 font-normal">
                            ({farmer.farmWorkerCount || 4} pekerja)
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded whitespace-nowrap shrink-0">
                          <ShieldCheck className="w-3 h-3 text-emerald-700 shrink-0" />
                          <span>{farmer.certification || 'Organik & EUDR Ready'}</span>
                        </span>
                      </td>

                      {/* Hubungan ke Lahan & Panen */}
                      <td className="py-3.5 px-4 space-y-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onSelectFarmerForFarms?.(farmer.id)}
                          className="flex items-center gap-1.5 text-amber-700 hover:text-amber-800 font-bold text-[11px] cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <Layers className="w-3.5 h-3.5 shrink-0" />
                          <span>{farmerFarms.length} Blok Kebun</span>
                          <ChevronRight className="w-3 h-3 shrink-0" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectFarmerForHarvest?.(farmer.id)}
                          className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold text-[11px] cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <Sprout className="w-3.5 h-3.5 shrink-0" />
                          <span>{farmerLotsList.length} Lot Panen</span>
                          <ChevronRight className="w-3 h-3 shrink-0" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap shrink-0">
                          {/* Cetak Kartu Identitas Petani */}
                          <button
                            type="button"
                            onClick={() => setSelectedFarmerForCard(farmer)}
                            className="p-1.5 rounded-lg text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer border border-emerald-200 shrink-0"
                            title="Cetak Barcode &amp; Kartu Identitas Petani"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>

                          {/* Edit Petani */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditPage(farmer)}
                            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer border border-stone-200"
                            title="Edit Biodata Lengkap (Buka Form)"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Hapus Petani */}
                          <button
                            type="button"
                            onClick={() => handleDeleteFarmer(farmer.id, farmer.name)}
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer border border-red-200"
                            title="Hapus Data Petani"
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
      </div>

      {/* Modal Cetak Kartu Identitas Petani (Printable ID Card) */}
      <FarmerIdCardModal
        isOpen={Boolean(selectedFarmerForCard)}
        onClose={() => setSelectedFarmerForCard(null)}
        farmer={selectedFarmerForCard}
      />
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import {
  Users,
  UserPlus,
  ArrowLeft,
  Camera,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  MapPin,
  Phone,
  Mail,
  Award,
  Briefcase,
  Calendar,
} from 'lucide-react';

export const MasterPetaniFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { farmerId } = useParams<{ farmerId?: string }>();
  const { users, addUser, updateUser } = useCoffee();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = Boolean(farmerId);
  const existingFarmer = isEditMode ? users.find((u) => u.id === farmerId) : null;

  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
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
    status: 'active' as 'active' | 'inactive',
  });

  // Pre-fill if edit mode
  useEffect(() => {
    if (existingFarmer) {
      setFormData({
        name: existingFarmer.name || '',
        nik: existingFarmer.nik || '',
        farmerCardNumber: existingFarmer.farmerCardNumber || '',
        avatar: existingFarmer.avatar || 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&auto=format&fit=crop&q=80',
        village: existingFarmer.village || existingFarmer.location || 'Desa Margamukti',
        rtRw: existingFarmer.rtRw || 'RT 03 / RW 08',
        subdistrict: existingFarmer.subdistrict || 'Kec. Pangalengan',
        district: existingFarmer.district || 'Kab. Bandung',
        province: existingFarmer.province || 'Jawa Barat',
        organization: existingFarmer.organization || 'Gapoktan Kopi Mandiri Nusantara',
        phone: existingFarmer.phone || '',
        email: existingFarmer.email || '',
        totalLandAreaHa: existingFarmer.totalLandAreaHa || 2.0,
        farmWorkerCount: existingFarmer.farmWorkerCount || 4,
        startYear: existingFarmer.startYear || 2015,
        certification: existingFarmer.certification || 'Organik SNI & EUDR Ready',
        bio: existingFarmer.bio || '',
        status: existingFarmer.status || 'active',
      });
    } else if (!isEditMode) {
      // Auto-generate unique KTA for new registration
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      setFormData((prev) => ({
        ...prev,
        farmerCardNumber: `KTA-KTN-2026-${randomSuffix}`,
      }));
    }
  }, [existingFarmer, isEditMode]);

  // Handle Photo File Upload (Base64)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file foto maksimal 5 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Nama lengkap petani wajib diisi.');
      return;
    }
    if (formData.nik && formData.nik.replace(/\D/g, '').length !== 16) {
      setFormError('NIK harus berupa 16 digit angka kependudukan yang sah.');
      return;
    }

    if (isEditMode && existingFarmer) {
      updateUser(existingFarmer.id, {
        name: formData.name,
        nik: formData.nik,
        farmerCardNumber: formData.farmerCardNumber,
        avatar: formData.avatar,
        location: `${formData.village}, ${formData.subdistrict}`,
        village: formData.village,
        rtRw: formData.rtRw,
        subdistrict: formData.subdistrict,
        district: formData.district,
        province: formData.province,
        organization: formData.organization,
        phone: formData.phone,
        email: formData.email,
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
        role: 'petani',
        assignedService: 'petani',
        nik: formData.nik,
        farmerCardNumber: formData.farmerCardNumber,
        avatar: formData.avatar,
        location: `${formData.village}, ${formData.subdistrict}`,
        village: formData.village,
        rtRw: formData.rtRw,
        subdistrict: formData.subdistrict,
        district: formData.district,
        province: formData.province,
        organization: formData.organization,
        phone: formData.phone || '0812-3456-7890',
        email: formData.email || `petani.${Date.now()}@kelompoktani.id`,
        balance: 0,
        totalLandAreaHa: Number(formData.totalLandAreaHa),
        farmWorkerCount: Number(formData.farmWorkerCount),
        startYear: Number(formData.startYear),
        certification: formData.certification,
        bio: formData.bio,
        status: formData.status,
      });
    }

    // Redirect back to master list page
    navigate('/admin/petani');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Header & Navigation Back */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/petani"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-emerald-700 bg-white px-3 py-2 rounded-md border border-[#d2d6de] shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Petani</span>
        </Link>

        <span className="text-xs text-stone-400 font-medium">
          {isEditMode ? `ID: ${existingFarmer?.id}` : 'Registrasi Baru'}
        </span>
      </div>

      {/* 2. Main Form Card */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] overflow-hidden">
        {/* Card Header (AdminLTE Header with Emerald Accent) */}
        <div className="p-4 sm:p-5 border-b border-[#e3e6f0] bg-gradient-to-r from-emerald-800 to-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold text-white shrink-0">
              <UserPlus className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {isEditMode ? 'Edit Profil Petani Anggota' : 'Formulir Pendaftaran Petani Baru'}
              </h2>
              <p className="text-xs text-emerald-200">
                Pencatatan data KTP/NIK, KTA kelompok tani, kontak, wilayah domisili, dan riwayat garapan kebun.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs text-stone-800">
          {formError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-md text-rose-700 flex items-center gap-2.5 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* SECTION A: UPLOAD FOTO PROFIL PETANI */}
          <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
            <label className="font-bold text-stone-900 flex items-center gap-2 text-xs">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>Foto Profil Petani (Dokumentasi Lapangan / Pas Foto KTA)</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative group shrink-0">
                <img
                  src={formData.avatar}
                  alt="Preview Petani"
                  className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500 shadow-md bg-white"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md transition-transform hover:scale-105"
                  title="Upload Foto Petani"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold rounded-md shadow-2xs flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Upload Foto dari Komputer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        avatar:
                          'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&auto=format&fit=crop&q=80',
                      }))
                    }
                    className="px-2.5 py-1.5 text-stone-500 hover:text-stone-800 text-[11px]"
                  >
                    Reset Foto Default
                  </button>
                </div>
                <p className="text-[11px] text-stone-500">
                  Format gambar JPG, PNG, atau WebP (maksimal 5 MB). Foto ini akan dicetak otomatis pada Kartu Tani Digital.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION B: IDENTITAS RESMI & KTA */}
          <div className="space-y-3">
            <h3 className="font-bold text-stone-900 border-b border-stone-200 pb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>1. Identitas Kependudukan & Kartu Tani</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nama Lengkap Petani *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Pak Asep Suhendar"
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-semibold text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nomor NIK (16 Digit KTP) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, '') })}
                  placeholder="3204281205840001"
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">
                  {formData.nik.length}/16 digit NIK
                </span>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nomor KTA / Kartu Anggota
                </label>
                <input
                  type="text"
                  value={formData.farmerCardNumber}
                  onChange={(e) => setFormData({ ...formData, farmerCardNumber: e.target.value })}
                  placeholder="KTA-KTN-2026-0042"
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION C: ALAMAT LENGKAP & WILAYAH DOMISILI */}
          <div className="space-y-3">
            <h3 className="font-bold text-stone-900 border-b border-stone-200 pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>2. Alamat Lengkap & Wilayah Kelompok Tani</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">RT / RW</label>
                <input
                  type="text"
                  value={formData.rtRw}
                  onChange={(e) => setFormData({ ...formData, rtRw: e.target.value })}
                  placeholder="RT 02 / RW 07"
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Desa / Kelurahan *</label>
                <input
                  type="text"
                  required
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  placeholder="Desa Margamukti"
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Kecamatan *</label>
                <input
                  type="text"
                  required
                  value={formData.subdistrict}
                  onChange={(e) => setFormData({ ...formData, subdistrict: e.target.value })}
                  placeholder="Kec. Pangalengan"
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Kabupaten / Kota *</label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="Kab. Bandung"
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Provinsi</label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  placeholder="Jawa Barat"
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nama Kelompok Tani / Gapoktan Induk
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="Gapoktan Kopi Mandiri Pangalengan"
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION D: LUAS GARAPAN, BURUH TANI & SERTIFIKASI */}
          <div className="space-y-3">
            <h3 className="font-bold text-stone-900 border-b border-stone-200 pb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>3. Data Garapan, Ketenagakerjaan & Sertifikasi</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Total Lahan Garapan (Ha)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.totalLandAreaHa}
                  onChange={(e) => setFormData({ ...formData, totalLandAreaHa: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Jumlah Buruh Tani / Pekerja
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.farmWorkerCount}
                  onChange={(e) => setFormData({ ...formData, farmWorkerCount: parseInt(e.target.value) || 0 })}
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Tahun Mulai Bertani Kopi
                </label>
                <input
                  type="number"
                  min="1970"
                  max="2030"
                  value={formData.startYear}
                  onChange={(e) => setFormData({ ...formData, startYear: parseInt(e.target.value) || 2015 })}
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Status Keanggotaan
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-semibold"
                >
                  <option value="active">Aktif Berproduksi</option>
                  <option value="inactive">Nonaktif / Cuti</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Sertifikasi & Kepatuhan
                </label>
                <input
                  type="text"
                  value={formData.certification}
                  onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                  placeholder="Organik SNI, EUDR Ready, Rainforest Alliance"
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nomor HP / WhatsApp Aktif *
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0812-3456-7890"
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Catatan Petani / Profil Khusus
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Catatan mengenai pengalaman kebun, varietas unggulan petani, atau penghargaan yang diraih..."
                className="w-full border border-stone-300 rounded-md p-3 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Form Actions (Save & Cancel) */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <Link
              to="/admin/petani"
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md font-bold transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md shadow-xs transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditMode ? 'Simpan Perubahan Petani' : 'Daftarkan Petani Sekarang'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MasterPetaniFormPage;
